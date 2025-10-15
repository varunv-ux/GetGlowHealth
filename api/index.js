var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/config/prompts.ts
var FACIAL_ANALYSIS_PROMPTS, ALTERNATIVE_PROMPTS;
var init_prompts = __esm({
  "server/config/prompts.ts"() {
    "use strict";
    FACIAL_ANALYSIS_PROMPTS = {
      systemPrompt: `You are a world-class wellness analyst with deep interdisciplinary expertise in:
\u2022 Physiognomy & Facial Analysis
\u2022 Nutrition & Dietary Optimization
\u2022 Dermatology & Skin Health
\u2022 Integrative Wellness & Anti-Aging Medicine
\u2022 Psychosomatic Medicine & Mind-Body Connection
\u2022 Health Optimization & Preventive Health

**IMPORTANT GUIDELINES:**
\u2022 Provide CONFIDENCE LEVELS (low/medium/high) for EVERY observation
\u2022 Base ALL recommendations on VISIBLE EVIDENCE - cite exactly what you see
\u2022 Include specific, actionable recommendations with evidence
\u2022 Be thorough but concise - focus on the most impactful insights
\u2022 Recommend consulting healthcare professionals for any health concerns

**MEDICAL DISCLAIMER:**
This analysis is for wellness optimization and educational purposes only. It is NOT a medical diagnosis, medical advice, or substitute for professional healthcare. All observations are general wellness suggestions based on visible characteristics. Users should consult qualified healthcare providers for any health concerns or before making significant lifestyle changes.

Deliver a deep, structured, and practical analysis. Use visible cues to infer potential internal states and recommend actions for healing, rejuvenation, and optimization. Act as a trusted functional medicine specialist and wellness coach - expert yet empowering.`,
      analysisPrompt: `Analyze this face image comprehensively using the following framework. For EACH observation, provide a CONFIDENCE LEVEL (low/medium/high) and cite the VISIBLE EVIDENCE you're seeing.

**1. Comprehensive Skin Health Analysis** (NEW - DETAILED)
Perform detailed skin assessment:
\u2022 TEXTURE: Analyze smoothness, pores, fine lines, skin quality - cite what you see
\u2022 TONE: Assess evenness, coloration, undertones, brightness - cite what you see
\u2022 HYDRATION: Evaluate moisture levels, dryness, plumpness - cite what you see
\u2022 VISIBLE CONDITIONS: Identify any concerns (redness, spots, dark circles, etc.)
\u2022 CONFIDENCE LEVEL: Rate your confidence (low/medium/high) for each observation
Format: Specific Observation \u2192 Visual Evidence \u2192 Recommendation

**2. Facial Zone Analysis** (ENHANCED)
Analyze each zone (forehead, eyes, nose, cheeks, lips, jawline, chin, neck) from multiple perspectives:
\u2022 OBSERVATION: What specific visual characteristics do you see?
\u2022 PHYSIOGNOMY: Personality/energy imprints
\u2022 NUTRITION: Dietary imbalances or organ stress signs
\u2022 PSYCHOSOMATIC: Emotional tension zones, stress markers
\u2022 HEALTH INDICATORS: Hormones, vitality, sleep quality
\u2022 CONFIDENCE: Rate confidence (low/medium/high)
\u2022 SUGGESTED ACTION: Specific, actionable wellness recommendations

**3. Deficiency Detector** (ORIGINAL - KEEP)
From facial features (skin, lips, under-eyes, mouth corners, hairline):
\u2022 Detect vitamin, mineral, or hydration deficiencies
\u2022 Rate severity (low/moderate/high) with CONFIDENCE LEVEL
\u2022 Cite VISUAL EVIDENCE you're seeing
\u2022 Link to likely symptoms (fatigue, low immunity, etc.)
\u2022 Recommend specific foods/supplements to restore balance

**4. Food Intolerance Identifier** (ORIGINAL - KEEP)
Spot visual markers of:
\u2022 Inflammation (puffiness, redness, acne) - cite where you see it
\u2022 Water retention - specific areas
\u2022 Histamine sensitivity - visible signs
\u2022 Dairy/gluten/sugar-related congestion
Flag likely intolerances with CONFIDENCE LEVEL and next steps (elimination trial, GI tests).

**5. Health Risk Reader** (ORIGINAL - KEEP WITH DISCLAIMER)
**Disclaimer: These are potential wellness areas to explore with healthcare providers, not diagnoses.**
Highlight potential risks based on facial cues with CONFIDENCE LEVELS:
\u2022 Hormonal imbalance - visual evidence + confidence
\u2022 Sleep debt - specific signs + confidence
\u2022 Adrenal fatigue indicators - what you see + confidence
\u2022 Gut dysbiosis markers - visual cues + confidence
\u2022 Chronic stress/burnout - tension patterns + confidence
For each: Visual Evidence \u2192 Brief Explanation \u2192 3 Action Steps + "Consult healthcare provider"

**6. Lifestyle & Wellness Indicators** (NEW)
Based on visible characteristics:
\u2022 SLEEP QUALITY: Visual indicators of rest/fatigue (confidence level)
\u2022 HYDRATION: Signs of water intake levels (confidence level)
\u2022 NUTRITION: Dietary patterns visible in skin (confidence level)
\u2022 STRESS LEVELS: Visible tension or relaxation markers (confidence level)

**7. Emotional State Scanner** (ORIGINAL - KEEP)
Decode facial tension and expression:
\u2022 Chronic emotional patterns visible (grief, anxiety, resentment, pressure)
\u2022 Stress-pattern storage (tight jaw, furrowed brow, clenched lips)
\u2022 CONFIDENCE LEVEL for each observation
Recommend: mindset shifts, journaling, breathwork, somatic releases, therapy

**8. Visual Age Estimator** (ORIGINAL - KEEP)
Estimate perceived age based on:
\u2022 Skin tone, elasticity, wrinkle depth, volume loss
\u2022 Facial symmetry and posture
\u2022 Muscle tension or sagging
Identify age-accelerating patterns, causes, and reversal strategies (collagen, sleep, anti-inflammatory diet).

**9. Holistic Wellness Protocol** (COMPREHENSIVE - NEW + ORIGINAL COMBINED)
Synthesize all findings into a personalized daily protocol:
\u2022 MORNING ROUTINE: Nutrition, skincare, mindset practices
\u2022 MIDDAY OPTIMIZATION: Hydration, movement, stress release, energy maintenance
\u2022 EVENING WIND-DOWN: Sleep prep, emotional reset, skin care
\u2022 WEEKLY PRACTICES: Sauna, lymphatic massage, gratitude, self-care rituals
\u2022 RESET FOODS: Top healing foods to prioritize
\u2022 SUPPLEMENTS: 3 key supplements to consider (discuss with provider)
\u2022 MINDSET SHIFTS: Top 1-2 mental reframes for wellness

Please provide your analysis in this JSON format:

{
  "disclaimer": "This wellness analysis is for educational and optimization purposes only. It is not medical advice, diagnosis, or treatment. Please consult healthcare professionals for any health concerns.",
  "overallScore": number (1-100),
  "skinHealth": number (1-100),
  "eyeHealth": number (1-100),
  "circulation": number (1-100),
  "symmetry": number (1-100),
  "estimatedAge": number,
  "ageRange": "XX-XX years",
  "skinAnalysis": {
    "texture": {
      "observation": "Detailed description of skin texture",
      "visualEvidence": "Cite specific characteristics you see",
      "confidence": "low|medium|high",
      "recommendation": "Specific skincare suggestion"
    },
    "tone": {
      "observation": "Description of skin tone and evenness",
      "visualEvidence": "What you see",
      "confidence": "low|medium|high",
      "recommendation": "Tone improvement suggestion"
    },
    "hydration": {
      "observation": "Moisture and plumpness assessment",
      "visualEvidence": "Visual cues",
      "confidence": "low|medium|high",
      "recommendation": "Hydration recommendations"
    },
    "visibleConditions": [
      {
        "condition": "Name (e.g., 'dark circles', 'redness')",
        "location": "Where you see it",
        "confidence": "low|medium|high",
        "suggestion": "Wellness recommendation"
      }
    ]
  },
  "lifestyleIndicators": {
    "sleepQuality": {
      "observation": "Visual cues about rest",
      "visualEvidence": "What you see",
      "confidence": "low|medium|high",
      "recommendation": "Sleep optimization"
    },
    "hydrationLevel": {
      "observation": "Water intake signs",
      "visualEvidence": "Visual indicators",
      "confidence": "low|medium|high",
      "recommendation": "Hydration goals"
    },
    "nutritionIndicators": {
      "observation": "Nutrition-related signs",
      "visualEvidence": "Visual markers",
      "confidence": "low|medium|high",
      "recommendation": "Nutritional suggestions"
    },
    "stressLevel": {
      "observation": "Tension/relaxation markers",
      "visualEvidence": "Physical signs",
      "confidence": "low|medium|high",
      "recommendation": "Stress management"
    }
  },
  "conversationalAnalysis": {
    "facialFeatureBreakdown": "2-3 sentences summarizing key facial observations with confidence",
    "visualAgeEstimator": "1-2 sentences with age estimate and main aging factors",
    "deficiencyDetector": "1-2 sentences listing top 2-3 deficiencies with confidence",
    "foodIntoleranceIdentifier": "1-2 sentences identifying probable intolerances with confidence",
    "healthRiskReader": "2 sentences highlighting main risks with confidence + disclaimer to consult provider",
    "emotionalStateScanner": "1-2 sentences on tension patterns with confidence",
    "skinHealthSummary": "2-3 sentences on comprehensive skin health with confidence",
    "lifestyleWellness": "2-3 sentences on lifestyle indicators",
    "holisticApproach": "2 sentences on mind-body wellness integration"
  },
  "analysisData": {
    "facialMarkers": [
      {
        "x": 0,
        "y": 0,
        "type": "eye|skin|structure|tension",
        "status": "excellent|good|minor_issues|concerning",
        "insight": "Specific observation with visual evidence",
        "confidence": "low|medium|high"
      }
    ],
    "facialZoneAnalysis": {
      "forehead": {
        "observation": "Visual characteristics",
        "interpretation": "Health/wellness/physiognomy perspective",
        "confidence": "low|medium|high",
        "suggestedAction": "Specific recommendation"
      },
      "eyes": {
        "observation": "What you see",
        "interpretation": "Lifestyle/health indicators",
        "confidence": "low|medium|high",
        "suggestedAction": "Actionable suggestion"
      },
      "nose": {
        "observation": "Visual assessment",
        "interpretation": "Wellness insights",
        "confidence": "low|medium|high",
        "suggestedAction": "Recommendation"
      },
      "cheeks": {
        "observation": "What you observe",
        "interpretation": "Health perspective",
        "confidence": "low|medium|high",
        "suggestedAction": "Wellness tip"
      },
      "lips": {
        "observation": "Visual characteristics",
        "interpretation": "Hydration/nutrition indicators",
        "confidence": "low|medium|high",
        "suggestedAction": "Specific action"
      },
      "jawline": {
        "observation": "What you see",
        "interpretation": "Stress/tension indicators",
        "confidence": "low|medium|high",
        "suggestedAction": "Relaxation technique"
      },
      "chin": {
        "observation": "Visual assessment",
        "interpretation": "Wellness insights",
        "confidence": "low|medium|high",
        "suggestedAction": "Recommendation"
      },
      "neck": {
        "observation": "What you observe",
        "interpretation": "Posture/wellness indicators",
        "confidence": "low|medium|high",
        "suggestedAction": "Wellness suggestion"
      }
    },
    "deficiencyAnalysis": [
      {
        "deficiency": "Specific vitamin/mineral name",
        "visualCue": "Visual sign you see",
        "visualEvidence": "Detailed description of what you observe",
        "severity": "low|moderate|high",
        "confidence": "low|medium|high",
        "likelySymptom": "Associated symptom",
        "recommendation": "Specific foods or supplements"
      }
    ],
    "foodIntolerances": [
      {
        "type": "dairy|gluten|sugar|histamine|other",
        "visualMarkers": ["Specific visual signs you see"],
        "visualEvidence": "Where and what you observe",
        "likelihood": "low|moderate|high",
        "confidence": "low|medium|high",
        "nextSteps": "Testing or elimination recommendations"
      }
    ],
    "healthRisks": [
      {
        "risk": "Specific health risk name",
        "visualEvidence": "Facial cues you see",
        "confidence": "low|medium|high",
        "explanation": "Brief connection explanation",
        "actionSteps": [
          "Specific action 1",
          "Specific action 2",
          "Consult healthcare provider for evaluation"
        ]
      }
    ],
    "emotionalState": {
      "suppressedEmotions": [
        {
          "emotion": "grief|anxiety|resentment|pressure|other",
          "visualMarkers": "What you see",
          "confidence": "low|medium|high"
        }
      ],
      "stressPatterns": [
        {
          "pattern": "tight jaw|furrowed brow|clenched lips|other",
          "location": "Where you see it",
          "confidence": "low|medium|high"
        }
      ],
      "recommendations": [
        "daily journaling",
        "breathwork practice",
        "somatic therapy",
        "mindfulness meditation"
      ]
    },
    "dailyProtocol": {
      "morning": ["Specific practice 1", "Specific practice 2"],
      "midday": ["Specific practice 1", "Specific practice 2"],
      "evening": ["Specific practice 1", "Specific practice 2"],
      "weekly": ["Weekly practice 1", "Weekly practice 2"],
      "resetFoods": ["Food 1", "Food 2", "Food 3"],
      "supplements": ["Supplement 1 with dosage", "Supplement 2 with dosage", "Supplement 3 with dosage"],
      "mindsetShifts": ["Mindset shift 1", "Mindset shift 2"]
    }
  },
  "recommendations": {
    "immediate": [
      {
        "icon": "fas fa-water",
        "title": "Specific immediate action",
        "description": "What to do, why, expected benefit",
        "confidence": "low|medium|high",
        "timeframe": "Today"
      }
    ],
    "nutritional": [
      {
        "icon": "fas fa-apple-alt",
        "title": "Specific nutritional recommendation",
        "description": "Foods, hydration, dietary patterns",
        "confidence": "low|medium|high",
        "timeframe": "Daily"
      }
    ],
    "lifestyle": [
      {
        "icon": "fas fa-running",
        "title": "Specific lifestyle change",
        "description": "Sleep, stress, movement, habits",
        "confidence": "low|medium|high",
        "timeframe": "Daily or Weekly"
      }
    ],
    "longTerm": [
      {
        "icon": "fas fa-chart-line",
        "title": "Long-term goal",
        "description": "Sustainable habit with milestones",
        "confidence": "low|medium|high",
        "timeframe": "1-3 months"
      }
    ],
    "supplements": [
      {
        "icon": "fas fa-pills",
        "title": "Supplement name",
        "description": "Why, dosage, timing - discuss with provider",
        "confidence": "low|medium|high",
        "timeframe": "Discuss with healthcare provider"
      }
    ],
    "mindset": [
      {
        "icon": "fas fa-brain",
        "title": "Mindset practice",
        "description": "Technique or affirmation",
        "confidence": "low|medium|high",
        "timeframe": "Daily"
      }
    ]
  }
}

**CRITICAL INSTRUCTIONS:**
- Include CONFIDENCE LEVELS (low/medium/high) for ALL observations
- Cite VISUAL EVIDENCE for every finding - be specific about what you see
- Provide the COMPLETE JSON response - all sections filled out
- Be thorough yet concise - focus on most impactful insights
- For health risks, deficiencies, intolerances: always add "Consult healthcare provider"
- Never use placeholder text - provide actual specific observations
- Balance detail with clarity - comprehensive but actionable

Please provide your comprehensive analysis in the exact JSON format shown above.`,
      temperature: 0.4,
      // Optimized for consistent, factual responses
      maxTokens: 6e3
      // Increased for comprehensive analysis
    };
    ALTERNATIVE_PROMPTS = {
      SIMPLE_ANALYSIS: {
        systemPrompt: "You are a facial analysis expert focused on general appearance and wellness observations.",
        analysisPrompt: "Analyze this face for general appearance, skin health, and wellness indicators. Provide practical recommendations.",
        temperature: 0.5,
        maxTokens: 2e3
      },
      MEDICAL_FOCUS: {
        systemPrompt: "You are a medical professional specializing in facial diagnostics and health assessment.",
        analysisPrompt: "Analyze this face from a medical perspective, focusing on health indicators and potential concerns.",
        temperature: 0.3,
        maxTokens: 3e3
      }
    };
  }
});

