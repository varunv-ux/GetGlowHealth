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
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and WEBP images are allowed'));
    }
  }
});

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// AI-powered facial analysis function using OpenAI GPT-4o
async function performFacialAnalysis(imagePath: string) {
  try {
    // Read and encode image as base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert dermatologist and facial health analyst. Analyze the facial image and provide comprehensive health assessment. Focus on skin health, eye condition, circulation indicators, and facial symmetry. Provide realistic scores (1-100) and detailed analysis. Respond with JSON in the exact format requested."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this facial image for health indicators and provide a comprehensive assessment. Return JSON with this exact structure:
{
  "overallScore": number (1-100),
  "skinHealth": number (1-100),
  "eyeHealth": number (1-100),
  "circulation": number (1-100),
  "symmetry": number (1-100),
  "analysisData": {
    "facialMarkers": [
      {"x": number, "y": number, "type": "eye|skin|structure", "status": "excellent|good|minor_issues|normal"}
    ],
    "skinAnalysis": {
      "hydration": "excellent|good|normal|poor",
      "pigmentation": "even|minor_spots|moderate_spots|significant_spots",
      "texture": "smooth|slightly_rough|rough|very_rough",
      "elasticity": "excellent|good|normal|poor"
    },
    "eyeAnalysis": {
      "underEyeCircles": "none|minimal|moderate|significant",
      "puffiness": "none|minimal|moderate|significant",
      "brightness": "high|medium|low",
      "symmetry": "perfect|good|slight_asymmetry|noticeable_asymmetry"
    },
    "circulationAnalysis": {
      "facialFlush": "healthy|normal|pale|excessive",
      "lipColor": "healthy|normal|pale|dark",
      "capillaryHealth": "excellent|good|normal|poor",
      "overallTone": "even|slightly_uneven|uneven|very_uneven"
    }
  },
  "recommendations": {
    "immediate": [
      {"icon": "fas fa-icon", "title": "Action Title", "description": "Detailed description"}
    ],
    "longTerm": [
      {"icon": "fas fa-icon", "title": "Action Title", "description": "Detailed description"}
    ]
  }
}

Provide specific, actionable recommendations based on the actual analysis of the face.`
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

    const analysisResult = JSON.parse(response.choices[0].message.content);
    return analysisResult;
    
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    // Fallback to basic analysis if OpenAI fails
    throw new Error("Failed to analyze image with AI");
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
        analysisData: analysisResults.analysisData,
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
