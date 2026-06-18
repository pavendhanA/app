const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const logger = require('./Logger');

class K6Reporter {
  /**
   * Generates a stylized excel report containing load test statistics and thresholds.
   */
  static async generateReport(summaryPath, reportPath) {
    logger.info(`K6Reporter: Parsing summary JSON at ${summaryPath}`);
    if (!fs.existsSync(summaryPath)) {
      throw new Error(`Summary JSON file does not exist at ${summaryPath}`);
    }

    const rawData = fs.readFileSync(summaryPath, 'utf8');
    const summaryData = JSON.parse(rawData);
    const metrics = summaryData.metrics || {};

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Smart Budget v3 K6 Load Reporter';
    workbook.created = new Date();

    // Design styles matching existing reports (Dark Navy Blue theme)
    const primaryHeaderFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1B365D' } // Navy Blue
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

    // ----------------------------------------------------
    // Tab 1: Load Test Summary
    // ----------------------------------------------------
    const sheet1 = workbook.addWorksheet('Load Test Summary');
    sheet1.views = [{ showGridLines: true }];
    sheet1.getColumn('A').width = 30;
    sheet1.getColumn('B').width = 35;

    sheet1.getCell('A1').value = 'Metric';
    sheet1.getCell('B1').value = 'Value';

    const totalReqs = metrics.http_reqs ? metrics.http_reqs.count : 0;
    const rps = metrics.http_reqs ? metrics.http_reqs.rate.toFixed(2) : '0';
    const vus = metrics.vus ? (metrics.vus.max || metrics.vus.value) : 100;
    const failedRate = metrics.http_req_failed ? (metrics.http_req_failed.value * 100).toFixed(2) + '%' : '0%';
    const checksPassed = metrics.checks ? metrics.checks.passes : 0;
    const checksFailed = metrics.checks ? metrics.checks.fails : 0;
    const totalChecks = checksPassed + checksFailed;
    const successRate = totalChecks > 0 ? ((checksPassed / totalChecks) * 100).toFixed(2) + '%' : '100%';

    const dataRecv = metrics.data_received ? (metrics.data_received.rate / 1024).toFixed(2) + ' KB/s' : '0 KB/s';
    const dataSent = metrics.data_sent ? (metrics.data_sent.rate / 1024).toFixed(2) + ' KB/s' : '0 KB/s';

    // Verify thresholds
    let thresholdsPassed = true;
    const thresholdDetails = [];
    Object.keys(metrics).forEach(metricName => {
      const metricObj = metrics[metricName];
      if (metricObj && metricObj.thresholds) {
        Object.keys(metricObj.thresholds).forEach(threshName => {
          const ok = metricObj.thresholds[threshName].ok;
          if (!ok) {
            thresholdsPassed = false;
          }
          thresholdDetails.push({
            metric: metricName,
            threshold: threshName,
            status: ok ? 'PASS' : 'FAIL'
          });
        });
      }
    });

    const summaryRows = [
      { m: 'Execution Timestamp', v: new Date().toLocaleString() },
      { m: 'Target Base URL', v: 'http://localhost:3000' },
      { m: 'Test Duration Limit', v: '1 minute (60s)' },
      { m: 'Target Concurrent VUs', v: vus },
      { m: 'Total Requests Dispatched', v: totalReqs },
      { m: 'Average Request Rate (RPS)', v: `${rps} req/sec` },
      { m: 'HTTP Request Failure Rate', v: failedRate },
      { m: 'Validation Checks Pass Rate', v: successRate },
      { m: 'Throughput (Data Received)', v: dataRecv },
      { m: 'Throughput (Data Sent)', v: dataSent },
      { m: 'Global Thresholds Verdict', v: thresholdsPassed ? 'ALL PASSED' : 'FAILED THRESHOLDS' }
    ];

    summaryRows.forEach((row, i) => {
      const rowIdx = i + 2;
      sheet1.getCell(`A${rowIdx}`).value = row.m;
      sheet1.getCell(`B${rowIdx}`).value = row.v;
    });

    // Style summary table
    sheet1.getCell('A1').fill = primaryHeaderFill;
    sheet1.getCell('A1').font = headerFont;
    sheet1.getCell('A1').alignment = centerAlignment;
    sheet1.getCell('B1').fill = primaryHeaderFill;
    sheet1.getCell('B1').font = headerFont;
    sheet1.getCell('B1').alignment = centerAlignment;

    for (let i = 0; i < summaryRows.length; i++) {
      const rIdx = i + 2;
      const cellA = sheet1.getCell(`A${rIdx}`);
      const cellB = sheet1.getCell(`B${rIdx}`);

      cellA.font = { name: 'Arial', size: 10, bold: true };
      cellB.font = { name: 'Arial', size: 10 };
      cellA.border = borderStyle;
      cellB.border = borderStyle;
      cellA.alignment = leftAlignment;
      cellB.alignment = leftAlignment;

      if (summaryRows[i].m === 'Global Thresholds Verdict') {
        if (thresholdsPassed) {
          cellB.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F4EA' } }; // Light green
          cellB.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF137333' } };
        } else {
          cellB.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE8E6' } }; // Light red
          cellB.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFC5221F' } };
        }
      }
    }

    // ----------------------------------------------------
    // Tab 2: Response Time Metrics
    // ----------------------------------------------------
    const sheet2 = workbook.addWorksheet('Response Time Distribution');
    sheet2.views = [{ showGridLines: true }];
    sheet2.columns = [
      { header: 'Percentile / Stat', key: 'stat', width: 25 },
      { header: 'Response Time (ms)', key: 'duration', width: 25 }
    ];

    const durObj = metrics.http_req_duration || {};
    const distributionRows = [
      { stat: 'Minimum Response Time', duration: durObj.min ? durObj.min.toFixed(2) + ' ms' : 'N/A' },
      { stat: 'Median Response Time (p50)', duration: durObj.med ? durObj.med.toFixed(2) + ' ms' : 'N/A' },
      { stat: 'Average Response Time', duration: durObj.avg ? durObj.avg.toFixed(2) + ' ms' : 'N/A' },
      { stat: '90th Percentile (p90)', duration: durObj['p(90)'] ? durObj['p(90)'].toFixed(2) + ' ms' : 'N/A' },
      { stat: '95th Percentile (p95)', duration: durObj['p(95)'] ? durObj['p(95)'].toFixed(2) + ' ms' : 'N/A' },
      { stat: 'Maximum Response Time', duration: durObj.max ? durObj.max.toFixed(2) + ' ms' : 'N/A' }
    ];

    distributionRows.forEach(row => {
      sheet2.addRow(row);
    });

    sheet2.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });

    sheet2.eachRow((row, rNumber) => {
      if (rNumber === 1) return;
      row.eachCell(cell => {
        cell.border = borderStyle;
        cell.font = { name: 'Arial', size: 10 };
        if (cell.col === 1) {
          cell.font = { name: 'Arial', size: 10, bold: true };
          cell.alignment = leftAlignment;
        } else {
          cell.alignment = centerAlignment;
        }
      });
    });

    // ----------------------------------------------------
    // Tab 3: Performance Thresholds
    // ----------------------------------------------------
    const sheet3 = workbook.addWorksheet('Threshold Details');
    sheet3.views = [{ showGridLines: true }];
    sheet3.columns = [
      { header: 'Target Metric', key: 'metric', width: 25 },
      { header: 'Threshold Criteria', key: 'threshold', width: 35 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    if (thresholdDetails.length === 0) {
      sheet3.addRow({
        metric: 'N/A',
        threshold: 'No thresholds defined',
        status: 'N/A'
      });
    } else {
      thresholdDetails.forEach(td => sheet3.addRow(td));
    }

    sheet3.getRow(1).eachCell(cell => {
      cell.fill = primaryHeaderFill;
      cell.font = headerFont;
      cell.alignment = centerAlignment;
    });

    sheet3.eachRow((row, rNumber) => {
      if (rNumber === 1) return;
      row.eachCell(cell => {
        cell.border = borderStyle;
        cell.font = { name: 'Arial', size: 10 };
        if (cell.col === 1 || cell.col === 2) {
          cell.alignment = leftAlignment;
        } else {
          cell.alignment = centerAlignment;
        }
      });

      const statusVal = row.getCell(3).value;
      if (statusVal === 'PASS') {
        row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F4EA' } };
        row.getCell(3).font = { name: 'Arial', size: 10, color: { argb: 'FF137333' }, bold: true };
      } else if (statusVal === 'FAIL') {
        row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE8E6' } };
        row.getCell(3).font = { name: 'Arial', size: 10, color: { argb: 'FFC5221F' }, bold: true };
      }
    });

    // Save report
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await workbook.xlsx.writeFile(reportPath);
    logger.info(`Excel Report saved successfully at: ${reportPath}`);
    return thresholdsPassed;
  }
}

module.exports = K6Reporter;