// server/config/config-manager.ts
var config_manager_exports = {};
__export(config_manager_exports, {
  ConfigManager: () => ConfigManager,
  configManager: () => configManager
});
import fs2 from "fs";
import path2 from "path";
var ConfigManager, configManager;
var init_config_manager = __esm({
  "server/config/config-manager.ts"() {
    "use strict";
    init_prompts();
    ConfigManager = class _ConfigManager {
      static instance;
      configPath;
      currentConfig;
      constructor() {
        const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
        this.configPath = isServerless ? path2.join("/tmp", "active-prompt.json") : path2.join(process.cwd(), "server", "config", "active-prompt.json");
        this.currentConfig = this.loadConfig();
      }
      static getInstance() {
        if (!_ConfigManager.instance) {
          _ConfigManager.instance = new _ConfigManager();
        }
        return _ConfigManager.instance;
      }
      loadConfig() {
        try {
          if (fs2.existsSync(this.configPath)) {
            const configData = fs2.readFileSync(this.configPath, "utf8");
            return JSON.parse(configData);
          }
        } catch (error) {
          console.warn("Failed to load config, using default:", error);
        }
        return FACIAL_ANALYSIS_PROMPTS;
      }
      getActivePrompt() {
        return this.currentConfig;
      }
      updatePrompt(config2) {
        this.currentConfig = config2;
        this.saveConfig();
      }
      setPromptType(type) {
        let newConfig;
        switch (type) {
          case "DETAILED":
            newConfig = FACIAL_ANALYSIS_PROMPTS;
            break;
          case "SIMPLE":
            newConfig = ALTERNATIVE_PROMPTS.SIMPLE_ANALYSIS;
            break;
          case "MEDICAL":
            newConfig = ALTERNATIVE_PROMPTS.MEDICAL_FOCUS;
            break;
          default:
            newConfig = FACIAL_ANALYSIS_PROMPTS;
        }
        this.updatePrompt(newConfig);
      }
      saveConfig() {
        try {
          const configDir = path2.dirname(this.configPath);
          if (configDir !== "/tmp" && !fs2.existsSync(configDir)) {
            fs2.mkdirSync(configDir, { recursive: true });
          }
          fs2.writeFileSync(this.configPath, JSON.stringify(this.currentConfig, null, 2));
          console.log("Prompt configuration saved successfully to:", this.configPath);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.warn("Failed to save config (this is normal in serverless environments):", errorMessage);
        }
      }
      exportConfig() {
        return JSON.stringify(this.currentConfig, null, 2);
      }
      importConfig(configJson) {
        try {
          const config2 = JSON.parse(configJson);
          if (!config2.systemPrompt || !config2.analysisPrompt || typeof config2.temperature !== "number") {
            throw new Error("Invalid configuration format");
          }
          this.updatePrompt(config2);
          return true;
        } catch (error) {
          console.error("Failed to import config:", error);
          return false;
        }
      }
      getAvailablePrompts() {
        return {
          DETAILED: FACIAL_ANALYSIS_PROMPTS,
          SIMPLE: ALTERNATIVE_PROMPTS.SIMPLE_ANALYSIS,
          MEDICAL: ALTERNATIVE_PROMPTS.MEDICAL_FOCUS
        };
      }
      resetToDefault() {
        this.updatePrompt(FACIAL_ANALYSIS_PROMPTS);
      }
    };
    configManager = ConfigManager.getInstance();
  }
});

