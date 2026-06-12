package com.gateguard

import com.gateguard.data.VisitorPass
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.tasks.await
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class FirebaseRepository {

    private val auth = FirebaseAuth.getInstance()
    private val firestore = FirebaseFirestore.getInstance()

    suspend fun registerUser(
        name: String,
        email: String,
        password: String,
        role: String
    ): Result<Unit> {
        return try {
            val authResult = auth.createUserWithEmailAndPassword(email, password).await()
            val uid = authResult.user?.uid ?: return Result.failure(Exception("User not created"))

            val profile = UserProfile(
                uid = uid,
                name = name,
                email = email,
                role = role
            )

            firestore.collection("users")
                .document(uid)
                .set(profile)
                .await()

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun loginUser(email: String, password: String): Result<UserProfile> {
        return try {
            val authResult = auth.signInWithEmailAndPassword(email, password).await()
            val uid = authResult.user?.uid ?: return Result.failure(Exception("Login failed"))

            val snapshot = firestore.collection("users")
                .document(uid)
                .get()
                .await()

            val profile = snapshot.toObject(UserProfile::class.java)
                ?: return Result.failure(Exception("User profile not found"))

            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getUserProfile(uid: String): Result<UserProfile> {
        return try {
            val snapshot = firestore.collection("users")
                .document(uid)
                .get()
                .await()

            val profile = snapshot.toObject(UserProfile::class.java)
                ?: return Result.failure(Exception("Profile not found"))

            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateUserProfile(uid: String, name: String, phone: String): Result<Unit> {
        return try {
            firestore.collection("users")
                .document(uid)
                .update(
                    mapOf(
                        "name" to name,
                        "phone" to phone
                    )
                )
                .await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createVisitorPass(pass: VisitorPass): Result<Unit> {
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

    suspend fun createVisitorPassRemote(pass: VisitorPassRemote): Result<Unit> {
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

    suspend fun getPassById(passId: String): Result<VisitorPass> {
        return try {
            val snapshot = firestore.collection("visitor_passes")
                .document(passId)
                .get()
                .await()
            val pass = snapshot.toObject(VisitorPass::class.java)
                ?: return Result.failure(Exception("Pass not found"))
            Result.success(pass)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logVisitorActionRemote(
        pass: VisitorPassRemote,
        scannedByUid: String,
        type: String // ENTRY or EXIT
    ): Result<Unit> {
        return try {
            val logId = firestore.collection("visitor_logs").document().id
            val today = SimpleDateFormat("d/M/yyyy", Locale.getDefault()).format(Date())
            val now = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())

            val log = VisitorLogRemote(
                passId = pass.passId,
                hostUid = pass.hostUid,
                visitorName = pass.visitorName,
                phoneNumber = pass.phoneNumber,
                visitDate = today,
                purpose = pass.purpose,
                status = "APPROVED",
                scannedAt = "$today $now",
                scannedAtMillis = System.currentTimeMillis(),
                type = type
            )

            firestore.collection("visitor_logs")
                .document(logId)
                .set(log)
                .await()

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logVisitorAction(
        pass: VisitorPass,
        scannedByUid: String,
        type: String // ENTRY or EXIT
    ): Result<Unit> {
        return try {
            val logId = firestore.collection("visitor_logs").document().id
            val today = SimpleDateFormat("d/M/yyyy", Locale.getDefault()).format(Date())
            val now = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())

            val log = VisitorLogRemote(
                passId = pass.passId,
                hostUid = pass.hostUid,
                visitorName = pass.visitorName,
                phoneNumber = pass.phoneNumber,
                visitDate = today,
                purpose = pass.purpose,
                status = "APPROVED",
                scannedAt = "$today $now",
                scannedAtMillis = System.currentTimeMillis(),
                type = type
            )

            firestore.collection("visitor_logs")
                .document(logId)
                .set(log)
                .await()

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun saveVisitorLog(log: VisitorLogRemote): Result<Unit> {
        return try {
              firestore.collection("visitor_logs")
                .document("${log.passId}_${log.type}_${log.scannedAtMillis}")
                .set(log)
                .await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getLatestLogForPass(passId: String): VisitorLogRemote? {
        return try {
            val today = SimpleDateFormat("d/M/yyyy", Locale.getDefault()).format(Date())
            val snapshot = firestore.collection("visitor_logs")
                .whereEqualTo("passId", passId)
                .whereEqualTo("visitDate", today)
                .orderBy("scannedAtMillis", Query.Direction.DESCENDING)
                .limit(1)
                .get()
                .await()
            
            snapshot.toObjects(VisitorLogRemote::class.java).firstOrNull()
        } catch (e: Exception) {
            null
        }
    }

    fun logout() {
        auth.signOut()
    }

    fun getCurrentUid(): String? = auth.currentUser?.uid
}