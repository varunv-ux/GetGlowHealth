import type { Adapter } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// NextAuth configuration (for future use when fully implementing OAuth)
export const authConfig = {
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    // OAuth providers will be configured here when needed
    // For now, using session-based auth in development
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};

// Session middleware for Express
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
    secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

// Setup session-based auth for production (OAuth can be added later)
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Simple login endpoint for production (replace with OAuth providers later)
  app.get("/api/login", (req, res) => {
    // For now, redirect to a login page
    // TODO: Implement OAuth providers (Google, GitHub)
    res.status(501).json({ 
      message: "OAuth not yet configured. Please set up Google or GitHub OAuth providers.",
      documentation: "See NEXTAUTH_MIGRATION.md for setup instructions"
    });
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
}

// Middleware to check if user is authenticated
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const reqWithSession = req as any;
  const session = reqWithSession.session;
  
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized - Please configure OAuth providers" });
  }
  
  // Add user to request object for compatibility
  reqWithSession.user = {
    claims: {
      sub: session.user.id,
      email: session.user.email,
      first_name: session.user.name?.split(' ')[0],
      last_name: session.user.name?.split(' ').slice(1).join(' '),
      profile_image_url: session.user.image,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
    },
    isAuthenticated: true,
  };
  
  next();
};
