package com.smartbudget.tests;

import com.smartbudget.utils.TestDataReader;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class SeleniumTest extends BaseTest {

    @DataProvider(name = "seleniumData")
    public Object[][] getSeleniumData() {
        return TestDataReader.getTestData("Selenium");
    }

    @Test(dataProvider = "seleniumData")
    public void testSeleniumModules(String id, String module, String desc, String expected,
                                    String actual, String status, String duration) {
        if (status.equalsIgnoreCase("FAIL")) {
            Assert.fail(actual);
        } else if (status.equalsIgnoreCase("SKIP")) {
            throw new SkipException("Skipped Selenium test case");
        }
        Assert.assertEquals(status, "PASS");
    }
}
