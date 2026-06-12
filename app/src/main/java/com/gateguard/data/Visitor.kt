package com.gateguard.data

data class Visitor(
    val id: String = "",
    val name: String = "",
    val phone: String = "",
    val startTime: String = "",
    val endTime: String = "",
    val status: String = "",
    val entryTime: String? = null,
    val exitTime: String? = null,
    val type: String = "" // ENTRY or EXIT
)
