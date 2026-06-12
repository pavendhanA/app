package com.gateguard.data

data class Database(
    var statsActiveVisitors: Int = 0,
    var statsUpcomingVisits: Int = 0,
    val visitors: MutableList<Visitor> = mutableListOf(),
    val notifications: MutableList<Notification> = mutableListOf()
)
