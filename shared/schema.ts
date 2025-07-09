import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  imageUrl: text("image_url").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"), // Original file size in bytes
  processedSize: integer("processed_size"), // Processed file size in bytes
  originalDimensions: text("original_dimensions"), // "width x height"
  processedDimensions: text("processed_dimensions"), // "width x height"
  overallScore: integer("overall_score").notNull(),
  skinHealth: integer("skin_health").notNull(),
  eyeHealth: integer("eye_health").notNull(),
  circulation: integer("circulation").notNull(),
  symmetry: integer("symmetry").notNull(),
  analysisData: jsonb("analysis_data").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;
