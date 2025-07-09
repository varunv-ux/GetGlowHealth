import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";
import { processImage, formatFileSize, getImageFormat } from "./image-processor";

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
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are a comprehensive facial analysis expert specializing in physiognomy, appearance assessment, and wellness insights. Analyze facial features to provide insights about general appearance, lifestyle factors, and well-being indicators. Focus on observable features and aesthetic analysis rather than medical diagnosis. Provide both structured data and conversational analysis."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this face comprehensively from multiple expert perspectives:

**1. Face Analyst (Physiognomist)**
Analyze facial features using physiognomy principles. Describe facial structure, proportions, bone structure, and general appearance characteristics. Focus on observable features and aesthetic qualities.

**2. Visual Age Estimator**
Estimate apparent age based on facial features, skin texture, and overall appearance. Note any signs of aging or youthful qualities visible in the face.

**3. Appearance Assessment**
Assess general appearance indicators like skin tone, facial symmetry, eye brightness, and overall complexion quality. Comment on skin texture and facial harmony.

**4. Expression Analysis**
Analyze facial expressions, muscle tension patterns, and emotional indicators visible in the face. Note any signs of stress or relaxation.

**5. Lifestyle Indicators**
Identify lifestyle factors that might be reflected in facial appearance, such as sleep patterns, stress levels, or general wellness habits.

**6. Wellness Observations**
Note general wellness indicators visible in facial features, skin quality, and overall appearance. Focus on observable characteristics rather than medical conditions.

**7. Improvement Suggestions**
Based on appearance analysis, suggest general lifestyle, skincare, or wellness approaches that might enhance overall appearance and well-being.

Please provide your analysis in this JSON format, including both structured data AND a comprehensive conversational analysis:

{
  "overallScore": number (1-100),
  "skinHealth": number (1-100),
  "eyeHealth": number (1-100),
  "circulation": number (1-100),
  "symmetry": number (1-100),
  "estimatedAge": number,
  "ageRange": "XX-XX years",
  "conversationalAnalysis": {
    "faceAnalyst": "Detailed physiognomist analysis with specific observations about facial structure, proportions, bone structure, and aesthetic qualities",
    "visualAgeEstimator": "Comprehensive age assessment explaining apparent age, aging signs, and youthful qualities visible in facial features",
    "appearanceAssessment": "Detailed appearance analysis covering skin tone, facial symmetry, eye brightness, complexion quality, and overall facial harmony",
    "expressionAnalysis": "Analysis of facial expressions, muscle tension patterns, and emotional indicators visible in the face",
    "lifestyleIndicators": "Assessment of lifestyle factors reflected in facial appearance, including sleep patterns, stress levels, and wellness habits",
    "wellnessObservations": "General wellness indicators visible in facial features, skin quality, and overall appearance characteristics",
    "improvementSuggestions": "Comprehensive suggestions for lifestyle, skincare, and wellness approaches to enhance overall appearance and well-being"
  },
  "analysisData": {
    "facialMarkers": [
      {"x": number, "y": number, "type": "eye|skin|structure", "status": "excellent|good|minor_issues|normal", "insight": "specific observation about this marker"}
    ],
    "skinAnalysis": {
      "hydration": "excellent|good|normal|poor",
      "pigmentation": "even|minor_spots|moderate_spots|significant_spots",
      "texture": "smooth|slightly_rough|rough|very_rough",
      "elasticity": "excellent|good|normal|poor",
      "agingSignsDetected": ["specific aging signs"],
      "skinTone": "description of skin tone and what it reveals",
      "inflammationSigns": ["specific inflammation indicators"]
    },
    "eyeAnalysis": {
      "underEyeCircles": "none|minimal|moderate|significant",
      "puffiness": "none|minimal|moderate|significant",
      "brightness": "high|medium|low",
      "symmetry": "perfect|good|slight_asymmetry|noticeable_asymmetry",
      "fatigueSignals": ["specific fatigue indicators"],
      "eyeColor": "description and health implications",
      "eyeClarity": "assessment of eye clarity and vitality"
    },
    "circulationAnalysis": {
      "facialFlush": "healthy|normal|pale|excessive",
      "lipColor": "healthy|normal|pale|dark",
      "capillaryHealth": "excellent|good|normal|poor",
      "overallTone": "even|slightly_uneven|uneven|very_uneven",
      "circulationPatterns": ["specific circulation observations"]
    },
    "lifestyleInsights": {
      "appearanceIndicators": ["general appearance observations"],
      "recommendedNutrients": ["nutrients that might support appearance"],
      "beneficialFoods": ["foods that might support skin and appearance"],
      "wellnessObservations": ["general wellness observations"]
    },
    "skinObservations": {
      "generalSigns": ["general skin observations"],
      "textureNotes": ["skin texture observations"],
      "appearanceFactors": ["factors that might influence appearance"],
      "observationPatterns": ["patterns observed in skin appearance"]
    },
    "emotionalStateReading": {
      "stressPatterns": ["specific stress indicators"],
      "emotionalSignals": ["mood and emotional state indicators"],
      "tensionAreas": ["areas of physical tension"],
      "energyLevel": "assessment of overall energy and vitality"
    },
    "healthRiskAssessment": {
      "hormonalIndicators": ["signs of hormonal imbalances"],
      "sleepQualityClues": ["sleep quality indicators"],
      "lifestyleConcerns": ["lifestyle factors affecting health"],
      "systemicIssues": ["potential systemic health concerns"]
    }
  },
  "recommendations": {
    "immediate": [
      {"icon": "fas fa-icon", "title": "Immediate Action", "description": "Specific immediate steps to take", "timeframe": "within 24-48 hours"}
    ],
    "nutritional": [
      {"icon": "fas fa-icon", "title": "Nutritional Strategy", "description": "Specific dietary recommendations with foods and supplements", "timeframe": "within 1-2 weeks"}
    ],
    "lifestyle": [
      {"icon": "fas fa-icon", "title": "Lifestyle Adjustment", "description": "Rest, stress, and mindset recommendations", "timeframe": "within 2-4 weeks"}
    ],
    "longTerm": [
      {"icon": "fas fa-icon", "title": "Long-term Strategy", "description": "Comprehensive healing approach for sustained health", "timeframe": "3-6 months"}
    ],
    "supplements": [
      {"icon": "fas fa-icon", "title": "Supplement Recommendation", "description": "Specific supplements to address deficiencies", "timeframe": "start within 1 week"}
    ],
    "mindset": [
      {"icon": "fas fa-icon", "title": "Mindset Shift", "description": "Inner dialogue and emotional healing recommendations", "timeframe": "ongoing practice"}
    ]
  }
}

Be extremely thorough and specific in your analysis. Provide detailed, actionable insights that someone can immediately implement to improve their appearance and general well-being.`
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
      response_format: { type: "json_object" },
      max_tokens: 4000
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
      model: "gpt-4o",
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
      
      // Save analysis to storage
      const analysis = await storage.createAnalysis({
        userId: null, // For now, not associating with users
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

  // Get all analyses (history)
  app.get("/api/history", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const analyses = await storage.getRecentAnalyses(limit);
      
      res.json(analyses);
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ message: "Failed to retrieve analysis history" });
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

  const httpServer = createServer(app);
  return httpServer;
}
