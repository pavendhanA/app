package com.smartbudget.tests;

import com.smartbudget.utils.TestDataReader;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class AccessibilityTest extends BaseTest {

    @DataProvider(name = "accessibilityData")
    public Object[][] getAccessibilityData() {
        return TestDataReader.getTestData("Accessibility");
    }

    @Test(dataProvider = "accessibilityData")
    public void testAccessibilityModules(String id, String suite, String module, String desc,
                                         String expected, String actual, String status, String duration,
                                         String browser, String platform, String environment) {
        if (status.equalsIgnoreCase("FAIL")) {
            Assert.fail(actual);
        }
        Assert.assertEquals(status, "PASS");
    }
}
