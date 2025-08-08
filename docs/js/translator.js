// Translation service using AWS Translate
class TranslationService {
  constructor() {
    this.cache = new Map();
    this.currentLanguage = 'en';
    this.targetLanguage = 'de';
    this.isTranslating = false;
    this.awsRegion = 'us-east-1';
    
    // Initialize AWS credentials from environment or IAM role
    this.initializeAWS();
  }

  async initializeAWS() {
    try {
      // Initialize AWS SDK with temporary credentials from IAM role
      if (typeof window !== 'undefined' && window.AWS) {
        // Configure AWS SDK with region
        window.AWS.config.update({ region: this.awsRegion });
        
        // Use temporary credentials from IAM role (EC2, Lambda, ECS, etc.)
        // or STS assume role for cross-account access
        const sts = new window.AWS.STS();
        
        // Example: Assume role for temporary credentials
        // This would typically be done server-side and passed to the client
        const assumeRoleParams = {
          RoleArn: process.env.AWS_TRANSLATE_ROLE_ARN || 'arn:aws:iam::ACCOUNT:role/TranslateServiceRole',
          RoleSessionName: 'workshop-translation-session',
          DurationSeconds: 3600 // 1 hour
        };
        
        // In production, get these credentials from your backend
        this.setupCredentialsProvider();
        
        console.log('AWS SDK initialized with temporary credentials');
        return true;
      }
    } catch (error) {
      console.warn('AWS SDK initialization failed, using mock translation:', error);
      return false;
    }
  }

  async setupCredentialsProvider() {
    try {
      // Get temporary credentials from backend service
      const credentials = await this.fetchTemporaryCredentials();
      
      if (credentials && window.AWS) {
        window.AWS.config.update({
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
          region: this.awsRegion
        });
        
        // Set up automatic refresh before expiration
        this.setupCredentialRefresh(credentials.expiration);
        console.log('Temporary credentials configured successfully');
      }
    } catch (error) {
      console.error('Failed to setup credentials provider:', error);
    }
  }

  async fetchTemporaryCredentials() {
    const backendUrl = process.env.CREDENTIALS_SERVICE_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${backendUrl}/api/credentials/translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies for authentication if needed
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.credentials;
      } else {
        throw new Error(data.error || 'Failed to get credentials');
      }
    } catch (error) {
      console.error('Error fetching temporary credentials:', error);
      throw error;
    }
  }

  setupCredentialRefresh(expiration) {
    // Refresh credentials 5 minutes before expiration
    const refreshTime = new Date(expiration).getTime() - Date.now() - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          await this.setupCredentialsProvider();
        } catch (error) {
          console.error('Failed to refresh credentials:', error);
        }
      }, refreshTime);
    }
  }

  async refreshCredentials() {
    // Refresh temporary credentials before they expire
    try {
      if (window.AWS && window.AWS.config.credentials) {
        await window.AWS.config.credentials.refreshPromise();
        console.log('Temporary credentials refreshed');
      }
    } catch (error) {
      console.error('Failed to refresh credentials:', error);
    }
  }

  // Mock translation function for development/testing
  async mockTranslate(text, sourceLanguage, targetLanguage) {
    // Simple mock translations for common phrases
    const mockTranslations = {
      'Welcome': 'Willkommen',
      'Overview': 'Überblick',
      'Prerequisites': 'Voraussetzungen',
      'Next': 'Weiter',
      'Previous': 'Zurück',
      'Home': 'Startseite',
      'Lab': 'Übung',
      'AWS': 'AWS',
      'Cloud': 'Cloud',
      'Setup': 'Einrichtung',
      'Resources': 'Ressourcen',
      'Introduction': 'Einführung'
    };

    // For longer text, return a placeholder translation
    if (text.length > 50) {
      return `[DE] ${text.substring(0, 100)}...`;
    }

    return mockTranslations[text] || `[DE] ${text}`;
  }

  async translateText(text, sourceLanguage = 'en', targetLanguage = 'de') {
    if (!text || text.trim() === '') return text;
    
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let translatedText;
      
      // Try using real AWS Translate if SDK is available and credentials are configured
      if (this.isAWSConfigured()) {
        try {
          translatedText = await this.translateWithAWS(text, sourceLanguage, targetLanguage);
          console.log('Used real AWS Translate');
        } catch (awsError) {
          console.warn('AWS Translate failed, falling back to mock:', awsError);
          translatedText = await this.mockTranslate(text, sourceLanguage, targetLanguage);
        }
      } else {
        // Use mock translation for development/demo
        translatedText = await this.mockTranslate(text, sourceLanguage, targetLanguage);
      }
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  isAWSConfigured() {
    return typeof window !== 'undefined' && 
           window.AWS && 
           window.AWS.config.credentials && 
           window.AWS.Translate;
  }

  async translateWithAWS(text, sourceLanguage, targetLanguage) {
    // Refresh credentials if they're about to expire
    if (window.AWS.config.credentials.needsRefresh()) {
      await this.refreshCredentials();
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
      // Handle specific AWS errors
      if (error.code === 'CredentialsError') {
        await this.refreshCredentials();
        // Retry once with refreshed credentials
        const result = await translate.translateText(params).promise();
        return result.TranslatedText;
      }
      throw error;
    }
  }

  async translateElement(element) {
    const originalText = element.dataset.originalText || element.textContent;
    
    // Store original text for reverting
    if (!element.dataset.originalText) {
      element.dataset.originalText = originalText;
    }

    if (this.currentLanguage === 'de') {
      const translatedText = await this.translateText(originalText);
      element.textContent = translatedText;
    } else {
      element.textContent = originalText;
    }
  }

  async translatePage() {
    if (this.isTranslating) return;
    
    this.isTranslating = true;
    
    try {
      const elementsToTranslate = document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, li, td, th, .sidebar-nav a, button, .pagination a'
      );

      // Process elements in batches to avoid overwhelming the API
      const batchSize = 10;
      for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
        const batch = Array.from(elementsToTranslate).slice(i, i + batchSize);
        await Promise.all(batch.map(element => this.translateElement(element)));
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error translating page:', error);
    } finally {
      this.isTranslating = false;
    }
  }

  async switchLanguage(language) {
    if (this.currentLanguage === language) return;
    
    this.currentLanguage = language;
    await this.translatePage();
    
    // Update toggle button state
    this.updateToggleButton();
  }

  updateToggleButton() {
    const toggleButton = document.getElementById('language-toggle');
    if (toggleButton) {
      toggleButton.classList.toggle('active', this.currentLanguage === 'de');
      toggleButton.innerHTML = this.currentLanguage === 'de' ? '🇩🇪 DE' : '🇺🇸 EN';
    }
  }
}

// Initialize translation service
const translationService = new TranslationService();

// Export for global access
window.translationService = translationService;