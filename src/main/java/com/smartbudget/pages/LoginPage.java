package com.smartbudget.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {
    private By emailField = By.id("login-email");
    private By passwordField = By.id("login-password");
    private By rememberCheckbox = By.id("remember-me-checkbox");
    private By loginSubmitButton = By.xpath("//form[@id='login-form']//button[@type='submit']");
    private By errorMessage = By.id("auth-error-message");
    private By registerLink = By.id("go-to-register");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public void login(String email, String password, boolean remember) {
        sendKeys(emailField, email);
        sendKeys(passwordField, password);
        if (remember && driver != null) {
            click(rememberCheckbox);
        }
        click(loginSubmitButton);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }

    public void clickRegister() {
        click(registerLink);
    }
}