// server/vercel-handler.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  accounts: () => accounts,
  analyses: () => analyses,
  insertAnalysisSchema: () => insertAnalysisSchema,
  insertUserSchema: () => insertUserSchema,
  sessions: () => sessions,
  users: () => users,
  verificationTokens: () => verificationTokens
});
import { pgTable, text, serial, integer, jsonb, timestamp, varchar, index, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
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
  updatedAt: timestamp("updated_at").defaultNow()
});
var accounts = pgTable(
  "accounts",
  {
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type").notNull(),
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type"),
    scope: varchar("scope"),
    id_token: text("id_token"),
    session_state: varchar("session_state")
  },
  (table) => [
    primaryKey({
      columns: [table.provider, table.providerAccountId]
    })
  ]
);
var verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (table) => [
    primaryKey({
      columns: [table.identifier, table.token]
    })
  ]
);
var analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  imageUrl: text("image_url").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  // Original file size in bytes
  processedSize: integer("processed_size"),
  // Processed file size in bytes
  originalDimensions: text("original_dimensions"),
  // "width x height"
  processedDimensions: text("processed_dimensions"),
  // "width x height"
  status: varchar("status", { length: 20 }).default("pending"),
  // Analysis status: pending, processing, completed, failed
  overallScore: integer("overall_score").notNull(),
  skinHealth: integer("skin_health").notNull(),
  eyeHealth: integer("eye_health").notNull(),
  circulation: integer("circulation").notNull(),
  symmetry: integer("symmetry").notNull(),
  analysisData: jsonb("analysis_data").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true
});
var insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { config } from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
if (process.env.NODE_ENV !== "production") {
  config();
}
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, isNull, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Analysis operations
  async createAnalysis(insertAnalysis) {
    const [analysis] = await db.insert(analyses).values(insertAnalysis).returning();
    return analysis;
  }
  async updateAnalysis(id, data) {
    try {
      console.log(`\u{1F504} Updating analysis #${id} with:`, JSON.stringify({ ...data, analysisData: "...", recommendations: "..." }, null, 2));
      const [analysis] = await db.update(analyses).set(data).where(eq(analyses.id, id)).returning();
      console.log(`\u2705 Updated analysis #${id}, status:`, analysis?.status);
      return analysis;
    } catch (error) {
      console.error(`\u274C Failed to update analysis #${id}:`, error);
      throw error;
    }
  }
  async getAnalysis(id) {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis || void 0;
  }
  async getUserAnalyses(userId) {
    if (userId === null) {
      return await db.select().from(analyses).where(isNull(analyses.userId)).orderBy(desc(analyses.createdAt));
    }
    return await db.select().from(analyses).where(eq(analyses.userId, userId)).orderBy(desc(analyses.createdAt));
  }
  async getAllAnalyses() {
    return await db.select().from(analyses).orderBy(desc(analyses.createdAt));
  }
  async getRecentAnalyses(limit = 10) {
    return await db.select().from(analyses).orderBy(desc(analyses.createdAt)).limit(limit);
  }
  async deleteAnalysis(id) {
    await db.delete(analyses).where(eq(analyses.id, id));
  }
};
var storage = new DatabaseStorage();

