import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

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
          content: "You are a facial analysis expert specializing in physiognomy and wellness assessment. Analyze facial features to provide insights about general appearance, skin condition, and facial characteristics. Focus on observable features rather than medical diagnoses. Respond with JSON in the exact format requested."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and describe the general facial features you observe. Focus on:

1. **Facial Structure**: General facial shape and symmetry
2. **Skin Appearance**: Basic skin tone and texture observations
3. **Age Assessment**: Estimated age range based on visible features
4. **General Observations**: Overall facial characteristics

Return JSON with this exact structure:
{
  "overallScore": number (1-100),
  "skinHealth": number (1-100),
  "eyeHealth": number (1-100),
  "circulation": number (1-100),
  "symmetry": number (1-100),
  "estimatedAge": number,
  "analysisData": {
    "facialMarkers": [
      {"x": number, "y": number, "type": "eye|skin|structure", "status": "excellent|good|minor_issues|normal"}
    ],
    "skinAnalysis": {
      "hydration": "excellent|good|normal|poor",
      "pigmentation": "even|minor_spots|moderate_spots|significant_spots",
      "texture": "smooth|slightly_rough|rough|very_rough",
      "elasticity": "excellent|good|normal|poor",
      "agingSignsDetected": ["string"]
    },
    "eyeAnalysis": {
      "underEyeCircles": "none|minimal|moderate|significant",
      "puffiness": "none|minimal|moderate|significant",
      "brightness": "high|medium|low",
      "symmetry": "perfect|good|slight_asymmetry|noticeable_asymmetry",
      "fatigueSignals": ["string"]
    },
    "circulationAnalysis": {
      "facialFlush": "healthy|normal|pale|excessive",
      "lipColor": "healthy|normal|pale|dark",
      "capillaryHealth": "excellent|good|normal|poor",
      "overallTone": "even|slightly_uneven|uneven|very_uneven"
    },
    "nutritionalInsights": {
      "possibleDeficiencies": ["string"],
      "recommendedNutrients": ["string"],
      "healingFoods": ["string"]
    },
    "intoleranceSignals": {
      "inflammationSigns": ["string"],
      "digestiveClues": ["string"],
      "possibleTriggers": ["string"]
    },
    "emotionalStateReading": {
      "stressPatterns": ["string"],
      "emotionalSignals": ["string"],
      "tensionAreas": ["string"]
    },
    "healthRiskAssessment": {
      "hormonalIndicators": ["string"],
      "sleepQualityClues": ["string"],
      "lifestyleConcerns": ["string"]
    }
  },
  "recommendations": {
    "immediate": [
      {"icon": "fas fa-icon", "title": "Action Title", "description": "Detailed description"}
    ],
    "nutritional": [
      {"icon": "fas fa-icon", "title": "Nutritional Strategy", "description": "Specific dietary recommendations"}
    ],
    "lifestyle": [
      {"icon": "fas fa-icon", "title": "Lifestyle Adjustment", "description": "Rest, stress, and mindset recommendations"}
    ],
    "longTerm": [
      {"icon": "fas fa-icon", "title": "Long-term Strategy", "description": "Comprehensive healing approach"}
    ]
  }
}

Provide specific, actionable insights based on physiognomist principles and holistic health analysis.`
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
      max_tokens: 2000
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

      // Perform facial analysis using OpenAI
      const analysisResults = await performFacialAnalysis(req.file.path);
      
      // Save analysis to storage
      const analysis = await storage.createAnalysis({
        userId: null, // For now, not associating with users
        imageUrl: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        overallScore: analysisResults.overallScore,
        skinHealth: analysisResults.skinHealth,
        eyeHealth: analysisResults.eyeHealth,
        circulation: analysisResults.circulation,
        symmetry: analysisResults.symmetry,
        analysisData: {
          ...analysisResults.analysisData,
          rawAnalysis: analysisResults.rawAnalysis
        },
        recommendations: analysisResults.recommendations,
      });

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
