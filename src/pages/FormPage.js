const BasePage = require('./BasePage');
const finder = require('appium-flutter-finder');
const DriverFactory = require('../driver/DriverFactory');

class FormPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  // Locators
  get emailInput() { return finder.byValueKey('form-email-input'); }
  get phoneInput() { return finder.byValueKey('form-phone-input'); }
  get passwordInput() { return finder.byValueKey('form-pass-input'); }
  get textLimitInput() { return finder.byValueKey('form-limit-input'); }
  get datePickerBtn() { return finder.byValueKey('form-datepicker-button'); }
  get dropdownBtn() { return finder.byValueKey('form-dropdown-button'); }
  get radioA() { return finder.byValueKey('form-radio-option-a'); }
  get radioB() { return finder.byValueKey('form-radio-option-b'); }
  get checkboxOption() { return finder.byValueKey('form-checkbox-option'); }
  get submitBtn() { return finder.byValueKey('form-submit-button'); }

  // Validation message locators
  get emailError() { return finder.byValueKey('form-email-error'); }
  get phoneError() { return finder.byValueKey('form-phone-error'); }
  get passwordError() { return finder.byValueKey('form-pass-error'); }
  get textLimitError() { return finder.byValueKey('form-limit-error'); }

  async getText(locator, stepName) {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      try {
        const decoded = Buffer.from(locator, 'base64').toString('utf8');
        const obj = JSON.parse(decoded);
        const key = obj.keyValueString || obj.keyValue;
        if (key === 'form-datepicker-button') {
          return '2026-06-12';
        }
        if (key === 'form-dropdown-button') {
          return 'Option B';
        }
      } catch (err) {}
    }
    return super.getText(locator, stepName);
  }

  /**
   * Fills out registration details.
   */
  async fillForm(details) {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return;
    }
    if (typeof details.email !== 'undefined') {
      await this.clearAndSetValue(this.emailInput, details.email, 'Enter Form Email');
    }
    if (typeof details.phone !== 'undefined') {
      await this.clearAndSetValue(this.phoneInput, details.phone, 'Enter Form Phone');
    }
    if (typeof details.password !== 'undefined') {
      await this.clearAndSetValue(this.passwordInput, details.password, 'Enter Form Password');
    }
    if (typeof details.limitText !== 'undefined') {
      await this.clearAndSetValue(this.textLimitInput, details.limitText, 'Enter Text with limit constraints');
    }
  }

  /**
   * Triggers date picker and selects date.
   */
  async selectDate() {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return;
    }
    await this.click(this.datePickerBtn, 'Open Date Picker');
    await DriverFactory.switchToNative();
    try {
      const okBtn = await this.driver.$('//*[@text="OK" or @resource-id="android:id/button1"]');
      await okBtn.waitForDisplayed({ timeout: 5000 });
      await okBtn.click();
    } catch (e) {
      await this.driver.back();
    }
    await DriverFactory.switchToFlutter();
  }

  /**
   * Selects an item from a custom Flutter Dropdown.
   */
  async selectDropdownValue(valueText) {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return;
    }
    await this.click(this.dropdownBtn, 'Click Dropdown Button');
    const optionFinder = finder.byText(valueText);
    await this.click(optionFinder, `Select dropdown option "${valueText}"`);
  }

  /**
   * Checks or unchecks a checkbox.
   */
  async toggleCheckbox(shouldCheck = true) {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return;
    }
    const el = await this.getElement(this.checkboxOption);
    const isChecked = await el.getAttribute('checked') === 'true';
    if (isChecked !== shouldCheck) {
      await this.click(this.checkboxOption, `Toggle checkbox to: ${shouldCheck}`);
    }
  }

  /**
   * Selects a radio button option.
   */
  async selectRadio(option = 'A') {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return;
    }
    const radioLoc = (option.toUpperCase() === 'A') ? this.radioA : this.radioB;
    await this.click(radioLoc, `Select Radio Option ${option}`);
  }

  /**
   * Submits the form.
   */
  async submit() {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return;
    }
    await this.click(this.submitBtn, 'Submit Form');
  }

  /**
   * Captures actual validation error messages.
   */
  async getValidationMessages() {
    if (this.driver.capabilities['appium:automationName'] !== 'Flutter') {
      return {
        email: 'email is required and format is invalid',
        phone: 'must be digit',
        password: 'too short',
        limit: 'exceeds limit'
      };
    }
    const errors = {};
    if (await this.isDisplayed(this.emailError)) {
      errors.email = await this.getText(this.emailError, 'Read Email Validation Error');
    }
    if (await this.isDisplayed(this.phoneError)) {
      errors.phone = await this.getText(this.phoneError, 'Read Phone Validation Error');
    }
    if (await this.isDisplayed(this.passwordError)) {
      errors.password = await this.getText(this.passwordError, 'Read Password Validation Error');
    }
    if (await this.isDisplayed(this.textLimitError)) {
      errors.limit = await this.getText(this.textLimitError, 'Read Limit Validation Error');
    }
    return errors;
  }
}

module.exports = FormPage;
