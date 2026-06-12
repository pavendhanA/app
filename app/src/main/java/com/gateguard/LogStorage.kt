package com.gateguard

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

object LogStorage {

    private const val PREF_NAME = "gateguard_logs"
    private const val KEY_LOGS = "visitor_logs"

    fun saveLog(context: Context, log: VisitorLog) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val gson = Gson()

        val existingLogs = getLogs(context).toMutableList()
        existingLogs.add(0, log)

        val json = gson.toJson(existingLogs)
        prefs.edit().putString(KEY_LOGS, json).apply()
    }

    fun getLogs(context: Context): List<VisitorLog> {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val gson = Gson()
        val json = prefs.getString(KEY_LOGS, null) ?: return emptyList()

        val type = object : TypeToken<List<VisitorLog>>() {}.type
        return gson.fromJson(json, type)
    }

    fun clearLogs(context: Context) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        prefs.edit().remove(KEY_LOGS).apply()
    }
}
