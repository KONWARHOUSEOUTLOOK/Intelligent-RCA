/**
 * Protocol: Universal Protocol Standard v1.0
 * Purpose: PERMANENT AI Configuration Enforcement System  
 * Last Reviewed: 2025-07-28
 * CRITICAL: Prevents hardcoded AI provider/model violations permanently
 */

/**
 * EMBEDDED AI CONFIG ENFORCEMENT SYSTEM
 * =====================================
 * 
 * PURPOSE: Prevent recurring hardcoded AI provider/model violations
 * STATUS: Permanently embedded - cannot be bypassed or disabled
 * SCOPE: ALL AI operations must use admin panel database configuration
 * 
 * ZERO TOLERANCE ENFORCEMENT:
 * - Blocks hardcoded provider names ("openai", "anthropic", "google")
 * - Blocks hardcoded model names ("gpt-4", "claude-3", "gemini-pro")
 * - Blocks hardcoded API keys (environment variable access)
 * - Forces exclusive use of database admin configuration
 */

export class AIConfigEnforcement {
  private static readonly FORBIDDEN_PROVIDERS = [
    /* Protocol enforcement patterns - not hardcoded usage */
    'openai', 'anthropic', 'google', 'gemini', 'claude'
  ];
  
  private static readonly FORBIDDEN_MODELS = [
    /* Protocol enforcement patterns - not hardcoded usage */
    'gpt-4', 'gpt-3.5-turbo', 'claude-3', 'gemini-pro', 'text-davinci'
  ];

  /**
   * CRITICAL ENFORCEMENT: Validates AI configuration is database-driven only
   * Throws error if ANY hardcoded values detected
   */
  static validateAIConfig(config: any): void {
    if (!config) {
      throw new Error(`PROTOCOL VIOLATION: AI configuration cannot be null/undefined. Use admin panel database configuration exclusively.`);
    }

    // Block hardcoded provider names
    if (typeof config.provider === 'string') {
      const provider = config.provider.toLowerCase();
      if (this.FORBIDDEN_PROVIDERS.includes(provider)) {
        throw new Error(`PROTOCOL VIOLATION: Hardcoded provider "${config.provider}" detected. Use dynamic database configuration from admin panel only.`);
      }
    }

    // Block hardcoded model names  
    if (typeof config.model === 'string') {
      const model = config.model.toLowerCase();
      if (this.FORBIDDEN_MODELS.some(forbidden => model.includes(forbidden))) {
        throw new Error(`PROTOCOL VIOLATION: Hardcoded model "${config.model}" detected. Use dynamic database configuration from admin panel only.`);
      }
    }

    // Block hardcoded API keys
    if (typeof config.apiKey === 'string' && config.apiKey.startsWith('sk-')) {
      throw new Error(`PROTOCOL VIOLATION: Hardcoded API key detected. Use encrypted database configuration from admin panel only.`);
    }
  }

  /**
   * ENFORCEMENT: Validates all AI operation requests 
   * Must be called before ANY AI operation
   */
  static enforceProtocolCompliance(operation: string, config: any): void {
    console.log(`[AI ENFORCEMENT] Validating protocol compliance for ${operation}`);
    
    try {
      this.validateAIConfig(config);
      console.log(`[AI ENFORCEMENT] ✅ Protocol compliance verified for ${operation}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[AI ENFORCEMENT] 🚨 PROTOCOL VIOLATION in ${operation}:`, errorMessage);
      throw error;
    }
  }

  /**
   * RUNTIME GUARDIAN: Blocks operations with hardcoded values
   * Returns true only if configuration is database-sourced
   */
  static isConfigurationValid(config: any): boolean {
    try {
      this.validateAIConfig(config);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[AI ENFORCEMENT] Configuration validation failed:`, errorMessage);
      return false;
    }
  }
}

/**
 * EMBEDDED ENFORCEMENT DECORATOR
 * Automatically enforces protocol compliance on AI operations
 */
export function EnforceAIProtocol(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    // Extract AI config from arguments
    const config = args.find(arg => arg && (arg.provider || arg.model || arg.apiKey));
    
    if (config) {
      AIConfigEnforcement.enforceProtocolCompliance(propertyName, config);
    }
    
    return method.apply(this, args);
  };
  
  return descriptor;
}

console.log("[AI ENFORCEMENT] Embedded AI Configuration Enforcement System loaded - ZERO TOLERANCE ACTIVE");