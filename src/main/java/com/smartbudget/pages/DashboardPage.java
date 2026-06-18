package com.smartbudget.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class DashboardPage extends BasePage {
    private By totalBalanceVal = By.id("stat-total");
    private By totalIncomeVal = By.id("stat-income");
    private By totalExpenseVal = By.id("stat-expense");
    
    private By navDashboard = By.id("nav-dashboard");
    private By navIncome = By.id("nav-income");
    private By navExpense = By.id("nav-expense");
    private By navBudget = By.id("nav-budget");
    private By navReports = By.id("nav-reports");
    private By navProfile = By.id("nav-profile");
    private By logoutButton = By.id("logout-button");
    private By visitorSearch = By.id("visitor-search");

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public void navigateTo(String module) {
        switch (module.toLowerCase()) {
            case "income": click(navIncome); break;
            case "expense": click(navExpense); break;
            case "budget": click(navBudget); break;
            case "reports": click(navReports); break;
            case "profile": click(navProfile); break;
            default: click(navDashboard); break;
        }
    }

    public void logout() {
        click(logoutButton);
    }

    public String getBalance() {
        return getText(totalBalanceVal);
    }

    public void searchTransaction(String query) {
        sendKeys(visitorSearch, query);
    }
}