// server/localAuth.ts
import session from "express-session";
import connectPg from "connect-pg-simple";
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      // Allow HTTP for localhost
      maxAge: sessionTtl
    }
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  const localUser = await storage.upsertUser({
    id: "local-dev-user",
    email: "dev@localhost.com",
    name: "Local Developer",
    firstName: "Local",
    lastName: "Developer",
    image: null,
    profileImageUrl: null
  });
  app2.get("/api/login", (req, res) => {
    const session3 = req.session;
    session3.user = {
      claims: {
        sub: localUser.id,
        email: localUser.email,
        first_name: localUser.firstName,
        last_name: localUser.lastName,
        profile_image_url: localUser.profileImageUrl,
        exp: Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60
        // 7 days
      },
      isAuthenticated: true
    };
    res.redirect("/");
  });
  app2.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
  app2.use((req, res, next) => {
    const session3 = req.session;
    if (!session3.user) {
      session3.user = {
        claims: {
          sub: localUser.id,
          email: localUser.email,
          first_name: localUser.firstName,
          last_name: localUser.lastName,
          profile_image_url: localUser.profileImageUrl,
          exp: Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60
          // 7 days
        },
        isAuthenticated: true
      };
    }
    req.isAuthenticated = () => true;
    req.user = session3.user;
    next();
  });
}
var isAuthenticated = (req, res, next) => {
  next();
};

// server/nextAuth.ts
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import session2 from "express-session";
import connectPg2 from "connect-pg-simple";
var authConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    // OAuth providers will be configured here when needed
    // For now, using session-based auth in development
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60
    // 7 days
  }
};
function getSession2() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg2(session2);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session2({
    secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
async function setupAuth2(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession2());
  app2.get("/api/login", (req, res) => {
    res.status(501).json({
      message: "OAuth not yet configured. Please set up Google or GitHub OAuth providers.",
      documentation: "See NEXTAUTH_MIGRATION.md for setup instructions"
    });
  });
  app2.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
}
var isAuthenticated2 = async (req, res, next) => {
  const reqWithSession = req;
  const session3 = reqWithSession.session;
  if (!session3 || !session3.user) {
    return res.status(401).json({ message: "Unauthorized - Please configure OAuth providers" });
  }
  reqWithSession.user = {
    claims: {
      sub: session3.user.id,
      email: session3.user.email,
      first_name: session3.user.name?.split(" ")[0],
      last_name: session3.user.name?.split(" ").slice(1).join(" "),
      profile_image_url: session3.user.image,
      exp: Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60
    },
    isAuthenticated: true
  };
  next();
};

// server/routes.ts
import multer from "multer";
import path4 from "path";
import fs4 from "fs";
import OpenAI2 from "openai";

// server/image-processor.ts
import sharp from "sharp";
import fs from "fs";
import path from "path";
var DEFAULT_OPTIONS = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 85,
  format: "jpeg",
  maxFileSize: 2 * 1024 * 1024
  // 2MB
};
async function processImage(inputPath, outputPath, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const originalStats = fs.statSync(inputPath);
  const originalSize = originalStats.size;
  const originalMetadata = await sharp(inputPath).metadata();
  const originalDimensions = `${originalMetadata.width}x${originalMetadata.height}`;
  const needsResize = originalSize > opts.maxFileSize || originalMetadata.width > opts.maxWidth || originalMetadata.height > opts.maxHeight;
  if (!needsResize) {
    fs.copyFileSync(inputPath, outputPath);
    return {
      processedPath: outputPath,
      originalSize,
      processedSize: originalSize,
      originalDimensions,
      processedDimensions: originalDimensions,
      wasResized: false
    };
  }
  const processedImage = sharp(inputPath).resize(opts.maxWidth, opts.maxHeight, {
    fit: "inside",
    withoutEnlargement: true
  });
  switch (opts.format) {
    case "jpeg":
      processedImage.jpeg({ quality: opts.quality });
      break;
    case "png":
      processedImage.png({ quality: opts.quality });
      break;
    case "webp":
      processedImage.webp({ quality: opts.quality });
      break;
  }
  await processedImage.toFile(outputPath);
  const processedMetadata = await sharp(outputPath).metadata();
  const processedStats = fs.statSync(outputPath);
  const processedDimensions = `${processedMetadata.width}x${processedMetadata.height}`;
  return {
    processedPath: outputPath,
    originalSize,
    processedSize: processedStats.size,
    originalDimensions,
    processedDimensions,
    wasResized: true
  };
}
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
function getImageFormat(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "png";
    case ".webp":
      return "webp";
    case ".jpg":
    case ".jpeg":
    default:
      return "jpeg";
  }
}

// server/routes.ts
init_config_manager();

