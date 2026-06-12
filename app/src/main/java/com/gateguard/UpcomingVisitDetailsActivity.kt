package com.gateguard

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class UpcomingVisitDetailsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_upcoming_visit_details)

        val tvPassId = findViewById<TextView>(R.id.tvDetailsPassId)
        val tvName = findViewById<TextView>(R.id.tvDetailsVisitorName)
        val tvVisitorType = findViewById<TextView>(R.id.tvDetailsVisitorType)
        val tvPhone = findViewById<TextView>(R.id.tvDetailsPhone)
        val tvFlat = findViewById<TextView>(R.id.tvDetailsFlat)
        val tvVehicle = findViewById<TextView>(R.id.tvDetailsVehicle)
        val tvNoOfVisitors = findViewById<TextView>(R.id.tvDetailsNoOfVisitors)
        val tvDate = findViewById<TextView>(R.id.tvDetailsDate)
        val tvTime = findViewById<TextView>(R.id.tvDetailsTime)
        val tvPurpose = findViewById<TextView>(R.id.tvDetailsPurpose)
        val tvStatus = findViewById<TextView>(R.id.tvDetailsStatus)

        val passId = intent.getStringExtra("passId").orEmpty()
        val visitorName = intent.getStringExtra("visitorName").orEmpty()
        val visitorType = intent.getStringExtra("visitorType").orEmpty()
        val phoneNumber = intent.getStringExtra("phoneNumber").orEmpty()
        val towerBlock = intent.getStringExtra("towerBlock").orEmpty()
        val flatNumber = intent.getStringExtra("flatNumber").orEmpty()
        val vehicleNumber = intent.getStringExtra("vehicleNumber").orEmpty()
        val noOfVisitors = intent.getStringExtra("noOfVisitors").orEmpty()
        val visitDate = intent.getStringExtra("visitDate").orEmpty()
        val fromTime = intent.getStringExtra("fromTime").orEmpty()
        val toTime = intent.getStringExtra("toTime").orEmpty()
        val purpose = intent.getStringExtra("purpose").orEmpty()
        val status = intent.getStringExtra("status").orEmpty()

        tvPassId.text = "Pass ID: $passId"
        tvName.text = "Visitor Name: $visitorName"
        tvVisitorType.text = "Visitor Type: $visitorType"
        tvPhone.text = "Phone: $phoneNumber"
        tvFlat.text = "Flat: $towerBlock - $flatNumber"
        tvVehicle.text = "Vehicle: $vehicleNumber"
        tvNoOfVisitors.text = "Visitors: $noOfVisitors"
        tvDate.text = "Visit Date: $visitDate"
        tvTime.text = "Time: $fromTime - $toTime"
        tvPurpose.text = "Purpose: $purpose"
        tvStatus.text = "Status: $status"
    }
}