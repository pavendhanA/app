package com.gateguard.data

data class VisitorPass(
    val passId: String = "",
    val hostUid: String = "",
    val visitorName: String = "",
    val phoneNumber: String = "",
    val visitDate: String = "", // format "d/M/yyyy"
    val fromTime: String = "",
    val toTime: String = "",
    val purpose: String = "",
    val status: String = "UPCOMING", // UPCOMING, ACTIVE, COMPLETED, EXPIRED
    val createdAt: Long = System.currentTimeMillis()
)
