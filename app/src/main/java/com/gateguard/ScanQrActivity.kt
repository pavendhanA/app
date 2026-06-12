package com.gateguard

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.journeyapps.barcodescanner.ScanContract
import com.journeyapps.barcodescanner.ScanOptions
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class ScanQrActivity : AppCompatActivity() {

    private lateinit var btnStartScan: MaterialButton
    private lateinit var btnBackFromScan: MaterialButton
    private lateinit var tvValidationStatus: TextView
    private lateinit var tvValidationReason: TextView
    private lateinit var tvScanResult: TextView
    private lateinit var cardValidationStatus: MaterialCardView

    private lateinit var database: AppDatabase
    private val syncRepo = VisitorSyncRepository()
    private val firebaseRepo = FirebaseRepository()
    private val passRepository = PassRepository()

    // FIX: prevent duplicate fast scans
    private var isProcessingScan = false
    private var lastScannedValue: String? = null

    private val barcodeLauncher = registerForActivityResult(ScanContract()) { result ->
        if (result.contents != null) {
            handleScannedQr(result.contents)
        } else {
            Toast.makeText(this, "Scan cancelled", Toast.LENGTH_SHORT).show()
            resetScanLock()
        }
    }

    private val cameraPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                startQrScanner()
            } else {
                Toast.makeText(this, "Camera permission is required to scan QR", Toast.LENGTH_SHORT).show()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scan_qr)

        database = AppDatabase.getDatabase(this)

        btnStartScan = findViewById(R.id.btnStartScan)
        btnBackFromScan = findViewById(R.id.btnBackFromScan)
        tvValidationStatus = findViewById(R.id.tvValidationStatus)
        tvValidationReason = findViewById(R.id.tvValidationReason)
        tvScanResult = findViewById(R.id.tvScanResult)
        cardValidationStatus = findViewById(R.id.cardValidationStatus)

        btnStartScan.setOnClickListener {
            checkCameraPermissionAndScan()
        }

        btnBackFromScan.setOnClickListener {
            finish()
        }
    }

    private fun checkCameraPermissionAndScan() {
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED -> {
                startQrScanner()
            }
            else -> {
                cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
        }
    }

    private fun startQrScanner() {
        val options = ScanOptions()
        options.setPrompt("Scan visitor QR pass")
        options.setBeepEnabled(true)
        options.setOrientationLocked(true)
        options.setDesiredBarcodeFormats(ScanOptions.QR_CODE)
        options.setCaptureActivity(CaptureActivityPortrait::class.java)
        barcodeLauncher.launch(options)
    }

    private fun handleScannedQr(qrContent: String) {
        if (isProcessingScan) return
        if (lastScannedValue == qrContent) return

        isProcessingScan = true
        lastScannedValue = qrContent

        validateQrData(qrContent)
    }

    private fun resetScanLock() {
        window.decorView.postDelayed({
            isProcessingScan = false
            lastScannedValue = null
        }, 1500)
    }

    private fun validateQrData(qrContent: String) {
        tvScanResult.text = qrContent

        val parsedData = parseQrContent(qrContent)

        if (parsedData == null) {
            val log = VisitorLogEntity(
                visitorName = "Unknown",
                phoneNumber = "-",
                visitorType = "-",
                towerBlock = "-",
                flatNumber = "-",
                vehicleNumber = "-",
                noOfVisitors = "-",
                visitDate = "-",
                fromTime = "-",
                toTime = "-",
                purpose = "-",
                status = "DENIED",
                reason = "Invalid QR format",
                scannedAt = getCurrentDateTime(),
                scannedAtMillis = System.currentTimeMillis(),
                type = "UNKNOWN",
                scannedByUid = firebaseRepo.getCurrentUid().orEmpty(),
                synced = false,
                remoteId = "denied_${System.currentTimeMillis()}",
                passId = "",
                hostUid = ""
            )
            showDenied("DENIED", "Invalid QR format. This visitor pass is not recognized.")
            saveLog(log)
            resetScanLock()
            return
        }

        val visitorName = parsedData["visitorName"].orEmpty()
        val phoneNumber = parsedData["phoneNumber"].orEmpty()
        val visitorType = parsedData["visitorType"].orEmpty()
        val towerBlock = parsedData["towerBlock"].orEmpty()
        val flatNumber = parsedData["flatNumber"].orEmpty()
        val vehicleNumber = parsedData["vehicleNumber"].orEmpty()
        val noOfVisitors = parsedData["noOfVisitors"].orEmpty()
        val visitDate = parsedData["visitDate"].orEmpty()
        val fromTime = parsedData["fromTime"].orEmpty()
        val toTime = parsedData["toTime"].orEmpty()
        val purpose = parsedData["purpose"].orEmpty()
        val passIdFromData = parsedData["passId"].orEmpty()
        val hostUidFromData = parsedData["hostUid"].orEmpty()

        if (
            visitorName.isEmpty() ||
            phoneNumber.isEmpty() ||
            visitDate.isEmpty() ||
            fromTime.isEmpty() ||
            toTime.isEmpty() ||
            purpose.isEmpty()
        ) {
            val log = VisitorLogEntity(
                visitorName = visitorName.ifEmpty { "Unknown" },
                phoneNumber = phoneNumber.ifEmpty { "-" },
                visitorType = visitorType.ifEmpty { "-" },
                towerBlock = towerBlock.ifEmpty { "-" },
                flatNumber = flatNumber.ifEmpty { "-" },
                vehicleNumber = vehicleNumber.ifEmpty { "-" },
                noOfVisitors = noOfVisitors.ifEmpty { "-" },
                visitDate = visitDate.ifEmpty { "-" },
                fromTime = fromTime.ifEmpty { "-" },
                toTime = toTime.ifEmpty { "-" },
                purpose = purpose.ifEmpty { "-" },
                status = "DENIED",
                reason = "Missing required visitor pass information",
                scannedAt = getCurrentDateTime(),
                scannedAtMillis = System.currentTimeMillis(),
                type = "UNKNOWN",
                scannedByUid = firebaseRepo.getCurrentUid().orEmpty(),
                synced = false,
                remoteId = "denied_${System.currentTimeMillis()}",
                passId = passIdFromData,
                hostUid = hostUidFromData
            )
            showDenied("DENIED", "Missing required visitor pass information.")
            saveLog(log)
            resetScanLock()
            return
        }

        val today = getTodayDate()

        if (visitDate != today) {
            val reason = "Pass expired or not valid for today."
            val log = VisitorLogEntity(
                visitorName = visitorName,
                phoneNumber = phoneNumber,
                visitorType = visitorType,
                towerBlock = towerBlock,
                flatNumber = flatNumber,
                vehicleNumber = vehicleNumber,
                noOfVisitors = noOfVisitors,
                visitDate = visitDate,
                fromTime = fromTime,
                toTime = toTime,
                purpose = purpose,
                status = "DENIED",
                reason = reason,
                scannedAt = getCurrentDateTime(),
                scannedAtMillis = System.currentTimeMillis(),
                type = "UNKNOWN",
                scannedByUid = firebaseRepo.getCurrentUid().orEmpty(),
                synced = false,
                remoteId = "denied_${System.currentTimeMillis()}",
                passId = passIdFromData,
                hostUid = hostUidFromData
            )
            showDenied("DENIED", "$reason\nValid date: $visitDate\nToday: $today")
            saveLog(log)
            resetScanLock()
            return
        }

        val currentTimeMinutes = getCurrentTimeInMinutes()
        val fromTimeMinutes = convertTimeToMinutes(fromTime)
        val toTimeMinutes = convertTimeToMinutes(toTime)

        if (fromTimeMinutes == null || toTimeMinutes == null) {
            val log = VisitorLogEntity(
                visitorName = visitorName,
                phoneNumber = phoneNumber,
                visitorType = visitorType,
                towerBlock = towerBlock,
                flatNumber = flatNumber,
                vehicleNumber = vehicleNumber,
                noOfVisitors = noOfVisitors,
                visitDate = visitDate,
                fromTime = fromTime,
                toTime = toTime,
                purpose = purpose,
                status = "DENIED",
                reason = "Invalid time format in QR pass",
                scannedAt = getCurrentDateTime(),
                scannedAtMillis = System.currentTimeMillis(),
                type = "UNKNOWN",
                scannedByUid = firebaseRepo.getCurrentUid().orEmpty(),
                synced = false,
                remoteId = "denied_${System.currentTimeMillis()}",
                passId = passIdFromData,
                hostUid = hostUidFromData
            )
            showDenied("DENIED", "Invalid time format in QR pass.")
            saveLog(log)
            resetScanLock()
            return
        }

        if (currentTimeMinutes < fromTimeMinutes) {
            val reason = "Visitor is too early."
            val log = VisitorLogEntity(
                visitorName = visitorName,
                phoneNumber = phoneNumber,
                visitorType = visitorType,
                towerBlock = towerBlock,
                flatNumber = flatNumber,
                vehicleNumber = vehicleNumber,
                noOfVisitors = noOfVisitors,
                visitDate = visitDate,
                fromTime = fromTime,
                toTime = toTime,
                purpose = purpose,
                status = "DENIED",
                reason = reason,
                scannedAt = getCurrentDateTime(),
                scannedAtMillis = System.currentTimeMillis(),
                type = "UNKNOWN",
                scannedByUid = firebaseRepo.getCurrentUid().orEmpty(),
                synced = false,
                remoteId = "denied_${System.currentTimeMillis()}",
                passId = passIdFromData,
                hostUid = hostUidFromData
            )
            showDenied("DENIED", "$reason\nAllowed from: $fromTime\nCurrent time: ${getCurrentTimeFormatted()}")
            saveLog(log)
            resetScanLock()
            return
        }

        if (currentTimeMinutes > toTimeMinutes) {
            val reason = "Visitor pass time has expired."
            val log = VisitorLogEntity(
                visitorName = visitorName,
                phoneNumber = phoneNumber,
                visitorType = visitorType,
                towerBlock = towerBlock,
                flatNumber = flatNumber,
                vehicleNumber = vehicleNumber,
                noOfVisitors = noOfVisitors,
                visitDate = visitDate,
                fromTime = fromTime,
                toTime = toTime,
                purpose = purpose,
                status = "DENIED",
                reason = reason,
                scannedAt = getCurrentDateTime(),
                scannedAtMillis = System.currentTimeMillis(),
                type = "UNKNOWN",
                scannedByUid = firebaseRepo.getCurrentUid().orEmpty(),
                synced = false,
                remoteId = "denied_${System.currentTimeMillis()}",
                passId = passIdFromData,
                hostUid = hostUidFromData
            )
            showDenied("DENIED", "$reason\nAllowed until: $toTime\nCurrent time: ${getCurrentTimeFormatted()}")
            saveLog(log)
            resetScanLock()
            return
        }

        if (passIdFromData.isNotEmpty()) {
            lifecycleScope.launch {
                val pass = passRepository.getPassRemote(passIdFromData)
                if (pass != null) {
                    validatePassFromServer(pass)
                } else {
                    processLocalValidation(
                        visitorName,
                        phoneNumber,
                        visitorType,
                        towerBlock,
                        flatNumber,
                        vehicleNumber,
                        noOfVisitors,
                        visitDate,
                        fromTime,
                        toTime,
                        purpose,
                        passIdFromData,
                        hostUidFromData
                    )
                }
            }
        } else {
            processLocalValidation(
                visitorName,
                phoneNumber,
                visitorType,
                towerBlock,
                flatNumber,
                vehicleNumber,
                noOfVisitors,
                visitDate,
                fromTime,
                toTime,
                purpose,
                "",
                hostUidFromData
            )
        }
    
    }

    private fun processLocalValidation(
        visitorName: String,
        phoneNumber: String,
        visitorType: String,
        towerBlock: String,
        flatNumber: String,
        vehicleNumber: String,
        noOfVisitors: String,
        visitDate: String,
        fromTime: String,
        toTime: String,
        purpose: String,
        passId: String,
        hostUid: String
    ) {
        lifecycleScope.launch {
            val existingLogs = database.visitorLogDao().getAllLogs()

            val approvedLogsForPass = existingLogs.filter {
                it.passId == passId && it.status == "APPROVED"
            }

            val entryExists = approvedLogsForPass.any { it.type == "ENTRY" }
            val exitExists = approvedLogsForPass.any { it.type == "EXIT" }

            val type = when {
                !entryExists -> "ENTRY"
                entryExists && !exitExists -> "EXIT"
                else -> {
                    runOnUiThread {
                        showDenied("EXPIRED", "This QR pass has already been used for entry and exit.")
                    }
                    resetScanLock()
                    return@launch
                }
            }

            val nowMillis = System.currentTimeMillis()
            val approveReason = "Visitor access is valid (Local)."

            val approvedLog = VisitorLogEntity(
                remoteId = "${passId}_${type}_$nowMillis",
                passId = passId,
                hostUid = hostUid,
                scannedByUid = firebaseRepo.getCurrentUid().orEmpty(),
                visitorName = visitorName,
                phoneNumber = phoneNumber,
                visitorType = visitorType,
                towerBlock = towerBlock,
                flatNumber = flatNumber,
                vehicleNumber = vehicleNumber,
                noOfVisitors = noOfVisitors,
                visitDate = visitDate,
                fromTime = fromTime,
                toTime = toTime,
                purpose = purpose,
                status = "APPROVED",
                reason = approveReason,
                scannedAt = getCurrentDateTime(),
                scannedAtMillis = nowMillis,
                type = type,
                synced = false
            )

            runOnUiThread {
                showApproved(
                    "APPROVED ($type)",
                    "$approveReason\nGuest: $visitorName ($visitorType)\nFlat: $towerBlock - $flatNumber\nDate: $visitDate\nTime: $fromTime to $toTime"
                )
            }

            saveLog(approvedLog)
            resetScanLock()
        }
    }

    private fun validatePassFromServer(pass: VisitorPassRemote) {
        lifecycleScope.launch {
            if (pass.status == "CANCELLED") {
                runOnUiThread {
                    showDenied("CANCELLED", "This visitor pass has been cancelled by the host.")
                }
                resetScanLock()
                return@launch
            }

            val type = when {
                !pass.usedForEntry -> "ENTRY"
                pass.usedForEntry && !pass.usedForExit -> "EXIT"
                else -> {
                    runOnUiThread {
                        showDenied("EXPIRED", "This QR pass has already been used for entry and exit.")
                    }
                    resetScanLock()
                    return@launch
                }
            }

            val updatedPass = when (type) {
                "ENTRY" -> pass.copy(usedForEntry = true)
                "EXIT" -> pass.copy(usedForExit = true, status = "COMPLETED")
                else -> pass
            }

            val passUpdateResult = passRepository.updatePassRemote(updatedPass)

            if (passUpdateResult.isFailure) {
                runOnUiThread {
                    showDenied("ERROR", "Failed to update pass status on server.")
                }
                resetScanLock()
                return@launch
            }

            val nowMillis = System.currentTimeMillis()
            val nowText = getCurrentDateTime()
            val reason = "Visitor access is valid."

            val logId = "${pass.passId}_${type}_$nowMillis"
            val localLog = VisitorLogEntity(
                remoteId = logId,
                passId = pass.passId,
                hostUid = pass.hostUid,
                scannedByUid = firebaseRepo.getCurrentUid().orEmpty(),
                visitorName = pass.visitorName,
                phoneNumber = pass.phoneNumber,
                visitorType = pass.visitorType,
                towerBlock = pass.towerBlock,
                flatNumber = pass.flatNumber,
                vehicleNumber = pass.vehicleNumber,
                noOfVisitors = pass.noOfVisitors,
                visitDate = pass.visitDate,
                fromTime = pass.fromTime,
                toTime = pass.toTime,
                purpose = pass.purpose,
                status = "APPROVED",
                reason = reason,
                scannedAt = nowText,
                scannedAtMillis = nowMillis,
                type = type,
                synced = false
            )

            try {
                database.visitorLogDao().insertLog(localLog)
            } catch (e: Exception) {
                // Ignore
            }

            val remote = VisitorLogRemote(
                passId = pass.passId,
                hostUid = pass.hostUid,
                visitorName = pass.visitorName,
                phoneNumber = pass.phoneNumber,
                visitDate = pass.visitDate,
                purpose = pass.purpose,
                status = "APPROVED",
                scannedAt = nowText,
                scannedAtMillis = nowMillis,
                type = type
            )

            // Show approved since server update was successful
            runOnUiThread {
                showApproved(
                    "APPROVED ($type)",
                    "$reason\nGuest: ${pass.visitorName} (${pass.visitorType})\nFlat: ${pass.towerBlock} - ${pass.flatNumber}\nDate: ${pass.visitDate}\nTime: ${pass.fromTime} to ${pass.toTime}"
                )
            }

            val logResult = syncRepo.uploadLog(remote)
            if (logResult.isFailure) {
                runOnUiThread {
                    Toast.makeText(this@ScanQrActivity, "Note: Log synced locally", Toast.LENGTH_SHORT).show()
                }
            } else {
                runOnUiThread {
                    Toast.makeText(this@ScanQrActivity, "$type Logged Successfully", Toast.LENGTH_SHORT).show()
                }
            }

            resetScanLock()
        }
    }

    private fun saveLog(log: VisitorLogEntity) {
        lifecycleScope.launch {
            try {
                database.visitorLogDao().insertLog(log)
            } catch (e: Exception) {
                // Ignore
            }

            val remote = VisitorLogRemote(
                passId = log.passId,
                hostUid = log.hostUid,
                visitorName = log.visitorName,
                phoneNumber = log.phoneNumber,
                type = log.type,
                status = log.status,
                purpose = log.purpose,
                visitDate = log.visitDate,
                scannedAt = log.scannedAt,
                scannedAtMillis = log.scannedAtMillis
            )

            syncRepo.uploadLog(remote)
        }
    }

    private fun parseQrContent(content: String): Map<String, String>? {
        return try {
            val jsonObject = Gson().fromJson(content, JsonObject::class.java)
            val dataMap = mutableMapOf<String, String>()

            jsonObject.entrySet().forEach { (key, value) ->
                dataMap[key] = value.asString
            }

            dataMap.ifEmpty { null }
        } catch (e: Exception) {
            null
        }
    }


    private fun getTodayDate(): String {
        val sdf = SimpleDateFormat("d/M/yyyy", Locale.getDefault())
        return sdf.format(Date())
    }

    private fun getCurrentDateTime(): String {
        val sdf = SimpleDateFormat("d/M/yyyy h:mm a", Locale.getDefault())
        return sdf.format(Date())
    }

    private fun getCurrentTimeInMinutes(): Int {
        val calendar = Calendar.getInstance()
        val hour = calendar.get(Calendar.HOUR_OF_DAY)
        val minute = calendar.get(Calendar.MINUTE)
        return hour * 60 + minute
    }

    private fun getCurrentTimeFormatted(): String {
        val sdf = SimpleDateFormat("h:mm a", Locale.getDefault())
        return sdf.format(Date())
    }

    private fun convertTimeToMinutes(time: String): Int? {
        return try {
            val sdf = SimpleDateFormat("h:mm a", Locale.getDefault())
            val date = sdf.parse(time) ?: return null

            val calendar = Calendar.getInstance()
            calendar.time = date

            val hour = calendar.get(Calendar.HOUR_OF_DAY)
            val minute = calendar.get(Calendar.MINUTE)

            hour * 60 + minute
        } catch (e: Exception) {
            null
        }
    }

    private fun showApproved(status: String, reason: String) {
        tvValidationStatus.text = status
        tvValidationStatus.setTextColor(Color.parseColor("#1B5E20"))
        tvValidationReason.text = reason
        cardValidationStatus.setCardBackgroundColor(Color.parseColor("#C8E6C9"))
    }

    private fun showDenied(status: String, reason: String) {
        tvValidationStatus.text = status
        tvValidationStatus.setTextColor(Color.parseColor("#B71C1C"))
        tvValidationReason.text = reason
        cardValidationStatus.setCardBackgroundColor(Color.parseColor("#FFCDD2"))
    }
}
