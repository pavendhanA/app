const fs = require('fs');
const path = require('path');
const logger = require('./Logger');

class HtmlReporter {
  /**
   * Generates a premium standalone dark-mode HTML report.
   */
  static async generateReport(reportPath, data) {
    const summary = data.summary || {};
    const testCases = data.testCases || [];
    const failedTests = data.failedTests || [];
    const executionLogs = data.executionLogs || [];

    const passedCount = summary.passed || 0;
    const failedCount = summary.failed || 0;
    const skippedCount = summary.skipped || 0;
    const totalCount = summary.total || 0;
    const passPercentage = summary.passPercentage || 0;

    // SVG Circle gauge properties
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (passPercentage / 100) * circumference;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E2E Automation Report</title>
  <!-- Google Fonts Outfit & Inter -->
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

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      padding: 2rem;
      line-height: 1.6;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

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

    .meta-badges {
      display: flex;
      gap: 1rem;
    }

    .badge {
      background: var(--panel-dark);
      border: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-muted);
    }
    
    .badge strong {
      color: var(--text-main);
    }

    /* Dashboard Grid */
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
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }

    .card.pass::before { background-color: var(--color-pass); }
    .card.fail::before { background-color: var(--color-fail); }
    .card.skip::before { background-color: var(--color-skip); }
    .card.neutral::before { background-color: var(--primary); }

    .card-title {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .card-val {
      font-family: 'Outfit', sans-serif;
      font-size: 3rem;
      font-weight: 800;
      line-height: 1;
    }

    .card-footer {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 1rem;
    }

    /* Gauge Chart Card */
    .chart-card {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      padding: 1.5rem;
    }

    .gauge-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .gauge-svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }

    .gauge-bg {
      fill: none;
      stroke: var(--border-color);
      stroke-width: 10;
    }

    .gauge-progress {
      fill: none;
      stroke: var(--color-pass);
      stroke-width: 10;
      stroke-linecap: round;
      stroke-dasharray: ${circumference};
      stroke-dashoffset: ${strokeDashoffset};
      transition: stroke-dashoffset 1s ease-out;
    }

    .gauge-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .gauge-percent {
      font-family: 'Outfit', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .gauge-label {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    /* Controls & Filter Buttons */
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .filter-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .btn {
      background-color: var(--panel-dark);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn:hover {
      background-color: var(--border-color);
    }

    .btn.active {
      background-color: var(--primary);
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }

    .btn-pass.active { background-color: var(--color-pass); border-color: var(--color-pass); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); }
    .btn-fail.active { background-color: var(--color-fail); border-color: var(--color-fail); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); }

    /* Test List Accordion */
    .test-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 3rem;
    }

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
      user-select: none;
      transition: background 0.2s;
    }

    .test-header:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }

    .test-title-area {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .status-dot.pass { background-color: var(--color-pass); box-shadow: 0 0 8px var(--color-pass); }
    .status-dot.fail { background-color: var(--color-fail); box-shadow: 0 0 8px var(--color-fail); }
    .status-dot.skip { background-color: var(--color-skip); box-shadow: 0 0 8px var(--color-skip); }

    .test-name {
      font-weight: 600;
      font-size: 1rem;
    }

    .test-module {
      font-size: 0.8rem;
      background-color: var(--border-color);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      color: var(--text-muted);
    }

    .test-meta {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .test-body {
      padding: 1.5rem;
      border-top: 1px solid var(--border-color);
      background-color: rgba(0, 0, 0, 0.2);
      display: none;
    }

    .test-item.open .test-body {
      display: block;
    }

    /* Failure Analysis */
    .failure-box {
      border: 1px solid rgba(239, 68, 68, 0.3);
      background-color: rgba(239, 68, 68, 0.05);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .failure-reason {
      color: var(--color-fail);
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-family: monospace;
    }

    .stack-trace {
      background: #000;
      padding: 1rem;
      border-radius: 6px;
      color: #fb7185;
      font-family: monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      white-space: pre;
    }

    .screenshot-preview {
      margin-top: 1.5rem;
    }

    .screenshot-preview h4 {
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
      color: var(--text-muted);
    }

    .screenshot-img {
      max-width: 320px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      cursor: zoom-in;
      transition: transform 0.2s;
    }

    .screenshot-img:hover {
      transform: scale(1.02);
    }

    /* Logs Audit Table */
    .logs-section {
      background-color: var(--panel-dark);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .logs-section h2 {
      font-family: 'Outfit', sans-serif;
      margin-bottom: 1.25rem;
      font-size: 1.5rem;
    }

    .logs-table-wrapper {
      max-height: 500px;
      overflow-y: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
      text-align: left;
    }

    th {
      background-color: rgba(0, 0, 0, 0.3);
      color: var(--text-muted);
      padding: 0.75rem 1rem;
      font-weight: 600;
      position: sticky;
      top: 0;
    }

    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    tr:hover td {
      background-color: rgba(255, 255, 255, 0.01);
    }

    .log-time {
      font-family: monospace;
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    .log-pass { color: var(--color-pass); font-weight: 600; }
    .log-fail { color: var(--color-fail); font-weight: 600; }

    /* Modal Styles */
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
    }

    .modal-content {
      max-width: 90%;
      max-height: 90%;
      border-radius: 8px;
    }

    .close-modal {
      position: absolute;
      top: 20px;
      right: 30px;
      color: #fff;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <div>
        <h1>Test Automation Report</h1>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.25rem;">Flutter & Android E2E Execution Dashboard</p>
      </div>
      <div class="meta-badges">
        <div class="badge">Date: <strong>${summary.date || new Date().toLocaleString()}</strong></div>
        <div class="badge">OS: <strong>Android ${summary.androidVersion || 'N/A'}</strong></div>
      </div>
    </header>

    <!-- Dashboard Stat Cards -->
    <div class="dashboard-grid">
      <div class="card pass">
        <div class="card-title">Passed</div>
        <div class="card-val" style="color: var(--color-pass);">${passedCount}</div>
        <div class="card-footer">Test scenarios successful</div>
      </div>

      <div class="card fail">
        <div class="card-title">Failed</div>
        <div class="card-val" style="color: var(--color-fail);">${failedCount}</div>
        <div class="card-footer">Test scenarios failed</div>
      </div>

      <div class="card skip">
        <div class="card-title">Skipped</div>
        <div class="card-val" style="color: var(--color-skip);">${skippedCount}</div>
        <div class="card-footer">Test scenarios bypassed</div>
      </div>

      <div class="card neutral chart-card">
        <div class="gauge-wrapper">
          <svg class="gauge-svg" viewBox="0 0 120 120">
            <circle class="gauge-bg" cx="60" cy="60" r="50"></circle>
            <circle class="gauge-progress" cx="60" cy="60" r="50"></circle>
          </svg>
          <div class="gauge-text">
            <div class="gauge-percent">${passPercentage}%</div>
            <div class="gauge-label">Pass Rate</div>
          </div>
        </div>
        <div style="flex: 1; margin-left: 1.5rem;">
          <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem;">Device Details</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Name: <strong style="color: var(--text-main);">${summary.deviceName || 'Emulator'}</strong></div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Duration: <strong style="color: var(--text-main);">${summary.duration || '0s'}</strong></div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem;">E2E Scenarios</h2>
      <div class="filter-buttons">
        <button class="btn active" onclick="filterTests('all')">All (${totalCount})</button>
        <button class="btn btn-pass" onclick="filterTests('PASS')">Passed (${passedCount})</button>
        <button class="btn btn-fail" onclick="filterTests('FAIL')">Failed (${failedCount})</button>
        <button class="btn" onclick="filterTests('SKIP')">Skipped (${skippedCount})</button>
      </div>
    </div>

    <!-- Accordion Test List -->
    <div class="test-list" id="testList">
      ${testCases.map((tc, idx) => {
        const failureDetails = failedTests.find(f => f.name === tc.scenario);
        return `
        <div class="test-item" data-status="${tc.status}">
          <div class="test-header" onclick="toggleAccordion(this)">
            <div class="test-title-area">
              <span class="status-dot ${tc.status.toLowerCase()}"></span>
              <span class="test-name">${tc.scenario}</span>
              <span class="test-module">${tc.module}</span>
            </div>
            <div class="test-meta">
              <span>Duration: <strong>${tc.duration}</strong></span>
              <span>ID: <strong>${tc.id}</strong></span>
              <span>&#9662;</span>
            </div>
          </div>
          <div class="test-body">
            ${failureDetails ? `
              <div class="failure-box">
                <div class="failure-reason">Failure: ${escapeHtml(failureDetails.reason)}</div>
                ${failureDetails.stackTrace ? `<pre class="stack-trace">${escapeHtml(failureDetails.stackTrace)}</pre>` : ''}
              </div>
              ${failureDetails.screenshotPath ? `
                <div class="screenshot-preview">
                  <h4>Screenshot Capture</h4>
                  <img class="screenshot-img" src="${getRelativeScreenshotPath(reportPath, failureDetails.screenshotPath)}" alt="Failure screenshot" onclick="openModal(this.src)">
                </div>
              ` : ''}
            ` : `
              <div style="color: var(--color-pass); font-weight: 500;">Test executed successfully. All steps passed.</div>
            `}
          </div>
        </div>
        `;
      }).join('')}
    </div>

    <!-- Execution Logs -->
    <div class="logs-section">
      <h2>Audit Logs</h2>
      <div class="logs-table-wrapper">
        <table>
          <thead>
            <tr>
              <th style="width: 20%;">Timestamp</th>
              <th style="width: 20%;">Test Name</th>
              <th style="width: 35%;">Step</th>
              <th style="width: 10%;">Result</th>
              <th style="width: 15%;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${executionLogs.map(log => `
              <tr>
                <td class="log-time">${new Date(log.timestamp).toLocaleTimeString()}</td>
                <td>${log.testName}</td>
                <td>${log.step}</td>
                <td class="${log.result === 'PASS' ? 'log-pass' : 'log-fail'}">${log.result}</td>
                <td style="color: var(--text-muted);">${log.remarks || ''}</td>
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
    function toggleAccordion(header) {
      const item = header.parentElement;
      item.classList.toggle('open');
      const arrow = header.querySelector('.test-meta span:last-child');
      if (item.classList.contains('open')) {
        arrow.innerHTML = '&#9652;';
      } else {
        arrow.innerHTML = '&#9662;';
      }
    }

    function filterTests(status) {
      // Manage active state of buttons
      const buttons = document.querySelectorAll('.filter-buttons button');
      buttons.forEach(btn => btn.classList.remove('active'));
      
      const event = window.event;
      if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
      }

      const items = document.querySelectorAll('.test-item');
      items.forEach(item => {
        if (status === 'all' || item.getAttribute('data-status') === status) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
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

    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(reportPath, htmlContent, 'utf8');
    logger.info(`HTML E2E Report created successfully at: ${reportPath}`);
  }
}

// Helpers
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getRelativeScreenshotPath(reportFilePath, screenshotAbsPath) {
  // Translate from absolute screenshot location to relative index.html directory location
  // reportFilePath: reports/index.html
  // screenshotAbsPath: reports/failures/screenshot_xyz.png
  // output: failures/screenshot_xyz.png
  try {
    const reportDir = path.dirname(reportFilePath);
    return path.relative(reportDir, screenshotAbsPath).replace(/\\/g, '/');
  } catch (e) {
    return screenshotAbsPath;
  }
}

module.exports = HtmlReporter;
