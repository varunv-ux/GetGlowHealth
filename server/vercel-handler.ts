import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;
let initPromise: Promise<any> | null = null;

async function initializeApp() {
  if (!initialized && !initPromise) {
    initPromise = (async () => {
      try {
        console.log('Initializing app...');
        await registerRoutes(app);
        
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
          console.error('Express error handler:', err);
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";
          res.status(status).json({ message });
        });
        
        initialized = true;
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
        throw error;
      }
    })();
  }
  if (initPromise) {
    await initPromise;
  }
  return app;
}

export default async function handler(req: Request, res: Response) {
  try {
    console.log(`${req.method} ${req.url}`);
    const expressApp = await initializeApp();
    return expressApp(req, res);
  } catch (error: any) {
    console.error('Handler error:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
