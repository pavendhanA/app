package com.smartbudget.tests;

import com.smartbudget.utils.TestDataReader;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class DataValidationTest extends BaseTest {

    @DataProvider(name = "dataValidationData")
    public Object[][] getDataValidationData() {
        return TestDataReader.getTestData("DataValidation");
    }

    @Test(dataProvider = "dataValidationData")
    public void testDataValidationModules(String id, String suite, String module, String desc,
                                          String expected, String actual, String status, String duration,
                                          String browser, String platform, String environment) {
        if (status.equalsIgnoreCase("FAIL")) {
            Assert.fail(actual);
        }
        Assert.assertEquals(status, "PASS");
    }
}
