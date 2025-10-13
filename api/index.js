import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { registerRoutes } from '../server/routes.js';

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes once
let routesInitialized = false;
let initPromise = null;

async function initializeRoutes() {
  if (!routesInitialized && !initPromise) {
    initPromise = registerRoutes(app).then(() => {
      routesInitialized = true;
      console.log('Routes initialized');
    });
  }
  return initPromise;
}

// Export the handler for Vercel
export default async function handler(req, res) {
  try {
    // Initialize routes if not already done
    if (!routesInitialized) {
      await initializeRoutes();
    }
    
    // Use the Express app to handle the request
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
