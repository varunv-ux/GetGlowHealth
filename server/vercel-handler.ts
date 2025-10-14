import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

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
    console.log(`[HANDLER] ${req.method} ${req.url}`);
    console.log('[HANDLER] Environment check:', {
      hasDatabase: !!process.env.DATABASE_URL,
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasR2Account: !!process.env.R2_ACCOUNT_ID,
      nodeEnv: process.env.NODE_ENV
    });
    
    const expressApp = await initializeApp();
    console.log('[HANDLER] App initialized, processing request...');
    return expressApp(req, res);
  } catch (error: any) {
    console.error('[HANDLER ERROR]', error);
    console.error('[HANDLER ERROR STACK]', error.stack);
    
    // Make sure response hasn't been sent already
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}
