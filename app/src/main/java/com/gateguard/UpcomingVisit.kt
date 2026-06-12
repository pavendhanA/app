package com.gateguard

data class UpcomingVisit(
    val visitorName: String,
    val phoneNumber: String,
    val visitorType: String = "",
    val towerBlock: String = "",
    val flatNumber: String = "",
    val vehicleNumber: String = "",
    val noOfVisitors: String = "",
    val visitDate: String,
    val fromTime: String,
    val toTime: String,
    val purpose: String,
    val status: String,
    val passId: String = ""
)