import {
  users,
  analyses,
  type User,
  type UpsertUser,
  type Analysis,
  type InsertAnalysis,
} from "@shared/schema";
import { db } from "./db";
import { eq, isNull, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Analysis operations
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  updateAnalysis(id: number, data: Partial<InsertAnalysis>): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getUserAnalyses(userId: string | null): Promise<Analysis[]>;
  getAllAnalyses(): Promise<Analysis[]>;
  getRecentAnalyses(limit?: number): Promise<Analysis[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Analysis operations
  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const [analysis] = await db
      .insert(analyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async updateAnalysis(id: number, data: Partial<InsertAnalysis>): Promise<Analysis> {
    const [analysis] = await db
      .update(analyses)
      .set(data)
      .where(eq(analyses.id, id))
      .returning();
    return analysis;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis || undefined;
  }

  async getUserAnalyses(userId: string | null): Promise<Analysis[]> {
    if (userId === null) {
      return await db.select().from(analyses).where(isNull(analyses.userId)).orderBy(desc(analyses.createdAt));
    }
    return await db.select().from(analyses).where(eq(analyses.userId, userId)).orderBy(desc(analyses.createdAt));
  }

  async getAllAnalyses(): Promise<Analysis[]> {
    return await db.select().from(analyses).orderBy(desc(analyses.createdAt));
  }

  async getRecentAnalyses(limit: number = 10): Promise<Analysis[]> {
    return await db.select().from(analyses).orderBy(desc(analyses.createdAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();