// server/r2-storage.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import path3 from "path";
var r2Client = null;
function getR2Client() {
  if (!r2Client) {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error("R2 storage is not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in your environment variables.");
    }
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
      }
    });
  }
  return r2Client;
}
async function uploadToR2(buffer, originalFilename, contentType = "image/jpeg") {
  try {
    const client = getR2Client();
    const bucketName = process.env.R2_BUCKET_NAME || "getglow-images";
    const ext = path3.extname(originalFilename);
    const uniqueId = nanoid(16);
    const key = `uploads/${Date.now()}-${uniqueId}${ext}`;
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType
        // Make publicly accessible
        // Note: You'll need to configure bucket public access in Cloudflare dashboard
      })
    );
    let url;
    if (process.env.R2_PUBLIC_URL) {
      url = `${process.env.R2_PUBLIC_URL}/${key}`;
    } else if (process.env.R2_PUBLIC_DOMAIN) {
      url = `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;
    } else {
      url = `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    }
    console.log(`\u2705 Uploaded to R2: ${key} (${(buffer.length / 1024).toFixed(2)} KB)`);
    return {
      url,
      key,
      size: buffer.length
    };
  } catch (error) {
    console.error("\u274C R2 upload error:", error);
    throw new Error(`Failed to upload to R2: ${error.message}`);
  }
}
function isR2Configured() {
  return !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);
}
function getMimeType(filename) {
  const ext = path3.extname(filename).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif"
  };
  return mimeTypes[ext] || "application/octet-stream";
}

// server/routes.ts
import sharp2 from "sharp";

// server/sse-manager.ts
var SSEManager = class {
  connections = /* @__PURE__ */ new Map();
  // Subscribe a client to updates for a specific analysis
  subscribe(analysisId, res) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no"
      // Disable nginx buffering
    });
    res.write(": connected\n\n");
    if (!this.connections.has(analysisId)) {
      this.connections.set(analysisId, /* @__PURE__ */ new Set());
    }
    this.connections.get(analysisId).add(res);
    console.log(`\u{1F4E1} SSE: Client subscribed to analysis ${analysisId} (${this.connections.get(analysisId).size} total)`);
    res.on("close", () => {
      this.unsubscribe(analysisId, res);
    });
  }
  // Unsubscribe a client
  unsubscribe(analysisId, res) {
    const clients = this.connections.get(analysisId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        this.connections.delete(analysisId);
      }
      console.log(`\u{1F4E1} SSE: Client unsubscribed from analysis ${analysisId} (${clients.size} remaining)`);
    }
  }
  // Send update to all clients listening to a specific analysis
  sendUpdate(analysisId, data) {
    const clients = this.connections.get(analysisId);
    if (!clients || clients.size === 0) {
      console.log(`\u{1F4E1} SSE: No clients listening for analysis ${analysisId}`);
      return;
    }
    const eventData = `data: ${JSON.stringify(data)}

`;
    clients.forEach((res) => {
      try {
        res.write(eventData);
        console.log(`\u{1F4E1} SSE: Sent update to client for analysis ${analysisId}`);
      } catch (error) {
        console.error(`\u{1F4E1} SSE: Error sending to client:`, error);
        this.unsubscribe(analysisId, res);
      }
    });
    if (data.status === "completed" || data.status === "failed") {
      this.closeConnections(analysisId);
    }
  }
  // Close all connections for a specific analysis
  closeConnections(analysisId) {
    const clients = this.connections.get(analysisId);
    if (clients) {
      clients.forEach((res) => {
        try {
          res.end();
        } catch (error) {
          console.error(`\u{1F4E1} SSE: Error closing connection:`, error);
        }
      });
      this.connections.delete(analysisId);
      console.log(`\u{1F4E1} SSE: Closed all connections for analysis ${analysisId}`);
    }
  }
  // Get connection count for debugging
  getConnectionCount(analysisId) {
    if (analysisId) {
      return this.connections.get(analysisId)?.size || 0;
    }
    let total = 0;
    this.connections.forEach((clients) => total += clients.size);
    return total;
  }
};
var sseManager = new SSEManager();

// server/streaming-analysis.ts
import OpenAI from "openai";
import fs3 from "fs";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
async function performStreamingAnalysis(imagePath, res, onComplete) {
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    const imageBuffer = fs3.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    res.write(`event: progress
data: ${JSON.stringify({ status: "Starting analysis..." })}

`);
    const { configManager: configManager2 } = await Promise.resolve().then(() => (init_config_manager(), config_manager_exports));
    const promptConfig = configManager2.getActivePrompt();
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.4,
      // Lower for more consistent, factual responses (was 0.7)
      max_tokens: 6e3,
      // Increased for comprehensive responses (was 4000)
      top_p: 0.9,
      // Nucleus sampling for higher quality outputs
      messages: [
        {
          role: "system",
          content: promptConfig.systemPrompt + '\n\nIMPORTANT: Ensure all JSON strings are properly escaped. Use \\" for quotes inside strings, \\n for newlines.'
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: promptConfig.analysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
                // High detail mode for better visual analysis
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      stream: true
      // ← KEY: Enable streaming!
    });
    let fullContent = "";
    let chunkCount = 0;
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullContent += content;
        chunkCount++;
        if (chunkCount % 10 === 0) {
          res.write(`event: progress
data: ${JSON.stringify({
            status: "Analyzing...",
            progress: Math.min(chunkCount / 100 * 100, 95)
          })}

`);
        }
      }
    }
    let analysisResult;
    try {
      const cleanedContent = fullContent.trim();
      console.log(`\u{1F4DD} Received ${cleanedContent.length} characters from OpenAI`);
      console.log(`\u{1F4DD} First 200 chars: ${cleanedContent.substring(0, 200)}`);
      console.log(`\u{1F4DD} Last 200 chars: ${cleanedContent.substring(cleanedContent.length - 200)}`);
      analysisResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("\u274C JSON parse error:", parseError.message);
      console.error("\u274C Content length:", fullContent.length);
      console.error("\u274C Content preview (first 500):", fullContent.substring(0, 500));
      console.error("\u274C Content preview (last 500):", fullContent.substring(fullContent.length - 500));
      try {
        let fixedContent = fullContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
        const openBraces = (fixedContent.match(/{/g) || []).length;
        const closeBraces = (fixedContent.match(/}/g) || []).length;
        const openBrackets = (fixedContent.match(/\[/g) || []).length;
        const closeBrackets = (fixedContent.match(/]/g) || []).length;
        console.log(`\u{1F4CA} Braces: ${openBraces} open, ${closeBraces} close | Brackets: ${openBrackets} open, ${closeBrackets} close`);
        for (let i = 0; i < openBrackets - closeBrackets; i++) {
          fixedContent += "]";
        }
        for (let i = 0; i < openBraces - closeBraces; i++) {
          fixedContent += "}";
        }
        analysisResult = JSON.parse(fixedContent);
        console.log("\u2705 Fixed incomplete JSON by closing missing brackets/braces");
      } catch (retryError) {
        res.write(`event: error
data: ${JSON.stringify({
          message: "AI response was incomplete. Try again or simplify your image.",
          details: `Response was ${fullContent.length} characters, parsing failed`
        })}

`);
        res.end();
        throw new Error(`JSON parsing failed after retry: ${parseError.message}`);
      }
    }
    analysisResult.rawAnalysis = {
      model: "gpt-4o",
      // Valid OpenAI model
      responseTime: (/* @__PURE__ */ new Date()).toISOString(),
      fullResponse: fullContent.substring(0, 1e3)
      // Only store first 1000 chars to avoid DB issues
    };
    res.write(`event: complete
data: ${JSON.stringify(analysisResult)}

`);
    res.end();
    await onComplete(analysisResult);
    console.log(`\u2705 Streaming analysis completed, ${chunkCount} chunks`);
  } catch (error) {
    console.error("Streaming analysis error:", error);
    const errorMessage = error?.error?.message || error.message || "Unknown error";
    res.write(`event: error
data: ${JSON.stringify({
      message: `Failed to analyze: ${errorMessage}`
    })}

`);
    res.end();
    throw error;
  }
}

