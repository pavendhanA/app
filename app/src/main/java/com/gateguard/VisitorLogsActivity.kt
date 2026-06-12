package com.gateguard

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.gateguard.databinding.ActivityVisitorLogsBinding
import com.google.firebase.firestore.FirebaseFirestore

class VisitorLogsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityVisitorLogsBinding
    private lateinit var adapter: VisitorLogAdapter

    private val firestore = FirebaseFirestore.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityVisitorLogsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        adapter = VisitorLogAdapter(emptyList())

        binding.recyclerVisitorLogs.layoutManager = LinearLayoutManager(this)
        binding.recyclerVisitorLogs.adapter = adapter

        loadLogs()
    }

    private fun loadLogs() {
        firestore.collection("visitor_logs")
            .addSnapshotListener { snapshots, error ->

                if (error != null || (snapshots == null)) return@addSnapshotListener

                val logs = snapshots.toObjects(VisitorLogRemote::class.java)
                    .sortedByDescending { it.scannedAtMillis }

                adapter.updateData(logs)
            }
    }
}