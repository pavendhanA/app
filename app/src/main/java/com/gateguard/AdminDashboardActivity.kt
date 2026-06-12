package com.gateguard

import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.button.MaterialButton
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.launch
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class AdminDashboardActivity : AppCompatActivity() {

    private val firestore = FirebaseFirestore.getInstance()
    private val repo = FirebaseRepository()

    private lateinit var tvAdminName: TextView
    private lateinit var tvAdminRole: TextView
    private lateinit var tvAdminProfileSubInfo: TextView
    private lateinit var tvAdminProfileAvatar: TextView
    private lateinit var imgAdminProfilePhoto: ImageView

    private lateinit var tvTotalScans: TextView
    private lateinit var tvApprovedCount: TextView
    private lateinit var tvDeniedCount: TextView
    private lateinit var tvEntryCount: TextView
    private lateinit var tvExitCount: TextView
    private lateinit var tvCurrentlyInsideCount: TextView

    private lateinit var tvNoAdminActiveVisitors: TextView
    private lateinit var tvNoAdminUpcomingVisits: TextView

    private lateinit var recyclerAdminActiveVisitors: RecyclerView
    private lateinit var activeVisitorAdapter: ActiveVisitorAdapter

    private lateinit var recyclerAdminUpcomingVisits: RecyclerView
    private lateinit var upcomingVisitAdapter: UpcomingVisitAdapter

    private lateinit var btnAdminLogs: MaterialButton
    private lateinit var btnAdminLogout: MaterialButton
    private lateinit var btnAdminOpenProfile: MaterialButton

    private val profileLauncher =
        registerForActivityResult(androidx.activity.result.contract.ActivityResultContracts.StartActivityForResult()) {
            loadAdminProfile()
            loadSavedPhoto()
        }

    private var currentUid: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_dashboard)

        currentUid = repo.getCurrentUid()

        tvAdminName = findViewById(R.id.tvAdminName)
        tvAdminRole = findViewById(R.id.tvAdminRole)
        tvAdminProfileSubInfo = findViewById(R.id.tvAdminProfileSubInfo)
        tvAdminProfileAvatar = findViewById(R.id.tvAdminProfileAvatar)
        imgAdminProfilePhoto = findViewById(R.id.imgAdminProfilePhoto)

        tvTotalScans = findViewById(R.id.tvTotalScans)
        tvApprovedCount = findViewById(R.id.tvApprovedCount)
        tvDeniedCount = findViewById(R.id.tvDeniedCount)
        tvEntryCount = findViewById(R.id.tvEntryCount)
        tvExitCount = findViewById(R.id.tvExitCount)
        tvCurrentlyInsideCount = findViewById(R.id.tvCurrentlyInsideCount)

        tvNoAdminActiveVisitors = findViewById(R.id.tvNoAdminActiveVisitors)
        tvNoAdminUpcomingVisits = findViewById(R.id.tvNoAdminUpcomingVisits)

        recyclerAdminActiveVisitors = findViewById(R.id.recyclerAdminActiveVisitors)
        activeVisitorAdapter = ActiveVisitorAdapter(emptyList()) { visitor ->
            val intent = Intent(this, ActiveVisitorDetailsActivity::class.java)
            intent.putExtra("passId", visitor.passId)
            intent.putExtra("visitorName", visitor.visitorName)
            intent.putExtra("phoneNumber", visitor.phoneNumber)
            intent.putExtra("scannedAt", visitor.scannedAt)
            intent.putExtra("type", visitor.type)
            intent.putExtra("status", visitor.status)
            intent.putExtra("purpose", visitor.purpose)
            startActivity(intent)
        }
        recyclerAdminActiveVisitors.layoutManager =
            LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        recyclerAdminActiveVisitors.adapter = activeVisitorAdapter

        recyclerAdminUpcomingVisits = findViewById(R.id.recyclerAdminUpcomingVisits)
        upcomingVisitAdapter = UpcomingVisitAdapter(emptyList()) { visit ->
            val intent = Intent(this, UpcomingVisitDetailsActivity::class.java)
            intent.putExtra("passId", visit.passId)
            intent.putExtra("visitorName", visit.visitorName)
            intent.putExtra("phoneNumber", visit.phoneNumber)
            intent.putExtra("visitDate", visit.visitDate)
            intent.putExtra("fromTime", visit.fromTime)
            intent.putExtra("toTime", visit.toTime)
            intent.putExtra("purpose", visit.purpose)
            intent.putExtra("status", visit.status)
            startActivity(intent)
        }
        recyclerAdminUpcomingVisits.layoutManager =
            LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        recyclerAdminUpcomingVisits.adapter = upcomingVisitAdapter

        btnAdminLogs = findViewById(R.id.btnAdminLogs)
        btnAdminLogout = findViewById(R.id.btnAdminLogout)
        btnAdminOpenProfile = findViewById(R.id.btnAdminOpenProfile)

        loadAdminProfile()
        loadSavedPhoto()
        listenToDashboardData()

        btnAdminLogs.setOnClickListener {
            startActivity(Intent(this, VisitorLogsActivity::class.java))
        }

        btnAdminOpenProfile.setOnClickListener {
            profileLauncher.launch(Intent(this, ProfileActivity::class.java))
        }

        btnAdminLogout.setOnClickListener {
            repo.logout()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }

    override fun onResume() {
        super.onResume()
        currentUid = repo.getCurrentUid()
        loadSavedPhoto()
        loadAdminProfile()
    }

    private fun loadAdminProfile() {
        val uid = currentUid ?: return

        lifecycleScope.launch {
            val result = repo.getUserProfile(uid)
            runOnUiThread {
                result.onSuccess { user ->
                    val name = if (user.name.isBlank()) "Admin User" else user.name
                    val role = if (user.role.isBlank()) "ADMIN" else user.role
                    val phone = if (user.phone.isBlank()) "No phone added" else user.phone

                    tvAdminName.text = name
                    tvAdminRole.text = role
                    tvAdminProfileSubInfo.text = phone
                    tvAdminProfileAvatar.text = getInitials(name)
                }.onFailure {
                    tvAdminName.text = "Admin User"
                    tvAdminRole.text = "ADMIN"
                    tvAdminProfileSubInfo.text = "View analytics and visitor activity"
                    tvAdminProfileAvatar.text = "A"
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
                    imgAdminProfilePhoto.setImageBitmap(bitmap)
                    imgAdminProfilePhoto.visibility = View.VISIBLE
                    tvAdminProfileAvatar.visibility = View.GONE
                } else {
                    imgAdminProfilePhoto.setImageDrawable(null)
                    tvAdminProfileAvatar.visibility = View.VISIBLE
                }
            } catch (_: Exception) {
                imgAdminProfilePhoto.setImageDrawable(null)
                tvAdminProfileAvatar.visibility = View.VISIBLE
            }
        } else {
            imgAdminProfilePhoto.setImageDrawable(null)
            tvAdminProfileAvatar.visibility = View.VISIBLE
        }
    }

    private fun listenToDashboardData() {
        val today = getTodayDate()

        firestore.collection("visitor_logs")
            .addSnapshotListener { snapshots, _ ->
                val docs = snapshots?.documents ?: emptyList()

                val todayLogs = docs.filter { it.getString("visitDate") == today }

                val total = todayLogs.size
                val approved = todayLogs.count { it.getString("status") == "APPROVED" }
                val denied = todayLogs.count { it.getString("status") == "DENIED" }
                val entry = todayLogs.count {
                    it.getString("status") == "APPROVED" && it.getString("type") == "ENTRY"
                }
                val exit = todayLogs.count {
                    it.getString("status") == "APPROVED" && it.getString("type") == "EXIT"
                }

                val approvedLogs = todayLogs.filter { it.getString("status") == "APPROVED" }

                val latestByPass = approvedLogs
                    .mapNotNull { doc ->
                        val passId = doc.getString("passId")
                        val name = doc.getString("visitorName")
                        val phone = doc.getString("phoneNumber")
                        val scannedAt = doc.getString("scannedAt")
                        val scannedAtMillis = doc.getLong("scannedAtMillis") ?: 0L
                        val type = doc.getString("type")
                        val status = doc.getString("status")
                        val purpose = doc.getString("purpose")

                        if (
                            passId != null &&
                            name != null &&
                            phone != null &&
                            scannedAt != null &&
                            type != null &&
                            status != null &&
                            purpose != null
                        ) {
                            ActiveVisitor(
                                visitorName = name,
                                phoneNumber = phone,
                                scannedAt = scannedAt,
                                scannedAtMillis = scannedAtMillis,
                                passId = passId,
                                type = type,
                                status = status,
                                purpose = purpose
                            )
                        } else {
                            null
                        }
                    }
                    .groupBy { it.passId }

                val activeVisitors = mutableListOf<ActiveVisitor>()

                for ((_, scans) in latestByPass) {
                    val latest = scans.maxByOrNull { it.scannedAtMillis }
                    if (latest != null && latest.type == "ENTRY") {
                        activeVisitors.add(latest)
                    }
                }

                tvTotalScans.text = total.toString()
                tvApprovedCount.text = approved.toString()
                tvDeniedCount.text = denied.toString()
                tvEntryCount.text = entry.toString()
                tvExitCount.text = "Exits: $exit"
                tvCurrentlyInsideCount.text = "Currently Inside: ${activeVisitors.size}"

                activeVisitorAdapter.updateData(activeVisitors)
                tvNoAdminActiveVisitors.visibility =
                    if (activeVisitors.isEmpty()) View.VISIBLE else View.GONE
            }

        firestore.collection("visitor_passes")
            .addSnapshotListener { passSnapshots, _ ->
                val passDocs = passSnapshots?.documents ?: emptyList()

                val upcomingVisits = passDocs.mapNotNull { doc ->
                    val visitDate = doc.getString("visitDate")
                    val status = doc.getString("status")
                    val usedForEntry = doc.getBoolean("usedForEntry") ?: false

                    if (visitDate == today && status == "ACTIVE" && !usedForEntry) {
                        UpcomingVisit(
                            visitorName = doc.getString("visitorName").orEmpty(),
                            phoneNumber = doc.getString("phoneNumber").orEmpty(),
                            visitDate = doc.getString("visitDate").orEmpty(),
                            fromTime = doc.getString("fromTime").orEmpty(),
                            toTime = doc.getString("toTime").orEmpty(),
                            purpose = doc.getString("purpose").orEmpty(),
                            status = doc.getString("status").orEmpty(),
                            passId = doc.getString("passId").orEmpty()
                        )
                    } else {
                        null
                    }
                }.sortedBy { it.fromTime }

                upcomingVisitAdapter.updateData(upcomingVisits)
                tvNoAdminUpcomingVisits.visibility =
                    if (upcomingVisits.isEmpty()) View.VISIBLE else View.GONE
            }
    }

    private fun getTodayDate(): String {
        val sdf = SimpleDateFormat("d/M/yyyy", Locale.getDefault())
        return sdf.format(Date())
    }

    private fun getInitials(name: String): String {
        val parts = name.trim().split(" ").filter { it.isNotEmpty() }
        return when {
            parts.isEmpty() -> "A"
            parts.size == 1 -> parts[0].take(1).uppercase()
            else -> (parts[0].take(1) + parts[1].take(1)).uppercase()
        }
    }
}
