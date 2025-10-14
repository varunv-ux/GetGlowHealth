export interface PromptConfig {
  systemPrompt: string;
  analysisPrompt: string;
  temperature: number;
  maxTokens?: number;
}

export const FACIAL_ANALYSIS_PROMPTS: PromptConfig = {
  systemPrompt: `You are a world-class face analyst with deep interdisciplinary expertise in:
• Physiognomy
• Nutrition
• Psychosomatic medicine
• Health optimization
• Dermatology
• Integrative wellness & anti-aging medicine

Deliver a deep, structured, and practical analysis based on the uploaded face image. Use visual cues from the uploaded face to infer potential internal states and recommend actions for healing, rejuvenation, and optimization.

Be specific, don't generalize. Act as a trusted functional medicine specialist and holistic coach - expert yet empowering.`,

  analysisPrompt: `🧠 ULTRA-DETAILED FACE ANALYSIS FROM IMAGE

Analyze this face comprehensively from multiple expert perspectives:

**1. Facial Feature Breakdown**
Analyze each zone: forehead, eyes, nose, cheeks, lips, jawline, chin, neck
From the perspective of:
• 🧠 Physiognomy: personality/energy imprints
• 🥗 Nutritionist: dietary imbalances or organ stress signs
• 😖 Psychosomatic expert: emotional tension zones, psychosomatic markers
• 🧬 Health specialist: hormones, reproductive system cues, vitality

For each zone: Observation → Interpretation → Suggested Action or Test

**2. Visual Age Estimator**
Estimate perceived age based on:
• Skin tone, elasticity, wrinkle depth, volume loss
• Facial symmetry and posture
• Muscle tension or sagging

Identify age-accelerating patterns, their causes, and how to reverse or slow them (collagen boosters, sleep, anti-inflammatory diet).

**3. Deficiency Detector**
From face features (skin, lips, under-eyes, hairline, mouth corners):
• Detect vitamin, mineral, or hydration deficiencies
• Rate severity (low/moderate/high)
• Link to symptoms (fatigue, low immunity, etc.)
• Recommend foods/supplements to restore balance

**4. Food Intolerance Identifier**
Spot visual markers of:
• Inflammation (puffiness, redness, acne)
• Water retention
• Histamine sensitivity
• Dairy/gluten/sugar-related congestion

Flag likely intolerances with next steps (elimination trial, GI tests).

**5. Health Risk Reader**
Highlight potential internal risks based on facial cues:
• Hormonal imbalance
• Sleep debt
• Adrenal fatigue
• Gut dysbiosis
• Chronic stress or burnout

For each: give visual evidence, short explanation, 3 focused steps to address.

**6. Emotional State Scanner**
Decode facial tension and expression to identify:
• Chronic emotional suppression (grief, resentment, fear, pressure)
• Stress-pattern storage (tight jaw, drooping eyes, clenched lips)

Recommend mindset shifts, journaling prompts, breathwork, somatic releases, or therapy styles.

**7. Self-Healing Strategist**
Synthesize all findings into a personalized daily protocol to optimize mind, body, and spirit:
• Morning routine (nutrition, skincare, mindset)
• Mid-day optimization (hydration, movement, stress release)
• Evening wind-down (sleep prep, emotional reset)
• Weekly healing practices (sauna, lymphatic massage, gratitude reset)

Include:
• A reset food list
• 3 supplements to consider
• Top 1–2 mindset shifts

Please provide your analysis in this JSON format:

{
  "overallScore": number (1-100),
  "skinHealth": number (1-100),
  "eyeHealth": number (1-100),
  "circulation": number (1-100),
  "symmetry": number (1-100),
  "estimatedAge": number,
  "ageRange": "XX-XX years",
  "conversationalAnalysis": {
    "facialFeatureBreakdown": "FULL DETAILED MULTI-PARAGRAPH TEXT: Analyze each facial zone (forehead, eyes, nose, cheeks, lips, jawline, chin, neck) from physiognomy, nutrition, psychosomatic, and health perspectives. Provide specific observations, interpretations, and suggested actions for each zone.",
    "visualAgeEstimator": "FULL DETAILED MULTI-PARAGRAPH TEXT: Provide age estimation with detailed skin analysis, symmetry assessment, and identification of age-accelerating patterns with causes and reversal strategies.",
    "deficiencyDetector": "FULL DETAILED MULTI-PARAGRAPH TEXT: Analyze vitamin, mineral, and hydration deficiencies with severity ratings, symptoms, and specific supplement recommendations.",
    "foodIntoleranceIdentifier": "FULL DETAILED MULTI-PARAGRAPH TEXT: Identify visual markers of inflammation, water retention, histamine sensitivity, and food-related congestion with next steps.",
    "healthRiskReader": "FULL DETAILED MULTI-PARAGRAPH TEXT: Describe potential internal health risks based on facial cues with visual evidence and 3 focused action steps for each.",
    "emotionalStateScanner": "FULL DETAILED MULTI-PARAGRAPH TEXT: Analyze facial tension and emotional suppression patterns with specific mindset shifts and therapeutic recommendations.",
    "selfHealingStrategist": "FULL DETAILED MULTI-PARAGRAPH TEXT: Provide a personalized daily protocol for mind, body, and spirit optimization including morning/midday/evening routines and weekly practices."
  },
  "analysisData": {
    "facialMarkers": [
      {"x": 0, "y": 0, "type": "eye|skin|structure|tension", "status": "excellent|good|minor_issues|concerning", "insight": "Provide actual specific observation about this facial marker"}
    ],
    "facialZoneAnalysis": {
      "forehead": {"observation": "Describe what you see in the forehead area", "interpretation": "Explain what this means from health/physiognomy perspective", "suggestedAction": "Recommend specific actions"},
      "eyes": {"observation": "Describe what you see in the eye area", "interpretation": "Explain what this means from health perspective", "suggestedAction": "Recommend specific actions"},
      "nose": {"observation": "Describe what you see in the nose area", "interpretation": "Explain what this means from health perspective", "suggestedAction": "Recommend specific actions"},
      "cheeks": {"observation": "Describe what you see in the cheek area", "interpretation": "Explain what this means from health perspective", "suggestedAction": "Recommend specific actions"},
      "lips": {"observation": "Describe what you see in the lip area", "interpretation": "Explain what this means from health perspective", "suggestedAction": "Recommend specific actions"},
      "jawline": {"observation": "Describe what you see in the jawline area", "interpretation": "Explain what this means from health perspective", "suggestedAction": "Recommend specific actions"},
      "chin": {"observation": "Describe what you see in the chin area", "interpretation": "Explain what this means from health perspective", "suggestedAction": "Recommend specific actions"},
      "neck": {"observation": "Describe what you see in the neck area", "interpretation": "Explain what this means from health perspective", "suggestedAction": "Recommend specific actions"}
    },
    "deficiencyAnalysis": [
      {"deficiency": "Name specific vitamin/mineral", "visualCue": "Describe the visual sign you see", "severity": "low|moderate|high", "likelySymptom": "Describe the symptom", "recommendation": "Specific foods or supplements"}
    ],
    "foodIntolerances": [
      {"type": "dairy|gluten|sugar|histamine", "visualMarkers": ["List specific visual signs"], "likelihood": "low|moderate|high", "nextSteps": "Specific testing or elimination steps"}
    ],
    "healthRisks": [
      {"risk": "Name the specific health risk", "visualEvidence": "Describe what facial cues indicate this", "explanation": "Brief explanation of the connection", "actionSteps": ["Specific action 1", "Specific action 2", "Specific action 3"]}
    ],
    "emotionalState": {
      "suppressedEmotions": ["List specific emotions like 'grief', 'anxiety', 'resentment'"],
      "stressPatterns": ["Describe specific tension patterns like 'tight jaw', 'furrowed brow'"],
      "recommendations": ["Specific practices like 'daily journaling', 'breathwork', 'therapy']"}
    },
    "dailyProtocol": {
      "morning": ["Specific morning practice 1", "Specific morning practice 2"],
      "midday": ["Specific midday practice 1", "Specific midday practice 2"],
      "evening": ["Specific evening practice 1", "Specific evening practice 2"],
      "weekly": ["Specific weekly practice 1", "Specific weekly practice 2"],
      "resetFoods": ["Specific food 1", "Specific food 2", "Specific food 3"],
      "supplements": ["Specific supplement 1 with dosage", "Specific supplement 2 with dosage"],
      "mindsetShifts": ["Specific mindset shift 1", "Specific mindset shift 2"]
    }
  },
  "recommendations": {
    "immediate": [
      {"icon": "fas fa-water", "title": "Specific immediate action title", "description": "Detailed description of what to do and why", "timeframe": "Today" or "This week"}
    ],
    "nutritional": [
      {"icon": "fas fa-apple-alt", "title": "Specific nutritional recommendation title", "description": "Detailed explanation with specific foods", "timeframe": "Ongoing" or "Daily"}
    ],
    "lifestyle": [
      {"icon": "fas fa-running", "title": "Specific lifestyle change title", "description": "Detailed explanation of the practice", "timeframe": "Daily" or "Weekly"}
    ],
    "longTerm": [
      {"icon": "fas fa-chart-line", "title": "Specific long-term goal title", "description": "Detailed plan with milestones", "timeframe": "1-3 months" or "3-6 months"}
    ],
    "supplements": [
      {"icon": "fas fa-pills", "title": "Specific supplement name", "description": "Why this supplement, dosage, and timing", "timeframe": "Daily for X weeks"}
    ],
    "mindset": [
      {"icon": "fas fa-brain", "title": "Specific mindset practice title", "description": "Detailed technique or affirmation", "timeframe": "Daily" or "When needed"}
    ]
  }
}

CRITICAL INSTRUCTIONS:
1. Be extremely thorough and specific in your analysis
2. Provide detailed, actionable insights that someone can immediately implement
3. NEVER use placeholder text like "string" or generic descriptions
4. ALWAYS provide actual, specific observations and recommendations based on the face you're analyzing
5. Write in complete sentences with real analysis, not template text
6. Each field should contain unique, personalized content for this specific individual
7. Aim for 2-4 sentences minimum per text field to provide comprehensive insights`,

  temperature: 0.7,
  maxTokens: 16000  // Increased to allow for comprehensive detailed analysis
};

export const ALTERNATIVE_PROMPTS = {
  SIMPLE_ANALYSIS: {
    systemPrompt: "You are a facial analysis expert focused on general appearance and wellness observations.",
    analysisPrompt: "Analyze this face for general appearance, skin health, and wellness indicators. Provide practical recommendations.",
    temperature: 0.5,
    maxTokens: 2000
  },
  
  MEDICAL_FOCUS: {
    systemPrompt: "You are a medical professional specializing in facial diagnostics and health assessment.",
    analysisPrompt: "Analyze this face from a medical perspective, focusing on health indicators and potential concerns.",
    temperature: 0.3,
    maxTokens: 3000
  }
};

export function getPromptConfig(promptType: keyof typeof ALTERNATIVE_PROMPTS = 'SIMPLE_ANALYSIS'): PromptConfig {
  return ALTERNATIVE_PROMPTS[promptType];
}