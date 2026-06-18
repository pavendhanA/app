package com.smartbudget.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

public class TestDataReader {
    /**
     * Reads all test case records from a specific sheet of testdata.xlsx.
     */
    public static Object[][] getTestData(String sheetName) {
        String path = ConfigReader.getProperty("excel.testdata.path");
        List<Object[]> dataList = new ArrayList<>();
        
        try {
            File file = new File(path);
            if (!file.exists()) {
                LoggerUtil.warn("Excel test data file not found at: " + path);
                return new Object[0][0];
            }
            
            FileInputStream fis = new FileInputStream(file);
            Workbook workbook = new XSSFWorkbook(fis);
            Sheet sheet = workbook.getSheet(sheetName);
            
            if (sheet == null) {
                LoggerUtil.warn("Sheet '" + sheetName + "' not found in " + path);
                workbook.close();
                fis.close();
                return new Object[0][0];
            }
            
            int rowCount = sheet.getLastRowNum();
            for (int i = 1; i <= rowCount; i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                String id = getCellValue(row.getCell(0));
                String suite = getCellValue(row.getCell(1));
                String module = getCellValue(row.getCell(2));
                String desc = getCellValue(row.getCell(3));
                String expected = getCellValue(row.getCell(4));
                String actual = getCellValue(row.getCell(5));
                String status = getCellValue(row.getCell(6));
                String duration = getCellValue(row.getCell(7));
                String browser = getCellValue(row.getCell(8));
                String platform = getCellValue(row.getCell(9));
                String environment = getCellValue(row.getCell(10));
                
                dataList.add(new Object[]{id, suite, module, desc, expected, actual, status, duration, browser, platform, environment});
            }
            workbook.close();
            fis.close();
        } catch (Exception e) {
            LoggerUtil.error("Error reading sheet '" + sheetName + "': " + e.getMessage());
        }
        
        Object[][] dataArray = new Object[dataList.size()][11];
        for (int i = 0; i < dataList.size(); i++) {
            dataArray[i] = dataList.get(i);
        }
        return dataArray;
    }

    private static String getCellValue(Cell cell) {
        if (cell == null) return "";
        CellType type = cell.getCellType();
        if (type == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (type == CellType.NUMERIC) {
            if (DateUtil.isCellDateFormatted(cell)) {
                return cell.getDateCellValue().toString();
            }
            return String.valueOf(cell.getNumericCellValue());
        } else if (type == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else {
            return "";
        }
    }
}
