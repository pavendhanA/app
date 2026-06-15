const logger = require('./Logger');
const DriverFactory = require('../driver/DriverFactory');

class AiTestingAgent {
  constructor(driver) {
    this.driver = driver;
    this.visitedScreens = new Set();
    this.navigationGraph = {};
  }

  /**
   * Main entry point to run autonomous testing exploration on the active screen.
   */
  async exploreActiveScreen() {
    logger.info('=== Starting AI Screen Analysis & Exploration ===');
    const xmlSource = await this.driver.getPageSource();
    
    // 1. Detect widgets automatically
    const widgets = this.detectWidgets(xmlSource);
    logger.info(`AI detected ${widgets.inputs.length} input fields and ${widgets.buttons.length} buttons on this screen.`);

    // 2. Generate dynamic test scenarios from discovered widgets
    const scenarios = this.generateScenarios(widgets);
    logger.info(`Generated ${scenarios.length} dynamic test validation scenarios.`);

    // 3. Execute scenarios & capture form validations
    await this.executeDynamicValidation(widgets, scenarios);

    // 4. Discover navigation paths
    await this.discoverNavigationPaths(widgets.buttons);
  }

  /**
   * Uses structural heuristics to parse XML page source and extract interactive widgets.
   */
  detectWidgets(xmlSource) {
    const inputs = [];
    const buttons = [];
    const navigationTabs = [];

    // Parse <node> tags from XML page source
    // Standard format: <node index="0" text="Label" class="android.widget.Button" resource-id="com.gateguard.app:id/submit" ... />
    const nodeRegex = /<node\s+([^>]+)>/g;
    let match;

    while ((match = nodeRegex.exec(xmlSource)) !== null) {
      const attributesStr = match[1];
      const attributes = this.parseAttributes(attributesStr);
      
      const className = attributes['class'] || '';
      const resourceId = attributes['resource-id'] || '';
      const contentDesc = attributes['content-desc'] || '';
      const text = attributes['text'] || '';
      const bounds = attributes['bounds'] || '';

      const widget = {
        class: className,
        id: resourceId,
        desc: contentDesc,
        text: text,
        bounds: bounds,
        selector: this.determineSelector(resourceId, contentDesc, text)
      };

      // Classify widget
      if (className.includes('EditText') || resourceId.includes('input') || resourceId.includes('field')) {
        inputs.push(widget);
      } else if (className.includes('Button') || resourceId.includes('btn') || resourceId.includes('submit') || text.toLowerCase() === 'submit' || text.toLowerCase() === 'login') {
        buttons.push(widget);
      } else if (contentDesc.includes('tab') || resourceId.includes('tab') || className.includes('Tab')) {
        navigationTabs.push(widget);
      }
    }

    return { inputs, buttons, navigationTabs };
  }

  /**
   * Parses XML node attribute strings into key-value pairs.
   */
  parseAttributes(attributesStr) {
    const attrs = {};
    const attrRegex = /(\S+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }
    return attrs;
  }

  /**
   * Determines the optimal selector to interact with a widget.
   */
  determineSelector(resourceId, contentDesc, text) {
    if (resourceId) return `id:${resourceId}`;
    if (contentDesc) return `accessibility:${contentDesc}`;
    if (text) return `xpath://*[@text="${text}"]`;
    return null;
  }

  /**
   * Resolves selector string to a WDIO Element.
   */
  async getElement(selectorStr) {
    if (!selectorStr) return null;
    const parts = selectorStr.split(':');
    const type = parts[0];
    const val = parts.slice(1).join(':');

    switch (type) {
      case 'id':
        return await this.driver.$(`[resource-id="${val}"]`);
      case 'accessibility':
        return await this.driver.$(`~${val}`);
      case 'xpath':
        return await this.driver.$(val);
      default:
        return null;
    }
  }

