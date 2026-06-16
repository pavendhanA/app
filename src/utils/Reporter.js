const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const logger = require('./Logger');

class Reporter {
  /**
   * Generates the four separate Excel reports: Selenium_Report.xlsx, Security_Report.xlsx, Appium_Report.xlsx, Master_Report.xlsx
   * and compiles the consolidated Master HTML dashboard report.
   */
  static async generateReports(payload) {
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const seleniumTests = payload.selenium || [];
    const securityTests = payload.security || [];
    const appiumTests = payload.appium || [];
    const executionLogs = payload.executionLogs || [];

    const selPassed = seleniumTests.filter(t => t.status === 'PASS').length;
    const selFailed = seleniumTests.filter(t => t.status === 'FAIL').length;
    
    const secPassed = securityTests.filter(t => t.status === 'PASS').length;
    const secFailed = securityTests.filter(t => t.status === 'FAIL').length;

    const appPassed = appiumTests.filter(t => t.status === 'PASS').length;
    const appFailed = appiumTests.filter(t => t.status === 'FAIL').length;

    const totalPassed = selPassed + secPassed + appPassed;
    const totalFailed = selFailed + secFailed + appFailed;
    const totalTests = seleniumTests.length + securityTests.length + appiumTests.length;
    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : '0.00';

    const summary = {
      date: new Date().toLocaleString(),
      selenium: { passed: selPassed, failed: selFailed, total: seleniumTests.length },
      security: { passed: secPassed, failed: secFailed, total: securityTests.length },
      appium: { passed: appPassed, failed: appFailed, total: appiumTests.length },
      total: totalTests,
      passed: totalPassed,
      failed: totalFailed,
      successRate: successRate + '%'
    };

    // Helper to generate a report with 4 tabs: Summary, Test Cases, Failed Tests, Execution Logs
    const createTabbedWorkbook = async (filePath, deviceName, deviceVersion, testCases, logs) => {
      const wb = new ExcelJS.Workbook();
      wb.creator = 'Smart Budget v3 QA Reporter';
      wb.created = new Date();

      // Style properties for ExcelJS
      const primaryHeaderFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1B365D' } // Navy Blue matching the screenshot header
      };
      const headerFont = {
        name: 'Arial',
        size: 11,
        bold: true,
        color: { argb: 'FFFFFFFF' }
      };
      const centerAlignment = { vertical: 'middle', horizontal: 'center' };
      const leftAlignment = { vertical: 'middle', horizontal: 'left' };
      const borderStyle = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
      };

      // 1. Summary tab
      const summarySheet = wb.addWorksheet('Summary');
      summarySheet.views = [{ showGridLines: true }];
      summarySheet.getColumn('A').width = 25;
      summarySheet.getColumn('B').width = 30;

      summarySheet.getCell('A1').value = 'Metric';
      summarySheet.getCell('B1').value = 'Value';

      const total = testCases.length;
      const passed = testCases.filter(tc => tc.status === 'PASS').length;
      const failed = testCases.filter(tc => tc.status === 'FAIL').length;
      const skipped = testCases.filter(tc => tc.status === 'SKIP').length;
      const passPercent = total > 0 ? Math.round((passed / total) * 100) + '%' : '0%';
      const durationSum = testCases.reduce((sum, tc) => sum + parseFloat(tc.duration || 0), 0).toFixed(2) + 's';

      const overviewRows = [
        { m: 'Execution Date', v: new Date().toLocaleString() },
        { m: 'Device Name', v: deviceName },
        { m: 'Android Version', v: deviceVersion },
        { m: 'Total Tests', v: total },
        { m: 'Passed', v: passed },
        { m: 'Failed', v: failed },
        { m: 'Skipped', v: skipped },
        { m: 'Pass Percentage', v: passPercent },
        { m: 'Duration', v: durationSum }
      ];

      overviewRows.forEach((row, i) => {
        const rowIdx = i + 2;
        summarySheet.getCell(`A${rowIdx}`).value = row.m;
        summarySheet.getCell(`B${rowIdx}`).value = row.v;
      });

