const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for GateGuard Web Automation Suite.
 */
module.exports = defineConfig({
  testDir: './tests-web',
  timeout: 15000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  workers: 1, // Single worker to avoid local state collisions in mock localStorage
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/selenium/report.json' }],
    ['junit', { outputFile: 'reports/selenium/report.xml' }],
    ['html', { outputFolder: 'reports/selenium/html-report', open: 'never' }],
    ['./src/utils/PlaywrightCustomReporter.js']
  ],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
  ],
});
