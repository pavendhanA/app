package com.gateguard

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton

class HomeActivity : AppCompatActivity() {

    private lateinit var btnGeneratePass: MaterialButton
    private lateinit var btnScanQr: MaterialButton
    private lateinit var btnVisitorLogs: MaterialButton
    private lateinit var btnLogout: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        btnGeneratePass = findViewById(R.id.btnGeneratePass)
        btnScanQr = findViewById(R.id.btnScanQr)
        btnVisitorLogs = findViewById(R.id.btnVisitorLogs)
        btnLogout = findViewById(R.id.btnLogout)

        btnGeneratePass.setOnClickListener {
            startActivity(Intent(this, GeneratePassActivity::class.java))
        }

        btnScanQr.setOnClickListener {
            startActivity(Intent(this, ScanQrActivity::class.java))
        }

        btnVisitorLogs.setOnClickListener {
            startActivity(Intent(this, VisitorLogsActivity::class.java))
        }

        btnLogout.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }
}
