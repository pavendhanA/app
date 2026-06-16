const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  // Sidebar navigation
  get navDashboardBtn() { return '#nav-dashboard'; }
  get navIncomeBtn() { return '#nav-income'; }
  get navExpenseBtn() { return '#nav-expense'; }
  get navBudgetBtn() { return '#nav-budget'; }
  get navReportsBtn() { return '#nav-reports'; }
  get navProfileBtn() { return '#nav-profile'; }
  get logoutBtn() { return '#logout-button'; }

  // Sidebar user widgets
  get sidebarNameLabel() { return '#sidebar-name'; }
  get sidebarRoleLabel() { return '#sidebar-role'; }
  get sidebarAvatarLabel() { return '#sidebar-avatar'; }

  // Dashboard Stats
  get balanceStat() { return '#stat-total'; }
  get incomeStat() { return '#stat-income'; }
  get expenseStat() { return '#stat-expense'; }

  // Dashboard Transaction controls
  get txnSearchField() { return '#visitor-search'; }
  get filterAllBtn() { return '#filter-all'; }
  get filterIncomeBtn() { return '#filter-active'; }
  get filterExpenseBtn() { return '#filter-upcoming'; }
  get txnListBody() { return '#visitors-list'; }
  get firstTxnDeleteBtn() { return '.cancel-pass-row'; }

  // Income form locators
  get incomeCategorySelect() { return '#income-category'; }
  get incomeAmountField() { return '#income-amount'; }
  get incomeDescField() { return '#income-desc'; }
  get incomeSubmitBtn() { return '#income-submit-button'; }
  get incomeErrorLabel() { return '#income-error-message'; }

  // Expense form locators
  get expenseCategorySelect() { return '#expense-category'; }
  get expenseAmountField() { return '#expense-amount'; }
  get expenseDescField() { return '#expense-desc'; }
  get expenseSubmitBtn() { return '#expense-submit-button'; }
  get expenseErrorLabel() { return '#expense-error-message'; }

  // Budget form locators
  get budgetCategorySelect() { return '#budget-category'; }
  get budgetLimitField() { return '#budget-limit'; }
  get budgetSubmitBtn() { return '#budget-submit-button'; }
  get budgetErrorLabel() { return '#budget-error-message'; }
  get budgetBarsContainer() { return '#budget-progress-bars'; }

  // Reports
  get distributionList() { return '#category-distribution-list'; }
  get exportReportsBtn() { return '#export-reports-btn'; }

  // Profile Form
  get profileNameField() { return '#profile-name'; }
  get profileCurrencySelect() { return '#profile-currency'; }
  get profileSubmitBtn() { return '#profile-submit-button'; }
  get profileSuccessLabel() { return '#profile-success-message'; }
  get profileRoleView() { return '#profile-role-view'; }

  // Alert Dialog (Budget Limit Warn Modal)
  get budgetModal() { return '#qr-modal'; }
  get closeModalBtn() { return '#close-qr-modal'; }
  get modalMessageText() { return '#qr-pass-id'; }
  get modalStatusLabel() { return '#qr-pass-status'; }
  get modalAcknowledgeBtn() { return '#download-qr-button'; }

  // --- Actions ---

  async navigateTo(tabName) {
    const selectorMap = {
      dashboard: this.navDashboardBtn,
      income: this.navIncomeBtn,
      expense: this.navExpenseBtn,
      budget: this.navBudgetBtn,
      reports: this.navReportsBtn,
      profile: this.navProfileBtn
    };
    const selector = selectorMap[tabName.toLowerCase()];
    if (selector) {
      await this.click(selector, `Navigate to tab: nav-${tabName.toLowerCase()}`);
    }
  }

  async logout() {
    await this.click(this.logoutBtn, 'Click Logout Button');
  }

  async isLoggedIn() {
    try {
      if (this.isSelenium && !this.isMock) {
        const { until } = require('selenium-webdriver');
        const el = await this.getElement(this.logoutBtn);
        await this.driver.wait(until.elementIsVisible(el), 5000);
      }
      return await this.isDisplayed(this.logoutBtn);
    } catch (e) {
      return false;
    }
  }

  async getBalance() {
    return await this.getText(this.balanceStat, 'Read total balance statistic');
  }

  async getIncomeSum() {
    return await this.getText(this.incomeStat, 'Read total income statistic');
  }

  async getExpenseSum() {
    return await this.getText(this.expenseStat, 'Read total expense statistic');
  }

  async addIncome(category, amount, description) {
    await this.navigateTo('income');
    await this.clearAndSetValue(this.incomeCategorySelect, category, `Select income category: ${category}`);
    await this.clearAndSetValue(this.incomeAmountField, String(amount), `Enter income amount: ${amount}`);
    await this.clearAndSetValue(this.incomeDescField, description, `Enter income description: ${description}`);
    await this.click(this.incomeSubmitBtn, 'Click Log Income Submit button');
  }

  async addExpense(category, amount, description) {
    await this.navigateTo('expense');
    await this.clearAndSetValue(this.expenseCategorySelect, category, `Select expense category: ${category}`);
    await this.clearAndSetValue(this.expenseAmountField, String(amount), `Enter expense amount: ${amount}`);
    await this.clearAndSetValue(this.expenseDescField, description, `Enter expense description: ${description}`);
    await this.click(this.expenseSubmitBtn, 'Click Log Expense Submit button');
  }

  async configureBudget(category, limit) {
    await this.navigateTo('budget');
    await this.clearAndSetValue(this.budgetCategorySelect, category, `Select budget segment: ${category}`);
    await this.clearAndSetValue(this.budgetLimitField, String(limit), `Enter budget cap limit: ${limit}`);
    await this.click(this.budgetSubmitBtn, 'Click Save Budget Allocation button');
  }

  async updateProfile(name, currencySymbol) {
    await this.navigateTo('profile');
    await this.clearAndSetValue(this.profileNameField, name, `Enter profile name: ${name}`);
    await this.clearAndSetValue(this.profileCurrencySelect, currencySymbol, `Select currency: ${currencySymbol}`);
    await this.click(this.profileSubmitBtn, 'Click Save Profile Settings button');
  }

  async getProfileSuccessMessage() {
    return await this.getText(this.profileSuccessLabel, 'Read profile update success banner');
  }

  async isAlertModalVisible() {
    return await this.isDisplayed(this.budgetModal);
  }

  async dismissAlertModal() {
    await this.click(this.modalAcknowledgeBtn, 'Acknowledge budget cap warning dialog');
  }
}

module.exports = DashboardPage;
