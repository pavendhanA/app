package com.gateguard.ui.notifications

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.gateguard.R
import com.gateguard.data.FirebaseRepository
import com.gateguard.databinding.FragmentNotificationsBinding
import kotlinx.coroutines.launch

class NotificationsFragment : Fragment(R.layout.fragment_notifications) {

    private var _binding: FragmentNotificationsBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentNotificationsBinding.bind(view)

        val adapter = NotificationsAdapter(emptyList())
        binding.rvNotifications.layoutManager = LinearLayoutManager(requireContext())
        binding.rvNotifications.adapter = adapter

        binding.swipeRefresh.setOnRefreshListener {
            loadNotifications(adapter)
        }

        loadNotifications(adapter)
    }

    private fun loadNotifications(adapter: NotificationsAdapter) {
        binding.swipeRefresh.isRefreshing = true
        lifecycleScope.launch {
            try {
                // Using the data package repository as it matches the current implementation
                val db = FirebaseRepository().getDatabase()
                val notifs = db.notifications.sortedByDescending { it.timestamp }
                adapter.updateData(notifs)
    
                if (notifs.isEmpty()) {
                    binding.emptyState.visibility = View.VISIBLE
                } else {
                    binding.emptyState.visibility = View.GONE
                }
            } catch (e: Exception) {
                e.printStackTrace()
                binding.tvEmpty.text = "Unable to fetch alerts natively."
                binding.emptyState.visibility = View.VISIBLE
            } finally {
                binding.swipeRefresh.isRefreshing = false
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
