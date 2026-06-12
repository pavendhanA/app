package com.gateguard

import com.gateguard.data.VisitorPass
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await
import java.util.UUID

class PassRepository {
    private val firestore = FirebaseFirestore.getInstance()

    suspend fun getPass(passId: String): VisitorPass? {
        return try {
            val snapshot = firestore.collection("visitor_passes")
                .document(passId)
                .get()
                .await()
            snapshot.toObject(VisitorPass::class.java)
        } catch (e: Exception) {
            null
        }
    }

    suspend fun createPass(pass: VisitorPass): Result<String> {
        return try {
            val passId = if (pass.passId.isEmpty()) UUID.randomUUID().toString().replace("-", "").take(16) else pass.passId
            val finalPass = pass.copy(
                passId = passId,
                createdAt = System.currentTimeMillis()
            )

            firestore.collection("visitor_passes")
                .document(passId)
                .set(finalPass)
                .await()

            Result.success(passId)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getPassRemote(passId: String): VisitorPassRemote? {
        return try {
            val snapshot = firestore.collection("visitor_passes")
                .document(passId)
                .get()
                .await()
            snapshot.toObject(VisitorPassRemote::class.java)
        } catch (e: Exception) {
            null
        }
    }

    suspend fun updatePassRemote(pass: VisitorPassRemote): Result<Unit> {
        return try {
            firestore.collection("visitor_passes")
                .document(pass.passId)
                .set(pass)
                .await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