      // Style Summary Sheet Header
      summarySheet.getCell('A1').fill = primaryHeaderFill;
      summarySheet.getCell('A1').font = headerFont;
      summarySheet.getCell('A1').alignment = centerAlignment;
      summarySheet.getCell('B1').fill = primaryHeaderFill;
      summarySheet.getCell('B1').font = headerFont;
      summarySheet.getCell('B1').alignment = centerAlignment;

      for (let i = 0; i < overviewRows.length; i++) {
        const rIdx = i + 2;
        const cellA = summarySheet.getCell(`A${rIdx}`);
        const cellB = summarySheet.getCell(`B${rIdx}`);

        cellA.font = { name: 'Arial', size: 10, bold: true };
        cellB.font = { name: 'Arial', size: 10 };
        cellA.border = borderStyle;
        cellB.border = borderStyle;
        cellA.alignment = leftAlignment;
        cellB.alignment = leftAlignment;

        if (overviewRows[i].m === 'Pass Percentage') {
          if (passed === total) {
            cellB.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF137333' } }; // Bold green
          } else {
            cellB.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFC5221F' } }; // Bold red
          }
        }
      }

      // 2. Test Cases tab
      const tcSheet = wb.addWorksheet('Test Cases');
      tcSheet.views = [{ showGridLines: true }];
      tcSheet.columns = [
        { header: 'Test Case ID', key: 'id', width: 15 },
        { header: 'Module', key: 'module', width: 18 },
        { header: 'Description', key: 'desc', width: 45 },
        { header: 'Expected Result', key: 'expected', width: 45 },
        { header: 'Actual Result', key: 'actual', width: 45 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Execution Time', key: 'duration', width: 16 }
      ];

      testCases.forEach(tc => {
        tcSheet.addRow(tc);
      });

      tcSheet.getRow(1).eachCell(cell => {
        cell.fill = primaryHeaderFill;
        cell.font = headerFont;
        cell.alignment = centerAlignment;
      });

      tcSheet.eachRow((row, rNumber) => {
        if (rNumber === 1) return;
        row.eachCell(cell => {
          cell.border = borderStyle;
          cell.font = { name: 'Arial', size: 10 };
          if (cell.col === 1 || cell.col === 6 || cell.col === 7) {
            cell.alignment = centerAlignment;
          } else {
            cell.alignment = leftAlignment;
          }
        });

        const statusVal = row.getCell(6).value;
        if (statusVal === 'PASS') {
          row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F4EA' } };
          row.getCell(6).font = { name: 'Arial', size: 10, color: { argb: 'FF137333' }, bold: true };
        } else if (statusVal === 'FAIL') {
          row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE8E6' } };
          row.getCell(6).font = { name: 'Arial', size: 10, color: { argb: 'FFC5221F' }, bold: true };
        }
      });

      // 3. Failed Tests tab
      const failedSheet = wb.addWorksheet('Failed Tests');
      failedSheet.views = [{ showGridLines: true }];
      failedSheet.columns = [
        { header: 'Test Case ID', key: 'id', width: 15 },
        { header: 'Module', key: 'module', width: 18 },
        { header: 'Description', key: 'desc', width: 45 },
        { header: 'Failure Message', key: 'failureMessage', width: 50 },
        { header: 'Stack Trace', key: 'stackTrace', width: 60 }
      ];

      const failedTests = testCases.filter(tc => tc.status === 'FAIL');
      if (failedTests.length === 0) {
        failedSheet.addRow({
          id: 'N/A',
          module: 'N/A',
          desc: 'All tests passed successfully.',
          failureMessage: 'No failure recorded',
          stackTrace: 'N/A'
        });
      } else {
        failedTests.forEach(ft => {
          const match = (global.failedTestsList || []).find(f => f.id === ft.id);
          failedSheet.addRow({
            id: ft.id,
            module: ft.module,
            desc: ft.desc,
            failureMessage: ft.actual || 'Execution failed',
            stackTrace: match ? match.stackTrace : 'N/A'
          });
        });
      }

      failedSheet.getRow(1).eachCell(cell => {
        cell.fill = primaryHeaderFill;
        cell.font = headerFont;
        cell.alignment = centerAlignment;
      });

      failedSheet.eachRow((row, rNumber) => {
        if (rNumber === 1) return;
        row.eachCell(cell => {
          cell.border = borderStyle;
          cell.font = { name: 'Arial', size: 10 };
          if (cell.col === 1) {
            cell.alignment = centerAlignment;
          } else {
            cell.alignment = leftAlignment;
          }
        });
      });

      // 4. Execution Logs tab
      const logSheet = wb.addWorksheet('Execution Logs');
      logSheet.views = [{ showGridLines: true }];
      logSheet.columns = [
        { header: 'Timestamp', key: 'timestamp', width: 22 },
        { header: 'Test Module / Page Object', key: 'testName', width: 28 },
        { header: 'Action Step / Details', key: 'step', width: 50 },
        { header: 'Status', key: 'result', width: 12 },
        { header: 'Remarks', key: 'remarks', width: 30 }
      ];

      logs.forEach(log => {
        logSheet.addRow({
          timestamp: new Date(log.timestamp).toLocaleString(),
          testName: log.testName,
          step: log.step,
          result: log.result,
          remarks: log.remarks || ''
        });
      });

      logSheet.getRow(1).eachCell(cell => {
        cell.fill = primaryHeaderFill;
        cell.font = headerFont;
        cell.alignment = centerAlignment;
      });

      logSheet.eachRow((row, rNumber) => {
        if (rNumber === 1) return;
        row.eachCell(cell => {
          cell.border = borderStyle;
          cell.font = { name: 'Arial', size: 10 };
          if (cell.col === 1 || cell.col === 4) {
            cell.alignment = centerAlignment;
          } else {
            cell.alignment = leftAlignment;
          }
        });

        const statusVal = row.getCell(4).value;
        if (statusVal === 'PASS') {
          row.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F4EA' } };
          row.getCell(4).font = { name: 'Arial', size: 10, color: { argb: 'FF137333' }, bold: true };
        } else if (statusVal === 'FAIL') {
          row.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE8E6' } };
          row.getCell(4).font = { name: 'Arial', size: 10, color: { argb: 'FFC5221F' }, bold: true };
        }
      });

      await wb.xlsx.writeFile(filePath);
      logger.info(`Excel Report saved successfully at: ${filePath}`);
    };

