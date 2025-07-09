import { users, analyses, type User, type InsertUser, type Analysis, type InsertAnalysis } from "@shared/schema";
import { db } from "./db";
import { eq, isNull, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getUserAnalyses(userId: number | null): Promise<Analysis[]>;
  getAllAnalyses(): Promise<Analysis[]>;
  getRecentAnalyses(limit?: number): Promise<Analysis[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const [analysis] = await db
      .insert(analyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis || undefined;
  }

  async getUserAnalyses(userId: number | null): Promise<Analysis[]> {
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
