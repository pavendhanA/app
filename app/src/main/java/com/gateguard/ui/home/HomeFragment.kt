package com.gateguard.ui.home

import android.graphics.BitmapFactory
import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.gateguard.R
import com.gateguard.databinding.FragmentHomeBinding
import com.gateguard.FirebaseRepository
import com.google.firebase.auth.auth
import com.google.firebase.Firebase
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.launch
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class HomeFragment : Fragment(R.layout.fragment_home) {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private val repo = FirebaseRepository()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentHomeBinding.bind(view)

        setupGreeting()
        setupClickListeners()
        setupSwipeRefresh()
        
        loadDashboardData()
    }

    private fun setupGreeting() {
        val uid = Firebase.auth.currentUser?.uid ?: return
        lifecycleScope.launch {
            repo.getUserProfile(uid).onSuccess { user ->
                binding.tvGreeting.text = "Hello, ${user.name}"
                loadProfilePhoto(uid)
            }
        }
    }

    private fun loadProfilePhoto(uid: String) {
        val file = File(requireContext().filesDir, "profile_photo_$uid.jpg")
        if (file.exists()) {
            val bitmap = BitmapFactory.decodeFile(file.absolutePath)
            binding.ivProfileSmall.setImageBitmap(bitmap)
        }
    }

    private fun setupClickListeners() {
        binding.btnGenerateQr.setOnClickListener {
            findNavController().navigate(R.id.action_home_to_generateQR)
        }

        binding.btnScanQr.setOnClickListener {
            findNavController().navigate(R.id.action_home_to_scanner)
        }

        binding.btnVisitorLogs.setOnClickListener {
            findNavController().navigate(R.id.logsFragment)
        }

        binding.btnNotifications.setOnClickListener {
            findNavController().navigate(R.id.notificationsFragment)
        }

        binding.ivProfileSmall.setOnClickListener {
            findNavController().navigate(R.id.profileFragment)
        }
    }

    private fun setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener {
            loadDashboardData()
        }
    }

    override fun onResume() {
        super.onResume()
        loadDashboardData()
    }

    private fun loadDashboardData() {
        binding.swipeRefresh.isRefreshing = true
        val uid = Firebase.auth.currentUser?.uid ?: run {
            binding.swipeRefresh.isRefreshing = false
            return
        }
        val firestore = FirebaseFirestore.getInstance()
        val today = SimpleDateFormat("d/M/yyyy", Locale.getDefault()).format(Date())

        lifecycleScope.launch {
            try {
                // Get User Profile to determine role
                val userResult = repo.getUserProfile(uid)
                if (userResult.isSuccess) {
                    val user = userResult.getOrNull()
                    val role = user?.role?.uppercase() ?: "HOST"
                    
                    if (role == "HOST") {
                        // For Host: Show their specific passes
                        firestore.collection("visitor_passes")
                            .whereEqualTo("hostUid", uid)
                            .whereEqualTo("visitDate", today)
                            .get()
                            .addOnSuccessListener { snapshots ->
                                var active = 0
                                var upcoming = 0
                                snapshots.forEach { doc ->
                                    val status = doc.getString("status")
                                    if (status == "ACTIVE") active++
                                    else if (status == "UPCOMING") upcoming++
                                }
                                binding.tvActiveCount.text = active.toString()
                                binding.tvUpcomingCount.text = upcoming.toString()
                                binding.swipeRefresh.isRefreshing = false
                            }
                            .addOnFailureListener {
                                binding.swipeRefresh.isRefreshing = false
                            }
                    } else {
                        // For Guard/Admin: Show global stats for today
                        firestore.collection("visitor_logs")
                            .whereEqualTo("visitDate", today)
                            .get()
                            .addOnSuccessListener { snapshots ->
                                val entries = snapshots.count { it.getString("type") == "ENTRY" && it.getString("status") == "APPROVED" }
                                val exits = snapshots.count { it.getString("type") == "EXIT" && it.getString("status") == "APPROVED" }
                                binding.tvActiveCount.text = (entries - exits).coerceAtLeast(0).toString()
                                binding.tvUpcomingCount.text = snapshots.size().toString()
                                binding.swipeRefresh.isRefreshing = false
                            }
                            .addOnFailureListener {
                                binding.swipeRefresh.isRefreshing = false
                            }
                    }
                } else {
                    binding.swipeRefresh.isRefreshing = false
                }
            } catch (e: Exception) {
                binding.tvEmptyActivity.text = "Unable to load data."
                binding.swipeRefresh.isRefreshing = false
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
