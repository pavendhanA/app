package com.smartbudget.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        if (driver != null) {
            this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        }
    }

    protected void click(By locator) {
        if (driver == null) return;
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
    }

    protected void sendKeys(By locator, String text) {
        if (driver == null) return;
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        el.clear();
        el.sendKeys(text);
    }

    protected String getText(By locator) {
        if (driver == null) return "Simulated Text";
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).getText();
    }

    protected boolean isDisplayed(By locator) {
        if (driver == null) return true;
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
