package com.smartbudget.tests;

import com.smartbudget.utils.TestDataReader;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class AppiumTest extends BaseTest {

    @DataProvider(name = "appiumData")
    public Object[][] getAppiumData() {
        return TestDataReader.getTestData("Appium");
    }

    @Test(dataProvider = "appiumData")
    public void testAppiumModules(String id, String module, String desc, String expected,
                                  String actual, String status, String duration) {
        if (status.equalsIgnoreCase("FAIL")) {
            Assert.fail(actual);
        } else if (status.equalsIgnoreCase("SKIP")) {
            throw new SkipException("Skipped Appium test case");
        }
        Assert.assertEquals(status, "PASS");
    }
}
