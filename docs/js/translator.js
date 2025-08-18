// Translation service using AWS Translate (safe mode for docsify)
class TranslationService {
  constructor() {
    this.cache = new Map()
    this.currentLanguage = 'en'
    this.targetLanguage = 'de'
    this.isTranslating = false
    this.aws = null
    this.originalTextByNode = new WeakMap()
    this.initialize()
  }

  async initialize() {
    try {
      console.log('Translation Service: Initializing...')

      // Wait for config to be available (max 5 seconds)
      let configAttempts = 0
      while (!window.WORKSHOP_CONFIG && configAttempts < 50) {
        await new Promise((r) => setTimeout(r, 100))
        configAttempts++
      }

      if (!window.WORKSHOP_CONFIG) {
        console.warn(
          'Translation Service: WORKSHOP_CONFIG not loaded after 5 seconds',
        )
      }

      if (!window.AWSTranslateConfig) {
        console.warn('Translation Service: AWSTranslateConfig not found')
        return
      }

      this.aws = new window.AWSTranslateConfig()
      const initialized = await this.aws.initialize()

      if (initialized) {
        console.log(
          'Translation Service: AWS Translate initialized successfully',
        )
      } else {
        console.warn(
          'Translation Service: AWS Translate initialization failed, will return original text',
        )
      }
    } catch (e) {
      console.error('Translation Service: Error during initialization:', e)
      console.warn(
        'Translation Service: Running in fallback mode (no translation)',
      )
    }
  }

  // No mock mode — always try real AWS Translate; on failure, return source text

