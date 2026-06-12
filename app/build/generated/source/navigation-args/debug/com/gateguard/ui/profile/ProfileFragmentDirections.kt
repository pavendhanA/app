package com.gateguard.ui.profile

import androidx.navigation.ActionOnlyNavDirections
import androidx.navigation.NavDirections
import com.gateguard.R

public class ProfileFragmentDirections private constructor() {
  public companion object {
    public fun actionProfileToSettings(): NavDirections =
        ActionOnlyNavDirections(R.id.action_profile_to_settings)

    public fun actionProfileToLogin(): NavDirections =
        ActionOnlyNavDirections(R.id.action_profile_to_login)
  }
}
