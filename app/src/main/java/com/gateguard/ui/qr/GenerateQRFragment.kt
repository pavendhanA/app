package com.gateguard.ui.qr

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.gateguard.R
import com.gateguard.databinding.FragmentGenerateQrBinding
import com.google.gson.Gson
import com.gateguard.VisitorPassRemote
import com.gateguard.FirebaseRepository
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import kotlinx.coroutines.launch
import androidx.lifecycle.lifecycleScope
import java.util.UUID
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class GenerateQRFragment : Fragment(R.layout.fragment_generate_qr) {

    private var _binding: FragmentGenerateQrBinding? = null
    private val binding get() = _binding!!

    private val repo = FirebaseRepository()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentGenerateQrBinding.bind(view)

        binding.btnGenerate.setOnClickListener {
            val name = binding.etName.text.toString().trim()
            val phone = binding.etPhone.text.toString().trim()
            val hostUid = Firebase.auth.currentUser?.uid ?: return@setOnClickListener

            if (name.isEmpty() || phone.isEmpty()) {
                Toast.makeText(requireContext(), "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val today = SimpleDateFormat("d/M/yyyy", Locale.getDefault()).format(Date())
            val fromTime = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
            val toTime = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date(System.currentTimeMillis() + 4 * 60 * 60 * 1000))

            val pass = VisitorPassRemote(
                passId = UUID.randomUUID().toString(),
                hostUid = hostUid,
                visitorName = name,
                phoneNumber = phone,
                visitDate = today,
                fromTime = fromTime,
                toTime = toTime,
                purpose = "General Visit",
                status = "ACTIVE",
                usedForEntry = false,
                usedForExit = false,
                createdAtMillis = System.currentTimeMillis()
            )

            lifecycleScope.launch {
                val result = repo.createVisitorPassRemote(pass)
                if (result.isSuccess) {
                    val jsonString = Gson().toJson(pass)
                    val action = GenerateQRFragmentDirections.actionGenerateQRToQrDisplay(jsonString)
                    findNavController().navigate(action)
                } else {
                    Toast.makeText(requireContext(), "Failed to save pass", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
