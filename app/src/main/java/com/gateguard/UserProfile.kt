package com.gateguard

data class UserProfile(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val role: String = "", // HOST, GUARD, ADMIN
    val phone: String = ""
)