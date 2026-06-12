package com.gateguard

import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
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

class HostDashboardActivity : AppCompatActivity() {

    private lateinit var btnHostGeneratePass: MaterialButton
    private lateinit var btnHostScanShortcut: MaterialButton
    private lateinit var btnHostLogout: MaterialButton

    private lateinit var navLogs: LinearLayout
    private lateinit var navProfile: LinearLayout
    private lateinit var navNotifications: LinearLayout

    private lateinit var tvHostName: TextView
    private lateinit var tvGreeting: TextView
    private lateinit var tvActiveNowCount: TextView
    private lateinit var tvTodayTotalCount: TextView
    private lateinit var tvHostEntryCount: TextView
    private lateinit var tvHostExitCount: TextView
    private lateinit var tvHostProfileSubInfo: TextView
    private lateinit var tvHostProfileAvatar: TextView
    private lateinit var imgHostProfilePhoto: ImageView
    private lateinit var tvNoActiveVisitors: TextView
    private lateinit var tvNoUpcomingVisits: TextView
    private lateinit var tvActiveSeeAll: TextView
    private lateinit var tvUpcomingSeeAll: TextView

    private lateinit var recyclerActiveVisitors: RecyclerView
    private lateinit var activeVisitorAdapter: ActiveVisitorAdapter

    private lateinit var recyclerUpcomingVisits: RecyclerView
    private lateinit var upcomingVisitAdapter: UpcomingVisitAdapter

    private val profileLauncher =
        registerForActivityResult(androidx.activity.result.contract.ActivityResultContracts.StartActivityForResult()) {
            loadHostProfile()
            loadSavedPhoto()
        }

