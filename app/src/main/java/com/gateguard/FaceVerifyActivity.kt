package com.gateguard

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton

class FaceVerifyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_face_verify)

        val tvFaceStatus = findViewById<TextView>(R.id.tvFaceStatus)
        val btnSimulateFaceCheck = findViewById<MaterialButton>(R.id.btnSimulateFaceCheck)

        btnSimulateFaceCheck.setOnClickListener {
            tvFaceStatus.text = getString(R.string.face_verified_msg)
        }
    }
}