package com.gateguard.ui.qr

import android.os.Bundle
import androidx.navigation.NavDirections
import com.gateguard.R
import kotlin.Int
import kotlin.String

public class GenerateQRFragmentDirections private constructor() {
  private data class ActionGenerateQRToQrDisplay(
    public val visitorData: String,
  ) : NavDirections {
    public override val actionId: Int = R.id.action_generateQR_to_qrDisplay

    public override val arguments: Bundle
      get() {
        val result = Bundle()
        result.putString("visitorData", this.visitorData)
        return result
      }
  }

  public companion object {
    public fun actionGenerateQRToQrDisplay(visitorData: String): NavDirections =
        ActionGenerateQRToQrDisplay(visitorData)
  }
}
