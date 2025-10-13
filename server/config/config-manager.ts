import fs from 'fs';
import path from 'path';
import { FACIAL_ANALYSIS_PROMPTS, ALTERNATIVE_PROMPTS, PromptConfig } from './prompts';

export class ConfigManager {
  private static instance: ConfigManager;
  private configPath: string;
  private currentConfig: PromptConfig;

  private constructor() {
    // Use /tmp for serverless environments (Vercel), otherwise use local path
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    this.configPath = isServerless 
      ? path.join('/tmp', 'active-prompt.json')
      : path.join(process.cwd(), 'server', 'config', 'active-prompt.json');
    this.currentConfig = this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): PromptConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(configData);
      }
    } catch (error) {
      console.warn('Failed to load config, using default:', error);
    }
    
    // Default to the detailed analysis prompt
    return FACIAL_ANALYSIS_PROMPTS;
  }

  public getActivePrompt(): PromptConfig {
    return this.currentConfig;
  }

  public updatePrompt(config: PromptConfig): void {
    this.currentConfig = config;
    this.saveConfig();
  }

  public setPromptType(type: 'DETAILED' | 'SIMPLE' | 'MEDICAL'): void {
    let newConfig: PromptConfig;
    
    switch (type) {
      case 'DETAILED':
        newConfig = FACIAL_ANALYSIS_PROMPTS;
        break;
      case 'SIMPLE':
        newConfig = ALTERNATIVE_PROMPTS.SIMPLE_ANALYSIS;
        break;
      case 'MEDICAL':
        newConfig = ALTERNATIVE_PROMPTS.MEDICAL_FOCUS;
        break;
      default:
        newConfig = FACIAL_ANALYSIS_PROMPTS;
    }
    
    this.updatePrompt(newConfig);
  }

  private saveConfig(): void {
    try {
      const configDir = path.dirname(this.configPath);
      
      // Only create directory if it doesn't exist and it's not /tmp (which always exists)
      if (configDir !== '/tmp' && !fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      fs.writeFileSync(this.configPath, JSON.stringify(this.currentConfig, null, 2));
      console.log('Prompt configuration saved successfully to:', this.configPath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn('Failed to save config (this is normal in serverless environments):', errorMessage);
      // Don't throw - just log the warning and continue
    }
  }

  public exportConfig(): string {
    return JSON.stringify(this.currentConfig, null, 2);
  }

  public importConfig(configJson: string): boolean {
    try {
      const config = JSON.parse(configJson);
      
      // Validate required fields
      if (!config.systemPrompt || !config.analysisPrompt || typeof config.temperature !== 'number') {
        throw new Error('Invalid configuration format');
      }
      
      this.updatePrompt(config);
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  }

  public getAvailablePrompts(): Record<string, PromptConfig> {
    return {
      DETAILED: FACIAL_ANALYSIS_PROMPTS,
      SIMPLE: ALTERNATIVE_PROMPTS.SIMPLE_ANALYSIS,
      MEDICAL: ALTERNATIVE_PROMPTS.MEDICAL_FOCUS
    };
  }

  public resetToDefault(): void {
    this.updatePrompt(FACIAL_ANALYSIS_PROMPTS);
  }
}

export const configManager = ConfigManager.getInstance();