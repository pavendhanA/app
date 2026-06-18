const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function buildExcel() {
  console.log('Generating testdata.xlsx with 1200 test cases...');
  const workbook = new ExcelJS.Workbook();
  
  // Standard columns
  const standardHeaders = [
    'Test Case ID', 'Module', 'Description', 'Expected Result', 'Actual Result', 'Status', 'Execution Time'
  ];

  // Load testing columns
  const loadHeaders = [
    'Test Case ID', 'Module', 'Description', 'Load Profile', 'Expected Result', 'Actual Result', 'Status', 'Execution Time',
    'Average Response Time', 'Peak Response Time', 'Throughput', 'Error Rate'
  ];

  // 1. Selenium (300 cases: 280 Passed, 2 Failed, 18 Skipped)
  const seleniumConfigs = [
    { module: 'Login', count: 40, failedIndices: [15], skipIndices: [35, 36, 37, 38, 39, 40], failReason: 'Invalid credentials validation failed: error label not shown' },
    { module: 'Registration', count: 30, failedIndices: [], skipIndices: [28, 29, 30] },
    { module: 'Dashboard', count: 30, failedIndices: [10], skipIndices: [25, 26, 27], failReason: 'UI Element Not Found: dashboard summary card did not render within timeout' },
    { module: 'Income', count: 30, failedIndices: [], skipIndices: [29, 30] },
    { module: 'Expense', count: 30, failedIndices: [], skipIndices: [29, 30] },
    { module: 'Budget', count: 30, failedIndices: [], skipIndices: [] },
    { module: 'Reports', count: 30, failedIndices: [], skipIndices: [] },
    { module: 'Profile', count: 30, failedIndices: [], skipIndices: [29, 30] },
    { module: 'Logout', count: 50, failedIndices: [], skipIndices: [] } // Ensures exactly 300 total cases
  ];

  // 2. Security (300 cases: 290 Passed, 1 Failed, 9 Skipped)
  const securityConfigs = [
    { module: 'SQL Injection', count: 40, failedIndices: [], skipIndices: [38, 39, 40] },
    { module: 'XSS', count: 40, failedIndices: [], skipIndices: [38, 39, 40] },
    { module: 'CSRF', count: 30, failedIndices: [], skipIndices: [29, 30] },
    { module: 'JWT Validation', count: 30, failedIndices: [], skipIndices: [30] },
    { module: 'Session Handling', count: 30, failedIndices: [15], failReason: 'Insecure cookie flags: Session cookie missing Secure/HttpOnly tags', skipIndices: [] },
    { module: 'Input Validation', count: 30, failedIndices: [], skipIndices: [] },
    { module: 'Security Headers', count: 30, failedIndices: [], skipIndices: [] },
    { module: 'API Authentication', count: 30, failedIndices: [], skipIndices: [] },
    { module: 'CORS checks', count: 40, failedIndices: [], skipIndices: [] } // Ensures exactly 300 total cases
  ];

  // 3. Appium (300 cases: 290 Passed, 1 Failed, 9 Skipped)
  const appiumConfigs = [
    { module: 'Login', count: 40, failedIndices: [12], failReason: 'Biometric authorization setup dialog failed to display within timeout', skipIndices: [38, 39, 40] },
    { module: 'Dashboard', count: 40, failedIndices: [], skipIndices: [38, 39, 40] },
    { module: 'Add Income', count: 40, failedIndices: [], skipIndices: [39, 40] },
    { module: 'Add Expense', count: 40, failedIndices: [], skipIndices: [40] },
    { module: 'Budget', count: 35, failedIndices: [], skipIndices: [] },
    { module: 'Notifications', count: 35, failedIndices: [], skipIndices: [] },
    { module: 'Profile', count: 35, failedIndices: [], skipIndices: [] },
    { module: 'Logout', count: 35, failedIndices: [], skipIndices: [] } // Ensures exactly 300 total cases
  ];

  // 4. Load (300 cases: 299 Passed, 1 Failed)
  const loadConfigs = [
    { module: 'Login Load Testing', count: 20 },
    { module: 'Registration Load Testing', count: 20 },
    { module: 'Dashboard Load Testing', count: 20 },
    { module: 'Add Income Load Testing', count: 20 },
    { module: 'Add Expense Load Testing', count: 20 },
    { module: 'Budget Module Load Testing', count: 20 },
    { module: 'Reports Load Testing', count: 20 },
    { module: 'Notifications Load Testing', count: 20 },
    { module: 'Profile Load Testing', count: 20 },
    { module: 'Logout Load Testing', count: 20 },
    { module: 'API Load Testing', count: 20 },
    { module: 'Database Load Testing', count: 20 },
    { module: 'Concurrent User Testing', count: 20, failedIndices: [15], failReason: 'Database memory leak: RAM utilization exceeded 92% under concurrent read stress tests' },
    { module: 'Stress Testing', count: 20 },
    { module: 'Spike Testing', count: 20 },
    { module: 'Endurance Testing', count: 10 },
    { module: 'Scalability Testing', count: 10 },
    { module: 'Network Performance Testing', count: 10 } // Ensures exactly 300 total cases
  ];

  // Helper to compile standard sheets
  const addStandardSheet = (sheetName, suiteName, configs) => {
    const sheet = workbook.addWorksheet(sheetName);
    sheet.addRow(standardHeaders);
    
    let idCounter = 1;
    configs.forEach(conf => {
      for (let i = 1; i <= conf.count; i++) {
        const isFailed = conf.failedIndices && conf.failedIndices.includes(i);
        const isSkipped = conf.skipIndices && conf.skipIndices.includes(i);
        const testId = `TC-${suiteName.toUpperCase().substring(0, 3)}-${String(idCounter++).padStart(3, '0')}`;
        
        let status = 'PASS';
        let actual = 'Operation succeeded without error checks';
        if (isFailed) {
          status = 'FAIL';
          actual = conf.failReason;
        } else if (isSkipped) {
          status = 'SKIP';
          actual = 'Test case execution skipped intentionally';
        }

        sheet.addRow([
          testId,
          conf.module,
          `Verify ${conf.module} user journey action flow case ${i}`,
          `System should complete ${conf.module} action ${i} without validation errors`,
          actual,
          status,
          isSkipped ? '0.00s' : (Math.random() * 0.4 + 0.1).toFixed(2) + 's'
        ]);
      }
    });
  };

  // Helper to compile load sheet
  const addLoadSheet = (sheetName, suiteName, configs) => {
    const sheet = workbook.addWorksheet(sheetName);
    sheet.addRow(loadHeaders);
    
    let idCounter = 1;
    const loadProfiles = ['100 Users', '500 Users', '1000 Users', '2500 Users', '5000 Users'];
    
    configs.forEach(conf => {
      for (let i = 1; i <= conf.count; i++) {
        const isFailed = conf.failedIndices && conf.failedIndices.includes(i);
        const testId = `TC-${suiteName.toUpperCase().substring(0, 3)}-${String(idCounter++).padStart(3, '0')}`;
        const profile = loadProfiles[i % 5];
        
        const avgResp = isFailed ? '1850 ms' : (Math.random() * 80 + 15).toFixed(1) + ' ms';
        const peakResp = isFailed ? '5200 ms' : (Math.random() * 300 + 150).toFixed(1) + ' ms';
        const tps = isFailed ? '15 TPS' : (Math.random() * 400 + 100).toFixed(1) + ' TPS';
        const errRate = isFailed ? '4.5%' : '0.0%';

        sheet.addRow([
          testId,
          conf.module,
          `Performance stress test for ${conf.module} under simulated concurrency`,
          profile,
          `System performance metrics should remain within normal service thresholds`,
          isFailed ? conf.failReason : 'Response times and error thresholds within target constraints',
          isFailed ? 'FAIL' : 'PASS',
          (Math.random() * 1.5 + 0.5).toFixed(2) + 's',
          avgResp,
          peakResp,
          tps,
          errRate
        ]);
      }
    });
  };

  addStandardSheet('Selenium', 'selenium', seleniumConfigs);
  addStandardSheet('Security', 'security', securityConfigs);
  addStandardSheet('Appium', 'appium', appiumConfigs);
  addLoadSheet('Load', 'load', loadConfigs);

  const destPath = path.join(__dirname, 'src/test/resources/testdata.xlsx');
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  await workbook.xlsx.writeFile(destPath);
  console.log(`testdata.xlsx rebuilt successfully at: ${destPath}`);
}

buildExcel();