    // 1. Generate Selenium_Report.xlsx
    await createTabbedWorkbook(
      path.join(reportDir, 'Selenium_Report.xlsx'),
      'Chrome Browser',
      'N/A',
      seleniumTests,
      executionLogs.filter(log => log.suite === 'selenium')
    );

    // 2. Generate Security_Report.xlsx
    await createTabbedWorkbook(
      path.join(reportDir, 'Security_Report.xlsx'),
      'Security Vulnerability Scanner',
      'N/A',
      securityTests,
      executionLogs.filter(log => log.suite === 'security')
    );

    // 3. Generate Appium_Report.xlsx
    await createTabbedWorkbook(
      path.join(reportDir, 'Appium_Report.xlsx'),
      'Android Device',
      '14.0',
      appiumTests,
      executionLogs.filter(log => log.suite === 'appium')
    );

    // 4. Generate Master_Report.xlsx
    await createTabbedWorkbook(
      path.join(reportDir, 'Master_Report.xlsx'),
      'Consolidated QA System',
      'N/A',
      [...seleniumTests, ...securityTests, ...appiumTests],
      executionLogs
    );

    // 5. Generate Master HTML Dashboard
    const htmlPath = path.join(reportDir, 'index.html');
    const allTests = [...seleniumTests, ...securityTests, ...appiumTests];
    const failedCases = allTests.filter(t => t.status === 'FAIL');

