package com.smartbudget.tests;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.smartbudget.utils.ExcelReporter;
import com.smartbudget.utils.ExtentManager;
import com.smartbudget.utils.LoggerUtil;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;

import java.lang.reflect.Method;

public class BaseTest {
    protected static ExtentReports extent;

    @BeforeSuite(alwaysRun = true)
    public void setupSuite() {
        LoggerUtil.info("BaseTest: Initializing Smart Budget v3 Enterprise QA Automation Test Suite...");
        extent = ExtentManager.getInstance();
        ExcelReporter.clearResults();
    }

    @BeforeMethod(alwaysRun = true)
    public void beforeMethod(Method method, Object[] params) {
        String testName = method.getName();
        if (params != null && params.length > 0) {
            testName += " [" + params[0] + "]"; // TC ID
        }
        ExtentTest test = extent.createTest(testName);
        ExtentManager.setTest(test);
        if (params != null && params.length >= 4) {
            test.info("Scenario: " + params[3]); // Description
        }
    }

    @AfterMethod(alwaysRun = true)
    public void afterMethod(ITestResult result, Object[] params) {
        ExtentTest test = ExtentManager.getTest();
        String status = "PASS";
        String actualResult = "Operation succeeded without error checks";

        if (result.getStatus() == ITestResult.FAILURE) {
            status = "FAIL";
            actualResult = result.getThrowable().getMessage();
            if (test != null) {
                test.fail("Test failed: " + actualResult);
            }
        } else if (result.getStatus() == ITestResult.SKIP) {
            status = "SKIP";
            actualResult = "Test execution skipped";
            if (test != null) {
                test.skip("Test skipped");
            }
        } else {
            if (test != null) {
                test.pass("Test passed successfully.");
            }
        }

        if (test != null) {
            ExtentManager.removeTest();
        }

        // Capture data-driven parameters and store in Excel reporter
        if (params != null && params.length >= 11) {
            String id = (String) params[0];
            String suite = (String) params[1];
            String module = (String) params[2];
            String desc = (String) params[3];
            String expected = (String) params[4];
            String duration = (String) params[7];
            String browser = (String) params[8];
            String platform = (String) params[9];
            String environment = (String) params[10];

            ExcelReporter.addResult(new ExcelReporter.TestResult(
                    id, suite, module, desc, expected, actualResult, status, duration, browser, platform, environment
            ));
        }
    }

    @AfterSuite(alwaysRun = true)
    public void tearDownSuite() {
        LoggerUtil.info("BaseTest: Compiling and generating reports...");
        if (extent != null) {
            extent.flush();
        }
        ExcelReporter.generateReports();
        LoggerUtil.info("BaseTest: Smart Budget v3 Enterprise QA execution finished.");
    }
}
