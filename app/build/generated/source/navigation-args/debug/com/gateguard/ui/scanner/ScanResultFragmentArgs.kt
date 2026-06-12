package com.gateguard.ui.scanner

import android.os.Bundle
import androidx.lifecycle.SavedStateHandle
import androidx.navigation.NavArgs
import java.lang.IllegalArgumentException
import kotlin.String
import kotlin.jvm.JvmStatic

public data class ScanResultFragmentArgs(
  public val scanData: String,
) : NavArgs {
  public fun toBundle(): Bundle {
    val result = Bundle()
    result.putString("scanData", this.scanData)
    return result
  }

  public fun toSavedStateHandle(): SavedStateHandle {
    val result = SavedStateHandle()
    result.set("scanData", this.scanData)
    return result
  }

  public companion object {
    @JvmStatic
    public fun fromBundle(bundle: Bundle): ScanResultFragmentArgs {
      bundle.setClassLoader(ScanResultFragmentArgs::class.java.classLoader)
      val __scanData : String?
      if (bundle.containsKey("scanData")) {
        __scanData = bundle.getString("scanData")
        if (__scanData == null) {
          throw IllegalArgumentException("Argument \"scanData\" is marked as non-null but was passed a null value.")
        }
      } else {
        throw IllegalArgumentException("Required argument \"scanData\" is missing and does not have an android:defaultValue")
      }
      return ScanResultFragmentArgs(__scanData)
    }

    @JvmStatic
    public fun fromSavedStateHandle(savedStateHandle: SavedStateHandle): ScanResultFragmentArgs {
      val __scanData : String?
      if (savedStateHandle.contains("scanData")) {
        __scanData = savedStateHandle["scanData"]
        if (__scanData == null) {
          throw IllegalArgumentException("Argument \"scanData\" is marked as non-null but was passed a null value")
        }
      } else {
        throw IllegalArgumentException("Required argument \"scanData\" is missing and does not have an android:defaultValue")
      }
      return ScanResultFragmentArgs(__scanData)
    }
  }
}
