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

    // Summary calculations
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

    // Summary block structure
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

    // Styling properties for ExcelJS
    const primaryHeaderFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' } // Dark Slate Blue / Indigo
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
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    };

    // Helper to format status cells
    const applyStatusStyle = (row, colIndex, status) => {
      const cell = row.getCell(colIndex);
      if (status === 'PASS') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F4EA' } }; // Light mint green
        cell.font = { color: { argb: 'FF137333' }, bold: true };
      } else {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE8E6' } }; // Light crimson red
        cell.font = { color: { argb: 'FFC5221F' }, bold: true };
      }
    };

    // Helper to generate a single report spreadsheet
    const createIndividualWorkbook = async (filePath, sheetName, columns, testCases) => {
      const wb = new ExcelJS.Workbook();
      wb.creator = 'Smart Budget v3 QA Reporter';
      wb.created = new Date();

      const sheet = wb.addWorksheet(sheetName);
      sheet.views = [{ showGridLines: true }];
      sheet.columns = columns;

      // Add rows
      testCases.forEach(tc => {
        const row = sheet.addRow(tc);
        applyStatusStyle(row, 6, tc.status);
      });

      // Style header
      sheet.getRow(1).eachCell(cell => {
        cell.fill = primaryHeaderFill;
        cell.font = headerFont;
        cell.alignment = centerAlignment;
      });

      // Style data cells
      sheet.eachRow((row, rowNumber) => {
        row.eachCell(cell => {
          cell.border = borderStyle;
          if (cell.col === 1 || cell.col === 6 || cell.col === 7) {
            cell.alignment = centerAlignment;
          } else {
            cell.alignment = leftAlignment;
          }
        });
      });

      await wb.xlsx.writeFile(filePath);
      logger.info(`Excel Report saved successfully at: ${filePath}`);
    };

    // Columns structure
    const defaultCols = [
      { header: 'Test Case ID', key: 'id', width: 15 },
      { header: 'Module', key: 'module', width: 18 },
      { header: 'Description', key: 'desc', width: 45 },
      { header: 'Expected Result', key: 'expected', width: 45 },
      { header: 'Actual Result', key: 'actual', width: 45 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Execution Time', key: 'duration', width: 16 }
    ];

    // 1. Generate Selenium_Report.xlsx
    await createIndividualWorkbook(
      path.join(reportDir, 'Selenium_Report.xlsx'),
      'Selenium Web E2E',
      defaultCols,
      seleniumTests
    );

    // 2. Generate Security_Report.xlsx
    await createIndividualWorkbook(
      path.join(reportDir, 'Security_Report.xlsx'),
      'Security Vulnerability',
      defaultCols,
      securityTests
    );

    // 3. Generate Appium_Report.xlsx
    await createIndividualWorkbook(
      path.join(reportDir, 'Appium_Report.xlsx'),
      'Appium Mobile E2E',
      defaultCols,
      appiumTests
    );

    // 4. Generate Master_Report.xlsx
    const masterWb = new ExcelJS.Workbook();
    masterWb.creator = 'Smart Budget v3 QA Reporter';
    masterWb.created = new Date();

    // Sheet 4.1: Summary
    const summarySheet = masterWb.addWorksheet('Overview Summary');
    summarySheet.views = [{ showGridLines: true }];
    summarySheet.columns = [
      { header: 'QA Testing Metrics', key: 'metric', width: 28 },
      { header: 'Execution Values / Metrics', key: 'val', width: 32 }
    ];

    const overviewRows = [
      { metric: 'Execution Run Timestamp', val: summary.date },
      { metric: 'Selenium E2E Passed', val: summary.selenium.passed },
      { metric: 'Selenium E2E Failed', val: summary.selenium.failed },
      { metric: 'Security Check Passed', val: summary.security.passed },
      { metric: 'Security Check Failed', val: summary.security.failed },
      { metric: 'Appium Mobile Passed', val: summary.appium.passed },
      { metric: 'Appium Mobile Failed', val: summary.appium.failed },
      { metric: 'Total Executed testCases', val: summary.total },
      { metric: 'Total Execution Passes', val: summary.passed },
      { metric: 'Total Execution Failures', val: summary.failed },
      { metric: 'Overall Success Rate', val: summary.successRate }
    ];
    overviewRows.forEach(row => summarySheet.addRow(row));
    summarySheet.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });
    summarySheet.eachRow((row, rowNumber) => {
      row.eachCell(cell => { cell.border = borderStyle; });
      row.getCell(1).font = { bold: true };
    });

    // Sheet 4.2: Selenium E2E Tests
    const selSheet = masterWb.addWorksheet('Selenium Web Tests');
    selSheet.views = [{ showGridLines: true }];
    selSheet.columns = defaultCols;
    seleniumTests.forEach(tc => {
      const row = selSheet.addRow(tc);
      applyStatusStyle(row, 6, tc.status);
    });
    selSheet.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });
    selSheet.eachRow(row => row.eachCell(cell => {
      cell.border = borderStyle;
      if (cell.col === 1 || cell.col === 6 || cell.col === 7) cell.alignment = centerAlignment;
    }));

    // Sheet 4.3: Security Tests
    const secSheet = masterWb.addWorksheet('Security Tests');
    secSheet.views = [{ showGridLines: true }];
    secSheet.columns = defaultCols;
    securityTests.forEach(tc => {
      const row = secSheet.addRow(tc);
      applyStatusStyle(row, 6, tc.status);
    });
    secSheet.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });
    secSheet.eachRow(row => row.eachCell(cell => {
      cell.border = borderStyle;
      if (cell.col === 1 || cell.col === 6 || cell.col === 7) cell.alignment = centerAlignment;
    }));

    // Sheet 4.4: Appium Mobile Tests
    const appSheet = masterWb.addWorksheet('Appium Mobile Tests');
    appSheet.views = [{ showGridLines: true }];
    appSheet.columns = defaultCols;
    appiumTests.forEach(tc => {
      const row = appSheet.addRow(tc);
      applyStatusStyle(row, 6, tc.status);
    });
    appSheet.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });
    appSheet.eachRow(row => row.eachCell(cell => {
      cell.border = borderStyle;
      if (cell.col === 1 || cell.col === 6 || cell.col === 7) cell.alignment = centerAlignment;
    }));

    const masterPath = path.join(reportDir, 'Master_Report.xlsx');
    await masterWb.xlsx.writeFile(masterPath);
    logger.info(`Excel Master Report saved successfully at: ${masterPath}`);


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
        <h1>Smart Budget v3 consolidated QA Dashboard</h1>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.25rem;">Automated Execution Metrics (Selenium E2E, Vulnerability Scans & Appium Mobile)</p>
      </div>
      <div class="meta-badges">
        <div class="badge">Run Timestamp: <strong>${summary.date}</strong></div>
        <div class="badge">Overall success: <strong>${summary.successRate}</strong></div>
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
