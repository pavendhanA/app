const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  // Locators
  get emailField() {
    return '#login-email';
  }

  get passwordField() {
    return '#login-password';
  }

  get loginButton() {
    return '#login-submit-button';
  }

  get errorLabel() {
    return '#auth-error-message';
  }

  get rememberCheckbox() {
    return '#remember-me-checkbox';
  }

  get goToRegisterLink() {
    return '#go-to-register';
  }

  /**
   * Complete login action.
   */
  async login(email, password, remember = false) {
    if (email !== null) {
      await this.clearAndSetValue(this.emailField, email, `Enter login email: ${email}`);
    }
    if (password !== null) {
      await this.clearAndSetValue(this.passwordField, password, 'Enter login password');
    }
    if (remember) {
      await this.click(this.rememberCheckbox, 'Check Remember Me option');
    }
    await this.click(this.loginButton, 'Click Sign In Button');
  }

  /**
   * Gets auth error validation messages.
   */
  async getErrorMessage() {
    return await this.getText(this.errorLabel, 'Get login error validation text');
  }

  /**
   * Navigate to Registration view.
   */
  async navigateToRegister() {
    await this.click(this.goToRegisterLink, 'Click Register Here link');
  }
}

module.exports = LoginPage;
