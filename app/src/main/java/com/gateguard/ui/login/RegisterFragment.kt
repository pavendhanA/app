package com.gateguard.ui.login

import android.os.Bundle
import android.util.Patterns
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.gateguard.R
import com.gateguard.data.User
import com.gateguard.databinding.FragmentRegisterBinding
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.Timestamp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.auth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.Firebase

class RegisterFragment : Fragment(R.layout.fragment_register) {

    private var _binding: FragmentRegisterBinding? = null
    private val binding get() = _binding!!
    private lateinit var auth: FirebaseAuth
    private val db = FirebaseFirestore.getInstance()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentRegisterBinding.bind(view)

        auth = Firebase.auth

        binding.btnRegister.setOnClickListener {
            handleRegistration()
        }

        binding.tvGoToLogin.setOnClickListener {
            findNavController().navigateUp()
        }
    }

    private fun handleRegistration() {
        val fullName = binding.etFullName.text?.toString()?.trim() ?: ""
        val email = binding.etRegisterEmail.text?.toString()?.trim() ?: ""
        val phone = binding.etPhoneNumber.text?.toString()?.trim() ?: ""
        val password = binding.etRegisterPassword.text?.toString()?.trim() ?: ""
        val confirmPassword = binding.etConfirmPassword.text?.toString()?.trim() ?: ""

        // Validation
        if (fullName.isEmpty()) {
            binding.tilFullName.error = "Full Name is required"
            return
        }
        binding.tilFullName.error = null

        if (email.isEmpty() || !Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilRegisterEmail.error = "Enter a valid email"
            return
        }
        binding.tilRegisterEmail.error = null

        if (phone.isEmpty()) {
            binding.tilPhoneNumber.error = "Phone number is required"
            return
        }
        binding.tilPhoneNumber.error = null

        if (password.length < 6) {
            binding.tilRegisterPassword.error = "Password must be at least 6 characters"
            return
        }
        binding.tilRegisterPassword.error = null

        if (password != confirmPassword) {
            binding.tilConfirmPassword.error = "Passwords do not match"
            return
        }
        binding.tilConfirmPassword.error = null

        showLoading(true)

        auth.createUserWithEmailAndPassword(email, password)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val uid = auth.currentUser?.uid ?: ""
                    saveUserToFirestore(uid, fullName, email, phone)
                } else {
                    showLoading(false)
                    showError(task.exception?.localizedMessage ?: "Registration failed")
                }
            }
    }

    private fun saveUserToFirestore(uid: String, name: String, email: String, phone: String) {
        val user = User(
            uid = uid,
            fullName = name,
            email = email,
            phoneNumber = phone,
            role = "user",
            createdAt = Timestamp.now()
        )

        db.collection("Users").document(uid)
            .set(user)
            .addOnSuccessListener {
                if (isAdded) {
                    showLoading(false)
                    findNavController().navigate(R.id.action_register_to_home)
                }
            }
            .addOnFailureListener { e ->
                if (isAdded) {
                    showLoading(false)
                    showError("User created but profile save failed: ${e.localizedMessage}")
                }
            }
    }

    private fun showLoading(isLoading: Boolean) {
        binding.btnRegister.isEnabled = !isLoading
        binding.btnRegister.alpha = if (isLoading) 0.5f else 1.0f
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.tilFullName.isEnabled = !isLoading
        binding.tilRegisterEmail.isEnabled = !isLoading
        binding.tilPhoneNumber.isEnabled = !isLoading
        binding.tilRegisterPassword.isEnabled = !isLoading
        binding.tilConfirmPassword.isEnabled = !isLoading
    }

    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
