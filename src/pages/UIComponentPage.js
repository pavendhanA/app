const BasePage = require('./BasePage');
const finder = require('appium-flutter-finder');

class UIComponentPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  // Button locators
  get elevatedButton() { return finder.byValueKey('elevated-btn'); }
  get textButton() { return finder.byValueKey('text-btn'); }
  get iconButton() { return finder.byValueKey('icon-btn'); }
  
  // Custom interactive switch
  get switchBtn() { return finder.byValueKey('material-switch'); }

  // Modal containers
  get showDialogBtn() { return finder.byValueKey('show-dialog-button'); }
  get dialogTitle() { return finder.byText('Confirm Action'); }
  get dialogOkBtn() { return finder.byText('OK'); }

  get showBottomSheetBtn() { return finder.byValueKey('show-bottomsheet-button'); }
  get bottomSheetContent() { return finder.byText('Options Menu'); }

  // Snackbar elements
  get showSnackbarBtn() { return finder.byValueKey('show-snackbar-button'); }
  get snackbarText() { return finder.byText('Operation successful!'); }

  // Lists
  get listView() { return finder.byValueKey('component-listview'); }
  get gridView() { return finder.byValueKey('component-gridview'); }
  get firstCard() { return finder.byValueKey('card-item-0'); }

  /**
   * Clicks elevated, text, and icon buttons to verify clickability.
   */
  async verifyButtons() {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return;
    }
    await this.click(this.elevatedButton, 'Click ElevatedButton');
    await this.click(this.textButton, 'Click TextButton');
    await this.click(this.iconButton, 'Click IconButton');
  }

  /**
   * Toggles the Material Switch component.
   */
  async toggleSwitch(shouldTurnOn = true) {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return;
    }
    const el = await this.getElement(this.switchBtn);
    const isOn = await el.getAttribute('checked') === 'true';
    if (isOn !== shouldTurnOn) {
      await this.click(this.switchBtn, `Toggle switch to: ${shouldTurnOn}`);
    }
  }

  /**
   * Triggers and validates dialog windows.
   */
  async handleDialog() {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return true;
    }
    await this.click(this.showDialogBtn, 'Trigger Dialog popup');
    const isShown = await this.isDisplayed(this.dialogTitle);
    if (isShown) {
      await this.click(this.dialogOkBtn, 'Dismiss Dialog popup');
    }
    return isShown;
  }

  /**
   * Triggers and validates bottom sheets.
   */
  async handleBottomSheet() {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return true;
    }
    await this.click(this.showBottomSheetBtn, 'Open Bottom Sheet overlay');
    const isShown = await this.isDisplayed(this.bottomSheetContent);
    if (isShown) {
      // Swipe down to dismiss standard bottom sheet
      await this.swipe(500, 1500, 500, 2000);
    }
    return isShown;
  }

  /**
   * Validates custom Flutter Snackbar notifications.
   */
  async checkSnackbar() {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return true;
    }
    await this.click(this.showSnackbarBtn, 'Trigger Snackbar notification');
    return await this.isDisplayed(this.snackbarText);
  }

  /**
   * Scrolls and taps on a List element.
   */
  async scrollAndSelectListItem(itemId) {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return;
    }
    // Scroll down inside ListView if needed
    await this.scroll('down', 0.4);
    const itemFinder = finder.byValueKey(`card-item-${itemId}`);
    await this.click(itemFinder, `Select item ${itemId} in ListView`);
  }
}

module.exports = UIComponentPage;
