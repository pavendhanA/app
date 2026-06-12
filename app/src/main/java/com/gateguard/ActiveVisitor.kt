package com.gateguard

data class ActiveVisitor(
    val visitorName: String,
    val phoneNumber: String,
    val visitorType: String = "",
    val towerBlock: String = "",
    val flatNumber: String = "",
    val vehicleNumber: String = "",
    val noOfVisitors: String = "",
    val scannedAt: String,
    val scannedAtMillis: Long,
    val passId: String = "",
    val type: String = "",
    val status: String = "",
    val purpose: String = ""
)
