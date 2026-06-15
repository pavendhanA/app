const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

class UnifiedReporter {
  /**
   * Updates results for a specific test execution type (appium or selenium),
   * compiles the combined Excel spreadsheet, and generates the master HTML dashboard.
   */
  static async updateReport(type, payload) {
    const reportDir = path.join(process.cwd(), 'reports');
    
    // Ensure directories exist
    [reportDir, path.join(reportDir, 'selenium'), path.join(reportDir, 'appium')].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // 1. Save results for the current test run type to a JSON cache file
    const cacheFile = path.join(reportDir, `${type}_results.json`);
    fs.writeFileSync(cacheFile, JSON.stringify(payload, null, 2), 'utf8');

    // 2. Load all cached results to compile consolidated summaries
    const appiumCacheFile = path.join(reportDir, 'appium_results.json');
    const seleniumCacheFile = path.join(reportDir, 'selenium_results.json');

    let appiumData = { summary: { total: 0, passed: 0, failed: 0, skipped: 0, duration: '0s' }, testCases: [], failedTests: [], executionLogs: [] };
    let seleniumData = { summary: { total: 0, passed: 0, failed: 0, skipped: 0, duration: '0s' }, testCases: [], failedTests: [], executionLogs: [] };

    if (fs.existsSync(appiumCacheFile)) {
      try {
        appiumData = JSON.parse(fs.readFileSync(appiumCacheFile, 'utf8'));
      } catch (e) {
        console.error('Failed to parse Appium results cache:', e);
      }
    }
    if (fs.existsSync(seleniumCacheFile)) {
      try {
        seleniumData = JSON.parse(fs.readFileSync(seleniumCacheFile, 'utf8'));
      } catch (e) {
        console.error('Failed to parse Selenium results cache:', e);
      }
    }

    // Combined stats calculation
    const total = (appiumData.summary.total || 0) + (seleniumData.summary.total || 0);
    const passed = (appiumData.summary.passed || 0) + (seleniumData.summary.passed || 0);
    const failed = (appiumData.summary.failed || 0) + (seleniumData.summary.failed || 0);
    const skipped = (appiumData.summary.skipped || 0) + (seleniumData.summary.skipped || 0);
    const passPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

    const consolidatedSummary = {
      date: new Date().toLocaleString(),
      appiumDevice: appiumData.summary.deviceName || 'Android Device',
      seleniumDevice: seleniumData.summary.deviceName || 'Web Browser',
      total,
      passed,
      failed,
      skipped,
      passPercentage,
      appiumDuration: appiumData.summary.duration || '0s',
      seleniumDuration: seleniumData.summary.duration || '0s'
    };

    // 3. Compile Unified Excel Report
    const excelPath = path.join(reportDir, 'GateGuard_QA_Report.xlsx');
    await this.generateUnifiedExcel(excelPath, consolidatedSummary, appiumData, seleniumData);

    // 4. Compile master HTML Dashboard
    const htmlPath = path.join(reportDir, 'index.html');
    this.generateUnifiedHtml(htmlPath, consolidatedSummary, appiumData, seleniumData);

    // 5. Generate sub-report references
    if (type === 'selenium') {
      const seleniumHtml = path.join(reportDir, 'selenium', 'index.html');
      this.generateHtmlSnapshot(seleniumHtml, 'Selenium Web Test Automation Report', seleniumData);
    } else if (type === 'appium') {
      const appiumHtml = path.join(reportDir, 'appium', 'index.html');
      this.generateHtmlSnapshot(appiumHtml, 'Appium Mobile Test Automation Report', appiumData);
    }
  }

  // --- Excel Sheet Builder ---
  static async generateUnifiedExcel(reportPath, summary, appium, selenium) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'GateGuard Unified QA Reporter';
    workbook.created = new Date();

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

    // Tab 1: Execution Summary
    const sheet1 = workbook.addWorksheet('Summary');
    sheet1.views = [{ showGridLines: true }];
    sheet1.columns = [
      { header: 'Metric / Component', key: 'metric', width: 25 },
      { header: 'Value / Execution Details', key: 'value', width: 35 }
    ];

