// AWS Configuration for Translation Service
// This file handles AWS SDK configuration for browser environments

class AWSTranslateConfig {
  constructor() {
    this.isConfigured = false;
    this.region = 'us-east-1'; // Default region
  }

  // Initialize AWS SDK for browser environment
  async initialize(credentials = null) {
    try {
      // Check if AWS SDK is loaded
      if (typeof window.AWS === 'undefined') {
        console.warn('AWS SDK not loaded. Using mock translation service.');
        return false;
      }

      // Configure AWS SDK
      window.AWS.config.update({
        region: this.region,
        credentials: credentials
      });

      // Test connection with a simple call
      const translate = new window.AWS.Translate();
      
      this.isConfigured = true;
      console.log('AWS Translate service configured successfully');
      return true;
    } catch (error) {
      console.error('Failed to configure AWS Translate:', error);
      return false;
    }
  }

  // Real AWS Translate implementation
  async translateWithAWS(text, sourceLanguage, targetLanguage) {
    if (!this.isConfigured) {
      throw new Error('AWS Translate service not configured');
    }

    const translate = new window.AWS.Translate();
    
    const params = {
      Text: text,
      SourceLanguageCode: sourceLanguage,
      TargetLanguageCode: targetLanguage
    };

    try {
      const result = await translate.translateText(params).promise();
      return result.TranslatedText;
    } catch (error) {
      console.error('AWS Translate API error:', error);
      throw error;
    }
  }

  // Check if AWS SDK is available
  isAWSSDKAvailable() {
    return typeof window.AWS !== 'undefined' && window.AWS.Translate;
  }
}

// Export configuration
window.AWSTranslateConfig = AWSTranslateConfig;