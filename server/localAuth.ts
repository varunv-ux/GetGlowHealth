import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow HTTP for localhost
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Create a default local user for development
  const localUser = await storage.upsertUser({
    id: "local-dev-user",
    email: "dev@localhost.com",
    name: "Local Developer",
    firstName: "Local",
    lastName: "Developer",
    image: null,
    profileImageUrl: null,
  });

  // Simple login endpoint for development
  app.get("/api/login", (req, res) => {
    const session = req.session as any;
    session.user = {
      claims: {
        sub: localUser.id,
        email: localUser.email,
        first_name: localUser.firstName,
        last_name: localUser.lastName,
        profile_image_url: localUser.profileImageUrl,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      },
      isAuthenticated: true,
    };
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  // Mock authenticated user for all requests in development
  app.use((req, res, next) => {
    const session = req.session as any;
    if (!session.user) {
      session.user = {
        claims: {
          sub: localUser.id,
          email: localUser.email,
          first_name: localUser.firstName,
          last_name: localUser.lastName,
          profile_image_url: localUser.profileImageUrl,
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
        },
        isAuthenticated: true,
      };
    }
    
    // Mock passport methods
    req.isAuthenticated = () => true;
    req.user = session.user;
    
    next();
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  // In development, always pass authentication
  next();
}; 