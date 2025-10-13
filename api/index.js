import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    await registerRoutes(app);
    initialized = true;
  }
  return app(req, res);
}
