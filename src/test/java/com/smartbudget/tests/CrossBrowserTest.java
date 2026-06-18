package com.smartbudget.tests;

import com.smartbudget.utils.TestDataReader;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class CrossBrowserTest extends BaseTest {

    @DataProvider(name = "crossBrowserData")
    public Object[][] getCrossBrowserData() {
        return TestDataReader.getTestData("CrossBrowser");
    }

    @Test(dataProvider = "crossBrowserData")
    public void testCrossBrowserModules(String id, String suite, String module, String desc,
                                        String expected, String actual, String status, String duration,
                                        String browser, String platform, String environment) {
        if (status.equalsIgnoreCase("FAIL")) {
            Assert.fail(actual);
        }
        Assert.assertEquals(status, "PASS");
    }
}
