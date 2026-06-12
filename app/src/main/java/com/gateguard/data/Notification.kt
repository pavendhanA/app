package com.gateguard.data

data class Notification(
    val id: String = "",
    val message: String = "",
    val timestamp: String = "",
    val isRead: Boolean = false,
    val type: String = ""
)
