package com.gateguard.data

import android.content.Context
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

class JsonRepository(private val context: Context) {
    private val fileName = "gateguard_db.json"
    private val gson = Gson()

    suspend fun getDatabase(): Database = withContext(Dispatchers.IO) {
        val file = File(context.filesDir, fileName)
        if (!file.exists()) {
            return@withContext Database()
        }
        val jsonString = file.readText()
        if (jsonString.isBlank()) return@withContext Database()
        return@withContext gson.fromJson(jsonString, Database::class.java)
    }

    suspend fun saveDatabase(db: Database) = withContext(Dispatchers.IO) {
        val file = File(context.filesDir, fileName)
        file.writeText(gson.toJson(db))
    }

    suspend fun addVisitor(visitor: Visitor) {
        val db = getDatabase()
        db.visitors.add(visitor)
        db.statsUpcomingVisits++
        saveDatabase(db)
    }

    suspend fun updateVisitorStatus(id: String, newStatus: String, entryTime: String?, exitTime: String?) {
        val db = getDatabase()
        val index = db.visitors.indexOfFirst { it.id == id }
        if (index != -1) {
            val old = db.visitors[index]
            db.visitors[index] = old.copy(
                status = newStatus,
                entryTime = entryTime ?: old.entryTime,
                exitTime = exitTime ?: old.exitTime
            )
            // Adjust stats
            if (old.status != "Active" && newStatus == "Active") {
                db.statsActiveVisitors++
                db.statsUpcomingVisits = maxOf(0, db.statsUpcomingVisits - 1)
            } else if (old.status == "Active" && newStatus == "Completed") {
                db.statsActiveVisitors = maxOf(0, db.statsActiveVisitors - 1)
            }
            saveDatabase(db)
        }
    }
}