    // SVG dash offset for circular gauge
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const passPercentageVal = parseFloat(successRate);
    const strokeDashoffset = circumference - (passPercentageVal / 100) * circumference;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Budget v3 Consolidated QA Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #070913;
      --panel-dark: #0f122c;
      --border-color: rgba(99, 102, 241, 0.15);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --color-pass: #10b981;
      --color-fail: #ef4444;
      --color-upcoming: #f59e0b;
      --primary: #6366f1;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-dark);
      background-image: radial-gradient(circle at 50% 50%, #0d122e 0%, #05060b 100%);
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
      background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%);
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
      grid-template-columns: repeat(4, 1fr);
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
      min-height: 140px;
    }
    .card.pass { border-left: 4px solid var(--color-pass); }
    .card.fail { border-left: 4px solid var(--color-fail); }
    .card-title { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
    .card-val { font-family: 'Outfit', sans-serif; font-size: 3rem; font-weight: 800; }
    .card-footer { font-size: 0.8rem; color: var(--text-muted); }
    .gauge-wrapper { position: relative; width: 100px; height: 100px; }
    .gauge-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    .gauge-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 10; }
    .gauge-progress {
      fill: none;
      stroke: var(--color-pass);
      stroke-width: 10;
      stroke-linecap: round;
      stroke-dasharray: ${circumference};
      stroke-dashoffset: ${strokeDashoffset};
    }
    .gauge-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
    .gauge-percent { font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; }
    .gauge-label { font-size: 0.65rem; color: var(--text-muted); }
    
    .download-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    .download-btn {
      background: var(--panel-dark);
      border: 1px solid var(--border-color);
      padding: 1rem;
      border-radius: 12px;
      color: var(--text-main);
      text-decoration: none;
      text-align: center;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .download-btn:hover {
      background: rgba(99, 102, 241, 0.1);
      border-color: var(--primary);
    }
    .download-btn span {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 400;
    }

    .tab-container {
      margin-bottom: 1.5rem;
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.5rem 1.25rem;
      transition: all 0.2s;
    }
    .tab-btn.active {
      color: var(--text-main);
      border-bottom: 3px solid var(--primary);
    }

    .test-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 3rem; }
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
    .test-title-area { display: flex; align-items: center; gap: 0.75rem; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .status-dot.pass { background-color: var(--color-pass); box-shadow: 0 0 6px var(--color-pass); }
    .status-dot.fail { background-color: var(--color-fail); box-shadow: 0 0 6px var(--color-fail); }
    .test-name { font-weight: 600; font-size: 0.95rem; }
    .test-module { font-size: 0.8rem; background-color: rgba(99,102,241,0.1); border: 1px solid var(--border-color); padding: 0.2rem 0.5rem; border-radius: 4px; color: #a5b4fc; }
    .test-body { padding: 1.5rem; border-top: 1px solid var(--border-color); background-color: rgba(0,0,0,0.25); display: none; }
    .test-item.open .test-body { display: block; }
    .failure-box { border: 1px solid rgba(239, 68, 68, 0.3); background-color: rgba(239, 68, 68, 0.05); border-radius: 8px; padding: 1rem; }
    .stack-trace { background: #000; padding: 1rem; border-radius: 6px; color: #fb7185; font-family: monospace; overflow-x: auto; white-space: pre; margin-top: 0.5rem; font-size: 0.85rem; }
    
    .screenshot-img {
      max-width: 320px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      cursor: zoom-in;
      transition: transform 0.2s;
      margin-top: 1rem;
    }
    .screenshot-img:hover {
      transform: scale(1.02);
    }

    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.9);
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(8px);
    }
    .modal-content { max-width: 90%; max-height: 90%; border-radius: 8px; border: 2px solid var(--border-color); }
    .close-modal { position: absolute; top: 20px; right: 30px; color: #fff; font-size: 40px; font-weight: bold; cursor: pointer; }

    /* Audit table */
    .audit-section {
      background-color: var(--panel-dark);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.5rem;
    }
    .audit-table-wrapper { max-height: 400px; overflow-y: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
    th { background: rgba(0,0,0,0.4); padding: 0.75rem 1rem; color: var(--text-muted); font-weight: 600; position: sticky; top: 0; border-bottom: 2px solid var(--border-color); }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); }
    .log-pass { color: var(--color-pass); font-weight: 600; }
    .log-fail { color: var(--color-fail); font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>Smart Budget v3 Consolidated QA Dashboard</h1>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.25rem;">Automated Execution Metrics (Selenium E2E, Vulnerability Scans & Appium Mobile)</p>
      </div>
      <div class="meta-badges">
        <div class="badge">Run Timestamp: <strong>${summary.date}</strong></div>
        <div class="badge">Overall Success: <strong>${summary.successRate}</strong></div>
      </div>
    </header>

    <!-- Consolidated Stat Cards -->
    <div class="dashboard-grid">
      <div class="card pass">
        <div class="card-title">Passed Cases</div>
        <div class="card-val" style="color: var(--color-pass);">${summary.passed}</div>
        <div class="card-footer">Verification cases resolved green</div>
      </div>
      <div class="card fail">
        <div class="card-title">Failed Cases</div>
        <div class="card-val" style="color: var(--color-fail);">${summary.failed}</div>
        <div class="card-footer">Intentionally triggered failures</div>
      </div>
      <div class="card">
        <div class="card-title">Total Execution</div>
        <div class="card-val">${summary.total}</div>
        <div class="card-footer">Across all 3 E2E test suites</div>
      </div>
      <div class="card" style="flex-direction: row; align-items: center; justify-content: space-around;">
        <div class="gauge-wrapper">
          <svg class="gauge-svg" viewBox="0 0 120 120">
            <circle class="gauge-bg" cx="60" cy="60" r="50"></circle>
            <circle class="gauge-progress" cx="60" cy="60" r="50"></circle>
          </svg>
          <div class="gauge-text">
            <div class="gauge-percent">${summary.successRate}</div>
            <div class="gauge-label">Pass Rate</div>
          </div>
        </div>
        <div>
          <div style="font-size:0.85rem; color:var(--text-muted);">Selenium: <strong style="color:var(--text-main);">${summary.selenium.passed}/${summary.selenium.total}</strong></div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.2rem;">Security: <strong style="color:var(--text-main);">${summary.security.passed}/${summary.security.total}</strong></div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.2rem;">Appium: <strong style="color:var(--text-main);">${summary.appium.passed}/${summary.appium.total}</strong></div>
        </div>
      </div>
    </div>

    <!-- Download Buttons -->
    <div class="download-grid">
      <a href="Selenium_Report.xlsx" class="download-btn">
        📥 Selenium_Report.xlsx
        <span>Web test results logs spreadsheet</span>
      </a>
      <a href="Security_Report.xlsx" class="download-btn">
        📥 Security_Report.xlsx
        <span>Security checks log spreadsheet</span>
      </a>
      <a href="Appium_Report.xlsx" class="download-btn">
        📥 Appium_Report.xlsx
        <span>Mobile emulation logs spreadsheet</span>
      </a>
      <a href="Master_Report.xlsx" class="download-btn" style="border-color: var(--primary);">
        📥 Master_Report.xlsx
        <span>Consolidated overview summary spreadsheet</span>
      </a>
    </div>

    <!-- Suite Tabs -->
    <div class="tab-container">
      <button class="tab-btn active" onclick="switchSuite('selenium', this)">🌐 Selenium Web E2E (${seleniumTests.length})</button>
      <button class="tab-btn" onclick="switchSuite('security', this)">🛡️ Vulnerability Testing (${securityTests.length})</button>
      <button class="tab-btn" onclick="switchSuite('appium', this)">📱 Appium Mobile E2E (${appiumTests.length})</button>
    </div>

    <!-- Selenium Test List -->
    <div id="selenium-suite" class="test-list suite-section">
      ${this.generateTestListHtml(seleniumTests, failedCases)}
    </div>

    <!-- Security Test List -->
    <div id="security-suite" class="test-list suite-section" style="display:none;">
      ${this.generateTestListHtml(securityTests, failedCases)}
    </div>

    <!-- Appium Test List -->
    <div id="appium-suite" class="test-list suite-section" style="display:none;">
      ${this.generateTestListHtml(appiumTests, failedCases)}
    </div>

    <!-- Execution Logs -->
    <div class="audit-section">
      <h3 style="font-family:'Outfit', sans-serif; margin-bottom:1rem;">Runner Execution Audit Logs</h3>
      <div class="audit-table-wrapper">
        <table>
          <thead>
            <tr>
              <th style="width: 25%;">Timestamp</th>
              <th style="width: 25%;">Test Case ID / Name</th>
              <th style="width: 40%;">Action details</th>
              <th style="width: 10%;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${executionLogs.map(log => `
              <tr>
                <td style="font-family:monospace; color:var(--text-muted);">${new Date(log.timestamp).toLocaleTimeString()}</td>
                <td><strong>${log.testId || ''}</strong> ${log.testName}</td>
                <td>${log.step}</td>
                <td class="${log.result === 'PASS' ? 'log-pass' : 'log-fail'}">${log.result}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal for full screenshot -->
  <div class="modal" id="imageModal" onclick="closeModal()">
    <span class="close-modal">&times;</span>
    <img class="modal-content" id="modalImg">
  </div>

  <script>
    function switchSuite(suite, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.querySelectorAll('.suite-section').forEach(s => s.style.display = 'none');
      document.getElementById(suite + '-suite').style.display = 'flex';
    }

    function toggleAccordion(header) {
      const item = header.parentElement;
      item.classList.toggle('open');
    }

    function openModal(src) {
      document.getElementById('imageModal').style.display = 'flex';
      document.getElementById('modalImg').src = src;
      event.stopPropagation();
    }

    function closeModal() {
      document.getElementById('imageModal').style.display = 'none';
    }
  </script>
</body>
</html>`;

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    logger.info(`Master HTML Report created successfully at: ${htmlPath}`);
  }

  // HTML Generator Helper for Accordion Tests
  static generateTestListHtml(testCases, failedCases) {
    if (testCases.length === 0) {
      return '<div style="padding: 2rem; color: var(--text-muted); text-align: center;">No test cases logged for this suite.</div>';
    }

    return testCases.map(tc => {
      const fail = failedCases.find(f => f.id === tc.id || f.scenario === tc.desc);
      return `
      <div class="test-item">
        <div class="test-header" onclick="toggleAccordion(this)">
          <div class="test-title-area">
            <span class="status-dot ${tc.status.toLowerCase()}"></span>
            <span class="test-name">${tc.id}: ${this.escapeHtml(tc.desc)}</span>
            <span class="test-module">${tc.module}</span>
          </div>
          <div style="color: var(--text-muted); font-size: 0.85rem; display:flex; gap:1.5rem; align-items:center;">
            <span>Time: <strong>${tc.duration}</strong></span>
            <span>&#9662;</span>
          </div>
        </div>
        <div class="test-body">
          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem; font-size:0.9rem;">
            <div><strong>Expected:</strong> ${this.escapeHtml(tc.expected)}</div>
            <div><strong>Actual:</strong> ${this.escapeHtml(tc.actual)}</div>
          </div>
          ${fail ? `
            <div class="failure-box">
              <div style="color: var(--color-fail); font-weight: 600;">Failure message: ${this.escapeHtml(fail.reason || fail.actual)}</div>
              ${fail.stackTrace ? `<pre class="stack-trace">${this.escapeHtml(fail.stackTrace)}</pre>` : ''}
              ${fail.screenshotPath ? `
                <div style="margin-top:1rem;">
                  <h4 style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.25rem;">Captured Screenshot</h4>
                  <img class="screenshot-img" src="${this.getRelativeScreenshotPath(fail.screenshotPath)}" alt="Failure Screen Capture" onclick="openModal(this.src)">
                </div>
              ` : ''}
            </div>
          ` : `
            <div style="color: var(--color-pass); font-weight: 500;">Test executed successfully. All checkpoints resolved green.</div>
          `}
        </div>
      </div>
      `;
    }).join('');
  }

  // Helpers
  static escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  static getRelativeScreenshotPath(screenshotAbsPath) {
    try {
      return path.relative(path.join(process.cwd(), 'reports'), screenshotAbsPath).replace(/\\/g, '/');
    } catch (e) {
      return screenshotAbsPath;
    }
  }
}

module.exports = Reporter;
