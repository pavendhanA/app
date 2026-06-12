package com.gateguard.data

import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext

class FirebaseRepository {
    private val db = FirebaseFirestore.getInstance()
    private val visitorsCollection = db.collection("visitors")
    private val notificationsCollection = db.collection("notifications")

    suspend fun getDatabase(): Database = withContext(Dispatchers.IO) {
        val visitors = visitorsCollection.get().await().toObjects(Visitor::class.java).toMutableList()
        val notifications = notificationsCollection.get().await().toObjects(Notification::class.java).toMutableList()
        
        var active = 0
        var upcoming = 0
        visitors.forEach {
            if (it.status == "Active") active++
            if (it.status == "Upcoming") upcoming++
        }
        Database(active, upcoming, visitors, notifications)
    }

    suspend fun addVisitor(visitor: Visitor) = withContext(Dispatchers.IO) {
        visitorsCollection.document(visitor.id).set(visitor).await()
    }

    suspend fun updateVisitorStatus(id: String, newStatus: String, entryTime: String?, exitTime: String?) = withContext(Dispatchers.IO) {
        val updates = mutableMapOf<String, Any>("status" to newStatus)
        if (entryTime != null) updates["entryTime"] = entryTime
        if (exitTime != null) updates["exitTime"] = exitTime
        visitorsCollection.document(id).update(updates).await()
    }
}
