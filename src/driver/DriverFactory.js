const { remote } = require('webdriverio');
const appiumConfig = require('../../config/appium.config');
const logger = require('../utils/Logger');

class DriverFactory {
  static driver = null;
  static currentContext = 'FLUTTER'; // Flutter is default if selected

  /**
   * Initializes the Appium WebDriver session.
   * Supports fallback to UiAutomator2 if Flutter initialization fails.
   */
  static async initDriver() {
    if (this.driver) {
      return this.driver;
    }

    const configCopy = { ...appiumConfig };
    const automationName = configCopy.capabilities['appium:automationName'];

    try {
      logger.info(`Initializing Appium session using [${automationName}] driver...`);
      this.driver = await remote(configCopy);
      logger.info(`Appium session created successfully with Session ID: ${this.driver.sessionId}`);
      
      if (automationName === 'Flutter') {
        this.currentContext = 'FLUTTER';
        logger.info('Running in Flutter context.');
      } else {
        this.currentContext = 'NATIVE_APP';
        logger.info('Running in native UiAutomator2 context.');
      }
      
      return this.driver;
    } catch (error) {
      logger.error(`Driver initialization failed with [${automationName}]: ${error.message}`);
      
      // Fallback to UiAutomator2 if Flutter initialization fails
      if (automationName === 'Flutter') {
        logger.warn('Attempting fallback to UiAutomator2 driver...');
        configCopy.capabilities['appium:automationName'] = 'UiAutomator2';
        
        try {
          this.driver = await remote(configCopy);
          this.currentContext = 'NATIVE_APP';
          logger.info(`Fallback Appium session created successfully using UiAutomator2 with Session ID: ${this.driver.sessionId}`);
          return this.driver;
        } catch (fallbackError) {
          logger.error(`Fallback driver initialization also failed: ${fallbackError.message}`);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Gets the current driver instance.
   */
  static getDriver() {
    if (!this.driver) {
      throw new Error('Driver not initialized. Call initDriver() first.');
    }
    return this.driver;
  }

  /**
   * Switches execution context to native Android view (e.g. for dialogs, permission popups).
   */
  static async switchToNative() {
    if (!this.driver) return;
    
    // Only context switch if we are using Appium Flutter Driver
    const automationName = appiumConfig.capabilities['appium:automationName'];
    if (automationName !== 'Flutter') {
      this.currentContext = 'NATIVE_APP';
      return;
    }

    try {
      const contexts = await this.driver.getContexts();
      logger.info(`Available contexts: ${JSON.stringify(contexts)}`);
      
      if (contexts.includes('NATIVE_APP')) {
        await this.driver.switchContext('NATIVE_APP');
        this.currentContext = 'NATIVE_APP';
        logger.info('Switched context to NATIVE_APP');
      } else {
        logger.warn('NATIVE_APP context is not available.');
      }
    } catch (e) {
      logger.error(`Failed to switch to native context: ${e.message}`);
    }
  }

  /**
   * Switches execution context back to Flutter view.
   */
  static async switchToFlutter() {
    if (!this.driver) return;

    const automationName = appiumConfig.capabilities['appium:automationName'];
    if (automationName !== 'Flutter') {
      this.currentContext = 'NATIVE_APP';
      return;
    }

    try {
      await this.driver.switchContext('FLUTTER');
      this.currentContext = 'FLUTTER';
      logger.info('Switched context to FLUTTER');
    } catch (e) {
      logger.error(`Failed to switch to Flutter context: ${e.message}`);
    }
  }

  /**
   * Closes the active driver session.
   */
  static async quitDriver() {
    if (this.driver) {
      logger.info('Quitting Appium driver session...');
      try {
        await this.driver.deleteSession();
        logger.info('Appium driver session ended.');
      } catch (e) {
        logger.error(`Error while quitting driver session: ${e.message}`);
      } finally {
        this.driver = null;
      }
    }
  }
}

module.exports = DriverFactory;
