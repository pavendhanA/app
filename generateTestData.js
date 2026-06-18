const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function buildExcel() {
  console.log('Generating testdata.xlsx...');
  const workbook = new ExcelJS.Workbook();
  
  // Headers configuration
  const headers = [
    'Test Case ID', 'Test Suite', 'Module', 'Description',
    'Expected Result', 'Actual Result', 'Status', 'Execution Time',
    'Browser', 'Platform', 'Environment'
  ];

  // 1. Selenium Configuration
  const seleniumConfigs = [
    { module: 'Authentication', count: 50, failedIndices: [15], failReason: 'Invalid Login Validation failed: expected error message "Invalid credentials" not shown' },
    { module: 'Dashboard', count: 40, failedIndices: [12], failReason: 'UI Element Not Found: dashboard summary card did not render within timeout' },
    { module: 'Income', count: 40, failedIndices: [] },
    { module: 'Expense', count: 40, failedIndices: [] },
    { module: 'Budget', count: 40, failedIndices: [20], failReason: 'Incorrect Budget Validation: app failed to trigger modal alert when transaction exceeded category limit' },
    { module: 'Reports', count: 40, failedIndices: [25], failReason: 'Missing Report Data: transaction breakdown list is empty for active billing cycle' },
    { module: 'Notifications', count: 20, failedIndices: [] },
    { module: 'Profile', count: 30, failedIndices: [] },
    { module: 'Settings', count: 20, failedIndices: [] },
    { module: 'Logout', count: 30, failedIndices: [10], failReason: 'Session Timeout: active session token was not automatically invalidated after 15 minutes of inactivity' }
  ];

  // 2. Security Configuration
  const securityConfigs = [
    { module: 'Authentication Security', count: 50, failedIndices: [] },
    { module: 'Session Management', count: 40, failedIndices: [10], failReason: 'Insecure session cookie detected: missing Secure and HttpOnly flags configuration' },
    { module: 'JWT Validation', count: 40, failedIndices: [] },
    { module: 'Security Headers', count: 40, failedIndices: [] },
    { module: 'Input Validation', count: 40, failedIndices: [] },
    { module: 'API Authentication', count: 40, failedIndices: [] },
    { module: 'Authorization', count: 30, failedIndices: [5], failReason: 'Broken Access Control: Unprivileged user was able to view admin logs via IDOR bypass' },
    { module: 'CORS Validation', count: 20, failedIndices: [2], failReason: 'CORS wildcard detected: Access-Control-Allow-Origin returns wildcard "*" for credentialed requests' },
    { module: 'Rate Limiting', count: 20, failedIndices: [] },
    { module: 'OWASP Top 10', count: 30, failedIndices: [] }
  ];

  // 3. Appium Configuration
  const appiumConfigs = [
    { module: 'Login', count: 50, failedIndices: [5], failReason: 'Biometric fingerprint authorization prompt failed to load on Android 14 emulator' },
    { module: 'Dashboard', count: 50, failedIndices: [15], failReason: 'Vertical swipe gesture failed to trigger pull-to-refresh data synchronization' },
    { module: 'Add Income', count: 40, failedIndices: [] },
    { module: 'Add Expense', count: 40, failedIndices: [] },
    { module: 'Budget', count: 40, failedIndices: [12], failReason: 'Budget cap breach warning alert did not display on exceedingShopping limit' },
    { module: 'Reports', count: 30, failedIndices: [8], failReason: 'Financial analytics trend chart container failed to load in landscape orientation' },
    { module: 'Notifications', count: 30, failedIndices: [] },
    { module: 'Profile', count: 40, failedIndices: [] },
    { module: 'Logout', count: 30, failedIndices: [10], failReason: 'Cached authentication tokens were not purged from SharedPreferences on logout execution' }
  ];

  // 4. API Configuration
  const apiConfigs = [
    { module: 'Authentication APIs', count: 50, failedIndices: [5], failReason: 'JSON Schema Validation: POST /api/auth/login response payload mismatch on error state' },
    { module: 'Income APIs', count: 50, failedIndices: [] },
    { module: 'Expense APIs', count: 50, failedIndices: [10], failReason: 'Invalid HTTP status code returned: DELETE /api/expense/999 returned 500 Server Error instead of 404 Not Found' },
    { module: 'Budget APIs', count: 50, failedIndices: [] },
    { module: 'Reports APIs', count: 50, failedIndices: [12], failReason: 'Response latency validation failed: GET /api/reports/annual took 1250ms, exceeding maximum limit of 500ms' },
    { module: 'Notifications APIs', count: 30, failedIndices: [] },
    { module: 'Profile APIs', count: 40, failedIndices: [15], failReason: 'Authentication validation failure: GET /api/profile returned 200 OK without Authorization header validation' },
    { module: 'Settings APIs', count: 30, failedIndices: [] }
  ];

  // 5. Performance Configuration
  const performanceConfigs = [
    { module: 'Login Load', count: 50, failedIndices: [10], failReason: 'Throughput check failed: Login endpoint dropped to 12 TPS under 1000 concurrent VUs' },
    { module: 'Dashboard Load', count: 50, failedIndices: [] },
    { module: 'Income Module', count: 40, failedIndices: [] },
    { module: 'Expense Module', count: 40, failedIndices: [] },
    { module: 'Budget Module', count: 40, failedIndices: [5], failReason: 'Error rate threshold breached: Budget updates encountered 1.5% connection timeout rate under 500 VUs' },
    { module: 'Reports Module', count: 40, failedIndices: [12], failReason: 'Resource exhaustion: CPU usage reached 98% during reports generation with 5000 users' },
    { module: 'API Load', count: 50, failedIndices: [20], failReason: 'Average latency threshold breached: API response latency reached 1850ms under 5000 VUs' },
    { module: 'Database Load', count: 40, failedIndices: [15], failReason: 'Memory leak detected: Database RAM utilization exceeded 92% under concurrent read stress tests' }
  ];

  // 6. Accessibility Configuration
  const accessibilityConfigs = [
    { module: 'WCAG Compliance', count: 40, failedIndices: [8], failReason: 'WCAG Level AA contrast check failed: delete button color contrast ratio is 3.1:1, less than 4.5:1 requirement' },
    { module: 'Keyboard Navigation', count: 30, failedIndices: [] },
    { module: 'Screen Reader Compatibility', count: 30, failedIndices: [12], failReason: 'Missing accessibility attributes: user avatar image element lacks android:contentDescription tag' },
    { module: 'Color Contrast', count: 30, failedIndices: [] },
    { module: 'Focus Management', count: 20, failedIndices: [] }
  ];

  // 7. Cross Browser Configuration (All PASS)
  const crossBrowserConfigs = [
    { module: 'Chrome Execution', count: 40, failedIndices: [] },
    { module: 'Firefox Execution', count: 45, failedIndices: [] },
    { module: 'Edge Execution', count: 35, failedIndices: [] },
    { module: 'Safari Execution', count: 30, failedIndices: [] }
  ];

  // 8. Data Validation Configuration (All PASS)
  const dataValidationConfigs = [
    { module: 'Database Records', count: 40, failedIndices: [] },
    { module: 'Data Integrity', count: 30, failedIndices: [] },
    { module: 'Data Consistency', count: 30, failedIndices: [] },
    { module: 'Financial Calculations', count: 30, failedIndices: [] },
    { module: 'Budget Calculations', count: 20, failedIndices: [] }
  ];

  // Helper to add data to sheet
  const addSheet = (sheetName, suiteName, configs) => {
    const sheet = workbook.addWorksheet(sheetName);
    sheet.addRow(headers);
    
    let idCounter = 1;
    configs.forEach(conf => {
      for (let i = 1; i <= conf.count; i++) {
        const isFailed = conf.failedIndices && conf.failedIndices.includes(i);
        const testId = `TC-${suiteName.toUpperCase().substring(0, 3)}-${String(idCounter++).padStart(3, '0')}`;
        
        sheet.addRow([
          testId,
          suiteName,
          conf.module,
          `Validate ${conf.module} business scenario ${i} parameters and user options`,
          `System should resolve ${conf.module} scenario ${i} without exceptions`,
          isFailed ? conf.failReason : 'Operation succeeded without error checks',
          isFailed ? 'FAIL' : 'PASS',
          isFailed ? '0.00s' : (Math.random() * 0.4 + 0.1).toFixed(2) + 's',
          suiteName === 'crossbrowser' ? ['Chrome', 'Firefox', 'Edge', 'Safari'][i % 4] : 'Chrome',
          suiteName === 'appium' ? 'Android' : 'Windows',
          'QA-Staging'
        ]);
      }
    });
  };

  addSheet('Selenium', 'selenium', seleniumConfigs);
  addSheet('Security', 'security', securityConfigs);
  addSheet('Appium', 'appium', appiumConfigs);
  addSheet('API', 'api', apiConfigs);
  addSheet('Performance', 'performance', performanceConfigs);
  addSheet('Accessibility', 'accessibility', accessibilityConfigs);
  addSheet('CrossBrowser', 'crossbrowser', crossBrowserConfigs);
  addSheet('DataValidation', 'datavalidation', dataValidationConfigs);

  const destPath = path.join(__dirname, 'src/test/resources/testdata.xlsx');
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  await workbook.xlsx.writeFile(destPath);
  console.log(`testdata.xlsx created successfully at: ${destPath}`);
}

buildExcel();
