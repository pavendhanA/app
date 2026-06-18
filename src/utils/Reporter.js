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

    const seleniumTests = payload.selenium || [];
    const securityTests = payload.security || [];
    const appiumTests = payload.appium || [];
    const loadTests = payload.load || [];
    const executionLogs = payload.executionLogs || [];

    const suites = ['selenium', 'security', 'appium', 'load'];
    const mergedTests = {
      selenium: seleniumTests,
      security: securityTests,
      appium: appiumTests,
      load: loadTests
    };
    let mergedLogs = executionLogs.length > 0 ? [...executionLogs] : [];

    // 1. Write and read cache for each suite
    for (const suite of suites) {
      const suiteTests = mergedTests[suite];
      if (suiteTests.length > 0) {
        const cacheTestFile = path.join(reportDir, `cache_${suite}_tests.json`);
        const cacheLogFile = path.join(reportDir, `cache_${suite}_logs.json`);
        
        fs.writeFileSync(cacheTestFile, JSON.stringify(suiteTests, null, 2), 'utf8');
        const suiteLogs = mergedLogs.filter(log => log.suite === suite);
        fs.writeFileSync(cacheLogFile, JSON.stringify(suiteLogs, null, 2), 'utf8');
      } else {
        const cacheTestFile = path.join(reportDir, `cache_${suite}_tests.json`);
        const cacheLogFile = path.join(reportDir, `cache_${suite}_logs.json`);

        if (fs.existsSync(cacheTestFile)) {
          try {
            mergedTests[suite] = JSON.parse(fs.readFileSync(cacheTestFile, 'utf8'));
          } catch (e) {
            logger.error(`Failed to parse cache tests for ${suite}: ${e.message}`);
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
            logger.error(`Failed to parse cache logs for ${suite}: ${e.message}`);
          }
        }
      }
    }

    // 2. Sort merged logs chronologically
    mergedLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Helper to generate a report with 4 tabs: Summary, Test Cases, Failed Tests, Execution Logs
    const createTabbedWorkbook = async (filePath, deviceName, deviceVersion, testCases, logs, isLoad = false) => {
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
      if (isLoad) {
        tcSheet.columns = [
          { header: 'Test Case ID', key: 'id', width: 15 },
          { header: 'Module', key: 'module', width: 18 },
          { header: 'Description', key: 'desc', width: 45 },
          { header: 'Load Profile', key: 'profile', width: 15 },
          { header: 'Expected Result', key: 'expected', width: 45 },
          { header: 'Actual Result', key: 'actual', width: 45 },
          { header: 'Status', key: 'status', width: 12 },
          { header: 'Execution Time', key: 'duration', width: 16 },
          { header: 'Average Response Time', key: 'avg', width: 20 },
          { header: 'Peak Response Time', key: 'peak', width: 20 },
          { header: 'Throughput', key: 'tps', width: 15 },
          { header: 'Error Rate', key: 'err', width: 15 }
        ];
      } else {
        tcSheet.columns = [
          { header: 'Test Case ID', key: 'id', width: 15 },
          { header: 'Module', key: 'module', width: 18 },
          { header: 'Description', key: 'desc', width: 45 },
          { header: 'Expected Result', key: 'expected', width: 45 },
          { header: 'Actual Result', key: 'actual', width: 45 },
          { header: 'Status', key: 'status', width: 12 },
          { header: 'Execution Time', key: 'duration', width: 16 }
        ];
      }

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
          const isCenterCol = isLoad 
            ? (cell.col === 1 || cell.col === 7 || cell.col === 8 || cell.col === 11 || cell.col === 12)
            : (cell.col === 1 || cell.col === 6 || cell.col === 7);
          if (isCenterCol) {
            cell.alignment = centerAlignment;
          } else {
            cell.alignment = leftAlignment;
          }
        });

        const statusColIdx = isLoad ? 7 : 6;
        const statusVal = row.getCell(statusColIdx).value;
        if (statusVal === 'PASS') {
          row.getCell(statusColIdx).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F4EA' } };
          row.getCell(statusColIdx).font = { name: 'Arial', size: 10, color: { argb: 'FF137333' }, bold: true };
        } else if (statusVal === 'FAIL') {
          row.getCell(statusColIdx).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE8E6' } };
          row.getCell(statusColIdx).font = { name: 'Arial', size: 10, color: { argb: 'FFC5221F' }, bold: true };
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

    // Generate/Update Selenium_Report.xlsx if data exists
    if (mergedTests.selenium.length > 0) {
      await createTabbedWorkbook(
        path.join(reportDir, 'Selenium_Report.xlsx'),
        'Chrome Browser',
        'N/A',
        mergedTests.selenium,
        mergedLogs.filter(log => log.suite === 'selenium')
      );
    }

    // Generate/Update Security_Report.xlsx if data exists
    if (mergedTests.security.length > 0) {
      await createTabbedWorkbook(
        path.join(reportDir, 'Security_Report.xlsx'),
        'Security Vulnerability Scanner',
        'N/A',
        mergedTests.security,
        mergedLogs.filter(log => log.suite === 'security')
      );
    }

    // Generate/Update Appium_Report.xlsx if data exists
    if (mergedTests.appium.length > 0) {
      await createTabbedWorkbook(
        path.join(reportDir, 'Appium_Report.xlsx'),
        'Android Device',
        '14.0',
        mergedTests.appium,
        mergedLogs.filter(log => log.suite === 'appium')
      );
    }

    // Generate/Update load_report.xlsx & Load_Test_Report.xlsx if data exists
    if (mergedTests.load.length > 0) {
      await createTabbedWorkbook(
        path.join(reportDir, 'load_report.xlsx'),
        'K6 Load Generator',
        'N/A',
        mergedTests.load,
        mergedLogs.filter(log => log.suite === 'load'),
        true
      );
      await createTabbedWorkbook(
        path.join(reportDir, 'Load_Test_Report.xlsx'),
        'K6 Load Generator',
        'N/A',
        mergedTests.load,
        mergedLogs.filter(log => log.suite === 'load'),
        true
      );
    }
  }
}

module.exports = Reporter;
