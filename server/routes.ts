import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";

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

// Mock facial analysis function
function performFacialAnalysis(imagePath: string) {
  // Simulate AI analysis with random but realistic values
  const baseScore = 70 + Math.random() * 25; // 70-95
  
  return {
    overallScore: Math.round(baseScore),
    skinHealth: Math.round(baseScore + (Math.random() - 0.5) * 20),
    eyeHealth: Math.round(baseScore + (Math.random() - 0.5) * 15),
    circulation: Math.round(baseScore + (Math.random() - 0.5) * 18),
    symmetry: Math.round(baseScore + (Math.random() - 0.5) * 12),
    analysisData: {
      facialMarkers: [
        { x: 25, y: 33, type: "eye", status: "good" },
        { x: 75, y: 33, type: "eye", status: "excellent" },
        { x: 33, y: 25, type: "skin", status: "minor_issues" },
        { x: 67, y: 50, type: "skin", status: "good" },
        { x: 50, y: 67, type: "structure", status: "good" }
      ],
      skinAnalysis: {
        hydration: "good",
        pigmentation: "minor_spots",
        texture: "smooth",
        elasticity: "normal"
      },
      eyeAnalysis: {
        underEyeCircles: "minimal",
        puffiness: "none",
        brightness: "high",
        symmetry: "perfect"
      },
      circulationAnalysis: {
        facialFlush: "normal",
        lipColor: "healthy",
        capillaryHealth: "good",
        overallTone: "even"
      }
    },
    recommendations: {
      immediate: [
        {
          icon: "fas fa-sun",
          title: "Apply Sunscreen",
          description: "Use broad-spectrum SPF 30+ daily to prevent further pigmentation"
        },
        {
          icon: "fas fa-tint",
          title: "Increase Hydration",
          description: "Drink 8-10 glasses of water daily for better skin hydration"
        },
        {
          icon: "fas fa-bed",
          title: "Improve Sleep",
          description: "Aim for 7-9 hours of quality sleep for better skin recovery"
        }
      ],
      longTerm: [
        {
          icon: "fas fa-apple-alt",
          title: "Balanced Nutrition",
          description: "Include antioxidant-rich foods for skin health improvement"
        },
        {
          icon: "fas fa-running",
          title: "Regular Exercise",
          description: "30 minutes of daily activity to boost circulation"
        },
        {
          icon: "fas fa-user-md",
          title: "Professional Consultation",
          description: "Consider a dermatologist visit for personalized skincare routine"
        }
      ]
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and analyze image
  app.post("/api/analyze", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Perform facial analysis
      const analysisResults = performFacialAnalysis(req.file.path);
      
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
