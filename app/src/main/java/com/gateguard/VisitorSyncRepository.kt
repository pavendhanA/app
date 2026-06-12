package com.gateguard

import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class VisitorSyncRepository {

    private val firestore = FirebaseFirestore.getInstance()

    suspend fun uploadLog(log: VisitorLogRemote): Result<String> {
        return try {
            val docId = "${log.passId}_${log.type}_${log.scannedAtMillis}"

            firestore.collection("visitor_logs")
                .document(docId)
                .set(log)
                .await()

            Result.success(docId)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}