  async translateText(text, sourceLanguage = 'en', targetLanguage = 'de') {
    if (!text || text.trim() === '') return text

    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      if (!this.isAWSConfigured()) {
        // Not configured — keep original text
        if (
          window.WORKSHOP_CONFIG &&
          window.WORKSHOP_CONFIG.debug &&
          window.WORKSHOP_CONFIG.debug.logTranslations
        ) {
          console.debug(
            'Translation Service: AWS not configured, returning original text',
          )
        }
        return text
      }

      const translatedText = await this.translateWithAWS(
        text,
        sourceLanguage,
        targetLanguage,
      )

      // Cache the result
      this.cache.set(cacheKey, translatedText)

      if (
        window.WORKSHOP_CONFIG &&
        window.WORKSHOP_CONFIG.debug &&
        window.WORKSHOP_CONFIG.debug.logTranslations
      ) {
        console.debug('Translation Service: Translated text cached', {
          original: text.substring(0, 50) + '...',
          translated: translatedText.substring(0, 50) + '...',
        })
      }

      return translatedText
    } catch (error) {
      console.error('Translation Service: Translation failed', {
        error: error.message,
        text: text.substring(0, 100) + '...',
        sourceLanguage,
        targetLanguage,
      })
      return text // keep source on error
    }
  }

  isAWSConfigured() {
    const checks = {
      hasWindow: typeof window !== 'undefined',
      hasAWS: !!window.AWS,
      hasTranslate: !!(window.AWS && window.AWS.Translate),
      hasConfig: !!(window.AWS && window.AWS.config),
      hasCredentials: !!(
        window.AWS &&
        window.AWS.config &&
        window.AWS.config.credentials
      ),
      hasIdentityPool: !!(
        window.WORKSHOP_CONFIG && window.WORKSHOP_CONFIG.translateIdentityPoolId
      ),
    }

    const isConfigured = Object.values(checks).every((check) => check)

    if (
      !isConfigured &&
      window.WORKSHOP_CONFIG &&
      window.WORKSHOP_CONFIG.debug &&
      window.WORKSHOP_CONFIG.debug.showAWSErrors
    ) {
      console.debug('Translation Service: Configuration check failed', checks)
    }

    return isConfigured
  }

  async translateWithAWS(text, sourceLanguage, targetLanguage) {
    const translate = new window.AWS.Translate()

    // Ensure credentials are resolved before API call
    if (window.AWS.config.credentials && window.AWS.config.credentials.get) {
      await new Promise((resolve, reject) => {
        window.AWS.config.credentials.get((err) =>
          err ? reject(err) : resolve(),
        )
      })
    }

    const params = {
      Text: text,
      SourceLanguageCode: sourceLanguage,
      TargetLanguageCode: targetLanguage,
    }

    try {
      const result = await translate.translateText(params).promise()
      return result.TranslatedText
    } catch (error) {
      console.error('Translate API error:', error)
      throw error
    }
  }

  getTranslatableElements(root) {
    if (!root) return []
    const all = root.querySelectorAll(
      '.markdown-section *:not(a):not(code):not(pre)',
    )
    return Array.from(all).filter((el) => {
      // Skip the language toggle button subtree entirely
      if (el.closest && el.closest('#language-toggle')) return false
      if (!el.textContent || el.textContent.trim() === '') return false
      if (el.closest('h1, h2, h3, h4, h5, h6')) return false
      // Only elements whose children are text nodes (no nested elements)
      const kids = Array.from(el.childNodes)
      if (kids.length === 0) return false
      return kids.every((n) => n.nodeType === Node.TEXT_NODE)
    })
  }

  getTranslatableTextNodes(root) {
    if (!root) return []

    const textNodes = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // Skip empty text nodes
        if (!node.nodeValue || node.nodeValue.trim() === '') {
          return NodeFilter.FILTER_REJECT
        }

        // Skip if parent is a script, style, code, or pre element
        const parent = node.parentElement
        if (!parent) return NodeFilter.FILTER_REJECT

        const tagName = parent.tagName?.toLowerCase()
        if (['script', 'style', 'code', 'pre'].includes(tagName)) {
          return NodeFilter.FILTER_REJECT
        }

        // Skip if inside a code block
        if (parent.closest('code') || parent.closest('pre')) {
          return NodeFilter.FILTER_REJECT
        }

        // Skip if inside the language toggle button
        if (parent.closest('#language-toggle')) {
          return NodeFilter.FILTER_REJECT
        }

        // Skip if inside a link (to preserve URLs)
        if (parent.closest('a')) {
          return NodeFilter.FILTER_REJECT
        }

        return NodeFilter.FILTER_ACCEPT
      },
    })

    let node
    while ((node = walker.nextNode())) {
      textNodes.push(node)
    }

    return textNodes
  }

  async translatePage() {
    if (this.isTranslating) {
      console.debug(
        'Translation Service: Translation already in progress, skipping',
      )
      return
    }

    this.isTranslating = true
    console.log(
      `Translation Service: Starting page translation to ${this.currentLanguage}`,
    )

    try {
      let root =
        document.querySelector('.markdown-section') ||
        (document.getElementById('app') &&
          document.getElementById('app').querySelector('.markdown-section')) ||
        document.querySelector('#app .markdown-section') ||
        document.querySelector('#main .markdown-section')
      // If content hasn't rendered yet, wait briefly and retry
      let attempts = 0
      while (
        attempts < 30 &&
        (!root || !root.textContent || root.textContent.trim() === '')
      ) {
        await new Promise((r) => setTimeout(r, 100))
        root =
          document.querySelector('.markdown-section') ||
          (document.getElementById('app') &&
            document
              .getElementById('app')
              .querySelector('.markdown-section')) ||
          document.querySelector('#app .markdown-section') ||
          document.querySelector('#main .markdown-section')
        attempts++
      }
      const textNodes = this.getTranslatableTextNodes(root)
      console.log(
        `Translation Service: Found ${textNodes.length} text nodes to translate`,
      )

      if (textNodes.length === 0) {
        console.warn('Translation Service: No translatable text nodes found')
        return
      }

      const batchSize =
        (window.WORKSHOP_CONFIG &&
          window.WORKSHOP_CONFIG.translation &&
          window.WORKSHOP_CONFIG.translation.batchSize) ||
        25
      for (let i = 0; i < textNodes.length; i += batchSize) {
        const batch = textNodes.slice(i, i + batchSize)
        await Promise.all(
          batch.map(async (node) => {
            if (this.currentLanguage === 'de') {
              if (!this.originalTextByNode.has(node)) {
                this.originalTextByNode.set(node, node.nodeValue)
              }
              const translated = await this.translateText(node.nodeValue)
              node.nodeValue = translated
            } else {
              if (this.originalTextByNode.has(node)) {
                node.nodeValue = this.originalTextByNode.get(node)
              }
            }
          }),
        )

        if (
          window.WORKSHOP_CONFIG &&
          window.WORKSHOP_CONFIG.debug &&
          window.WORKSHOP_CONFIG.debug.logTranslations
        ) {
          console.debug(
            `Translation Service: Batch ${Math.floor(i / batchSize) + 1} completed`,
          )
        }

        const delay =
          (window.WORKSHOP_CONFIG &&
            window.WORKSHOP_CONFIG.translation &&
            window.WORKSHOP_CONFIG.translation.requestDelay) ||
          60
        await new Promise((r) => setTimeout(r, delay))
      }

      console.log('Translation Service: Page translation completed')
    } catch (error) {
      console.error('Translation Service: Error during page translation', {
        error: error.message,
        stack: error.stack,
      })
    } finally {
      this.isTranslating = false
    }
  }

  async switchLanguage(language) {
    if (this.currentLanguage === language) {
      console.debug('Translation Service: Already in language:', language)
      return
    }

    console.log(
      `Translation Service: Switching language from ${this.currentLanguage} to ${language}`,
    )
    this.currentLanguage = language
    await this.translatePage()

    // Update toggle button state
    this.updateToggleButton()
  }

  updateToggleButton() {
    const toggleButton = document.getElementById('language-toggle')
    if (toggleButton) {
      toggleButton.classList.toggle('active', this.currentLanguage === 'de')
      toggleButton.innerHTML = this.currentLanguage === 'de' ? '🇩🇪 DE' : '🇺🇸 EN'
    }
  }
}

// Initialize translation service
const translationService = new TranslationService()

// Export for global access
window.translationService = translationService
