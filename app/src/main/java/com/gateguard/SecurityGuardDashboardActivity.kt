package com.gateguard

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton

class SecurityGuardDashboardActivity : AppCompatActivity() {

    private lateinit var btnGuardScanQr: MaterialButton
    private lateinit var btnGuardVisitorLogs: MaterialButton
    private lateinit var btnGuardLogout: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_guard_dashboard)

        btnGuardScanQr = findViewById(R.id.btnGuardScanQr)
        btnGuardVisitorLogs = findViewById(R.id.btnGuardVisitorLogs)
        btnGuardLogout = findViewById(R.id.btnGuardLogout)

        btnGuardScanQr.setOnClickListener {
            startActivity(Intent(this, ScanQrActivity::class.java))
        }

        btnGuardVisitorLogs.setOnClickListener {
            startActivity(Intent(this, VisitorLogsActivity::class.java))
        }

        btnGuardLogout.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
            finish()
        }
    }
}