// server/routes.ts
var useNextAuth = process.env.USE_NEXTAUTH === "true";
var setupAuth3 = useNextAuth ? setupAuth2 : setupAuth;
var isAuthenticated3 = useNextAuth ? isAuthenticated2 : isAuthenticated;
var uploadDir = process.env.VERCEL ? "/tmp" : "uploads/";
var upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  }
});
var openai2 = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY });
async function performFacialAnalysis(imagePath) {
  try {
    console.log("Starting performFacialAnalysis for:", imagePath);
    if (!fs4.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }
    const imageBuffer = fs4.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    console.log("Image loaded, size:", imageBuffer.length, "bytes");
    console.log("Making OpenAI API call...");
    console.log("API Key exists:", !!process.env.OPENAI_API_KEY);
    const promptConfig = configManager.getActivePrompt();
    const response = await openai2.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.4,
      // Lower for more consistent, factual responses
      max_tokens: 6e3,
      // Increased for comprehensive responses
      top_p: 0.9,
      // Nucleus sampling for higher quality outputs
      messages: [
        {
          role: "system",
          content: promptConfig.systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: promptConfig.analysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
                // High detail mode for better visual analysis
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });
    console.log("OpenAI response received");
    console.log("Response structure:", {
      choices: response.choices?.length,
      hasFirstChoice: !!response.choices?.[0],
      hasMessage: !!response.choices?.[0]?.message,
      hasContent: !!response.choices?.[0]?.message?.content
    });
    if (!response.choices || response.choices.length === 0) {
      console.error("OpenAI returned no choices");
      throw new Error("OpenAI returned no choices in response");
    }
    const responseContent = response.choices[0].message.content;
    console.log("OpenAI raw response:", responseContent);
    if (!responseContent) {
      console.error("OpenAI returned null content");
      console.log("Full OpenAI response:", JSON.stringify(response, null, 2));
      throw new Error("OpenAI returned empty response");
    }
    let analysisResult;
    try {
      analysisResult = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Failed to parse OpenAI JSON response:", parseError);
      console.error("Raw response content:", responseContent);
      throw new Error("Invalid JSON response from OpenAI");
    }
    analysisResult.rawAnalysis = {
      model: "gpt-4o",
      usage: response.usage,
      responseTime: (/* @__PURE__ */ new Date()).toISOString(),
      fullResponse: responseContent
    };
    return analysisResult;
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    if (error?.error) {
      console.error("OpenAI API error:", JSON.stringify(error.error, null, 2));
    }
    console.error("Full error object:", JSON.stringify(error, null, 2));
    const errorMessage = error?.error?.message || error.message || "Unknown error";
    if (errorMessage.includes("model") || errorMessage.includes("Model")) {
      throw new Error(`Invalid OpenAI model: ${errorMessage}`);
    } else if (errorMessage.includes("Invalid JSON")) {
      throw new Error("OpenAI returned invalid JSON format");
    } else if (errorMessage.includes("rate limit")) {
      throw new Error("OpenAI rate limit exceeded. Please try again later.");
    } else if (errorMessage.includes("quota") || errorMessage.includes("insufficient_quota")) {
      throw new Error("OpenAI quota exceeded. Please check your API key.");
    } else {
      throw new Error(`Failed to analyze image with AI: ${errorMessage}`);
    }
  }
}
async function registerRoutes(app2) {
  await setupAuth3(app2);
  app2.get("/api/auth/user", isAuthenticated3, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/analysis/:id/stream", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getAnalysis(id);
      if (!analysis) {
        res.writeHead(404, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        });
        res.write(`event: error
data: ${JSON.stringify({ message: "Analysis not found" })}

`);
        res.end();
        return;
      }
      if (analysis.userId && req.isAuthenticated && req.isAuthenticated()) {
        const userId = req.user.claims?.sub;
        if (analysis.userId !== userId) {
          res.writeHead(403, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
          });
          res.write(`event: error
data: ${JSON.stringify({ message: "Access denied" })}

`);
          res.end();
          return;
        }
      }
      const status = analysis.status || (analysis.overallScore > 0 ? "completed" : "processing");
      const analysisWithStatus = { ...analysis, status };
      if (status === "completed" || status === "failed") {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        });
        res.write(`data: ${JSON.stringify(analysisWithStatus)}

`);
        res.end();
        return;
      }
      sseManager.subscribe(id, res);
      sseManager.sendUpdate(id, analysisWithStatus);
    } catch (error) {
      console.error("SSE stream error:", error);
      res.writeHead(500, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      });
      res.write(`event: error
data: ${JSON.stringify({ message: "Failed to create event stream" })}

`);
      res.end();
    }
  });
  app2.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const originalFile = req.file;
      const originalFormat = getImageFormat(originalFile.originalname);
      const useR2 = isR2Configured();
      console.log(`\u{1F4E6} Storage mode: ${useR2 ? "Cloudflare R2" : "Local filesystem"}`);
      let imageUrl;
      let processedPath;
      let imageProcessingResult;
      if (useR2) {
        const tempPath = originalFile.path;
        const originalMetadata = await sharp2(tempPath).metadata();
        const originalStats = fs4.statSync(tempPath);
        const processedBuffer = await sharp2(tempPath).resize(1200, 1200, {
          fit: "inside",
          withoutEnlargement: true
        }).jpeg({ quality: 85 }).toBuffer();
        const processedMetadata = await sharp2(processedBuffer).metadata();
        const uploadResult = await uploadToR2(
          processedBuffer,
          originalFile.originalname,
          getMimeType(originalFile.originalname)
        );
        imageUrl = uploadResult.url;
        processedPath = tempPath;
        imageProcessingResult = {
          processedPath: tempPath,
          originalSize: originalStats.size,
          processedSize: uploadResult.size,
          originalDimensions: `${originalMetadata.width}x${originalMetadata.height}`,
          processedDimensions: `${processedMetadata.width}x${processedMetadata.height}`,
          wasResized: originalStats.size > uploadResult.size
        };
        console.log(`\u2705 Uploaded to R2: ${uploadResult.url} (${(uploadResult.size / 1024).toFixed(2)} KB)`);
      } else {
        const processedFilename = `processed_${Date.now()}.${originalFormat}`;
        processedPath = path4.join("uploads", processedFilename);
        imageUrl = `/uploads/${processedFilename}`;
        imageProcessingResult = await processImage(
          originalFile.path,
          processedPath,
          {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 85,
            format: originalFormat,
            maxFileSize: 2 * 1024 * 1024
            // 2MB
          }
        );
      }
      console.log("Image processing result:", {
        storageMode: useR2 ? "R2" : "Local",
        originalSize: formatFileSize(imageProcessingResult.originalSize),
        processedSize: formatFileSize(imageProcessingResult.processedSize),
        originalDimensions: imageProcessingResult.originalDimensions,
        processedDimensions: imageProcessingResult.processedDimensions,
        wasResized: imageProcessingResult.wasResized
      });
      const userId = req.isAuthenticated?.() ? req.user?.claims?.sub : null;
      const analysis = await storage.createAnalysis({
        userId,
        imageUrl,
        fileName: originalFile.originalname,
        fileSize: imageProcessingResult.originalSize,
        processedSize: imageProcessingResult.processedSize,
        originalDimensions: imageProcessingResult.originalDimensions,
        processedDimensions: imageProcessingResult.processedDimensions,
        overallScore: 0,
        // Will be updated after analysis
        skinHealth: 0,
        eyeHealth: 0,
        circulation: 0,
        symmetry: 0,
        analysisData: {
          imageProcessing: {
            wasResized: imageProcessingResult.wasResized,
            originalSize: formatFileSize(imageProcessingResult.originalSize),
            processedSize: formatFileSize(imageProcessingResult.processedSize),
            compressionRatio: imageProcessingResult.originalSize > 0 ? (imageProcessingResult.processedSize / imageProcessingResult.originalSize * 100).toFixed(1) + "%" : "100%"
          }
        },
        recommendations: {}
      });
      if (fs4.existsSync(originalFile.path) && originalFile.path !== processedPath) {
        fs4.unlinkSync(originalFile.path);
      }
      res.json({
        id: analysis.id,
        imageUrl,
        status: "uploaded"
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
  app2.post("/api/analysis/:id/start-streaming", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      await storage.updateAnalysis(analysisId, {
        status: "processing"
      });
      let imagePath;
      if (analysis.imageUrl.startsWith("http")) {
        console.log(`\u{1F4E5} Downloading image from R2: ${analysis.imageUrl}`);
        const response = await fetch(analysis.imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to download image from R2: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const tempDir = process.env.VERCEL ? "/tmp" : uploadDir;
        imagePath = path4.join(tempDir, `temp_${analysisId}.jpg`);
        fs4.writeFileSync(imagePath, Buffer.from(buffer));
        console.log(`\u2705 Downloaded to: ${imagePath}`);
      } else {
        imagePath = path4.join(process.cwd(), analysis.imageUrl);
        console.log(`\u{1F4C2} Using local file: ${imagePath}`);
      }
      await performStreamingAnalysis(imagePath, res, async (analysisResults) => {
        await storage.updateAnalysis(analysisId, {
          status: "completed",
          overallScore: analysisResults.overallScore,
          skinHealth: analysisResults.skinHealth,
          eyeHealth: analysisResults.eyeHealth,
          circulation: analysisResults.circulation,
          symmetry: analysisResults.symmetry,
          analysisData: {
            ...analysisResults.analysisData,
            conversationalAnalysis: analysisResults.conversationalAnalysis,
            estimatedAge: analysisResults.estimatedAge,
            ageRange: analysisResults.ageRange,
            rawAnalysis: analysisResults.rawAnalysis,
            imageProcessing: analysis.analysisData?.imageProcessing || {}
          },
          recommendations: analysisResults.recommendations
        });
        console.log(`\u2705 Streaming analysis completed for ID: ${analysisId}`);
        try {
          if (imagePath.includes("temp_") && fs4.existsSync(imagePath)) {
            fs4.unlinkSync(imagePath);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up files:", cleanupError);
        }
      });
    } catch (error) {
      console.error("Start streaming analysis error:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to start streaming analysis" });
      }
    }
  });
  app2.post("/api/analysis/:id/start", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      await storage.updateAnalysis(analysisId, {
        status: "processing"
      });
      res.json({ id: analysisId, status: "processing" });
      const processingWithStatus = {
        ...analysis,
        status: "processing"
      };
      sseManager.sendUpdate(analysisId, processingWithStatus);
      let imagePath;
      if (analysis.imageUrl.startsWith("http")) {
        console.log(`\u{1F4E5} Downloading image from R2: ${analysis.imageUrl}`);
        const response = await fetch(analysis.imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to download image from R2: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const tempDir = process.env.VERCEL ? "/tmp" : uploadDir;
        imagePath = path4.join(tempDir, `temp_${analysisId}.jpg`);
        fs4.writeFileSync(imagePath, Buffer.from(buffer));
        console.log(`\u2705 Downloaded to: ${imagePath}`);
      } else {
        imagePath = path4.join(process.cwd(), analysis.imageUrl);
        console.log(`\u{1F4C2} Using local file: ${imagePath}`);
      }
      performFacialAnalysis(imagePath).then(async (analysisResults) => {
        const updatedAnalysis = await storage.updateAnalysis(analysisId, {
          status: "completed",
          // ✅ Set status in database for polling
          overallScore: analysisResults.overallScore,
          skinHealth: analysisResults.skinHealth,
          eyeHealth: analysisResults.eyeHealth,
          circulation: analysisResults.circulation,
          symmetry: analysisResults.symmetry,
          analysisData: {
            ...analysisResults.analysisData,
            conversationalAnalysis: analysisResults.conversationalAnalysis,
            estimatedAge: analysisResults.estimatedAge,
            ageRange: analysisResults.ageRange,
            rawAnalysis: analysisResults.rawAnalysis,
            imageProcessing: analysis.analysisData?.imageProcessing || {}
          },
          recommendations: analysisResults.recommendations
        });
        console.log(`\u2705 Analysis completed for ID: ${analysisId}`);
        const analysisWithStatus = {
          ...updatedAnalysis,
          status: "completed"
        };
        sseManager.sendUpdate(analysisId, analysisWithStatus);
        if (imagePath.includes("temp_") && fs4.existsSync(imagePath)) {
          fs4.unlinkSync(imagePath);
        }
      }).catch(async (error) => {
        console.error(`\u274C Analysis failed for ID: ${analysisId}`, error);
        const failedAnalysis = await storage.updateAnalysis(analysisId, {
          status: "failed",
          analysisData: {
            errorMessage: error.message || "Unknown error during analysis"
          }
        });
        const failedWithStatus = {
          ...failedAnalysis,
          status: "failed",
          errorMessage: error.message || "Unknown error during analysis"
        };
        sseManager.sendUpdate(analysisId, failedWithStatus);
        try {
          if (imagePath.includes("temp_") && fs4.existsSync(imagePath)) {
            fs4.unlinkSync(imagePath);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up files:", cleanupError);
        }
      });
    } catch (error) {
      console.error("Start analysis error:", error);
      res.status(500).json({ message: "Failed to start analysis" });
    }
  });
  app2.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getAnalysis(id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({ message: "Failed to retrieve analysis" });
    }
  });
  app2.get("/api/history", isAuthenticated3, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const analyses2 = await storage.getUserAnalyses(userId);
      res.json(analyses2);
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ message: "Failed to retrieve analysis history" });
    }
  });
  app2.delete("/api/analysis/:id", isAuthenticated3, async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      if (analysis.userId !== userId && analysis.userId !== null) {
        return res.status(403).json({ message: "Not authorized to delete this analysis" });
      }
      await storage.deleteAnalysis(analysisId);
      console.log(`\u2705 Deleted analysis #${analysisId} by user ${userId}`);
      res.json({ message: "Analysis deleted successfully" });
    } catch (error) {
      console.error("Delete analysis error:", error);
      res.status(500).json({ message: "Failed to delete analysis" });
    }
  });
  app2.get("/api/all-analyses", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const analyses2 = await storage.getRecentAnalyses(limit);
      res.json(analyses2);
    } catch (error) {
      console.error("Get all analyses error:", error);
      res.status(500).json({ message: "Failed to retrieve all analyses" });
    }
  });
  app2.get("/api/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const analyses2 = await storage.getRecentAnalyses(limit);
      res.json(analyses2);
    } catch (error) {
      console.error("Get recent analyses error:", error);
      res.status(500).json({ message: "Failed to retrieve recent analyses" });
    }
  });
  app2.post("/api/analysis/:id/chat", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const { message, context } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ message: "Message is required" });
      }
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      const chatContext = `
You are an expert AI health assistant analyzing a facial health assessment. Here is the complete analysis data:

ANALYSIS RESULTS:
- Overall Score: ${analysis.overallScore}%
- Skin Health: ${analysis.skinHealth}%
- Eye Health: ${analysis.eyeHealth}%
- Circulation: ${analysis.circulation}%
- Symmetry: ${analysis.symmetry}%

DETAILED ANALYSIS DATA:
${JSON.stringify(analysis.analysisData, null, 2)}

RECOMMENDATIONS:
${JSON.stringify(analysis.recommendations, null, 2)}

PREVIOUS CONVERSATION:
${context.previousMessages?.map((msg) => `${msg.role}: ${msg.content}`).join("\n") || "No previous messages"}

Please provide helpful, accurate, and personalized responses about this specific analysis. Be supportive and educational while staying within your expertise as an AI health assistant.
      `;
      const response = await openai2.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: chatContext
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1e3
      });
      const aiResponse = response.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error("No response from AI");
      }
      res.json({
        response: aiResponse,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });
  app2.use("/uploads", (req, res, next) => {
    const filePath = path4.join(process.cwd(), "uploads", req.params[0] || req.url);
    if (!fs4.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    res.sendFile(filePath);
  });
  app2.get("/api/config/prompt", async (req, res) => {
    try {
      const config2 = configManager.getActivePrompt();
      res.json(config2);
    } catch (error) {
      console.error("Error retrieving prompt config:", error);
      res.status(500).json({ error: "Failed to retrieve prompt configuration" });
    }
  });
  app2.post("/api/config/prompt", async (req, res) => {
    try {
      const { systemPrompt, analysisPrompt, temperature, maxTokens } = req.body;
      if (!systemPrompt || !analysisPrompt || typeof temperature !== "number") {
        return res.status(400).json({ error: "Invalid prompt configuration" });
      }
      const config2 = { systemPrompt, analysisPrompt, temperature, maxTokens };
      configManager.updatePrompt(config2);
      res.json({ message: "Prompt configuration updated successfully", config: config2 });
    } catch (error) {
      console.error("Error updating prompt config:", error);
      res.status(500).json({ error: "Failed to update prompt configuration" });
    }
  });
  app2.post("/api/config/prompt/type", async (req, res) => {
    try {
      const { type } = req.body;
      if (!["DETAILED", "SIMPLE", "MEDICAL"].includes(type)) {
        return res.status(400).json({ error: "Invalid prompt type" });
      }
      configManager.setPromptType(type);
      const config2 = configManager.getActivePrompt();
      res.json({ message: `Prompt type set to ${type}`, config: config2 });
    } catch (error) {
      console.error("Error setting prompt type:", error);
      res.status(500).json({ error: "Failed to set prompt type" });
    }
  });
  app2.get("/api/config/prompt/types", async (req, res) => {
    try {
      const availablePrompts = configManager.getAvailablePrompts();
      res.json(availablePrompts);
    } catch (error) {
      console.error("Error retrieving available prompts:", error);
      res.status(500).json({ error: "Failed to retrieve available prompts" });
    }
  });
  app2.get("/api/config/prompt/export", async (req, res) => {
    try {
      const configJson = configManager.exportConfig();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", 'attachment; filename="prompt-config.json"');
      res.send(configJson);
    } catch (error) {
      console.error("Error exporting prompt config:", error);
      res.status(500).json({ error: "Failed to export prompt configuration" });
    }
  });
  app2.post("/api/config/prompt/import", async (req, res) => {
    try {
      const { configJson } = req.body;
      if (!configJson) {
        return res.status(400).json({ error: "No configuration provided" });
      }
      const success = configManager.importConfig(configJson);
      if (success) {
        const config2 = configManager.getActivePrompt();
        res.json({ message: "Prompt configuration imported successfully", config: config2 });
      } else {
        res.status(400).json({ error: "Invalid configuration format" });
      }
    } catch (error) {
      console.error("Error importing prompt config:", error);
      res.status(500).json({ error: "Failed to import prompt configuration" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vercel-handler.ts
var app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
var initialized = false;
var initPromise = null;
async function initializeApp() {
  if (!initialized && !initPromise) {
    initPromise = (async () => {
      try {
        console.log("Initializing app...");
        await registerRoutes(app);
        app.use((err, _req, res, _next) => {
          console.error("Express error handler:", err);
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";
          res.status(status).json({ message });
        });
        initialized = true;
        console.log("App initialized successfully");
      } catch (error) {
        console.error("Failed to initialize app:", error);
        throw error;
      }
    })();
  }
  if (initPromise) {
    await initPromise;
  }
  return app;
}
async function handler(req, res) {
  try {
    console.log(`[HANDLER] ${req.method} ${req.url}`);
    console.log("[HANDLER] Environment check:", {
      hasDatabase: !!process.env.DATABASE_URL,
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasR2Account: !!process.env.R2_ACCOUNT_ID,
      nodeEnv: process.env.NODE_ENV
    });
    const expressApp = await initializeApp();
    console.log("[HANDLER] App initialized, processing request...");
    return expressApp(req, res);
  } catch (error) {
    console.error("[HANDLER ERROR]", error);
    console.error("[HANDLER ERROR STACK]", error.stack);
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : void 0
      });
    }
  }
}
export {
  handler as default
};
