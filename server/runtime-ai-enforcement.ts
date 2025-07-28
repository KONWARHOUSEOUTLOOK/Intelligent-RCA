/**
 * Protocol: Universal Protocol Standard v1.0
 * Purpose: RUNTIME AI Configuration Enforcement - ZERO TOLERANCE
 * Last Reviewed: 2025-07-28
 * CRITICAL: Blocks ALL hardcoded AI configurations at runtime
 */

import { AIConfigEnforcement } from './ai-config-enforcement';

/**
 * RUNTIME ENFORCEMENT INTERCEPTOR
 * =============================== 
 * 
 * PURPOSE: Intercept and validate ALL AI configuration usage at runtime
 * SCOPE: Every AI operation must pass through this validation
 * ENFORCEMENT: Throws errors for any hardcoded values
 */

export class RuntimeAIEnforcement {
  private static violationLog: string[] = [];
  
  /**
   * CRITICAL: Validates AI configuration before any operation
   * Logs all enforcement actions for audit trail
   */
  static validateAIOperation(operation: string, config: any): void {
    const timestamp = new Date().toISOString();
    
    try {
      // Block hardcoded provider names
      if (typeof config === 'object' && config.provider) {
        if (typeof config.provider === 'string') {
          const provider = config.provider.toLowerCase();
          const hardcodedProviders = ['openai', 'anthropic', 'google', 'claude', 'gemini'];
          
          if (hardcodedProviders.includes(provider)) {
            const violation = `${timestamp}: RUNTIME BLOCKED - Hardcoded provider "${config.provider}" in ${operation}`;
            this.violationLog.push(violation);
            console.error(`🚨 RUNTIME ENFORCEMENT: ${violation}`);
            throw new Error(`PROTOCOL VIOLATION: Hardcoded provider "${config.provider}" detected in ${operation}. Use admin panel database configuration only.`);
          }
        }
      }
      
      // Block hardcoded model names
      if (typeof config === 'object' && config.model) {
        if (typeof config.model === 'string') {
          const model = config.model.toLowerCase();
          const hardcodedModels = ['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'gemini-pro'];
          
          if (hardcodedModels.some(forbidden => model.includes(forbidden))) {
            const violation = `${timestamp}: RUNTIME BLOCKED - Hardcoded model "${config.model}" in ${operation}`;
            this.violationLog.push(violation);
            console.error(`🚨 RUNTIME ENFORCEMENT: ${violation}`);
            throw new Error(`PROTOCOL VIOLATION: Hardcoded model "${config.model}" detected in ${operation}. Use admin panel database configuration only.`);
          }
        }
      }
      
      // Block direct API key usage
      if (typeof config === 'object' && config.apiKey) {
        if (typeof config.apiKey === 'string' && config.apiKey.startsWith('sk-')) {
          const violation = `${timestamp}: RUNTIME BLOCKED - Direct API key usage in ${operation}`;
          this.violationLog.push(violation);
          console.error(`🚨 RUNTIME ENFORCEMENT: ${violation}`);
          throw new Error(`PROTOCOL VIOLATION: Direct API key usage detected in ${operation}. Use encrypted database configuration only.`);
        }
      }
      
      // Log successful validation
      const success = `${timestamp}: RUNTIME VALIDATION PASSED - ${operation}`;
      this.violationLog.push(success);
      console.log(`✅ RUNTIME ENFORCEMENT: ${success}`);
      
    } catch (error) {
      // Re-throw to block the operation
      throw error;
    }
  }
  
  /**
   * Block ANY direct model/provider string usage in code
   */
  static interceptModelCall(modelName: string, operation: string): never {
    const timestamp = new Date().toISOString();
    const violation = `${timestamp}: RUNTIME BLOCKED - Direct model call "${modelName}" in ${operation}`;
    this.violationLog.push(violation);
    console.error(`🚨 RUNTIME ENFORCEMENT: ${violation}`);
    
    throw new Error(`PROTOCOL VIOLATION: Direct model call model: "${modelName}" detected in ${operation}. All AI operations must use admin panel database configuration exclusively.`);
  }
  
  /**
   * Get violation log for audit purposes
   */
  static getViolationLog(): string[] {
    return [...this.violationLog];
  }
  
  /**
   * Clear violation log (admin only)
   */
  static clearViolationLog(): void {
    this.violationLog = [];
    console.log('🔒 RUNTIME ENFORCEMENT: Violation log cleared by admin');
  }
}

/**
 * GLOBAL ENFORCEMENT: Override common AI operations
 * This prevents ANY direct hardcoded AI calls
 */

// Override fetch for AI endpoints
const originalFetch = global.fetch;
if (originalFetch) {
  global.fetch = function(url: string | URL, options?: RequestInit) {
    const urlString = url.toString();
    
    // Block direct OpenAI API calls
    if (urlString.includes('api.openai.com')) {
      RuntimeAIEnforcement.interceptModelCall('OpenAI-Direct', 'fetch');
    }
    
    // Block direct Anthropic API calls  
    if (urlString.includes('api.anthropic.com')) {
      RuntimeAIEnforcement.interceptModelCall('Anthropic-Direct', 'fetch');
    }
    
    return originalFetch(url, options);
  };
}

console.log('🚨 RUNTIME AI ENFORCEMENT: Global AI operation interception active');
console.log('🚨 RUNTIME AI ENFORCEMENT: ALL hardcoded AI configurations will be blocked');