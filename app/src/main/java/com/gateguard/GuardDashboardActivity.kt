package com.gateguard

import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.launch
import java.io.File

class GuardDashboardActivity : AppCompatActivity() {

    private lateinit var btnGuardScanQr: MaterialButton
    private lateinit var btnGuardVisitorLogs: MaterialButton
    private lateinit var btnGuardLogout: MaterialButton
    private lateinit var btnGuardOpenProfile: MaterialButton

    private val profileLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
            loadGuardProfile()
            loadSavedPhoto()
        }

    private lateinit var tvGuardName: TextView
    private lateinit var tvGuardRole: TextView
    private lateinit var tvGuardProfileAvatar: TextView
    private lateinit var imgGuardProfilePhoto: ImageView
    private lateinit var tvGuardProfileSubInfo: TextView
    private lateinit var tvGuardEntryCount: TextView
    private lateinit var tvGuardExitCount: TextView
    private lateinit var tvGuardInsideCount: TextView

    private val repo = FirebaseRepository()
    private val firestore = FirebaseFirestore.getInstance()
    private var currentUid: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_guard_dashboard)

        currentUid = repo.getCurrentUid()

        btnGuardScanQr = findViewById(R.id.btnGuardScanQr)
        btnGuardVisitorLogs = findViewById(R.id.btnGuardVisitorLogs)
        btnGuardLogout = findViewById(R.id.btnGuardLogout)
        btnGuardOpenProfile = findViewById(R.id.btnGuardOpenProfile)

        tvGuardName = findViewById(R.id.tvGuardName)
        tvGuardRole = findViewById(R.id.tvGuardRole)
        tvGuardProfileSubInfo = findViewById(R.id.tvGuardProfileSubInfo)
        tvGuardProfileAvatar = findViewById(R.id.tvGuardProfileAvatar)
        imgGuardProfilePhoto = findViewById(R.id.imgGuardProfilePhoto)
        tvGuardEntryCount = findViewById(R.id.tvGuardEntryCount)
        tvGuardExitCount = findViewById(R.id.tvGuardExitCount)
        tvGuardInsideCount = findViewById(R.id.tvGuardInsideCount)

        loadGuardProfile()
        loadSavedPhoto()
        loadGuardStats()

        btnGuardScanQr.setOnClickListener {
            startActivity(Intent(this, ScanQrActivity::class.java))
        }

        btnGuardVisitorLogs.setOnClickListener {
            startActivity(Intent(this, VisitorLogsActivity::class.java))
        }

        btnGuardOpenProfile.setOnClickListener {
            profileLauncher.launch(Intent(this, ProfileActivity::class.java))
        }

        btnGuardLogout.setOnClickListener {
            repo.logout()
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
            finish()
        }
    }

    override fun onResume() {
        super.onResume()
        currentUid = repo.getCurrentUid()
        loadSavedPhoto()
        loadGuardProfile()
    }

    private fun loadGuardProfile() {
        val uid = currentUid ?: return

        lifecycleScope.launch {
            val result = repo.getUserProfile(uid)

            runOnUiThread {
                result.onSuccess { user ->
                    val name = if (user.name.isBlank()) "Security Guard" else user.name
                    val role = if (user.role.isBlank()) "GUARD" else user.role
                    val phone = if (user.phone.isBlank()) "No phone added" else user.phone

                    tvGuardName.text = name
                    tvGuardRole.text = role
                    tvGuardProfileSubInfo.text = phone
                    tvGuardProfileAvatar.text = getInitials(name)
                }.onFailure {
                    tvGuardName.text = "Security Guard"
                    tvGuardRole.text = "GUARD"
                    tvGuardProfileSubInfo.text = "Scan visitors and monitor entry / exit activity"
                    tvGuardProfileAvatar.text = "G"
                }
            }
        }
    }

    private fun loadSavedPhoto() {
        val uid = currentUid ?: return
        val file = File(filesDir, "profile_photo_$uid.jpg")

        if (file.exists()) {
            try {
                val bitmap = BitmapFactory.decodeFile(file.absolutePath)
                if (bitmap != null) {
                    imgGuardProfilePhoto.setImageBitmap(bitmap)
                    imgGuardProfilePhoto.visibility = View.VISIBLE
                    tvGuardProfileAvatar.visibility = View.GONE
                } else {
                    imgGuardProfilePhoto.setImageDrawable(null)
                    tvGuardProfileAvatar.visibility = View.VISIBLE
                }
            } catch (_: Exception) {
                imgGuardProfilePhoto.setImageDrawable(null)
                tvGuardProfileAvatar.visibility = View.VISIBLE
            }
        } else {
            imgGuardProfilePhoto.setImageDrawable(null)
            tvGuardProfileAvatar.visibility = View.VISIBLE
        }
    }

    private fun loadGuardStats() {
        val today = java.text.SimpleDateFormat("d/M/yyyy", java.util.Locale.getDefault())
            .format(java.util.Date())

        firestore.collection("visitor_logs")
            .addSnapshotListener { snapshots, _ ->
                val docs = snapshots?.documents ?: emptyList()

                val todayLogs = docs.filter { it.getString("visitDate") == today }
                val approvedLogs = todayLogs.filter { it.getString("status") == "APPROVED" }

                val entry = approvedLogs.count { it.getString("type") == "ENTRY" }
                val exit = approvedLogs.count { it.getString("type") == "EXIT" }

                val latestByPass = approvedLogs
                    .mapNotNull { doc ->
                        val passId = doc.getString("passId")
                        val type = doc.getString("type")
                        val scannedAtMillis = doc.getLong("scannedAtMillis") ?: 0L

                        if (passId != null && type != null) {
                            Triple(passId, type, scannedAtMillis)
                        } else {
                            null
                        }
                    }
                    .groupBy { it.first }

                var currentlyInside = 0
                for ((_, scans) in latestByPass) {
                    val latest = scans.maxByOrNull { it.third }
                    if (latest?.second == "ENTRY") {
                        currentlyInside++
                    }
                }

                tvGuardEntryCount.text = "Entries: $entry"
                tvGuardExitCount.text = "Exits: $exit"
                tvGuardInsideCount.text = "Currently Inside: $currentlyInside"
            }
    }

    private fun getInitials(name: String): String {
        val parts = name.trim().split(" ").filter { it.isNotEmpty() }
        return when {
            parts.isEmpty() -> "G"
            parts.size == 1 -> parts[0].take(1).uppercase()
            else -> (parts[0].take(1) + parts[1].take(1)).uppercase()
        }
    }
}