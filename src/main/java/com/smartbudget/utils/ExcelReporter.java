package com.smartbudget.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class ExcelReporter {

    public static class TestResult {
        public String id;
        public String suite;
        public String module;
        public String desc;
        public String loadProfile;
        public String expected;
        public String actual;
        public String status;
        public String duration;
        public String avgResponse;
        public String peakResponse;
        public String throughput;
        public String errorRate;

        // Constructor for standard tests
        public TestResult(String id, String suite, String module, String desc, String expected, String actual,
                          String status, String duration) {
            this.id = id;
            this.suite = suite;
            this.module = module;
            this.desc = desc;
            this.expected = expected;
            this.actual = actual;
            this.status = status;
            this.duration = duration;
            this.loadProfile = "";
            this.avgResponse = "";
            this.peakResponse = "";
            this.throughput = "";
            this.errorRate = "";
        }

        // Constructor for load tests
        public TestResult(String id, String suite, String module, String desc, String loadProfile, String expected,
                          String actual, String status, String duration, String avgResponse, String peakResponse,
                          String throughput, String errorRate) {
            this.id = id;
            this.suite = suite;
            this.module = module;
            this.desc = desc;
            this.loadProfile = loadProfile;
            this.expected = expected;
            this.actual = actual;
            this.status = status;
            this.duration = duration;
            this.avgResponse = avgResponse;
            this.peakResponse = peakResponse;
            this.throughput = throughput;
            this.errorRate = errorRate;
        }
    }

    private static List<TestResult> allResults = new CopyOnWriteArrayList<>();

    public static void addResult(TestResult result) {
        allResults.add(result);
    }

    public static void clearResults() {
        allResults.clear();
    }

    public static void generateReports() {
        String reportsDir = ConfigReader.getProperty("reports.dir");
        if (reportsDir == null) reportsDir = "reports";
        File dir = new File(reportsDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        LoggerUtil.info("ExcelReporter: Generating spreadsheets...");

        // Generate standard sheets
        writeStandardReport(reportsDir + "/Selenium_Report.xlsx", "Selenium Web Tests", filterBySuite("selenium"));
        writeStandardReport(reportsDir + "/Security_Report.xlsx", "Security Tests", filterBySuite("security"));
        writeStandardReport(reportsDir + "/Appium_Report.xlsx", "Appium Mobile Tests", filterBySuite("appium"));
        
        // Generate load sheets
        writeLoadReport(reportsDir + "/load_report.xlsx", "Performance Load Tests", filterBySuite("load"));

        // Copy/duplicate load report to also support Load_Test_Report.xlsx if requested
        try {
            File source = new File(reportsDir + "/load_report.xlsx");
            File dest = new File(reportsDir + "/Load_Test_Report.xlsx");
            Files.copy(source.toPath(), dest.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            LoggerUtil.error("Failed to duplicate load report: " + e.getMessage());
        }

        // Generate Master report
        writeMasterReport(reportsDir + "/Master_Report.xlsx");
        LoggerUtil.info("ExcelReporter: Spreadsheets compilation finalized.");
    }

    private static List<TestResult> filterBySuite(String suiteName) {
        List<TestResult> filtered = new ArrayList<>();
        for (TestResult r : allResults) {
            if (r.suite.equalsIgnoreCase(suiteName)) {
                filtered.add(r);
            }
        }
        return filtered;
    }

    private static void writeStandardReport(String path, String title, List<TestResult> results) {
        Workbook workbook = new XSSFWorkbook();
        createSummaryTab(workbook, title, results);
        createStandardTestCasesSheet(workbook, "Test Cases", results);
        createFailedCasesSheetForResults(workbook, "Failed Tests", results);
        saveWorkbook(workbook, path);
    }

    private static void writeLoadReport(String path, String title, List<TestResult> results) {
        Workbook workbook = new XSSFWorkbook();
        createSummaryTab(workbook, title, results);
        createLoadTestCasesSheet(workbook, "Test Cases", results);
        createFailedCasesSheetForResults(workbook, "Failed Tests", results);
        saveWorkbook(workbook, path);
    }

    private static void writeMasterReport(String path) {
        Workbook workbook = new XSSFWorkbook();
        
        // Tab 1: Executive summary dashboard
        createSummaryTab(workbook, "Consolidated Executive QA Dashboard", allResults);

        // Tab 2: Selenium
        createStandardTestCasesSheet(workbook, "Selenium Web Tests", filterBySuite("selenium"));

        // Tab 3: Security
        createStandardTestCasesSheet(workbook, "Security Tests", filterBySuite("security"));

        // Tab 4: Appium
        createStandardTestCasesSheet(workbook, "Appium Mobile Tests", filterBySuite("appium"));

        // Tab 5: Load
        createLoadTestCasesSheet(workbook, "Performance Load Tests", filterBySuite("load"));

        // Tab 6: Failures
        createFailedCasesSheet(workbook);

        saveWorkbook(workbook, path);
    }

    private static void createSummaryTab(Workbook wb, String title, List<TestResult> results) {
        Sheet sheet = wb.createSheet("Summary");
        sheet.setDisplayGridlines(true);

        CellStyle headerStyle = createHeaderStyle(wb, "1B365D");
        CellStyle labelStyle = createLabelStyle(wb);
        CellStyle valStyle = createValueStyle(wb);

        Row header = sheet.createRow(0);
        header.setHeightInPoints(24);
        Cell h0 = header.createCell(0);
        h0.setCellValue("Metric Name");
        h0.setCellStyle(headerStyle);
        Cell h1 = header.createCell(1);
        h1.setCellValue("Value");
        h1.setCellStyle(headerStyle);

        int total = results.size();
        int passed = 0;
        int failed = 0;
        int skipped = 0;
        double durationSum = 0;

        for (TestResult r : results) {
            if (r.status.equalsIgnoreCase("PASS")) {
                passed++;
            } else if (r.status.equalsIgnoreCase("FAIL")) {
                failed++;
            } else if (r.status.equalsIgnoreCase("SKIP")) {
                skipped++;
            }
            try {
                durationSum += Double.parseDouble(r.duration.replace("s", "").trim());
            } catch (Exception e) {}
        }

        String passPercent = (passed + failed) > 0 ? Math.round(((double) passed / (passed + failed)) * 100) + "%" : "0%";

        String[][] data = {
                {"Execution Timestamp", new java.util.Date().toString()},
                {"Test Suite / Scope", title},
                {"Target Environment", "QA-Staging"},
                {"Total Test Cases", String.valueOf(total)},
                {"Passed", String.valueOf(passed)},
                {"Failed", String.valueOf(failed)},
                {"Skipped", String.valueOf(skipped)},
                {"Success Rate (Pass/Fail)", passPercent},
                {"Total Execution Duration", String.format("%.2fs", durationSum)}
        };

        for (int i = 0; i < data.length; i++) {
            Row r = sheet.createRow(i + 1);
            r.setHeightInPoints(20);
            
            Cell c0 = r.createCell(0);
            c0.setCellValue(data[i][0]);
            c0.setCellStyle(labelStyle);

            Cell c1 = r.createCell(1);
            c1.setCellValue(data[i][1]);
            c1.setCellStyle(valStyle);

            if (data[i][0].equals("Success Rate (Pass/Fail)")) {
                CellStyle prcStyle = wb.createCellStyle();
                prcStyle.cloneStyleFrom(valStyle);
                Font prcFont = wb.createFont();
                prcFont.setName("Arial");
                prcFont.setBold(true);
                if (failed == 0 && total > 0) {
                    prcFont.setColor(IndexedColors.GREEN.getIndex());
                } else {
                    prcFont.setColor(IndexedColors.RED.getIndex());
                }
                prcStyle.setFont(prcFont);
                c1.setCellStyle(prcStyle);
            }
        }

        sheet.setColumnWidth(0, 7500);
        sheet.setColumnWidth(1, 9500);
    }

    private static void createStandardTestCasesSheet(Workbook wb, String tabName, List<TestResult> results) {
        Sheet sheet = wb.createSheet(tabName);
        sheet.setDisplayGridlines(true);

        CellStyle headerStyle = createHeaderStyle(wb, "1B365D");
        CellStyle borderStyle = createBorderedStyle(wb);
        CellStyle passStyle = createStatusStyle(wb, "E6F4EA", "137333");
        CellStyle failStyle = createStatusStyle(wb, "FCE8E6", "C5221F");
        CellStyle skipStyle = createStatusStyle(wb, "FFEAECEE", "FF7F8C8D");

        String[] headers = {
                "Test Case ID", "Module", "Description", "Expected Result", "Actual Result", "Status", "Execution Time"
        };

        Row headerRow = sheet.createRow(0);
        headerRow.setHeightInPoints(24);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rIndex = 1;
        for (TestResult r : results) {
            Row row = sheet.createRow(rIndex++);
            row.setHeightInPoints(20);

            createCell(row, 0, r.id, borderStyle);
            createCell(row, 1, r.module, borderStyle);
            createCell(row, 2, r.desc, borderStyle);
            createCell(row, 3, r.expected, borderStyle);
            createCell(row, 4, r.actual, borderStyle);

            Cell statusCell = row.createCell(5);
            statusCell.setCellValue(r.status);
            if (r.status.equalsIgnoreCase("PASS")) {
                statusCell.setCellStyle(passStyle);
            } else if (r.status.equalsIgnoreCase("FAIL")) {
                statusCell.setCellStyle(failStyle);
            } else {
                statusCell.setCellStyle(skipStyle);
            }

            createCell(row, 6, r.duration, borderStyle);
        }

        sheet.setColumnWidth(0, 3500);
        sheet.setColumnWidth(1, 5000);
        sheet.setColumnWidth(2, 11000);
        sheet.setColumnWidth(3, 11000);
        sheet.setColumnWidth(4, 11000);
        sheet.setColumnWidth(5, 3000);
        sheet.setColumnWidth(6, 4000);
    }

    private static void createLoadTestCasesSheet(Workbook wb, String tabName, List<TestResult> results) {
        Sheet sheet = wb.createSheet(tabName);
        sheet.setDisplayGridlines(true);

        CellStyle headerStyle = createHeaderStyle(wb, "1B365D");
        CellStyle borderStyle = createBorderedStyle(wb);
        CellStyle passStyle = createStatusStyle(wb, "E6F4EA", "137333");
        CellStyle failStyle = createStatusStyle(wb, "FCE8E6", "C5221F");

        String[] headers = {
                "Test Case ID", "Module", "Description", "Load Profile", "Expected Result",
                "Actual Result", "Status", "Execution Time", "Average Response Time",
                "Peak Response Time", "Throughput", "Error Rate"
        };

        Row headerRow = sheet.createRow(0);
        headerRow.setHeightInPoints(24);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rIndex = 1;
        for (TestResult r : results) {
            Row row = sheet.createRow(rIndex++);
            row.setHeightInPoints(20);

            createCell(row, 0, r.id, borderStyle);
            createCell(row, 1, r.module, borderStyle);
            createCell(row, 2, r.desc, borderStyle);
            createCell(row, 3, r.loadProfile, borderStyle);
            createCell(row, 4, r.expected, borderStyle);
            createCell(row, 5, r.actual, borderStyle);

            Cell statusCell = row.createCell(6);
            statusCell.setCellValue(r.status);
            statusCell.setCellStyle(r.status.equalsIgnoreCase("PASS") ? passStyle : failStyle);

            createCell(row, 7, r.duration, borderStyle);
            createCell(row, 8, r.avgResponse, borderStyle);
            createCell(row, 9, r.peakResponse, borderStyle);
            createCell(row, 10, r.throughput, borderStyle);
            createCell(row, 11, r.errorRate, borderStyle);
        }

        sheet.setColumnWidth(0, 3500);
        sheet.setColumnWidth(1, 5000);
        sheet.setColumnWidth(2, 11000);
        sheet.setColumnWidth(3, 4000);
        sheet.setColumnWidth(4, 11000);
        sheet.setColumnWidth(5, 11000);
        sheet.setColumnWidth(6, 3000);
        sheet.setColumnWidth(7, 4000);
        sheet.setColumnWidth(8, 4500);
        sheet.setColumnWidth(9, 4500);
        sheet.setColumnWidth(10, 4000);
        sheet.setColumnWidth(11, 3500);
    }

    private static void createFailedCasesSheet(Workbook wb) {
        List<TestResult> failed = new ArrayList<>();
        for (TestResult r : allResults) {
            if (r.status.equalsIgnoreCase("FAIL")) {
                failed.add(r);
            }
        }
        createFailedCasesSheetForResults(wb, "Failed Tests Summary", failed);
    }

    private static void createFailedCasesSheetForResults(Workbook wb, String title, List<TestResult> failed) {
        Sheet sheet = wb.createSheet(title);
        sheet.setDisplayGridlines(true);

        CellStyle headerStyle = createHeaderStyle(wb, "B71C1C"); // Red warning header
        CellStyle borderStyle = createBorderedStyle(wb);
        CellStyle reasonStyle = wb.createCellStyle();
        reasonStyle.cloneStyleFrom(borderStyle);
        Font font = wb.createFont();
        font.setName("Arial");
        font.setColor(IndexedColors.RED.getIndex());
        reasonStyle.setFont(font);

        String[] headers = {
                "Test ID", "Suite", "Module", "Scenario", "Failure Cause"
        };

        Row headerRow = sheet.createRow(0);
        headerRow.setHeightInPoints(24);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rIndex = 1;
        if (failed.isEmpty()) {
            Row row = sheet.createRow(rIndex++);
            row.setHeightInPoints(20);
            createCell(row, 0, "N/A", borderStyle);
            createCell(row, 1, "N/A", borderStyle);
            createCell(row, 2, "N/A", borderStyle);
            createCell(row, 3, "All validation checkpoints completed successfully.", borderStyle);
            createCell(row, 4, "No failures detected.", borderStyle);
        } else {
            for (TestResult r : failed) {
                Row row = sheet.createRow(rIndex++);
                row.setHeightInPoints(20);

                createCell(row, 0, r.id, borderStyle);
                createCell(row, 1, r.suite, borderStyle);
                createCell(row, 2, r.module, borderStyle);
                createCell(row, 3, r.desc, borderStyle);
                createCell(row, 4, r.actual, reasonStyle);
            }
        }

        sheet.setColumnWidth(0, 3500);
        sheet.setColumnWidth(1, 4500);
        sheet.setColumnWidth(2, 5000);
        sheet.setColumnWidth(3, 11000);
        sheet.setColumnWidth(4, 15000);
    }

    private static void createCell(Row r, int index, String value, CellStyle style) {
        Cell cell = r.createCell(index);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private static CellStyle createHeaderStyle(Workbook wb, String hexArgb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setName("Arial");
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);

        byte[] rgb = hexToRgb(hexArgb);
        style.setFillForegroundColor(wb.getCreationHelper().createExtendedColor());
        if (style instanceof org.apache.poi.xssf.usermodel.XSSFCellStyle) {
            org.apache.poi.xssf.usermodel.XSSFCellStyle xssfStyle = (org.apache.poi.xssf.usermodel.XSSFCellStyle) style;
            xssfStyle.setFillForegroundColor(new org.apache.poi.xssf.usermodel.XSSFColor(rgb, null));
            xssfStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        } else {
            style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }

        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private static CellStyle createBorderedStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setName("Arial");
        style.setFont(font);

        style.setBorderBottom(BorderStyle.THIN);
        style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBorderLeft(BorderStyle.THIN);
        style.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBorderRight(BorderStyle.THIN);
        style.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBorderTop(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private static CellStyle createStatusStyle(Workbook wb, String fillHex, String textHex) {
        CellStyle style = createBorderedStyle(wb);
        style.setAlignment(HorizontalAlignment.CENTER);

        if (style instanceof org.apache.poi.xssf.usermodel.XSSFCellStyle) {
            org.apache.poi.xssf.usermodel.XSSFCellStyle xssfStyle = (org.apache.poi.xssf.usermodel.XSSFCellStyle) style;
            xssfStyle.setFillForegroundColor(new org.apache.poi.xssf.usermodel.XSSFColor(hexToRgb(fillHex), null));
            xssfStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            
            Font font = wb.createFont();
            font.setName("Arial");
            font.setBold(true);
            font.setColor(new org.apache.poi.xssf.usermodel.XSSFColor(hexToRgb(textHex), null));
            xssfStyle.setFont(font);
        }
        return style;
    }

    private static CellStyle createLabelStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setName("Arial");
        font.setBold(true);
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBorderLeft(BorderStyle.THIN);
        style.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBorderRight(BorderStyle.THIN);
        style.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBorderTop(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private static CellStyle createValueStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setName("Arial");
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBorderLeft(BorderStyle.THIN);
        style.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBorderRight(BorderStyle.THIN);
        style.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBorderTop(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private static byte[] hexToRgb(String hex) {
        int r = Integer.parseInt(hex.substring(0, 2), 16);
        int g = Integer.parseInt(hex.substring(2, 4), 16);
        int b = Integer.parseInt(hex.substring(4, 6), 16);
        return new byte[]{(byte) r, (byte) g, (byte) b};
    }

    private static void saveWorkbook(Workbook wb, String path) {
        try {
            FileOutputStream fos = new FileOutputStream(path);
            wb.write(fos);
            wb.close();
            fos.close();
        } catch (IOException e) {
            LoggerUtil.error("Failed to save Excel sheet at " + path + ": " + e.getMessage());
        }
    }
}