  /**
   * Analyzes input descriptors and generates custom validation input boundaries.
   */
  generateScenarios(widgets) {
    const scenarios = [];

    widgets.inputs.forEach(input => {
      const identifier = (input.id || input.desc || input.text || 'field').toLowerCase();
      
      if (identifier.includes('email')) {
        scenarios.push({
          target: input.selector,
          name: 'Invalid Email Validation',
          testValue: 'invalid-email-format',
          expectedError: 'invalid email'
        });
      } else if (identifier.includes('phone') || identifier.includes('mobile')) {
        scenarios.push({
          target: input.selector,
          name: 'Phone Format Check',
          testValue: '1234abcd',
          expectedError: 'digits only'
        });
      } else if (identifier.includes('pass')) {
        scenarios.push({
          target: input.selector,
          name: 'Password Complexity',
          testValue: '123',
          expectedError: 'too short'
        });
      } else {
        // General required field check
        scenarios.push({
          target: input.selector,
          name: `${identifier} blank test`,
          testValue: '',
          expectedError: 'required'
        });
      }
    });

    return scenarios;
  }

  /**
   * Executes fuzz inputs on form fields dynamically and logs error responses.
   */
  async executeDynamicValidation(widgets, scenarios) {
    logger.info('--- Executing Form Validation Fuzzing ---');

    for (const scenario of scenarios) {
      const el = await this.getElement(scenario.target);
      if (!el || !(await el.isDisplayed())) continue;

      logger.info(`AI Scenario: Testing "${scenario.name}" on selector ${scenario.target}`);
      
      // Enter fuzz value
      await el.setValue(scenario.testValue);
      
      // Find and click the main submit/login button
      const submitBtn = widgets.buttons[0];
      if (submitBtn) {
        const btnEl = await this.getElement(submitBtn.selector);
        if (btnEl && (await btnEl.isDisplayed())) {
          await btnEl.click();
          await this.driver.pause(1000);
          
          // Capture new validation messages displayed by widgets
          const pageSource = await this.driver.getPageSource();
          const errors = this.detectErrorsInSource(pageSource);
          if (errors.length > 0) {
            logger.info(`Captured validation error: "${errors.join(', ')}"`);
          } else {
            logger.info('No explicit validation message detected in layout.');
          }
        }
      }
      
      // Clear value for next run
      await el.clearValue();
    }
  }

  /**
   * Identifies red error messages and validation texts in layout.
   */
  detectErrorsInSource(xmlSource) {
    const errorMessages = [];
    const nodeRegex = /<node\s+([^>]+)>/g;
    let match;

    while ((match = nodeRegex.exec(xmlSource)) !== null) {
      const attributes = this.parseAttributes(match[1]);
      const resourceId = attributes['resource-id'] || '';
      const text = attributes['text'] || '';

      if (resourceId.includes('error') || resourceId.includes('validation') || text.toLowerCase().includes('required') || text.toLowerCase().includes('invalid')) {
        if (text) errorMessages.push(text);
      }
    }

    return errorMessages;
  }

  /**
   * Automates explorer clicks on button paths to maps navigation branches.
   */
  async discoverNavigationPaths(buttons) {
    logger.info('--- Automating Screen Navigation Path Discovery ---');
    
    for (const btn of buttons) {
      const name = btn.text || btn.desc || btn.id || 'unnamed-btn';
      logger.info(`AI Explorer: Testing navigation path via: "${name}"`);
      
      const el = await this.getElement(btn.selector);
      if (el && (await el.isDisplayed())) {
        try {
          await el.click();
          await this.driver.pause(2000);
          
          // Read new screen title/package
          const currentSource = await this.driver.getPageSource();
          const title = this.extractScreenTitle(currentSource);
          
          logger.info(`Navigated to Screen: "${title}"`);
          
          // Back tracking
          await this.driver.back();
          await this.driver.pause(1500);
        } catch (e) {
          logger.warn(`Could not navigate or backtrack: ${e.message}`);
        }
      }
    }
  }

  /**
   * Helper to identify active screen headers in page source layouts.
   */
  extractScreenTitle(xmlSource) {
    const titleRegex = /<node[^>]*resource-id="[^"]*title[^"]*"[^>]*text="([^"]+)"/i;
    const match = titleRegex.exec(xmlSource);
    return match ? match[1] : 'Unknown Screen';
  }
}

// Standalone execution entrypoint if running `npm run test:ai` directly
if (require.main === module) {
  (async () => {
    logger.info('Starting standalone AI Testing Agent execution...');
    try {
      const driver = await DriverFactory.initDriver();
      const agent = new AiTestingAgent(driver);
      await agent.exploreActiveScreen();
    } catch (e) {
      logger.error(`AI Testing execution failed: ${e.message}`);
    } finally {
      await DriverFactory.quitDriver();
    }
  })();
}

module.exports = AiTestingAgent;
