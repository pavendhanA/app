const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const logger = require('./Logger');

class Reporter {
  /**
   * Generates ONLY the Appium Mobile E2E Excel report.
   */
  static async generateReports(payload) {
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const appiumTests = payload.appium || [];
    const executionLogs = payload.executionLogs || [];

    const suites = ['appium'];
    const mergedTests = {
      appium: appiumTests.length > 0 ? appiumTests : []
    };
    let mergedLogs = executionLogs.length > 0 ? [...executionLogs] : [];

    // 1. Write active Appium suite to cache file
    if (appiumTests.length > 0) {
      const cacheTestFile = path.join(reportDir, 'cache_appium_tests.json');
      const cacheLogFile = path.join(reportDir, 'cache_appium_logs.json');
      
      const suiteTests = mergedTests.appium;
      const suiteLogs = mergedLogs.filter(log => log.suite === 'appium');
      
      fs.writeFileSync(cacheTestFile, JSON.stringify(suiteTests, null, 2), 'utf8');
      fs.writeFileSync(cacheLogFile, JSON.stringify(suiteLogs, null, 2), 'utf8');
    }

    // 2. Read Appium cache if it exists and wasn't in current payload
    if (mergedTests.appium.length === 0) {
      const cacheTestFile = path.join(reportDir, 'cache_appium_tests.json');
      const cacheLogFile = path.join(reportDir, 'cache_appium_logs.json');

      if (fs.existsSync(cacheTestFile)) {
        try {
          mergedTests.appium = JSON.parse(fs.readFileSync(cacheTestFile, 'utf8'));
        } catch (e) {
          logger.error(`Failed to parse cache tests for appium: ${e.message}`);
        }
      }
      if (fs.existsSync(cacheLogFile)) {
        try {
          const suiteLogs = JSON.parse(fs.readFileSync(cacheLogFile, 'utf8'));
          const existingTimestamps = new Set(mergedLogs.map(l => l.timestamp + l.step));
          suiteLogs.forEach(l => {
            if (!existingTimestamps.has(l.timestamp + l.step)) {
              mergedLogs.push(l);
            }
          });
        } catch (e) {
          logger.error(`Failed to parse cache logs for appium: ${e.message}`);
        }
      }
    }

    // 3. Sort merged logs chronologically
    mergedLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Helper to generate a report with 4 tabs: Summary, Test Cases, Failed Tests, Execution Logs
    const createTabbedWorkbook = async (filePath, deviceName, deviceVersion, testCases, logs) => {
      const wb = new ExcelJS.Workbook();
      wb.creator = 'Smart Budget v3 QA Reporter';
      wb.created = new Date();

      // Style properties for ExcelJS
      const primaryHeaderFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1B365D' } // Dark Navy Blue matching the screenshot header
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

    // Generate/Update ONLY Appium_Report.xlsx if data exists
    if (mergedTests.appium.length > 0) {
      await createTabbedWorkbook(
        path.join(reportDir, 'Appium_Report.xlsx'),
        'Android Device',
        '14.0',
        mergedTests.appium,
        mergedLogs.filter(log => log.suite === 'appium')
      );
    }
  }
}

module.exports = Reporter;
