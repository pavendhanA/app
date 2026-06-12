package com.gateguard

data class VisitorPassRemote(
    val passId: String = "",
    val visitorName: String = "",
    val phoneNumber: String = "",
    val visitorType: String = "",
    val towerBlock: String = "",
    val flatNumber: String = "",
    val vehicleNumber: String = "",
    val noOfVisitors: String = "",
    val visitDate: String = "",
    val fromTime: String = "",
    val toTime: String = "",
    val purpose: String = "",
    val hostUid: String = "",
    val status: String = "ACTIVE",
    val usedForEntry: Boolean = false,
    val usedForExit: Boolean = false,
    val createdAtMillis: Long = System.currentTimeMillis()
)
