package com.gateguard.ui.splash

import androidx.navigation.ActionOnlyNavDirections
import androidx.navigation.NavDirections
import com.gateguard.R

public class SplashFragmentDirections private constructor() {
  public companion object {
    public fun actionSplashToLogin(): NavDirections =
        ActionOnlyNavDirections(R.id.action_splash_to_login)
  }
}
