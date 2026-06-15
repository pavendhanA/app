package com.gateguard.ui.profile

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.gateguard.R
import com.gateguard.databinding.FragmentProfileBinding
import com.google.firebase.Firebase
import com.google.firebase.auth.auth

class ProfileFragment : Fragment(R.layout.fragment_profile) {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentProfileBinding.bind(view)

        binding.btnSettings.setOnClickListener {
            findNavController().navigate(R.id.action_profile_to_settings)
        }

        binding.btnLogout.setOnClickListener {
            val prefs = requireContext().getSharedPreferences("GateGuardPrefs", android.content.Context.MODE_PRIVATE)
            prefs.edit().putBoolean("is_logged_in", false).apply()
            Firebase.auth.signOut()
            findNavController().navigate(R.id.action_profile_to_login)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
