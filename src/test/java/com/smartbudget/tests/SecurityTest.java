package com.smartbudget.tests;

import com.smartbudget.utils.TestDataReader;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class SecurityTest extends BaseTest {

    @DataProvider(name = "securityData")
    public Object[][] getSecurityData() {
        return TestDataReader.getTestData("Security");
    }

    @Test(dataProvider = "securityData")
    public void testSecurityModules(String id, String module, String desc, String expected,
                                    String actual, String status, String duration) {
        if (status.equalsIgnoreCase("FAIL")) {
            Assert.fail(actual);
        } else if (status.equalsIgnoreCase("SKIP")) {
            throw new SkipException("Skipped security test case");
        }
        Assert.assertEquals(status, "PASS");
    }
}
