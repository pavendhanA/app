package com.gateguard

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface VisitorLogDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLog(log: VisitorLogEntity)

    @Query("SELECT * FROM visitor_logs ORDER BY id DESC")
    suspend fun getAllLogs(): List<VisitorLogEntity>

    @Query("DELETE FROM visitor_logs")
    suspend fun clearAllLogs()
}
