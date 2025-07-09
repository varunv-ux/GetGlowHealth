export interface PromptConfig {
  systemPrompt: string;
  analysisPrompt: string;
  temperature: number;
  maxTokens?: number;
}

export const FACIAL_ANALYSIS_PROMPTS: PromptConfig = {
  systemPrompt: `You are a facial health analysis expert specializing in dermatology, wellness, and health optimization. Provide concise, actionable insights based on facial features and visual health indicators. Focus on practical recommendations that users can implement immediately.`,

  analysisPrompt: `Analyze this face for health indicators. Provide a concise assessment covering:

1. **Skin Health**: Analyze skin tone, texture, hydration, and any visible concerns
2. **Facial Symmetry**: Assess overall facial balance and structure
3. **Age Estimation**: Estimate apparent age based on visual cues
4. **Health Indicators**: Identify potential wellness areas (nutrition, sleep, stress)
5. **Actionable Recommendations**: Provide 3-5 specific, practical suggestions

Respond in JSON format:

{
  "overallScore": number (1-100),
  "skinHealth": number (1-100),
  "eyeHealth": number (1-100),
  "circulation": number (1-100),
  "symmetry": number (1-100),
  "estimatedAge": number,
  "conversationalAnalysis": {
    "facialFeatureBreakdown": "Brief analysis of key facial features and their health implications",
    "visualAgeEstimator": "Age assessment with key aging factors observed",
    "deficiencyDetector": "Potential vitamin/mineral deficiencies based on visual cues",
    "foodIntoleranceIdentifier": "Signs of inflammation or food sensitivities",
    "healthRiskReader": "General health indicators and wellness areas",
    "emotionalStateScanner": "Stress patterns and emotional indicators",
    "selfHealingStrategist": "Top 3 actionable health recommendations"
  },
  "analysisData": {
    "skinAnalysis": {
      "hydration": "excellent|good|fair|poor",
      "pigmentation": "even|minor_spots|uneven|concerning",
      "texture": "smooth|rough|mixed",
      "elasticity": "firm|moderate|loose"
    },
    "eyeAnalysis": {
      "underEyeCircles": "minimal|moderate|pronounced",
      "puffiness": "none|slight|moderate|significant",
      "brightness": "bright|normal|dull",
      "symmetry": "symmetric|slightly_asymmetric|asymmetric"
    }
  },
  "recommendations": {
    "immediate": [{"title": "string", "description": "string"}],
    "nutritional": [{"title": "string", "description": "string"}],
    "lifestyle": [{"title": "string", "description": "string"}]
  }
}`,

  temperature: 0.3,
  maxTokens: 1500
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