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
        boolean isLoad = sheetName.equalsIgnoreCase("Load");
        int columnCount = isLoad ? 12 : 7;
        
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
                
                Object[] rowData = new Object[columnCount];
                for (int j = 0; j < columnCount; j++) {
                    rowData[j] = getCellValue(row.getCell(j));
                }
                dataList.add(rowData);
            }
            workbook.close();
            fis.close();
        } catch (Exception e) {
            LoggerUtil.error("Error reading sheet '" + sheetName + "': " + e.getMessage());
        }
        
        Object[][] dataArray = new Object[dataList.size()][columnCount];
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
            double val = cell.getNumericCellValue();
            if (val == (long) val) {
                return String.valueOf((long) val);
            }
            return String.valueOf(val);
        } else if (type == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else {
            return "";
        }
    }
}
