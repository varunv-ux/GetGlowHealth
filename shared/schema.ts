import { pgTable, text, serial, integer, jsonb, timestamp, varchar, index, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Express session storage table for express-session
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table compatible with both local auth and NextAuth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  name: varchar("name"),
  image: varchar("image"),
  // Legacy fields for backward compatibility
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NextAuth tables
export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type").notNull(),
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type"),
    scope: varchar("scope"),
    id_token: text("id_token"),
    session_state: varchar("session_state"),
  },
  (table) => [
    primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  ]
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.identifier, table.token],
    }),
  ]
);

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  imageUrl: text("image_url").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"), // Original file size in bytes
  processedSize: integer("processed_size"), // Processed file size in bytes
  originalDimensions: text("original_dimensions"), // "width x height"
  processedDimensions: text("processed_dimensions"), // "width x height"
  status: varchar("status", { length: 20 }).default('pending'), // Analysis status: pending, processing, completed, failed
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
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;
