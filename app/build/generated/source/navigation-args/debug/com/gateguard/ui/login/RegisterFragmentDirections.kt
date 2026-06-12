package com.gateguard.ui.login

import androidx.navigation.ActionOnlyNavDirections
import androidx.navigation.NavDirections
import com.gateguard.R

public class RegisterFragmentDirections private constructor() {
  public companion object {
    public fun actionRegisterToHome(): NavDirections =
        ActionOnlyNavDirections(R.id.action_register_to_home)
  }
}
