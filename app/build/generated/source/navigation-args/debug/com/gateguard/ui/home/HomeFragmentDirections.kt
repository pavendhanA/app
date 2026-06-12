package com.gateguard.ui.home

import androidx.navigation.ActionOnlyNavDirections
import androidx.navigation.NavDirections
import com.gateguard.R

public class HomeFragmentDirections private constructor() {
  public companion object {
    public fun actionHomeToGenerateQR(): NavDirections =
        ActionOnlyNavDirections(R.id.action_home_to_generateQR)

    public fun actionHomeToScanner(): NavDirections =
        ActionOnlyNavDirections(R.id.action_home_to_scanner)
  }
}