    private val repo = FirebaseRepository()
    private val firestore = FirebaseFirestore.getInstance()
    private var currentUid: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_host_dashboard)

        currentUid = repo.getCurrentUid()

        btnHostGeneratePass = findViewById(R.id.btnHostGeneratePass)
        btnHostScanShortcut = findViewById(R.id.btnHostScanShortcut)
        btnHostLogout = findViewById(R.id.btnHostLogout)

        navLogs = findViewById(R.id.navLogs)
        navProfile = findViewById(R.id.navProfile)
        navNotifications = findViewById(R.id.navNotifications)

        tvHostName = findViewById(R.id.tvHostName)
        tvGreeting = findViewById(R.id.tvGreeting)
        tvActiveNowCount = findViewById(R.id.tvActiveNowCount)
        tvTodayTotalCount = findViewById(R.id.tvTodayTotalCount)
        tvHostEntryCount = findViewById(R.id.tvHostEntryCount)
        tvHostExitCount = findViewById(R.id.tvHostExitCount)
        tvHostProfileSubInfo = findViewById(R.id.tvHostProfileSubInfo)
        tvHostProfileAvatar = findViewById(R.id.tvHostProfileAvatar)
        imgHostProfilePhoto = findViewById(R.id.imgHostProfilePhoto)
        tvNoActiveVisitors = findViewById(R.id.tvNoActiveVisitors)
        tvNoUpcomingVisits = findViewById(R.id.tvNoUpcomingVisits)
        tvActiveSeeAll = findViewById(R.id.tvActiveSeeAll)
        tvUpcomingSeeAll = findViewById(R.id.tvUpcomingSeeAll)

        recyclerActiveVisitors = findViewById(R.id.recyclerActiveVisitors)
        activeVisitorAdapter = ActiveVisitorAdapter(emptyList()) { visitor ->
            val intent = Intent(this, ActiveVisitorDetailsActivity::class.java)
            intent.putExtra("passId", visitor.passId)
            intent.putExtra("visitorName", visitor.visitorName)
            intent.putExtra("phoneNumber", visitor.phoneNumber)
            intent.putExtra("visitorType", visitor.visitorType)
            intent.putExtra("towerBlock", visitor.towerBlock)
            intent.putExtra("flatNumber", visitor.flatNumber)
            intent.putExtra("vehicleNumber", visitor.vehicleNumber)
            intent.putExtra("noOfVisitors", visitor.noOfVisitors)
            intent.putExtra("type", visitor.type)
            intent.putExtra("scannedAt", visitor.scannedAt)
            intent.putExtra("status", visitor.status)
            intent.putExtra("purpose", visitor.purpose)
            startActivity(intent)
        }
        recyclerActiveVisitors.layoutManager =
            LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        recyclerActiveVisitors.adapter = activeVisitorAdapter

        recyclerUpcomingVisits = findViewById(R.id.recyclerUpcomingVisits)
        upcomingVisitAdapter = UpcomingVisitAdapter(emptyList()) { visit ->
            val intent = Intent(this, UpcomingVisitDetailsActivity::class.java)
            intent.putExtra("passId", visit.passId)
            intent.putExtra("visitorName", visit.visitorName)
            intent.putExtra("phoneNumber", visit.phoneNumber)
            intent.putExtra("visitorType", visit.visitorType)
            intent.putExtra("towerBlock", visit.towerBlock)
            intent.putExtra("flatNumber", visit.flatNumber)
            intent.putExtra("vehicleNumber", visit.vehicleNumber)
            intent.putExtra("noOfVisitors", visit.noOfVisitors)
            intent.putExtra("visitDate", visit.visitDate)
            intent.putExtra("fromTime", visit.fromTime)
            intent.putExtra("toTime", visit.toTime)
            intent.putExtra("purpose", visit.purpose)
            intent.putExtra("status", visit.status)
            startActivity(intent)
        }
        recyclerUpcomingVisits.layoutManager =
            LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        recyclerUpcomingVisits.adapter = upcomingVisitAdapter

        loadHostProfile()
        loadSavedPhoto()
        listenToDashboardData()

        btnHostGeneratePass.setOnClickListener {
            startActivity(Intent(this, GeneratePassActivity::class.java))
        }

        btnHostScanShortcut.setOnClickListener {
            startActivity(Intent(this, ScanQrActivity::class.java))
        }

        navLogs.setOnClickListener {
            startActivity(Intent(this, VisitorLogsActivity::class.java))
        }

        navProfile.setOnClickListener {
            profileLauncher.launch(Intent(this, ProfileActivity::class.java))
        }

        navNotifications.setOnClickListener {
            Toast.makeText(this, "Notifications feature coming soon", Toast.LENGTH_SHORT).show()
        }

        tvActiveSeeAll.setOnClickListener {
            startActivity(Intent(this, VisitorLogsActivity::class.java))
        }

        tvUpcomingSeeAll.setOnClickListener {
            startActivity(Intent(this, VisitorLogsActivity::class.java))
        }

        btnHostLogout.setOnClickListener {
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
        loadHostProfile()
    }

    private fun loadHostProfile() {
        val uid = currentUid ?: return

        lifecycleScope.launch {
            val result = repo.getUserProfile(uid)
            runOnUiThread {
                result.onSuccess { user ->
                    val name = if (user.name.isBlank()) "Host" else user.name
                    val phone = if (user.phone.isBlank()) "No phone added" else user.phone
                    tvGreeting.text = "Hello,"
                    tvHostName.text = name
                    tvHostProfileSubInfo.text = phone
                    tvHostProfileAvatar.text = getInitials(name)
                }.onFailure {
                    tvGreeting.text = "Hello,"
                    tvHostName.text = "Host"
                    tvHostProfileSubInfo.text = "Manage passes and visitor activity"
                    tvHostProfileAvatar.text = "H"
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
                    imgHostProfilePhoto.setImageBitmap(bitmap)
                    imgHostProfilePhoto.visibility = View.VISIBLE
                    tvHostProfileAvatar.visibility = View.GONE
                } else {
                    imgHostProfilePhoto.setImageDrawable(null)
                    tvHostProfileAvatar.visibility = View.VISIBLE
                }
            } catch (_: Exception) {
                imgHostProfilePhoto.setImageDrawable(null)
                tvHostProfileAvatar.visibility = View.VISIBLE
            }
        } else {
            imgHostProfilePhoto.setImageDrawable(null)
            tvHostProfileAvatar.visibility = View.VISIBLE
        }
    }

    private fun listenToDashboardData() {
        val uid = currentUid ?: return
        val today = getTodayDate()

        firestore.collection("visitor_passes")
            .addSnapshotListener { passSnapshots, _ ->
                val passDocs = passSnapshots?.documents ?: emptyList()

                val hostTodayPasses = passDocs.filter {
                    it.getString("hostUid") == uid &&
                            it.getString("visitDate") == today
                }

                val upcomingVisits = hostTodayPasses.mapNotNull { doc ->
                    val status = doc.getString("status")
                    val usedForEntry = doc.getBoolean("usedForEntry") ?: false

                    if (status == "ACTIVE" && !usedForEntry) {
                        UpcomingVisit(
                            visitorName = doc.getString("visitorName").orEmpty(),
                            phoneNumber = doc.getString("phoneNumber").orEmpty(),
                            visitorType = doc.getString("visitorType").orEmpty(),
                            towerBlock = doc.getString("towerBlock").orEmpty(),
                            flatNumber = doc.getString("flatNumber").orEmpty(),
                            vehicleNumber = doc.getString("vehicleNumber").orEmpty(),
                            noOfVisitors = doc.getString("noOfVisitors").orEmpty(),
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
                tvNoUpcomingVisits.visibility =
                    if (upcomingVisits.isEmpty()) View.VISIBLE else View.GONE

                tvTodayTotalCount.text = hostTodayPasses.size.toString()
            }

        firestore.collection("visitor_logs")
            .addSnapshotListener { logSnapshots, _ ->
                val logDocs = logSnapshots?.documents ?: emptyList()

                val hostLogs = logDocs.filter {
                    it.getString("hostUid") == uid &&
                            it.getString("visitDate") == today &&
                            it.getString("status") == "APPROVED"
                }

                val entryCount = hostLogs.count { it.getString("type") == "ENTRY" }
                val exitCount = hostLogs.count { it.getString("type") == "EXIT" }

                val latestByPass = hostLogs
                    .mapNotNull { doc ->
                        val passId = doc.getString("passId")
                        val name = doc.getString("visitorName")
                        val phone = doc.getString("phoneNumber")
                        val scannedAt = doc.getString("scannedAt")
                        val type = doc.getString("type")
                        val status = doc.getString("status")
                        val purpose = doc.getString("purpose")

                        if (passId != null && name != null && phone != null &&
                            scannedAt != null && type != null && status != null && purpose != null
                        ) {
                            ActiveVisitor(
                                visitorName = name,
                                phoneNumber = phone,
                                visitorType = doc.getString("visitorType").orEmpty(),
                                towerBlock = doc.getString("towerBlock").orEmpty(),
                                flatNumber = doc.getString("flatNumber").orEmpty(),
                                vehicleNumber = doc.getString("vehicleNumber").orEmpty(),
                                noOfVisitors = doc.getString("noOfVisitors").orEmpty(),
                                scannedAt = scannedAt,
                                scannedAtMillis = doc.getLong("scannedAtMillis") ?: 0L,
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

                tvHostEntryCount.text = entryCount.toString()
                tvHostExitCount.text = exitCount.toString()
                tvActiveNowCount.text = activeVisitors.size.toString()

                activeVisitorAdapter.updateData(activeVisitors)
                tvNoActiveVisitors.visibility =
                    if (activeVisitors.isEmpty()) View.VISIBLE else View.GONE
            }
    }

    private fun getTodayDate(): String {
        val sdf = SimpleDateFormat("d/M/yyyy", Locale.getDefault())
        return sdf.format(Date())
    }

    private fun getInitials(name: String): String {
        val parts = name.trim().split(" ").filter { it.isNotEmpty() }
        return when {
            parts.isEmpty() -> "H"
            parts.size == 1 -> parts[0].take(1).uppercase()
            else -> (parts[0].take(1) + parts[1].take(1)).uppercase()
        }
    }
}