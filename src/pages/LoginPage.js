const BasePage = require('./BasePage');
const finder = require('appium-flutter-finder');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  // Locators defined using Flutter finders (will translate in native fallback)
  get usernameField() {
    return finder.byValueKey('username-input');
  }

  get passwordField() {
    return finder.byValueKey('password-input');
  }

  get loginButton() {
    return finder.byValueKey('login-submit-button');
  }

  get errorLabel() {
    return finder.byValueKey('auth-error-message');
  }

  get profileMenuButton() {
    return finder.bySemanticsLabel('Profile Menu');
  }

  get logoutButton() {
    return finder.byText('Logout');
  }

  get successToastOrHeader() {
    return finder.byText('Dashboard');
  }

  /**
   * Complete login action.
   */
  async login(username, password) {
    if (username !== null) {
      await this.clearAndSetValue(this.usernameField, username, 'Enter username');
    }
    if (password !== null) {
      await this.clearAndSetValue(this.passwordField, password, 'Enter password');
    }
    await this.click(this.loginButton, 'Click Login Submit Button');
  }

  /**
   * Gets auth error validation messages.
   */
  async getErrorMessage() {
    return await this.getText(this.errorLabel, 'Get login error message');
  }

  /**
   * Logs out the user.
   */
  async logout() {
    await this.click(this.profileMenuButton, 'Open Profile Menu');
    await this.click(this.logoutButton, 'Click Logout Option');
  }

  /**
   * Verifies if user is currently logged in.
   */
  async isLoggedIn() {
    return await this.isDisplayed(this.profileMenuButton);
  }
}

module.exports = LoginPage;
