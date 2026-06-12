package com.gateguard

data class VisitorLogRemote(
    val passId: String = "",
    val hostUid: String = "",
    val visitorName: String = "",
    val phoneNumber: String = "",
    val type: String = "",
    val status: String = "",
    val purpose: String = "",
    val visitDate: String = "",
    val scannedAt: String = "",
    val scannedAtMillis: Long = 0L
)