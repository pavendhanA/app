package com.gateguard.data

import com.google.firebase.Timestamp

data class User(
    val uid: String = "",
    val fullName: String = "",
    val email: String = "",
    val phoneNumber: String = "",
    val role: String = "user",
    val createdAt: Timestamp? = null
)
