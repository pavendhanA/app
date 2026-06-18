package com.smartbudget.utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;

public class ExtentManager {
    private static ExtentReports extent;
    private static ThreadLocal<ExtentTest> test = new ThreadLocal<>();

    public static ExtentReports getInstance() {
        if (extent == null) {
            String path = "reports/ExtentReport.html";
            ExtentSparkReporter spark = new ExtentSparkReporter(path);
            spark.config().setTheme(Theme.DARK);
            spark.config().setDocumentTitle("Smart Budget v3 QA Automation Report");
            spark.config().setReportName("Smart Budget v3 QA Executive Run Summary");
            
            extent = new ExtentReports();
            extent.attachReporter(spark);
            extent.setSystemInfo("E2E Automation Engine", "TestNG + Selenium 4");
            extent.setSystemInfo("Platform Target", "Windows 11 / Linux CI");
            extent.setSystemInfo("Environment", "Staging-QA");
        }
        return extent;
    }

    public static ExtentTest getTest() {
        return test.get();
    }

    public static void setTest(ExtentTest extentTest) {
        test.set(extentTest);
    }

    public static void removeTest() {
        test.remove();
    }
}
