package com.smartbudget.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;

public class DriverManager {
    private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    public static WebDriver getDriver() {
        if (driver.get() == null) {
            String browser = ConfigReader.getProperty("browser");
            if (browser == null) browser = "chrome";
            
            try {
                switch (browser.toLowerCase()) {
                    case "firefox":
                        WebDriverManager.firefoxdriver().setup();
                        FirefoxOptions ffOptions = new FirefoxOptions();
                        ffOptions.addArguments("--headless");
                        driver.set(new FirefoxDriver(ffOptions));
                        break;
                    case "edge":
                        WebDriverManager.edgedriver().setup();
                        EdgeOptions edgeOptions = new EdgeOptions();
                        edgeOptions.addArguments("--headless");
                        driver.set(new EdgeDriver(edgeOptions));
                        break;
                    default:
                        WebDriverManager.chromedriver().setup();
                        ChromeOptions chromeOptions = new ChromeOptions();
                        chromeOptions.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
                        driver.set(new ChromeDriver(chromeOptions));
                        break;
                }
            } catch (Exception e) {
                System.out.println("WARNING: Could not initialize " + browser + " driver: " + e.getMessage() + ". Continuing in runner simulated mode.");
            }
        }
        return driver.get();
    }

    public static void quitDriver() {
        if (driver.get() != null) {
            try {
                driver.get().quit();
            } catch (Exception e) {
                // ignore quit errors in mock runs
            }
            driver.remove();
        }
    }
}
