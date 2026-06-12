package com.gateguard

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.drawable.BitmapDrawable
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import com.google.android.material.button.MaterialButton
import com.google.zxing.BarcodeFormat
import com.google.zxing.MultiFormatWriter
import com.google.zxing.common.BitMatrix
import com.google.gson.JsonObject
import java.io.File
import java.io.FileOutputStream
import java.util.UUID

class PassPreviewActivity : AppCompatActivity() {

    private lateinit var tvVisitorDetails: TextView
    private lateinit var imgQrCode: ImageView
    private lateinit var btnDone: MaterialButton
    private lateinit var btnShareWhatsApp: MaterialButton
    
    private var visitorName: String = ""
    private var visitorPhone: String = ""
    private var visitorType: String = ""
    private var towerBlock: String = ""
    private var flatNumber: String = ""
    private var vehicleNumber: String = ""
    private var noOfVisitors: String = ""
    private var visitDate: String = ""
    private var fromTime: String = ""
    private var toTime: String = ""
    private var purpose: String = ""
    private var passId: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pass_preview)

        tvVisitorDetails = findViewById(R.id.tvVisitorDetails)
        imgQrCode = findViewById(R.id.imgQrCode)
        btnDone = findViewById(R.id.btnDone)
        btnShareWhatsApp = findViewById(R.id.btnShareWhatsApp)

        visitorName = intent.getStringExtra("visitorName") ?: ""
        visitorPhone = intent.getStringExtra("visitorPhone") ?: ""
        visitorType = intent.getStringExtra("visitorType") ?: ""
        towerBlock = intent.getStringExtra("towerBlock") ?: ""
        flatNumber = intent.getStringExtra("flatNumber") ?: ""
        vehicleNumber = intent.getStringExtra("vehicleNumber") ?: ""
        noOfVisitors = intent.getStringExtra("noOfVisitors") ?: ""
        visitDate = intent.getStringExtra("visitDate") ?: ""
        fromTime = intent.getStringExtra("fromTime") ?: ""
        toTime = intent.getStringExtra("toTime") ?: ""
        purpose = intent.getStringExtra("purpose") ?: ""
        passId = intent.getStringExtra("passId") ?: ""

        val qrObject = JsonObject().apply {
            addProperty("passId", passId)
            addProperty("visitorName", visitorName)
            addProperty("phoneNumber", visitorPhone)
            addProperty("visitorType", visitorType)
            addProperty("towerBlock", towerBlock)
            addProperty("flatNumber", flatNumber)
            addProperty("vehicleNumber", vehicleNumber)
            addProperty("noOfVisitors", noOfVisitors)
            addProperty("visitDate", visitDate)
            addProperty("fromTime", fromTime)
            addProperty("toTime", toTime)
            addProperty("purpose", purpose)
        }
        val qrData = qrObject.toString()

        val details = """
            Pass ID: $passId
            Visitor Name: $visitorName
            Type: $visitorType
            Flat: $towerBlock - $flatNumber
            Visitors: $noOfVisitors
            Vehicle: ${vehicleNumber.ifEmpty { "None" }}
            
            Phone Number: $visitorPhone
            Date: $visitDate
            Time: $fromTime to $toTime
            Purpose: $purpose
        """.trimIndent()

        tvVisitorDetails.text = details
        generateQrCode(qrData)

        btnShareWhatsApp.setOnClickListener {
            shareQrToWhatsAppNumber()
        }

        btnDone.setOnClickListener {
            val intent = Intent(this, HostDashboardActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
            finish()
        }
    }

    private fun generateQrCode(data: String) {
        try {
            val bitMatrix: BitMatrix = MultiFormatWriter().encode(
                data,
                BarcodeFormat.QR_CODE,
                800,
                800
            )

            val bitmap = Bitmap.createBitmap(
                bitMatrix.width,
                bitMatrix.height,
                Bitmap.Config.RGB_565
            )

            for (x in 0 until bitMatrix.width) {
                for (y in 0 until bitMatrix.height) {
                    bitmap.setPixel(
                        x,
                        y,
                        if (bitMatrix[x, y]) Color.BLACK else Color.WHITE
                    )
                }
            }

            imgQrCode.setImageBitmap(bitmap)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun shareQrToWhatsAppNumber() {
        try {
            if (visitorPhone.isBlank()) {
                Toast.makeText(this, "Visitor phone number missing", Toast.LENGTH_SHORT).show()
                return
            }

            val cleanedNumber = formatPhoneNumberForWhatsApp(visitorPhone)

            val drawable = imgQrCode.drawable as? BitmapDrawable
            if (drawable == null) {
                Toast.makeText(this, "QR not ready", Toast.LENGTH_SHORT).show()
                return
            }

            val bitmap = drawable.bitmap

            val file = File(cacheDir, "visitor_qr.png")
            FileOutputStream(file).use {
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
            }

            val uri = FileProvider.getUriForFile(
                this,
                "$packageName.provider",
                file
            )

            val message = """
GateGuard Visitor Pass

Pass ID: $passId
Name: $visitorName
Type: $visitorType
Flat: $towerBlock - $flatNumber
Visitors: $noOfVisitors
Vehicle: ${vehicleNumber.ifEmpty { "None" }}
Phone: $visitorPhone
Date: $visitDate
Time: $fromTime to $toTime
Purpose: $purpose

Show this QR at the gate.
        """.trimIndent()

            val sendIntent = Intent(Intent.ACTION_SEND).apply {
                type = "image/png"
                putExtra(Intent.EXTRA_STREAM, uri)
                putExtra(Intent.EXTRA_TEXT, message)
                putExtra("jid", "$cleanedNumber@s.whatsapp.net")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }

            sendIntent.setPackage("com.whatsapp")

            if (sendIntent.resolveActivity(packageManager) != null) {
                startActivity(sendIntent)
            } else {
                sendIntent.setPackage("com.whatsapp.w4b")

                if (sendIntent.resolveActivity(packageManager) != null) {
                    startActivity(sendIntent)
                } else {
                    Toast.makeText(this, "WhatsApp not installed", Toast.LENGTH_SHORT).show()
                }
            }

        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(this, "Error sending QR", Toast.LENGTH_SHORT).show()
        }
    }

    private fun formatPhoneNumberForWhatsApp(phone: String): String {
        var cleaned = phone.replace("\\s".toRegex(), "")
            .replace("+", "")
            .replace("-", "")

        if (cleaned.length == 10) {
            cleaned = "91$cleaned"
        }

        return cleaned
    }
}