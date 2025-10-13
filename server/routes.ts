import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth as setupLocalAuth, isAuthenticated as isLocalAuthenticated } from "./localAuth";
import { setupAuth as setupNextAuth, isAuthenticated as isNextAuthenticated } from "./nextAuth";

// Use NextAuth for production, local auth for development
const setupAuth = process.env.NODE_ENV === 'development' ? setupLocalAuth : setupNextAuth;
const isAuthenticated = process.env.NODE_ENV === 'development' ? isLocalAuthenticated : isNextAuthenticated;
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";
import { processImage, formatFileSize, getImageFormat } from "./image-processor";
import { configManager } from "./config/config-manager";
import { uploadToR2, isR2Configured, getMimeType } from "./r2-storage";
import sharp from "sharp";
import { sseManager } from "./sse-manager";

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// AI-powered facial analysis function using OpenAI GPT-4o
async function performFacialAnalysis(imagePath: string) {
  try {
    console.log("Starting performFacialAnalysis for:", imagePath);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }
    
    // Read and encode image as base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    console.log("Image loaded, size:", imageBuffer.length, "bytes");
    console.log("Making OpenAI API call...");
    console.log("API Key exists:", !!process.env.OPENAI_API_KEY);
    
    // Using GPT-4.1 model for enhanced facial analysis capabilities
    const promptConfig = configManager.getActivePrompt();
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      temperature: promptConfig.temperature,
      max_tokens: promptConfig.maxTokens,
      messages: [
        {
          role: "system",
          content: promptConfig.systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: promptConfig.analysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    console.log("OpenAI response received");
    console.log("Response structure:", {
      choices: response.choices?.length,
      hasFirstChoice: !!response.choices?.[0],
      hasMessage: !!response.choices?.[0]?.message,
      hasContent: !!response.choices?.[0]?.message?.content
    });
    
    if (!response.choices || response.choices.length === 0) {
      console.error("OpenAI returned no choices");
      throw new Error("OpenAI returned no choices in response");
    }
    
    const responseContent = response.choices[0].message.content;
    console.log("OpenAI raw response:", responseContent);
    
    if (!responseContent) {
      console.error("OpenAI returned null content");
      console.log("Full OpenAI response:", JSON.stringify(response, null, 2));
      throw new Error("OpenAI returned empty response");
    }
    
    let analysisResult;
    try {
      analysisResult = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Failed to parse OpenAI JSON response:", parseError);
      console.error("Raw response content:", responseContent);
      throw new Error("Invalid JSON response from OpenAI");
    }
    
    // Add raw OpenAI response for transparency
    analysisResult.rawAnalysis = {
      model: "gpt-4.1",
      usage: response.usage,
      responseTime: new Date().toISOString(),
      fullResponse: responseContent
    };
    
    return analysisResult;
    
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    
    // Check if it's an OpenAI API error
    if (error.response) {
      console.error("OpenAI API error response:", error.response.status, error.response.data);
    }
    
    // Provide more specific error message
    if (error.message.includes("Invalid JSON")) {
      throw new Error("OpenAI returned invalid JSON format");
    } else if (error.message.includes("rate limit")) {
      throw new Error("OpenAI rate limit exceeded. Please try again later.");
    } else if (error.message.includes("insufficient_quota")) {
      throw new Error("OpenAI quota exceeded. Please check your API key.");
    } else {
      throw new Error("Failed to analyze image with AI: " + error.message);
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // SSE endpoint for real-time analysis updates
  // Note: This endpoint doesn't use isAuthenticated middleware to allow EventSource to work
  // We verify ownership inside the handler instead
  app.get("/api/analysis/:id/stream", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // Verify analysis exists
      const analysis = await storage.getAnalysis(id);
      if (!analysis) {
        // Return SSE error format
        res.writeHead(404, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        res.write(`event: error\ndata: ${JSON.stringify({ message: "Analysis not found" })}\n\n`);
        res.end();
        return;
      }

      // Check authorization - if analysis has userId, verify it matches current user
      if (analysis.userId && req.isAuthenticated && req.isAuthenticated()) {
        const userId = (req.user as any).claims?.sub;
        if (analysis.userId !== userId) {
          res.writeHead(403, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          });
          res.write(`event: error\ndata: ${JSON.stringify({ message: "Access denied" })}\n\n`);
          res.end();
          return;
        }
      }

      // Backward compatibility: if status field doesn't exist yet (pre-migration)
      // treat as completed if overallScore > 0, otherwise processing
      const status = (analysis as any).status || (analysis.overallScore > 0 ? 'completed' : 'processing');
      const analysisWithStatus = { ...analysis, status };

      // If already completed or failed, send final state and close
      if (status === 'completed' || status === 'failed') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        res.write(`data: ${JSON.stringify(analysisWithStatus)}\n\n`);
        res.end();
        return;
      }

      // Subscribe to updates
      sseManager.subscribe(id, res);

      // Send current state immediately (with backward-compatible status)
      sseManager.sendUpdate(id, analysisWithStatus);
    } catch (error) {
      console.error("SSE stream error:", error);
      // Return SSE error format instead of JSON
      res.writeHead(500, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write(`event: error\ndata: ${JSON.stringify({ message: "Failed to create event stream" })}\n\n`);
      res.end();
    }
  });

  // Upload image only (without starting analysis)
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const originalFile = req.file;
      const originalFormat = getImageFormat(originalFile.originalname);
      
      // Check if R2 is configured, otherwise use local storage
      const useR2 = isR2Configured();
      console.log(`📦 Storage mode: ${useR2 ? 'Cloudflare R2' : 'Local filesystem'}`);
      
      let imageUrl: string;
      let processedPath: string;
      let imageProcessingResult: any;
      
      if (useR2) {
        // R2 Storage Mode: Process in memory and upload to R2
        const tempPath = originalFile.path;
        
        // Get original metadata
        const originalMetadata = await sharp(tempPath).metadata();
        const originalStats = fs.statSync(tempPath);
        
        // Process and optimize image to buffer
        const processedBuffer = await sharp(tempPath)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 85 })
          .toBuffer();
        
        // Get processed metadata
        const processedMetadata = await sharp(processedBuffer).metadata();
        
        // Upload to R2
        const uploadResult = await uploadToR2(
          processedBuffer,
          originalFile.originalname,
          getMimeType(originalFile.originalname)
        );
        
        imageUrl = uploadResult.url;
        processedPath = tempPath; // Use temp path for AI analysis
        
        // Create processing result object
        imageProcessingResult = {
          processedPath: tempPath,
          originalSize: originalStats.size,
          processedSize: uploadResult.size,
          originalDimensions: `${originalMetadata.width}x${originalMetadata.height}`,
          processedDimensions: `${processedMetadata.width}x${processedMetadata.height}`,
          wasResized: originalStats.size > uploadResult.size
        };
        
        console.log(`✅ Uploaded to R2: ${uploadResult.url} (${(uploadResult.size / 1024).toFixed(2)} KB)`);
      } else {
        // Local Storage Mode: Process and save to disk
        const processedFilename = `processed_${Date.now()}.${originalFormat}`;
        processedPath = path.join('uploads', processedFilename);
        imageUrl = `/uploads/${processedFilename}`;
        
        // Process and optimize image
        imageProcessingResult = await processImage(
          originalFile.path,
          processedPath,
          {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 85,
            format: originalFormat,
            maxFileSize: 2 * 1024 * 1024 // 2MB
          }
        );
      }
      
      console.log("Image processing result:", {
        storageMode: useR2 ? 'R2' : 'Local',
        originalSize: formatFileSize(imageProcessingResult.originalSize),
        processedSize: formatFileSize(imageProcessingResult.processedSize),
        originalDimensions: imageProcessingResult.originalDimensions,
        processedDimensions: imageProcessingResult.processedDimensions,
        wasResized: imageProcessingResult.wasResized
      });

      // Get user ID from session if authenticated
      const userId = (req as any).isAuthenticated?.() ? (req as any).user?.claims?.sub : null;

      // Create initial analysis record (without AI results yet - just uploaded state)
      const analysis = await storage.createAnalysis({
        userId: userId,
        imageUrl: imageUrl,
        fileName: originalFile.originalname,
        fileSize: imageProcessingResult.originalSize,
        processedSize: imageProcessingResult.processedSize,
        originalDimensions: imageProcessingResult.originalDimensions,
        processedDimensions: imageProcessingResult.processedDimensions,
        overallScore: 0, // Will be updated after analysis
        skinHealth: 0,
        eyeHealth: 0,
        circulation: 0,
        symmetry: 0,
        analysisData: {
          imageProcessing: {
            wasResized: imageProcessingResult.wasResized,
            originalSize: formatFileSize(imageProcessingResult.originalSize),
            processedSize: formatFileSize(imageProcessingResult.processedSize),
            compressionRatio: imageProcessingResult.originalSize > 0 ?
              (imageProcessingResult.processedSize / imageProcessingResult.originalSize * 100).toFixed(1) + '%' : '100%'
          }
        },
        recommendations: {},
      });

      // Cleanup temp files (keep processed for later analysis)
      if (fs.existsSync(originalFile.path) && originalFile.path !== processedPath) {
        fs.unlinkSync(originalFile.path);
      }

      // Return immediately with the analysis ID and image URL
      res.json({ 
        id: analysis.id, 
        imageUrl: imageUrl,
        status: 'uploaded' 
      });

    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Start analysis for an uploaded image
  app.post("/api/analysis/:id/start", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      
      // Get the analysis
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      // Return immediately
      res.json({ id: analysisId, status: 'processing' });

      // Send initial SSE update
      const processingWithStatus = {
        ...analysis,
        status: 'processing'
      };
      sseManager.sendUpdate(analysisId, processingWithStatus);

      // Get the image path for analysis
      let imagePath: string;
      if (analysis.imageUrl.startsWith('http')) {
        // R2 URL - need to download temporarily
        const response = await fetch(analysis.imageUrl);
        const buffer = await response.arrayBuffer();
        imagePath = path.join('uploads', `temp_${analysisId}.jpg`);
        fs.writeFileSync(imagePath, Buffer.from(buffer));
      } else {
        // Local path
        imagePath = path.join(process.cwd(), analysis.imageUrl);
      }

      // Perform facial analysis asynchronously in the background
      performFacialAnalysis(imagePath)
        .then(async (analysisResults) => {
          // Update the analysis with AI results
          const updatedAnalysis = await storage.updateAnalysis(analysisId, {
            overallScore: analysisResults.overallScore,
            skinHealth: analysisResults.skinHealth,
            eyeHealth: analysisResults.eyeHealth,
            circulation: analysisResults.circulation,
            symmetry: analysisResults.symmetry,
            analysisData: {
              ...analysisResults.analysisData,
              conversationalAnalysis: analysisResults.conversationalAnalysis,
              estimatedAge: analysisResults.estimatedAge,
              ageRange: analysisResults.ageRange,
              rawAnalysis: analysisResults.rawAnalysis,
              imageProcessing: (analysis.analysisData as any)?.imageProcessing || {}
            },
            recommendations: analysisResults.recommendations,
          });

          console.log(`✅ Analysis completed for ID: ${analysisId}`);

          // Notify all connected clients via SSE (add virtual status)
          const analysisWithStatus = {
            ...updatedAnalysis,
            status: 'completed'
          };
          sseManager.sendUpdate(analysisId, analysisWithStatus);

          // Cleanup temp file if it was downloaded from R2
          if (imagePath.includes('temp_') && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        })
        .catch(async (error) => {
          console.error(`❌ Analysis failed for ID: ${analysisId}`, error);

          // Get current analysis state
          const failedAnalysis = await storage.getAnalysis(analysisId);

          // Notify clients of failure via SSE (with virtual status)
          const failedWithStatus = {
            ...failedAnalysis,
            status: 'failed',
            errorMessage: error.message || 'Unknown error during analysis'
          };
          sseManager.sendUpdate(analysisId, failedWithStatus);

          // Cleanup temp file even on failure
          try {
            if (imagePath.includes('temp_') && fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          } catch (cleanupError) {
            console.error('Error cleaning up files:', cleanupError);
          }
        });

    } catch (error) {
      console.error("Start analysis error:", error);
      res.status(500).json({ message: "Failed to start analysis" });
    }
  });



  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({ message: "Failed to retrieve analysis" });
    }
  });

  // Get user-specific analyses (history) - protected route
  app.get("/api/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const analyses = await storage.getUserAnalyses(userId);
      
      res.json(analyses.slice(0, limit));
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ message: "Failed to retrieve analysis history" });
    }
  });

  // Get all analyses (admin route) - for now, public
  app.get("/api/all-analyses", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const analyses = await storage.getRecentAnalyses(limit);
      
      res.json(analyses);
    } catch (error) {
      console.error("Get all analyses error:", error);
      res.status(500).json({ message: "Failed to retrieve all analyses" });
    }
  });

  // Get recent analyses
  app.get("/api/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const analyses = await storage.getRecentAnalyses(limit);
      
      res.json(analyses);
    } catch (error) {
      console.error("Get recent analyses error:", error);
      res.status(500).json({ message: "Failed to retrieve recent analyses" });
    }
  });

  // Chat with AI about analysis
  app.post("/api/analysis/:id/chat", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const { message, context } = req.body;
      
      if (!message || !message.trim()) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Get the analysis data
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      // Build chat context with analysis data
      const chatContext = `
You are an expert AI health assistant analyzing a facial health assessment. Here is the complete analysis data:

ANALYSIS RESULTS:
- Overall Score: ${analysis.overallScore}%
- Skin Health: ${analysis.skinHealth}%
- Eye Health: ${analysis.eyeHealth}%
- Circulation: ${analysis.circulation}%
- Symmetry: ${analysis.symmetry}%

DETAILED ANALYSIS DATA:
${JSON.stringify(analysis.analysisData, null, 2)}

RECOMMENDATIONS:
${JSON.stringify(analysis.recommendations, null, 2)}

PREVIOUS CONVERSATION:
${context.previousMessages?.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') || 'No previous messages'}

Please provide helpful, accurate, and personalized responses about this specific analysis. Be supportive and educational while staying within your expertise as an AI health assistant.
      `;
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: chatContext
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });
      
      const aiResponse = response.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error("No response from AI");
      }
      
      res.json({ 
        response: aiResponse,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Serve uploaded images
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'uploads', (req.params as any)[0] || req.url);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    
    res.sendFile(filePath);
  });

  // Configuration management routes
  
  // Get current prompt configuration
  app.get("/api/config/prompt", async (req, res) => {
    try {
      const config = configManager.getActivePrompt();
      res.json(config);
    } catch (error) {
      console.error("Error retrieving prompt config:", error);
      res.status(500).json({ error: "Failed to retrieve prompt configuration" });
    }
  });

  // Update prompt configuration
  app.post("/api/config/prompt", async (req, res) => {
    try {
      const { systemPrompt, analysisPrompt, temperature, maxTokens } = req.body;
      
      if (!systemPrompt || !analysisPrompt || typeof temperature !== 'number') {
        return res.status(400).json({ error: "Invalid prompt configuration" });
      }

      const config = { systemPrompt, analysisPrompt, temperature, maxTokens };
      configManager.updatePrompt(config);
      
      res.json({ message: "Prompt configuration updated successfully", config });
    } catch (error) {
      console.error("Error updating prompt config:", error);
      res.status(500).json({ error: "Failed to update prompt configuration" });
    }
  });

  // Set prompt type
  app.post("/api/config/prompt/type", async (req, res) => {
    try {
      const { type } = req.body;
      
      if (!['DETAILED', 'SIMPLE', 'MEDICAL'].includes(type)) {
        return res.status(400).json({ error: "Invalid prompt type" });
      }

      configManager.setPromptType(type);
      const config = configManager.getActivePrompt();
      
      res.json({ message: `Prompt type set to ${type}`, config });
    } catch (error) {
      console.error("Error setting prompt type:", error);
      res.status(500).json({ error: "Failed to set prompt type" });
    }
  });

  // Get available prompt types
  app.get("/api/config/prompt/types", async (req, res) => {
    try {
      const availablePrompts = configManager.getAvailablePrompts();
      res.json(availablePrompts);
    } catch (error) {
      console.error("Error retrieving available prompts:", error);
      res.status(500).json({ error: "Failed to retrieve available prompts" });
    }
  });

  // Export prompt configuration
  app.get("/api/config/prompt/export", async (req, res) => {
    try {
      const configJson = configManager.exportConfig();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="prompt-config.json"');
      res.send(configJson);
    } catch (error) {
      console.error("Error exporting prompt config:", error);
      res.status(500).json({ error: "Failed to export prompt configuration" });
    }
  });

  // Import prompt configuration
  app.post("/api/config/prompt/import", async (req, res) => {
    try {
      const { configJson } = req.body;
      
      if (!configJson) {
        return res.status(400).json({ error: "No configuration provided" });
      }

      const success = configManager.importConfig(configJson);
      
      if (success) {
        const config = configManager.getActivePrompt();
        res.json({ message: "Prompt configuration imported successfully", config });
      } else {
        res.status(400).json({ error: "Invalid configuration format" });
      }
    } catch (error) {
      console.error("Error importing prompt config:", error);
      res.status(500).json({ error: "Failed to import prompt configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
