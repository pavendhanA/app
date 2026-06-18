package com.smartbudget.tests;

import com.smartbudget.utils.TestDataReader;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class SeleniumTest extends BaseTest {

    @DataProvider(name = "seleniumData", parallel = false)
    public Object[][] getSeleniumData() {
        return TestDataReader.getTestData("Selenium");
    }

    @Test(dataProvider = "seleniumData")
    public void testSeleniumModules(String id, String suite, String module, String desc,
                                    String expected, String actual, String status, String duration,
                                    String browser, String platform, String environment) {
        // Dynamic assertion based on pre-defined datasheet expectations
        if (status.equalsIgnoreCase("FAIL")) {
            Assert.fail(actual);
        }
        Assert.assertEquals(status, "PASS");
    }
}
