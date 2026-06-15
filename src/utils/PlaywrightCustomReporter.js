const fs = require('fs');
const path = require('path');
const UnifiedReporter = require('./UnifiedReporter');

class PlaywrightCustomReporter {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
    this.reportDir = path.join(process.cwd(), 'reports', 'selenium');
  }

  onBegin(config, suite) {
    console.log(`Starting Web automation suite: ${suite.allTests().length} scenarios queued.`);
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  onTestEnd(test, result) {
    const durationMs = result.duration;
    const durationSec = (durationMs / 1000).toFixed(2) + 's';
    
    // Resolve name & parents
    const scenarioName = test.title;
    const parentSuite = test.parent ? test.parent.title : 'Root';
    const cleanStatus = result.status.toUpperCase();
    
    let errMsg = '';
    let stackTrace = '';
    if (result.errors && result.errors.length > 0) {
      errMsg = result.errors[0].message || 'Execution error';
      stackTrace = result.errors[0].stack || '';
    }

    console.log(`Finished Test: "${scenarioName}" [${cleanStatus}] (${durationSec})`);

    this.results.push({
      id: `TC-${201 + this.results.length}`, // Start at 201 to separate from Appium TCs (101+)
      module: parentSuite || 'GateGuard E2E Suite',
      scenario: scenarioName,
      status: cleanStatus === 'PASSED' ? 'PASS' : (cleanStatus === 'FAILED' ? 'FAIL' : 'SKIP'),
      duration: durationSec,
      error: errMsg,
      stack: stackTrace
    });
  }

  async onEnd(result) {
    const endTime = Date.now();
    const durationSec = ((endTime - this.startTime) / 1000).toFixed(2) + 's';

    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;
    const passPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

    const summaryData = {
      date: new Date().toLocaleString(),
      deviceName: 'Chrome/Firefox/WebKit Headless',
      total,
      passed,
      failed,
      skipped,
      passPercentage,
      duration: durationSec
    };

    const reportPayload = {
      summary: summaryData,
      testCases: this.results,
      failedTests: this.results.filter(r => r.status === 'FAIL').map(f => ({
        name: f.scenario,
        reason: f.error || 'Test assertion failed',
        stackTrace: f.stack,
        screenshotPath: '',
        device: 'Web Browser',
        androidVersion: 'Web Engine'
      })),
      executionLogs: this.results.map(r => ({
        timestamp: new Date().toISOString(),
        testName: r.scenario,
        step: `Asserting module ${r.module}`,
        result: r.status,
        remarks: r.status === 'FAIL' ? r.error : 'Success'
      }))
    };

    try {
      await UnifiedReporter.updateReport('selenium', reportPayload);
      console.log('Custom unified reports generated successfully in reports/');
    } catch (err) {
      console.error('Failed to compile Playwright unified custom reports:', err);
    }
  }
}

module.exports = PlaywrightCustomReporter;
