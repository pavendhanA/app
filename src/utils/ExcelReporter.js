const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const logger = require('./Logger');

class ExcelReporter {
  /**
   * Generates a stylized excel report containing test statistics, logs, and screenshots references.
   */
  static async generateReport(reportPath, data) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Appium Flutter E2E Framework';
    workbook.created = new Date();

    const summary = data.summary || {};
    const testCases = data.testCases || [];
    const failedTests = data.failedTests || [];
    const executionLogs = data.executionLogs || [];

    // Colors design system
    const primaryHeaderFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1A237E' } // Deep Navy Indigo
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
      top: { style: 'thin', color: { argb: 'FFD6DBDF' } },
      left: { style: 'thin', color: { argb: 'FFD6DBDF' } },
      bottom: { style: 'thin', color: { argb: 'FFD6DBDF' } },
      right: { style: 'thin', color: { argb: 'FFD6DBDF' } }
    };

    // ----------------------------------------------------
    // Sheet 1: Summary
    // ----------------------------------------------------
    const sheet1 = workbook.addWorksheet('Summary');
    sheet1.views = [{ showGridLines: true }];
    sheet1.columns = [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Value', key: 'value', width: 30 }
    ];

    const summaryRows = [
      { metric: 'Execution Date', value: summary.date || new Date().toLocaleString() },
      { metric: 'Device Name', value: summary.deviceName || 'Android Device' },
      { metric: 'Android Version', value: summary.androidVersion || 'N/A' },
      { metric: 'Total Tests', value: summary.total || 0 },
      { metric: 'Passed', value: summary.passed || 0 },
      { metric: 'Failed', value: summary.failed || 0 },
      { metric: 'Skipped', value: summary.skipped || 0 },
      { metric: 'Pass Percentage', value: `${summary.passPercentage || 0}%` },
      { metric: 'Duration', value: summary.duration || '0s' }
    ];

    summaryRows.forEach(row => sheet1.addRow(row));

    // Style summary table
    sheet1.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });

    sheet1.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.getCell(1).font = { bold: true };
        row.getCell(2).alignment = leftAlignment;
      }
      row.eachCell(cell => { cell.border = borderStyle; });
    });

    // ----------------------------------------------------
    // Sheet 2: Test Cases
    // ----------------------------------------------------
    const sheet2 = workbook.addWorksheet('Test Cases');
    sheet2.views = [{ showGridLines: true }];
    sheet2.columns = [
      { header: 'Test ID', key: 'id', width: 12 },
      { header: 'Module', key: 'module', width: 20 },
      { header: 'Scenario', key: 'scenario', width: 45 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Device', key: 'device', width: 20 },
      { header: 'Duration', key: 'duration', width: 15 }
    ];

    testCases.forEach(tc => {
      const row = sheet2.addRow(tc);
      const statusCell = row.getCell('status');
      
      // Highlight status cell
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

    sheet2.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });

    sheet2.eachRow(row => {
      row.eachCell(cell => {
        cell.border = borderStyle;
        if (cell.col === 1 || cell.col === 4 || cell.col === 6) {
          cell.alignment = centerAlignment;
        }
      });
    });

    // ----------------------------------------------------
    // Sheet 3: Failed Tests
    // ----------------------------------------------------
    const sheet3 = workbook.addWorksheet('Failed Tests');
    sheet3.views = [{ showGridLines: true }];
    sheet3.columns = [
      { header: 'Test Name', key: 'name', width: 35 },
      { header: 'Failure Reason', key: 'reason', width: 55 },
      { header: 'Screenshot Path', key: 'screenshotPath', width: 40 },
      { header: 'Device', key: 'device', width: 18 },
      { header: 'Android Version', key: 'androidVersion', width: 15 }
    ];

    failedTests.forEach(ft => sheet3.addRow(ft));

    sheet3.getRow(1).eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB71C1C' } // Warning crimson red for failed headers
      };
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });

    sheet3.eachRow(row => {
      row.eachCell(cell => {
        cell.border = borderStyle;
        if (cell.col === 4 || cell.col === 5) {
          cell.alignment = centerAlignment;
        }
      });
    });

    // ----------------------------------------------------
    // Sheet 4: Execution Logs
    // ----------------------------------------------------
    const sheet4 = workbook.addWorksheet('Execution Logs');
    sheet4.views = [{ showGridLines: true }];
    sheet4.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 26 },
      { header: 'Test Name', key: 'testName', width: 25 },
      { header: 'Step', key: 'step', width: 40 },
      { header: 'Result', key: 'result', width: 12 },
      { header: 'Remarks', key: 'remarks', width: 45 }
    ];

    executionLogs.forEach(logLine => {
      const row = sheet4.addRow(logLine);
      const resCell = row.getCell('result');
      if (logLine.result === 'PASS') {
        resCell.font = { color: { argb: 'FF117A65' }, bold: true };
      } else if (logLine.result === 'FAIL') {
        resCell.font = { color: { argb: 'FFC0392B' }, bold: true };
      }
    });

    sheet4.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });

    sheet4.eachRow(row => {
      row.eachCell(cell => {
        cell.border = borderStyle;
        if (cell.col === 1 || cell.col === 4) {
          cell.alignment = centerAlignment;
        }
      });
    });

    // Write file
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await workbook.xlsx.writeFile(reportPath);
    logger.info(`Excel E2E Report created successfully at: ${reportPath}`);
  }
}

module.exports = ExcelReporter;
