package com.smartbudget.tests;

import com.smartbudget.utils.TestDataReader;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class PerformanceTest extends BaseTest {

    @DataProvider(name = "performanceData")
    public Object[][] getPerformanceData() {
        return TestDataReader.getTestData("Performance");
    }

    @Test(dataProvider = "performanceData")
    public void testPerformanceModules(String id, String suite, String module, String desc,
                                       String expected, String actual, String status, String duration,
                                       String browser, String platform, String environment) {
        if (status.equalsIgnoreCase("FAIL")) {
            Assert.fail(actual);
        }
        Assert.assertEquals(status, "PASS");
    }
}
