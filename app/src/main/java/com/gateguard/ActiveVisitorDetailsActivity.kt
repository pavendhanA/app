package com.gateguard

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class ActiveVisitorDetailsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_active_visitor_details)

        val tvPassId = findViewById<TextView>(R.id.tvActiveDetailsPassId)
        val tvName = findViewById<TextView>(R.id.tvActiveDetailsVisitorName)
        val tvVisitorType = findViewById<TextView>(R.id.tvActiveDetailsVisitorType)
        val tvPhone = findViewById<TextView>(R.id.tvActiveDetailsPhone)
        val tvFlat = findViewById<TextView>(R.id.tvActiveDetailsFlat)
        val tvVehicle = findViewById<TextView>(R.id.tvActiveDetailsVehicle)
        val tvNoOfVisitors = findViewById<TextView>(R.id.tvActiveDetailsNoOfVisitors)
        val tvScanType = findViewById<TextView>(R.id.tvActiveDetailsType)
        val tvScannedAt = findViewById<TextView>(R.id.tvActiveDetailsScannedAt)
        val tvStatus = findViewById<TextView>(R.id.tvActiveDetailsStatus)
        val tvPurpose = findViewById<TextView>(R.id.tvActiveDetailsPurpose)

        val passId = intent.getStringExtra("passId").orEmpty()
        val visitorName = intent.getStringExtra("visitorName").orEmpty()
        val visitorType = intent.getStringExtra("visitorType").orEmpty()
        val phoneNumber = intent.getStringExtra("phoneNumber").orEmpty()
        val towerBlock = intent.getStringExtra("towerBlock").orEmpty()
        val flatNumber = intent.getStringExtra("flatNumber").orEmpty()
        val vehicleNumber = intent.getStringExtra("vehicleNumber").orEmpty()
        val noOfVisitors = intent.getStringExtra("noOfVisitors").orEmpty()
        val type = intent.getStringExtra("type").orEmpty()
        val scannedAt = intent.getStringExtra("scannedAt").orEmpty()
        val status = intent.getStringExtra("status").orEmpty()
        val purpose = intent.getStringExtra("purpose").orEmpty()

        tvPassId.text = "Pass ID: $passId"
        tvName.text = "Visitor Name: $visitorName"
        tvVisitorType.text = "Visitor Type: $visitorType"
        tvPhone.text = "Phone: $phoneNumber"
        tvFlat.text = "Flat: $towerBlock - $flatNumber"
        tvVehicle.text = "Vehicle: $vehicleNumber"
        tvNoOfVisitors.text = "Visitors: $noOfVisitors"
        tvScanType.text = "Latest Scan Type: $type"
        tvScannedAt.text = "Scanned At: $scannedAt"
        tvStatus.text = "Status: $status"
        tvPurpose.text = "Purpose: $purpose"
    }
}