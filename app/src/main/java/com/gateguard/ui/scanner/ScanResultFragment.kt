package com.gateguard.ui.scanner

import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.gateguard.R
import com.gateguard.FirebaseRepository
import com.gateguard.VisitorPassRemote
import com.gateguard.data.VisitorPass
import com.gateguard.VisitorLogRemote
import com.gateguard.databinding.FragmentScanResultBinding
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.google.gson.Gson
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ScanResultFragment : Fragment(R.layout.fragment_scan_result) {

    private var _binding: FragmentScanResultBinding? = null
    private val binding get() = _binding!!
    private val args: ScanResultFragmentArgs by navArgs()
    
    private var passObj: VisitorPassRemote? = null
    private val repo = FirebaseRepository()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentScanResultBinding.bind(view)

        binding.btnClose.setOnClickListener {
            findNavController().navigateUp()
        }

        val scanData = arguments?.getString("scanData")

        try {
            if (scanData != null) {
                passObj = Gson().fromJson(scanData, VisitorPassRemote::class.java)
                if (passObj != null && passObj?.passId?.isNotEmpty() == true) {
                    loadPassAndValidation(passObj!!.passId)
                } else {
                    showInvalidState("Unrecognized QR Code")
                }
            } else {
                showInvalidState("No Data Received")
            }
        } catch (e: Exception) {
            showInvalidState("Invalid Format")
        }
    }

    private fun loadPassAndValidation(passId: String) {
        lifecycleScope.launch {
            // Note: FirebaseRepository.getPassById currently returns VisitorPass.
            // We should ideally update it to return VisitorPassRemote if we want consistency.
            val passResult = repo.getPassById(passId)
            passResult.onSuccess { pass ->
                val latestLog = repo.getLatestLogForPass(passId)
                
                if (_binding == null) return@onSuccess

                binding.tvGuestName.text = "Guest: ${pass.visitorName}"
                
                when {
                    latestLog == null -> {
                        // First scan of the day -> ENTRY
                        showValidState("Valid Pass: Ready for Entry", "Log ENTRY") {
                            performLog(pass, "ENTRY")
                        }
                    }
                    latestLog.type == "ENTRY" -> {
                        // Already entered -> EXIT
                        showValidState("Guest is Inside: Ready for Exit", "Log EXIT") {
                            performLog(pass, "EXIT")
                        }
                    }
                    latestLog.type == "EXIT" -> {
                        // Already exited -> EXPIRED
                        showInvalidState("Pass EXPIRED: Already used for Exit today")
                    }
                    else -> {
                        showInvalidState("Invalid Scan State")
                    }
                }
            }.onFailure {
                showInvalidState("Pass not found in system")
            }
        }
    }
    
    private fun showValidState(message: String, buttonText: String, action: () -> Unit) {
        if (_binding == null) return
        binding.ivStatusIcon.setColorFilter(Color.GREEN)
        binding.tvStatusTitle.text = "Access Approved"
        binding.tvStatusTitle.setTextColor(Color.GREEN)
        binding.tvGuestDetails.text = message
        
        binding.btnAction.visibility = View.VISIBLE
        binding.btnAction.text = buttonText
        binding.btnAction.setOnClickListener { action() }
    }
    
    private fun showInvalidState(reason: String) {
        if (_binding == null) return
        binding.ivStatusIcon.setColorFilter(Color.RED)
        binding.tvStatusTitle.text = "Access Denied"
        binding.tvStatusTitle.setTextColor(Color.RED)
        binding.tvGuestName.visibility = View.GONE
        binding.tvGuestDetails.text = reason
        binding.btnAction.visibility = View.GONE
    }
    
    private fun performLog(pass: VisitorPass, type: String) {
        val currentUserUid = Firebase.auth.currentUser?.uid ?: return
        lifecycleScope.launch {
            val result = repo.logVisitorAction(pass, currentUserUid, type)
            if (result.isSuccess) {
                Toast.makeText(requireContext(), "$type Logged Successfully", Toast.LENGTH_SHORT).show()
                findNavController().navigateUp()
            } else {
                Toast.makeText(requireContext(), "Failed to log $type", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
