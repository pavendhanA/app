package com.gateguard.ui.scanner

import android.os.Bundle
import androidx.navigation.NavDirections
import com.gateguard.R
import kotlin.Int
import kotlin.String

public class ScannerFragmentDirections private constructor() {
  private data class ActionScannerToScanResult(
    public val scanData: String,
  ) : NavDirections {
    public override val actionId: Int = R.id.action_scanner_to_scanResult

    public override val arguments: Bundle
      get() {
        val result = Bundle()
        result.putString("scanData", this.scanData)
        return result
      }
  }

  public companion object {
    public fun actionScannerToScanResult(scanData: String): NavDirections =
        ActionScannerToScanResult(scanData)
  }
}
