const { test, expect } = require('@playwright/test');
const path = require('path');

const fileUrl = `file://${path.resolve(__dirname, '../web/index.html')}`;

test.describe('Selenium Web Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the local mock web page
    await page.goto(fileUrl);
  });

  // ==========================================
  // MODULE: Authentication (Login/Logout)
  // ==========================================
  
  test('TC-101: Login - Validate empty field constraints', async ({ page }) => {
    await page.locator('#login-submit-button').click();
    // HTML5 native validation will prevent submission or trigger verification
    const emailInput = page.locator('#login-email');
    const isRequired = await emailInput.evaluate(el => el.required);
    expect(isRequired).toBe(true);
  });

  test('TC-102: Login - Validate password length restriction', async ({ page }) => {
    await page.locator('#login-email').fill('host@gateguard.app');
    await page.locator('#login-password').fill('123');
    await page.locator('#login-submit-button').click();
    
    const errMsg = page.locator('#auth-error-message');
    await expect(errMsg).toHaveText('Password must be at least 8 characters.');
  });

  test('TC-103: Login - Verify successful authentication for Admin role', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-role').selectOption('admin');
    await page.locator('#login-submit-button').click();
    
    await expect(page.locator('#dashboard-container')).toBeVisible();
    await expect(page.locator('#sidebar-name')).toHaveText('Admin User');
    await expect(page.locator('#sidebar-role')).toHaveText('ADMIN');
  });

  test('TC-104: Logout - Validate session clear', async ({ page }) => {
    // Log in first
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    await expect(page.locator('#dashboard-container')).toBeVisible();
    
    // Log out
    await page.locator('#logout-button').click();
    await expect(page.locator('#auth-container')).toBeVisible();
    await expect(page.locator('#login-view')).toBeVisible();
  });

  // ==========================================
  // MODULE: Registration
  // ==========================================

  test('TC-105: Registration - Validate empty submission block', async ({ page }) => {
    await page.locator('#go-to-register').click();
    await expect(page.locator('#register-view')).toBeVisible();
    
    await page.locator('#register-submit-button').click();
    const errMsg = page.locator('#register-error-message');
    await expect(errMsg).toHaveText('All fields are required for registration.');
  });

  test('TC-106: Registration - Validate password mismatch check', async ({ page }) => {
    await page.locator('#go-to-register').click();
    
    await page.locator('#register-name').fill('Sarah Jenkins');
    await page.locator('#register-email').fill('sarah@gateguard.app');
    await page.locator('#register-password').fill('Password123!');
    await page.locator('#register-confirm-password').fill('Password999!');
    await page.locator('#register-submit-button').click();
    
    const errMsg = page.locator('#register-error-message');
    await expect(errMsg).toHaveText('Passwords do not match.');
  });

  test('TC-107: Registration - Successful signup and dashboard auto-redirect', async ({ page }) => {
    await page.locator('#go-to-register').click();
    
    await page.locator('#register-name').fill('Sarah Jenkins');
    await page.locator('#register-email').fill('sarah@gateguard.app');
    await page.locator('#register-password').fill('Password123!');
    await page.locator('#register-confirm-password').fill('Password123!');
    await page.locator('#register-role').selectOption('host');
    await page.locator('#register-submit-button').click();
    
    await expect(page.locator('#dashboard-container')).toBeVisible();
    await expect(page.locator('#sidebar-name')).toHaveText('Sarah Jenkins');
    await expect(page.locator('#sidebar-role')).toHaveText('HOST');
  });

  // ==========================================
  // MODULE: Dashboard
  // ==========================================

  test('TC-108: Dashboard - Verify initial statistical widgets mapping', async ({ page }) => {
    // Login to view dashboard
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await expect(page.locator('#stat-total')).toHaveText('3');
    await expect(page.locator('#stat-active')).toHaveText('2');
    await expect(page.locator('#stat-upcoming')).toHaveText('1');
  });

  test('TC-109: Dashboard - Verify real-time list search filters', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await page.locator('#visitor-search').fill('Bob');
    
    // Rows list should filter to 1 item
    const rows = page.locator('#visitors-list tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first().locator('td').nth(1)).toHaveText('Bob Johnson');
  });

  test('TC-110: Dashboard - Verify "Active" status tab filter', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await page.locator('#filter-active').click();
    
    const rows = page.locator('#visitors-list tr');
    await expect(rows).toHaveCount(2); // Initial active count is 2
    
    const statusBadges = page.locator('#visitors-list tr td .badge-status');
    const statusText1 = await statusBadges.nth(0).innerText();
    const statusText2 = await statusBadges.nth(1).innerText();
    expect(statusText1).toBe('ACTIVE');
    expect(statusText2).toBe('ACTIVE');
  });

  test('TC-111: Dashboard - Verify "Upcoming" status tab filter', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await page.locator('#filter-upcoming').click();
    
    const rows = page.locator('#visitors-list tr');
    await expect(rows).toHaveCount(1); // Initial upcoming count is 1
    
    const badge = page.locator('#visitors-list tr td .badge-status');
    await expect(badge).toHaveText('UPCOMING');
  });

  // ==========================================
  // MODULE: Visitor Pass Generation
  // ==========================================

  test('TC-112: Pass Generation - Validate form fields error flags', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await page.locator('#nav-pass').click();
    await expect(page.locator('#pass-view')).toBeVisible();
    
    // Select input element verification
    const hostSelect = page.locator('#pass-host');
    const isRequired = await hostSelect.evaluate(el => el.required);
    expect(isRequired).toBe(true);
  });

  test('TC-113: Pass Generation - Complete flow with QR modal trigger', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await page.locator('#nav-pass').click();
    
    await page.locator('#pass-name').fill('Emily Davis');
    await page.locator('#pass-email').fill('emily@davis.com');
    await page.locator('#pass-phone').fill('+1 (555) 014-9988');
    await page.locator('#pass-purpose').selectOption('Social Meeting');
    await page.locator('#pass-host').selectOption('Host User');
    await page.locator('#pass-submit-button').click();
    
    // QR Code modal should load
    await expect(page.locator('#qr-modal')).toBeVisible();
    await expect(page.locator('#qr-visitor-name')).toHaveText('Emily Davis');
    await expect(page.locator('#qr-pass-status')).toHaveText('UPCOMING');
  });

  test('TC-114: Pass Generation - Cancel/Delete active pass', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    // Accept dialog confirm
    page.once('dialog', dialog => dialog.accept());
    
    // Cancel the first pass
    const cancelBtn = page.locator('.cancel-pass-row').first();
    await cancelBtn.click();
    
    const firstRowStatus = page.locator('#visitors-list tr td .badge-status').first();
    await expect(firstRowStatus).toHaveText('CANCELLED');
  });

  // ==========================================
  // MODULE: QR Preview
  // ==========================================

  test('TC-115: QR Preview - Open preview dialog from visitor logs list', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    // Click QR button of first row
    await page.locator('.view-qr-row').first().click();
    await expect(page.locator('#qr-modal')).toBeVisible();
    await expect(page.locator('#qr-visitor-name')).toHaveText('Alice Smith');
  });

  test('TC-116: QR Preview - Validate Pass ID display format', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    // Open modal
    await page.locator('.view-qr-row').nth(1).click(); // Bob Johnson
    await expect(page.locator('#qr-pass-id')).toHaveText('Pass ID: GG-502');
  });

  test('TC-117: QR Preview - Safely close preview modal and restore dashboard focus', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await page.locator('.view-qr-row').first().click();
    await expect(page.locator('#qr-modal')).toBeVisible();
    
    // Close modal
    await page.locator('#close-qr-modal').click();
    await expect(page.locator('#qr-modal')).toBeHidden();
  });

  // ==========================================
  // MODULE: Profile
  // ==========================================

  test('TC-118: Profile - Update user info metadata fields', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await page.locator('#nav-profile').click();
    await expect(page.locator('#profile-view')).toBeVisible();
    
    await page.locator('#profile-name').fill('Sarah Connor');
    await page.locator('#profile-phone').fill('+1 (555) 999-8888');
    await page.locator('#profile-submit-button').click();
    
    await expect(page.locator('#profile-success-message')).toHaveText('Profile settings updated successfully!');
    await expect(page.locator('#sidebar-name')).toHaveText('Sarah Connor');
  });

  test('TC-119: Profile - Verify profile roles are in readonly format', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await page.locator('#nav-profile').click();
    const roleInput = page.locator('#profile-role-view');
    const isReadonly = await roleInput.evaluate(el => el.readOnly);
    expect(isReadonly).toBe(true);
  });

  test('TC-120: Profile - Check dashboard layout buttons routing and click download QR', async ({ page }) => {
    await page.locator('#login-email').fill('admin@gateguard.app');
    await page.locator('#login-password').fill('GateGuardPass123!');
    await page.locator('#login-submit-button').click();
    
    await page.locator('.view-qr-row').first().click();
    
    // Modal buttons check
    page.once('dialog', dialog => {
      expect(dialog.message()).toContain('QR code download');
      return dialog.accept();
    });
    await page.locator('#download-qr-button').click();
  });

});
