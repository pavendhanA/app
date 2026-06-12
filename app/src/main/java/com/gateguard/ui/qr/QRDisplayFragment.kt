package com.gateguard.ui.qr

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.gateguard.R
import com.gateguard.databinding.FragmentQrDisplayBinding
import com.gateguard.VisitorPassRemote
import com.gateguard.FirebaseRepository
import com.gateguard.utils.QRGenerator
import com.google.gson.Gson
import kotlinx.coroutines.launch

class QRDisplayFragment : Fragment(R.layout.fragment_qr_display) {

    private var _binding: FragmentQrDisplayBinding? = null
    private val binding get() = _binding!!
    private val args: QRDisplayFragmentArgs by navArgs()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentQrDisplayBinding.bind(view)

        val visitorJson = args.visitorData
        val visitor = Gson().fromJson(visitorJson, VisitorPassRemote::class.java)

        binding.tvGuestName.text = visitor.visitorName
        binding.tvValidity.text = "Valid Until: ${visitor.toTime}"

        val bitmap = QRGenerator.generateQRCode(visitorJson, 512, 512)
        if (bitmap != null) {
            binding.ivQrCode.setImageBitmap(bitmap)
        }

        binding.btnBack.setOnClickListener {
            findNavController().navigateUp()
        }

        binding.btnShare.setOnClickListener {
            val sendIntent: Intent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_TEXT, "Here is your GateGuard Visitor Pass!\n\nName: ${visitor.visitorName}\nValid Until: ${visitor.toTime}")
                type = "text/plain"
            }
            val shareIntent = Intent.createChooser(sendIntent, null)
            startActivity(shareIntent)
        }
        
        // No need to save to Database again here if GenerateQRFragment already did it,
        // but we'll keep the block if additional local logic is needed.
        lifecycleScope.launch {
            try {
                // Already saved in GenerateQRFragment, just logging for diagnostics
            } catch(e: Exception) {
                e.printStackTrace()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
