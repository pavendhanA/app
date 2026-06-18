package com.smartbudget.tests;

import com.smartbudget.utils.TestDataReader;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class LoadTest extends BaseTest {

    @DataProvider(name = "loadData")
    public Object[][] getLoadData() {
        return TestDataReader.getTestData("Load");
    }

    @Test(dataProvider = "loadData")
    public void testLoadModules(String id, String module, String desc, String loadProfile,
                               String expected, String actual, String status, String duration,
                               String avgResponse, String peakResponse, String throughput, String errorRate) {
        if (status.equalsIgnoreCase("FAIL")) {
            Assert.fail(actual);
        } else if (status.equalsIgnoreCase("SKIP")) {
            throw new SkipException("Skipped load test scenario");
        }
        Assert.assertEquals(status, "PASS");
    }
}
