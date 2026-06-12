package com.gateguard

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "visitor_logs")
data class VisitorLog(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val visitorName: String,
    val phoneNumber: String,
    val visitDate: String,
    val fromTime: String,
    val toTime: String,
    val purpose: String,
    val status: String,
    val reason: String,
    val scannedAt: String
)
