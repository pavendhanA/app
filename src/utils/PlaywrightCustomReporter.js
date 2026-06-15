const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

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
      id: `TC-${101 + this.results.length}`,
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
      androidVersion: 'HTML5 Portal',
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
      // 1. Generate Excel Report
      await this.generateExcelReport(path.join(this.reportDir, 'Selenium_E2E_Report.xlsx'), reportPayload);
      // 2. Generate HTML Report
      await this.generateHtmlReport(path.join(this.reportDir, 'index.html'), reportPayload);
      console.log('Custom report generation complete. Saved in reports/selenium/');
    } catch (err) {
      console.error('Failed to compile Playwright custom reports:', err);
    }
  }

  // --- Excel Compiler ---
  async generateExcelReport(reportPath, data) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Playwright Web E2E Framework';
    workbook.created = new Date();

    const summary = data.summary || {};
    const testCases = data.testCases || [];
    const failedTests = data.failedTests || [];
    const executionLogs = data.executionLogs || [];

    const primaryHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A237E' } };
    const headerFont = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    const centerAlignment = { vertical: 'middle', horizontal: 'center' };
    const leftAlignment = { vertical: 'middle', horizontal: 'left' };
    const borderStyle = {
      top: { style: 'thin', color: { argb: 'FFD6DBDF' } },
      left: { style: 'thin', color: { argb: 'FFD6DBDF' } },
      bottom: { style: 'thin', color: { argb: 'FFD6DBDF' } },
      right: { style: 'thin', color: { argb: 'FFD6DBDF' } }
    };

    // Sheet 1
    const sheet1 = workbook.addWorksheet('Summary');
    sheet1.views = [{ showGridLines: true }];
    sheet1.columns = [{ header: 'Metric', key: 'metric', width: 25 }, { header: 'Value', key: 'value', width: 30 }];
    const summaryRows = [
      { metric: 'Execution Date', value: summary.date },
      { metric: 'Target Platform', value: summary.deviceName },
      { metric: 'Engine Version', value: summary.androidVersion },
      { metric: 'Total Tests', value: summary.total },
      { metric: 'Passed', value: summary.passed },
      { metric: 'Failed', value: summary.failed },
      { metric: 'Skipped', value: summary.skipped },
      { metric: 'Pass Percentage', value: `${summary.passPercentage}%` },
      { metric: 'Duration', value: summary.duration }
    ];
    summaryRows.forEach(row => sheet1.addRow(row));
    sheet1.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });
    sheet1.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.getCell(1).font = { bold: true };
      }
      row.eachCell(cell => { cell.border = borderStyle; });
    });

    // Sheet 2
    const sheet2 = workbook.addWorksheet('Test Cases');
    sheet2.views = [{ showGridLines: true }];
    sheet2.columns = [
      { header: 'Test ID', key: 'id', width: 12 },
      { header: 'Module', key: 'module', width: 20 },
      { header: 'Scenario', key: 'scenario', width: 45 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Duration', key: 'duration', width: 15 }
    ];
    testCases.forEach(tc => {
      const row = sheet2.addRow(tc);
      const statusCell = row.getCell('status');
      if (tc.status === 'PASS') {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F8F5' } };
        statusCell.font = { color: { argb: 'FF117A65' }, bold: true };
      } else if (tc.status === 'FAIL') {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDF2F2' } };
        statusCell.font = { color: { argb: 'FFC0392B' }, bold: true };
      }
    });
    sheet2.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });
    sheet2.eachRow(row => {
      row.eachCell(cell => {
        cell.border = borderStyle;
        if (cell.col === 1 || cell.col === 4 || cell.col === 5) cell.alignment = centerAlignment;
      });
    });

    // Sheet 3
    const sheet3 = workbook.addWorksheet('Failed Tests');
    sheet3.views = [{ showGridLines: true }];
    sheet3.columns = [
      { header: 'Test Name', key: 'name', width: 35 },
      { header: 'Failure Reason', key: 'reason', width: 75 }
    ];
    failedTests.forEach(ft => sheet3.addRow(ft));
    sheet3.getRow(1).eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB71C1C' } };
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });
    sheet3.eachRow(row => {
      row.eachCell(cell => { cell.border = borderStyle; });
    });

    await workbook.xlsx.writeFile(reportPath);
  }

  // --- HTML Compiler ---
  generateHtmlReport(reportPath, data) {
    const summary = data.summary || {};
    const testCases = data.testCases || [];
    const failedTests = data.failedTests || [];
    const executionLogs = data.executionLogs || [];

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (summary.passPercentage / 100) * circumference;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Playwright Web Automation Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0e1a;
      --panel-dark: #121829;
      --border-color: #202b47;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --color-pass: #10b981;
      --color-fail: #ef4444;
      --color-skip: #f59e0b;
      --primary: #4f46e5;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      padding: 2rem;
      line-height: 1.6;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 2rem;
    }
    header h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .meta-badges { display: flex; gap: 1rem; }
    .badge {
      background: var(--panel-dark);
      border: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .badge strong { color: var(--text-main); }
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1.5fr;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .card {
      background-color: var(--panel-dark);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card.pass { border-left: 4px solid var(--color-pass); }
    .card.fail { border-left: 4px solid var(--color-fail); }
    .card.skip { border-left: 4px solid var(--color-skip); }
    .card-title { font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 1rem; }
    .card-val { font-family: 'Outfit', sans-serif; font-size: 3rem; font-weight: 800; }
    .gauge-wrapper { position: relative; width: 120px; height: 120px; }
    .gauge-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    .gauge-bg { fill: none; stroke: var(--border-color); stroke-width: 10; }
    .gauge-progress {
      fill: none;
      stroke: var(--color-pass);
      stroke-width: 10;
      stroke-linecap: round;
      stroke-dasharray: ${circumference};
      stroke-dashoffset: ${strokeDashoffset};
    }
    .gauge-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
    .gauge-percent { font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; }
    .gauge-label { font-size: 0.7rem; color: var(--text-muted); }
    .test-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem; }
    .test-item {
      background-color: var(--panel-dark);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
    }
    .test-header {
      padding: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
    .test-title-area { display: flex; align-items: center; gap: 1rem; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .status-dot.pass { background-color: var(--color-pass); }
    .status-dot.fail { background-color: var(--color-fail); }
    .test-name { font-weight: 600; }
    .test-module { font-size: 0.8rem; background-color: var(--border-color); padding: 0.25rem 0.5rem; border-radius: 4px; color: var(--text-muted); }
    .test-body { padding: 1.5rem; border-top: 1px solid var(--border-color); background-color: rgba(0,0,0,0.2); display: none; }
    .test-item.open .test-body { display: block; }
    .failure-box { border: 1px solid rgba(239, 68, 68, 0.3); background-color: rgba(239, 68, 68, 0.05); border-radius: 8px; padding: 1rem; }
    .stack-trace { background: #000; padding: 1rem; border-radius: 6px; color: #fb7185; font-family: monospace; overflow-x: auto; white-space: pre; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>Playwright Web Reports</h1>
        <p style="color: var(--text-muted); font-size: 0.95rem;">GateGuard Web Integration Dashboard</p>
      </div>
      <div class="meta-badges">
        <div class="badge">Date: <strong>${summary.date}</strong></div>
        <div class="badge">Platform: <strong>${summary.deviceName}</strong></div>
      </div>
    </header>
    <div class="dashboard-grid">
      <div class="card pass">
        <div class="card-title">Passed</div>
        <div class="card-val" style="color: var(--color-pass);">${summary.passed}</div>
      </div>
      <div class="card fail">
        <div class="card-title">Failed</div>
        <div class="card-val" style="color: var(--color-fail);">${summary.failed}</div>
      </div>
      <div class="card skip">
        <div class="card-title">Skipped</div>
        <div class="card-val" style="color: var(--color-skip);">${summary.skipped}</div>
      </div>
      <div class="card" style="flex-direction: row; align-items: center; justify-content: space-around;">
        <div class="gauge-wrapper">
          <svg class="gauge-svg" viewBox="0 0 120 120">
            <circle class="gauge-bg" cx="60" cy="60" r="50"></circle>
            <circle class="gauge-progress" cx="60" cy="60" r="50"></circle>
          </svg>
          <div class="gauge-text">
            <div class="gauge-percent">${summary.passPercentage}%</div>
            <div class="gauge-label">Pass Rate</div>
          </div>
        </div>
        <div>
          <div style="font-size: 1.1rem; font-weight:600;">Time metrics</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top:0.25rem;">Duration: <strong style="color: var(--text-main);">${summary.duration}</strong></div>
        </div>
      </div>
    </div>

    <h2 style="margin-bottom: 1.5rem; font-family: 'Outfit', sans-serif;">Execution Scenarios (${summary.total})</h2>
    <div class="test-list">
      ${testCases.map(tc => `
        <div class="test-item">
          <div class="test-header" onclick="this.parentElement.classList.toggle('open')">
            <div class="test-title-area">
              <span class="status-dot ${tc.status.toLowerCase()}"></span>
              <span class="test-name">${tc.scenario}</span>
              <span class="test-module">${tc.module}</span>
            </div>
            <div class="test-meta" style="color: var(--text-muted); font-size: 0.85rem;">
              <span>Duration: <strong>${tc.duration}</strong></span> |
              <span>ID: <strong>${tc.id}</strong></span>
            </div>
          </div>
          <div class="test-body">
            ${tc.status === 'FAIL' ? `
              <div class="failure-box">
                <div style="color: var(--color-fail); font-weight: 600;">${tc.error || 'Assertion failed'}</div>
                ${tc.stack ? `<pre class="stack-trace">${tc.stack}</pre>` : ''}
              </div>
            ` : `<div style="color: var(--color-pass);">All validation checkpoints resolved successfully.</div>`}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;

    fs.writeFileSync(reportPath, htmlContent, 'utf8');
  }
}

module.exports = PlaywrightCustomReporter;
