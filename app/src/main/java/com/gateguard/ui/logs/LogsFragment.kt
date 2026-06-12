package com.gateguard.ui.logs

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.gateguard.R
import com.gateguard.VisitorLogRemote
import com.gateguard.databinding.FragmentLogsBinding
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class LogsFragment : Fragment(R.layout.fragment_logs) {

    private var _binding: FragmentLogsBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var adapter: LogsAdapter
    private var allLogs: List<VisitorLogRemote> = emptyList()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentLogsBinding.bind(view)
        
        adapter = LogsAdapter(emptyList())
        binding.rvLogs.layoutManager = LinearLayoutManager(requireContext())
        binding.rvLogs.adapter = adapter
        
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterLogs(s.toString())
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        binding.swipeRefresh.setOnRefreshListener {
            listenToLogs()
        }

        listenToLogs()
    }
    
    private fun listenToLogs() {
        binding.swipeRefresh.isRefreshing = true
        FirebaseFirestore.getInstance().collection("visitor_logs")
            .orderBy("scannedAtMillis", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, e ->
                binding.swipeRefresh.isRefreshing = false
                if (e != null) {
                    Toast.makeText(context, "Listen failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    return@addSnapshotListener
                }

                if (snapshot != null) {
                    allLogs = snapshot.toObjects(VisitorLogRemote::class.java)
                    adapter.updateLogs(allLogs)
                    
                    if (allLogs.isEmpty()) {
                        binding.layoutEmpty.visibility = View.VISIBLE
                        binding.tvEmpty.text = "No logs found in cloud."
                    } else {
                        binding.layoutEmpty.visibility = View.GONE
                    }
                }
            }
    }
    
    private fun filterLogs(query: String) {
        if (query.isBlank()) {
            adapter.updateLogs(allLogs)
        } else {
            val filtered = allLogs.filter { 
                it.visitorName.contains(query, ignoreCase = true) || 
                it.status.contains(query, ignoreCase = true) ||
                it.phoneNumber.contains(query)
            }
            adapter.updateLogs(filtered)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
