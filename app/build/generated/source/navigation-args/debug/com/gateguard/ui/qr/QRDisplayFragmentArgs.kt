package com.gateguard.ui.qr

import android.os.Bundle
import androidx.lifecycle.SavedStateHandle
import androidx.navigation.NavArgs
import java.lang.IllegalArgumentException
import kotlin.String
import kotlin.jvm.JvmStatic

public data class QRDisplayFragmentArgs(
  public val visitorData: String,
) : NavArgs {
  public fun toBundle(): Bundle {
    val result = Bundle()
    result.putString("visitorData", this.visitorData)
    return result
  }

  public fun toSavedStateHandle(): SavedStateHandle {
    val result = SavedStateHandle()
    result.set("visitorData", this.visitorData)
    return result
  }

  public companion object {
    @JvmStatic
    public fun fromBundle(bundle: Bundle): QRDisplayFragmentArgs {
      bundle.setClassLoader(QRDisplayFragmentArgs::class.java.classLoader)
      val __visitorData : String?
      if (bundle.containsKey("visitorData")) {
        __visitorData = bundle.getString("visitorData")
        if (__visitorData == null) {
          throw IllegalArgumentException("Argument \"visitorData\" is marked as non-null but was passed a null value.")
        }
      } else {
        throw IllegalArgumentException("Required argument \"visitorData\" is missing and does not have an android:defaultValue")
      }
      return QRDisplayFragmentArgs(__visitorData)
    }

    @JvmStatic
    public fun fromSavedStateHandle(savedStateHandle: SavedStateHandle): QRDisplayFragmentArgs {
      val __visitorData : String?
      if (savedStateHandle.contains("visitorData")) {
        __visitorData = savedStateHandle["visitorData"]
        if (__visitorData == null) {
          throw IllegalArgumentException("Argument \"visitorData\" is marked as non-null but was passed a null value")
        }
      } else {
        throw IllegalArgumentException("Required argument \"visitorData\" is missing and does not have an android:defaultValue")
      }
      return QRDisplayFragmentArgs(__visitorData)
    }
  }
}
