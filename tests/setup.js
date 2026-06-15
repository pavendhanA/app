const fs = require('fs');
const path = require('path');
const DriverFactory = require('../src/driver/DriverFactory');
const ExcelReporter = require('../src/utils/ExcelReporter');
const HtmlReporter = require('../src/utils/HtmlReporter');
const logger = require('../src/utils/Logger');

// Create reports directories
const reportDir = path.join(process.cwd(), 'reports');
const failureDir = path.join(reportDir, 'failures');
[reportDir, failureDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Global tracking data
global.testCasesList = [];
global.failedTestsList = [];
global.executionLogs = [];
let startTime;

before(async function () {
  this.timeout(120000); // 2 minutes startup timeout
  logger.info('=== Initializing QA Test Suite Session ===');
  startTime = Date.now();
  
  // Initialize Driver
  try {
    await DriverFactory.initDriver();
    logger.info('Appium Session initialized successfully.');
  } catch (error) {
    logger.error(`Appium Session initialization failed: ${error.message}`);
    throw error;
  }
});

beforeEach(function () {
  this.currentTest.startTime = Date.now();
  logger.info(`Starting Test: "${this.currentTest.fullTitle()}"`);
});

afterEach(async function () {
  const test = this.currentTest;
  const durationSec = ((Date.now() - test.startTime) / 1000).toFixed(2) + 's';
  const status = test.state === 'passed' ? 'PASS' : test.state === 'failed' ? 'FAIL' : 'SKIP';
  
  const testName = test.title;
  const parentSuite = test.parent ? test.parent.title : 'Root';

  logger.info(`Finished Test: "${test.fullTitle()}" [${status}] (${durationSec})`);

  // Log test case result
  global.testCasesList.push({
    id: `TC-${global.testCasesList.length + 101}`,
    module: parentSuite,
    scenario: testName,
    status: status,
    device: DriverFactory.driver ? DriverFactory.driver.capabilities['appium:deviceName'] || 'Android Emulator' : 'N/A',
    duration: durationSec
  });

  if (test.state === 'failed') {
    const timestamp = Date.now();
    const sanitName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    const screenshotPath = path.join(failureDir, `screenshot_${sanitName}_${timestamp}.png`);
    const logPath = path.join(failureDir, `logs_${sanitName}_${timestamp}.log`);
    const xmlPath = path.join(failureDir, `source_${sanitName}_${timestamp}.xml`);

    logger.error(`Test FAILED: "${testName}". Capturing troubleshooting logs...`);

    if (DriverFactory.driver) {
      try {
        // 1. Capture screenshot
        await DriverFactory.driver.saveScreenshot(screenshotPath);
        
        // 2. Dump page source widget tree
        const xmlSource = await DriverFactory.driver.getPageSource();
        fs.writeFileSync(xmlPath, xmlSource, 'utf8');

        // 3. Dump device logcat logs
        let logsStr = '';
        try {
          const logcat = await DriverFactory.driver.getLogs('logcat');
          logsStr = logcat.map(entry => `[${entry.timestamp}] ${entry.level}: ${entry.message}`).join('\n');
        } catch (logErr) {
          logsStr = `Logcat capture failed: ${logErr.message}`;
        }
        fs.writeFileSync(logPath, logsStr, 'utf8');
      } catch (err) {
        logger.error(`Error saving failure artifacts: ${err.message}`);
      }
    }

    // Save failure entry
    global.failedTestsList.push({
      name: testName,
      reason: test.err ? test.err.message : 'Unknown failure error',
      stackTrace: test.err ? test.err.stack : '',
      screenshotPath: screenshotPath,
      device: DriverFactory.driver ? DriverFactory.driver.capabilities['appium:deviceName'] || 'Android Device' : 'N/A',
      androidVersion: DriverFactory.driver ? DriverFactory.driver.capabilities['appium:platformVersion'] || 'N/A' : 'N/A'
    });

    // Record step log entry
    logger.step(parentSuite, testName, 'FAIL', test.err ? test.err.message : 'Failure');
  } else if (test.state === 'passed') {
    logger.step(parentSuite, testName, 'PASS', 'Completed without errors');
  }
});

after(async function () {
  this.timeout(30000);
  logger.info('=== Starting Suite Cleanup & Report Compiling ===');

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
  const driver = DriverFactory.driver;

  const total = global.testCasesList.length;
  const passed = global.testCasesList.filter(tc => tc.status === 'PASS').length;
  const failed = global.testCasesList.filter(tc => tc.status === 'FAIL').length;
  const skipped = global.testCasesList.filter(tc => tc.status === 'SKIP').length;
  const passPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

  const summaryData = {
    date: new Date().toLocaleString(),
    deviceName: driver ? driver.capabilities['appium:deviceName'] || 'Android Device' : 'Android Emulator',
    androidVersion: driver ? driver.capabilities['appium:platformVersion'] || 'N/A' : 'N/A',
    total,
    passed,
    failed,
    skipped,
    passPercentage,
    duration: totalDuration
  };

  const reportPayload = {
    summary: summaryData,
    testCases: global.testCasesList,
    failedTests: global.failedTestsList,
    executionLogs: global.executionLogs
  };

  // Compile Reports
  try {
    await ExcelReporter.generateReport(path.join(reportDir, 'Flutter_E2E_Report.xlsx'), reportPayload);
    await HtmlReporter.generateReport(path.join(reportDir, 'index.html'), reportPayload);
  } catch (reportErr) {
    logger.error(`Failed to compile reports: ${reportErr.message}`);
  }

  // Quit session
  await DriverFactory.quitDriver();
  logger.info('=== All E2E Tests Complete ===');
});
