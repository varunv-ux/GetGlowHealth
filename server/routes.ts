import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";
import { processImage, formatFileSize, getImageFormat } from "./image-processor";
import { configManager } from "./config/config-manager";

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
  const startTime = Date.now();
  try {
    console.log("Starting performFacialAnalysis for:", imagePath);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }
    
    // Process image to optimize size for OpenAI API (reduces upload time)
    const processedImagePath = imagePath.replace(/\.(jpg|jpeg|png|webp)$/i, '_processed.jpg');
    const imageResult = await processImage(imagePath, processedImagePath, {
      maxWidth: 800,  // Smaller size for faster upload
      maxHeight: 800,
      quality: 75,    // Lower quality for faster processing
      format: 'jpeg'
    });
    
    // Read and encode processed image as base64
    const imageBuffer = fs.readFileSync(processedImagePath);
    const base64Image = imageBuffer.toString('base64');
    
    console.log("Image optimized:", {
      originalSize: formatFileSize(imageResult.originalSize),
      processedSize: formatFileSize(imageResult.processedSize),
      dimensions: imageResult.processedDimensions,
      wasResized: imageResult.wasResized
    });
    
    console.log("Image loaded, size:", imageBuffer.length, "bytes");
    const apiStartTime = Date.now();
    console.log("Making OpenAI API call...");
    console.log("API Key exists:", !!process.env.OPENAI_API_KEY);
    
    // Using GPT-4o model with optimized settings for faster responses
    const promptConfig = configManager.getActivePrompt();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3, // Lower temperature for faster, more consistent responses
      max_tokens: 2000, // Reduced token limit for faster responses
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

    const apiEndTime = Date.now();
    const apiDuration = apiEndTime - apiStartTime;
    console.log("OpenAI response received in", apiDuration, "ms");
    console.log("Response structure:", {
      choices: response.choices?.length,
      hasFirstChoice: !!response.choices?.[0],
      hasMessage: !!response.choices?.[0]?.message,
      hasContent: !!response.choices?.[0]?.message?.content,
      tokensUsed: response.usage?.total_tokens
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
      model: "gpt-4o",
      usage: response.usage,
      responseTime: new Date().toISOString(),
      fullResponse: responseContent
    };
    
    // Clean up processed image file to save disk space
    if (fs.existsSync(processedImagePath)) {
      fs.unlinkSync(processedImagePath);
    }
    
    const totalDuration = Date.now() - startTime;
    console.log("Total analysis completed in", totalDuration, "ms");
    console.log("Performance breakdown:", {
      totalTime: totalDuration + "ms",
      apiTime: apiDuration + "ms",
      processingTime: (totalDuration - apiDuration) + "ms",
      tokensUsed: response.usage?.total_tokens
    });
    
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

  // Upload and analyze image
  app.post("/api/analyze", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const originalFile = req.file;
      const originalFormat = getImageFormat(originalFile.originalname);
      
      // Generate processed filename
      const processedFilename = `processed_${Date.now()}.${originalFormat}`;
      const processedPath = path.join('uploads', processedFilename);
      
      // Process and optimize image
      const imageProcessingResult = await processImage(
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
      
      console.log("Image processing result:", {
        originalSize: formatFileSize(imageProcessingResult.originalSize),
        processedSize: formatFileSize(imageProcessingResult.processedSize),
        originalDimensions: imageProcessingResult.originalDimensions,
        processedDimensions: imageProcessingResult.processedDimensions,
        wasResized: imageProcessingResult.wasResized
      });

      // Perform facial analysis using OpenAI on processed image
      const analysisResults = await performFacialAnalysis(processedPath);
      
      // Get user ID from session if authenticated
      const userId = req.isAuthenticated() ? (req.user as any).claims?.sub : null;
      
      // Save analysis to storage
      const analysis = await storage.createAnalysis({
        userId: userId,
        imageUrl: `/uploads/${processedFilename}`,
        fileName: originalFile.originalname,
        fileSize: imageProcessingResult.originalSize,
        processedSize: imageProcessingResult.processedSize,
        originalDimensions: imageProcessingResult.originalDimensions,
        processedDimensions: imageProcessingResult.processedDimensions,
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
          imageProcessing: {
            wasResized: imageProcessingResult.wasResized,
            originalSize: formatFileSize(imageProcessingResult.originalSize),
            processedSize: formatFileSize(imageProcessingResult.processedSize),
            compressionRatio: imageProcessingResult.originalSize > 0 ? 
              (imageProcessingResult.processedSize / imageProcessingResult.originalSize * 100).toFixed(1) + '%' : '100%'
          }
        },
        recommendations: analysisResults.recommendations,
      });

      // Clean up original uploaded file if it was processed
      if (imageProcessingResult.wasResized) {
        fs.unlinkSync(originalFile.path);
      }

      res.json(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Failed to analyze image" });
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

  // Serve uploaded images
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'uploads', req.params[0] || req.url);
    
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
