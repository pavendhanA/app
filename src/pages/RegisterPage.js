const BasePage = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  // Locators
  get nameField() {
    return '#register-name';
  }

  get emailField() {
    return '#register-email';
  }

  get passwordField() {
    return '#register-password';
  }

  get confirmPasswordField() {
    return '#register-confirm-password';
  }

  get registerButton() {
    return '#register-submit-button';
  }

  get errorLabel() {
    return '#register-error-message';
  }

  get goToLoginLink() {
    return '#go-to-login';
  }

  /**
   * Complete registration action.
   */
  async register(name, email, password, confirmPassword) {
    if (name !== null) {
      await this.clearAndSetValue(this.nameField, name, `Enter register name: ${name}`);
    }
    if (email !== null) {
      await this.clearAndSetValue(this.emailField, email, `Enter register email: ${email}`);
    }
    if (password !== null) {
      await this.clearAndSetValue(this.passwordField, password, 'Enter register password');
    }
    if (confirmPassword !== null) {
      await this.clearAndSetValue(this.confirmPasswordField, confirmPassword, 'Confirm register password');
    }
    await this.click(this.registerButton, 'Click Sign Up Button');
  }

  /**
   * Gets registration error validation messages.
   */
  async getErrorMessage() {
    return await this.getText(this.errorLabel, 'Get registration error message');
  }

  /**
   * Navigate back to Login view.
   */
  async navigateToLogin() {
    await this.click(this.goToLoginLink, 'Click Login Here link');
  }
}

module.exports = RegisterPage;
