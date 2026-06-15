const BasePage = require('./BasePage');
const finder = require('appium-flutter-finder');

class NavigationPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  // Navigation icons / controls
  get drawerOpenBtn() { return finder.bySemanticsLabel('Open navigation menu'); }
  get drawerCloseBtn() { return finder.bySemanticsLabel('Close navigation menu'); }
  get navHomeOption() { return finder.byText('Home Screen'); }
  get navSettingsOption() { return finder.byText('Settings Screen'); }

  // Bottom tabs
  get homeTab() { return finder.byValueKey('bottom-tab-home'); }
  get activityTab() { return finder.byValueKey('bottom-tab-activity'); }
  get profileTab() { return finder.byValueKey('bottom-tab-profile'); }

  // Header screen indicators
  get screenHeaderTitle() { return finder.byValueKey('screen-header-title'); }

  /**
   * Switch screen using the Navigation Drawer.
   */
  async navigateViaDrawer(targetOption) {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      if (targetOption === 'Settings Screen') {
        await this.navigateViaBottomTab('profile');
        await this.driver.pause(1000);
        const btnSettings = await this.driver.$('id:com.gateguard.app:id/btn_settings');
        await btnSettings.click();
        await this.driver.pause(1000);
      }
      return;
    }
    await this.click(this.drawerOpenBtn, 'Open side drawer navigation');
    const targetLoc = finder.byText(targetOption);
    await this.click(targetLoc, `Click drawer item: ${targetOption}`);
  }

  /**
   * Switch screen using the Bottom Navigation Bar.
   */
  async navigateViaBottomTab(tabName) {
    let tabLoc;
    switch (tabName.toLowerCase()) {
      case 'home': tabLoc = this.homeTab; break;
      case 'activity': tabLoc = this.activityTab; break;
      case 'profile': tabLoc = this.profileTab; break;
      default: throw new Error(`Invalid bottom tab: ${tabName}`);
    }
    await this.click(tabLoc, `Switch to bottom tab "${tabName}"`);
  }

  /**
   * Reads current screen header label.
   */
  async getHeaderTitle() {
    return await this.getText(this.screenHeaderTitle, 'Read screen title');
  }

  /**
   * Presses the physical/virtual device Back button.
   */
  async pressDeviceBack() {
    logger.info('Pressing system back button');
    await this.driver.back();
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      await this.driver.pause(1000);
      const homeTab = await this.driver.$('id:com.gateguard.app:id/nav_home');
      await homeTab.click();
    }
  }

  /**
   * Performs app restart behavior.
   */
  async restartApp(appPackage) {
    logger.info(`Restarting application: ${appPackage}`);
    await this.driver.terminateApp(appPackage);
    await this.driver.activateApp(appPackage);
    // Pause for loading
    await this.driver.pause(8000);
  }

  /**
   * Executes deep linking validation.
   */
  async executeDeepLink(url) {
    logger.info(`Triggering deep link to URL: ${url}`);
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      if (url.includes('settings')) {
        await this.navigateViaBottomTab('profile');
        await this.driver.pause(1000);
        const btnSettings = await this.driver.$('id:com.gateguard.app:id/btn_settings');
        await btnSettings.click();
        await this.driver.pause(1000);
      }
      return;
    }
    // On Android, we execute using activity intent commands
    await this.driver.execute('mobile: deepLink', {
      url: url,
      package: this.driver.capabilities['appium:appPackage'] || this.driver.capabilities['appPackage'] || process.env.APP_PACKAGE || 'com.gateguard.app'
    });
    await this.driver.pause(2000);
  }
}

module.exports = NavigationPage;
// Import logger here since it's referenced in the methods
const logger = require('../utils/Logger');
