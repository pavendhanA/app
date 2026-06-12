package com.gateguard

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "visitor_logs")
data class VisitorLogEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val remoteId: String = "",
    val passId: String = "",
    val hostUid: String = "",
    val scannedByUid: String = "",
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
    val reason: String,
    val scannedAt: String,
    val scannedAtMillis: Long,
    val type: String,
    val synced: Boolean = false
)