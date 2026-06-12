package com.gateguard

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.*
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class LoginActivityTest {

    // This rule launches the LoginActivity before each test method runs
    @get:Rule
    val activityRule = ActivityScenarioRule(LoginActivity::class.java)

    @Test
    fun testEmptyEmailShowsError() {
        // Find the login button and click it without entering email/password
        onView(withId(R.id.btnLogin)).perform(click())

        // Check if the email field shows an error (or is focused)
        onView(withId(R.id.etLoginEmail)).check(matches(hasErrorText("Enter email")))
    }

    @Test
    fun testEmptyPasswordShowsError() {
        // Enter email but leave password empty
        onView(withId(R.id.etLoginEmail)).perform(typeText("test@example.com"), closeSoftKeyboard())
        onView(withId(R.id.btnLogin)).perform(click())

        // Check if the password field shows an error
        onView(withId(R.id.etLoginPassword)).check(matches(hasErrorText("Enter password")))
    }
}