    const summaryRows = [
      { metric: 'Execution Date', value: summary.date },
      { metric: 'Appium Platform Target', value: summary.appiumDevice },
      { metric: 'Selenium Browser Target', value: summary.seleniumDevice },
      { metric: 'Total QA Test Cases', value: summary.total },
      { metric: 'Passed Tests', value: summary.passed },
      { metric: 'Failed Tests', value: summary.failed },
      { metric: 'Skipped Tests', value: summary.skipped },
      { metric: 'Overall Pass Percentage', value: `${summary.passPercentage}%` },
      { metric: 'Appium Execution Time', value: summary.appiumDuration },
      { metric: 'Selenium Execution Time', value: summary.seleniumDuration }
    ];
    summaryRows.forEach(row => sheet1.addRow(row));
    sheet1.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });
    sheet1.eachRow((row, rowNumber) => {
      if (rowNumber > 1) row.getCell(1).font = { bold: true };
      row.eachCell(cell => { cell.border = borderStyle; });
    });

    // Helper to add test cases sheet
    const addTestCasesSheet = (title, testCases) => {
      const sheet = workbook.addWorksheet(title);
      sheet.views = [{ showGridLines: true }];
      sheet.columns = [
        { header: 'Test ID', key: 'id', width: 12 },
        { header: 'Module', key: 'module', width: 20 },
        { header: 'Scenario Description', key: 'scenario', width: 45 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Execution Duration', key: 'duration', width: 15 }
      ];
      testCases.forEach(tc => {
        const row = sheet.addRow(tc);
        const statusCell = row.getCell('status');
        if (tc.status === 'PASS') {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F8F5' } };
          statusCell.font = { color: { argb: 'FF117A65' }, bold: true };
        } else if (tc.status === 'FAIL') {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDF2F2' } };
          statusCell.font = { color: { argb: 'FFC0392B' }, bold: true };
        } else {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAECEE' } };
          statusCell.font = { color: { argb: 'FF7F8C8D' }, bold: true };
        }
      });
      sheet.getRow(1).eachCell(cell => {
        cell.fill = primaryHeaderFill;
        cell.font = headerFont;
        cell.alignment = centerAlignment;
      });
      sheet.eachRow(row => {
        row.eachCell(cell => {
          cell.border = borderStyle;
          if (cell.col === 1 || cell.col === 4 || cell.col === 5) cell.alignment = centerAlignment;
        });
      });
    };

    // Tab 2: Appium Mobile Tests
    addTestCasesSheet('Appium Mobile Tests', appium.testCases);

    // Tab 3: Selenium Web Tests
    addTestCasesSheet('Selenium Web Tests', selenium.testCases);

    // Helper to add failure sheet
    const addFailuresSheet = (title, failures) => {
      const sheet = workbook.addWorksheet(title);
      sheet.views = [{ showGridLines: true }];
      sheet.columns = [
        { header: 'Failed Test Name', key: 'name', width: 35 },
        { header: 'Failure Reason Description', key: 'reason', width: 75 }
      ];
      failures.forEach(ft => sheet.addRow(ft));
      sheet.getRow(1).eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB71C1C' } };
        cell.font = headerFont;
        cell.alignment = centerAlignment;
      });
      sheet.eachRow(row => {
        row.eachCell(cell => { cell.border = borderStyle; });
      });
    };

    // Tab 4: Appium Failures
    addFailuresSheet('Appium Failures', appium.failedTests);

    // Tab 5: Selenium Failures
    addFailuresSheet('Selenium Failures', selenium.failedTests);

    await workbook.xlsx.writeFile(reportPath);
  }

  // --- HTML Master Dashboard Builder ---
  static generateUnifiedHtml(reportPath, summary, appium, selenium) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (summary.passPercentage / 100) * circumference;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GateGuard Consolidated QA Automation Dashboard</title>
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
      --primary-hover: #4338ca;
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

    /* Module Navigation Tabs */
    .tab-container {
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-family: 'Outfit', sans-serif;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.5rem 1rem;
      transition: all 0.2s;
    }
    .tab-btn.active {
      color: var(--text-main);
      border-bottom: 3px solid var(--primary);
    }

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
    .status-dot.skip { background-color: var(--color-skip); }
    .test-name { font-weight: 600; }
    .test-module { font-size: 0.8rem; background-color: var(--border-color); padding: 0.25rem 0.5rem; border-radius: 4px; color: var(--text-muted); }
    .test-body { padding: 1.5rem; border-top: 1px solid var(--border-color); background-color: rgba(0,0,0,0.2); display: none; }
    .test-item.open .test-body { display: block; }
    .failure-box { border: 1px solid rgba(239, 68, 68, 0.3); background-color: rgba(239, 68, 68, 0.05); border-radius: 8px; padding: 1rem; }
    .stack-trace { background: #000; padding: 1rem; border-radius: 6px; color: #fb7185; font-family: monospace; overflow-x: auto; white-space: pre; margin-top: 0.5rem; }
    
    .download-section {
      background-color: var(--panel-dark);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>GateGuard Master QA Dashboard</h1>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Consolidated Execution Report (Mobile App & Web Suite)</p>
      </div>
      <div class="meta-badges">
        <div class="badge">Last Run: <strong>${summary.date}</strong></div>
        <div class="badge">Appium: <strong>${summary.appiumDevice}</strong></div>
      </div>
    </header>

    <!-- Consolidated Stat Cards -->
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
          <div style="font-size: 1rem; font-weight:600;">Execution Time</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top:0.25rem;">Appium: <strong style="color: var(--text-main);">${summary.appiumDuration}</strong></div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top:0.25rem;">Selenium: <strong style="color: var(--text-main);">${summary.seleniumDuration}</strong></div>
        </div>
      </div>
    </div>

    <!-- Download Excel Block -->
    <div class="download-section">
      <div>
        <h3 style="font-family: 'Outfit', sans-serif; margin-bottom: 0.25rem;">📥 GateGuard Unified Excel Report</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Download the full spreadsheet containing separate sheets for mobile, web, failures, and execution audits.</p>
      </div>
      <a href="GateGuard_QA_Report.xlsx" class="badge" style="background: var(--primary); color: #fff; text-decoration: none; padding: 0.75rem 1.5rem; border: none; cursor: pointer; border-radius: 8px; font-weight: 600;">Download Excel</a>
    </div>

    <!-- Suite Tabs -->
    <div class="tab-container">
      <button class="tab-btn active" onclick="switchSuite('appium', this)">🎟️ Appium Mobile Tests (${appium.testCases.length})</button>
      <button class="tab-btn" onclick="switchSuite('selenium', this)">🌐 Selenium Web Tests (${selenium.testCases.length})</button>
    </div>

    <!-- Appium Suite List -->
    <div id="appium-suite" class="test-list suite-section">
      ${appium.testCases.length === 0 ? '<div style="padding: 2rem; color: var(--text-muted); text-align: center;">No Appium mobile test results compiled yet.</div>' : appium.testCases.map(tc => {
        const fail = appium.failedTests.find(f => f.name === tc.scenario);
        return `
        <div class="test-item">
          <div class="test-header" onclick="this.parentElement.classList.toggle('open')">
            <div class="test-title-area">
              <span class="status-dot ${tc.status.toLowerCase()}"></span>
              <span class="test-name">${tc.scenario}</span>
              <span class="test-module">${tc.module}</span>
            </div>
            <div class="test-meta" style="color: var(--text-muted); font-size: 0.85rem;">
              <span>ID: <strong>${tc.id}</strong></span> |
              <span>Time: <strong>${tc.duration}</strong></span>
            </div>
          </div>
          <div class="test-body">
            ${fail ? `
              <div class="failure-box">
                <div style="color: var(--color-fail); font-weight: 600;">Failure: ${fail.reason}</div>
                ${fail.stackTrace ? `<pre class="stack-trace">${fail.stackTrace}</pre>` : ''}
              </div>
            ` : `<div style="color: var(--color-pass);">All checkpoints resolved successfully on emulator.</div>`}
          </div>
        </div>
        `;
      }).join('')}
    </div>

    <!-- Selenium Suite List -->
    <div id="selenium-suite" class="test-list suite-section" style="display: none;">
      ${selenium.testCases.length === 0 ? '<div style="padding: 2rem; color: var(--text-muted); text-align: center;">No Playwright web test results compiled yet.</div>' : selenium.testCases.map(tc => {
        const fail = selenium.failedTests.find(f => f.name === tc.scenario);
        return `
        <div class="test-item">
          <div class="test-header" onclick="this.parentElement.classList.toggle('open')">
            <div class="test-title-area">
              <span class="status-dot ${tc.status.toLowerCase()}"></span>
              <span class="test-name">${tc.scenario}</span>
              <span class="test-module">${tc.module}</span>
            </div>
            <div class="test-meta" style="color: var(--text-muted); font-size: 0.85rem;">
              <span>ID: <strong>${tc.id}</strong></span> |
              <span>Time: <strong>${tc.duration}</strong></span>
            </div>
          </div>
          <div class="test-body">
            ${fail ? `
              <div class="failure-box">
                <div style="color: var(--color-fail); font-weight: 600;">Failure: ${fail.reason}</div>
                ${fail.stackTrace ? `<pre class="stack-trace">${fail.stackTrace}</pre>` : ''}
              </div>
            ` : `<div style="color: var(--color-pass);">All validation checkpoints resolved successfully in browser.</div>`}
          </div>
        </div>
        `;
      }).join('')}
    </div>

  </div>

  <script>
    function switchSuite(suite, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.querySelectorAll('.suite-section').forEach(s => s.style.display = 'none');
      document.getElementById(suite + '-suite').style.display = 'flex';
    }
  </script>
</body>
</html>`;

    fs.writeFileSync(reportPath, htmlContent, 'utf8');
  }

  // --- Html Sub-report Snapshots Builder ---
  static generateHtmlSnapshot(reportPath, title, data) {
    const summary = data.summary || {};
    const testCases = data.testCases || [];
    const failedTests = data.failedTests || [];

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - ((summary.passPercentage || 0) / 100) * circumference;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
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
    body { font-family: 'Inter', sans-serif; background-color: var(--bg-dark); color: var(--text-main); padding: 2rem; }
    .container { max-width: 1400px; margin: 0 auto; }
    header { padding-bottom: 2rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2rem; }
    header h1 { font-family: 'Outfit', sans-serif; font-size: 2.2rem; background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .dashboard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
    .card { background-color: var(--panel-dark); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem; }
    .card-title { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem; }
    .card-val { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 800; }
    .test-list { display: flex; flex-direction: column; gap: 1rem; }
    .test-item { background-color: var(--panel-dark); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; }
    .test-header { padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 0.75rem; }
    .status-dot.pass { background-color: var(--color-pass); }
    .status-dot.fail { background-color: var(--color-fail); }
    .status-dot.skip { background-color: var(--color-skip); }
    .test-name { font-weight: 600; }
    .test-body { padding: 1.5rem; border-top: 1px solid var(--border-color); background-color: rgba(0,0,0,0.2); display: none; }
    .test-item.open .test-body { display: block; }
    .failure-box { border: 1px solid rgba(239, 68, 68, 0.3); background-color: rgba(239, 68, 68, 0.05); padding: 1rem; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${title}</h1>
      <p style="color: var(--text-muted); margin-top: 0.25rem;">Date: ${summary.date || new Date().toLocaleString()}</p>
    </header>
    <div class="dashboard-grid">
      <div class="card"><div class="card-title">Total</div><div class="card-val">${summary.total || 0}</div></div>
      <div class="card" style="border-left: 4px solid var(--color-pass);"><div class="card-title">Passed</div><div class="card-val" style="color: var(--color-pass);">${summary.passed || 0}</div></div>
      <div class="card" style="border-left: 4px solid var(--color-fail);"><div class="card-title">Failed</div><div class="card-val" style="color: var(--color-fail);">${summary.failed || 0}</div></div>
      <div class="card"><div class="card-title">Pass Rate</div><div class="card-val">${summary.passPercentage || 0}%</div></div>
    </div>
    <div class="test-list">
      ${testCases.map(tc => {
        const fail = failedTests.find(f => f.name === tc.scenario);
        return `
        <div class="test-item">
          <div class="test-header" onclick="this.parentElement.classList.toggle('open')">
            <div>
              <span class="status-dot ${tc.status.toLowerCase()}"></span>
              <span class="test-name">${tc.scenario}</span>
            </div>
            <div style="color: var(--text-muted); font-size: 0.85rem;">ID: ${tc.id}</div>
          </div>
          <div class="test-body">
            ${fail ? `
              <div class="failure-box">
                <div style="color: var(--color-fail); font-weight: 600;">Failure: ${fail.reason}</div>
              </div>
            ` : `<div style="color: var(--color-pass);">Success.</div>`}
          </div>
        </div>
        `;
      }).join('')}
    </div>
  </div>
</body>
</html>`;

    fs.writeFileSync(reportPath, htmlContent, 'utf8');
  }
}

module.exports = UnifiedReporter;
