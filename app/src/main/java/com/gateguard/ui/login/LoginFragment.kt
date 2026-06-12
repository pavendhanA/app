package com.gateguard.ui.login

import android.os.Bundle
import android.util.Patterns
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.gateguard.R
import com.gateguard.databinding.FragmentLoginBinding
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException
import com.google.firebase.auth.FirebaseAuthInvalidUserException
import com.google.firebase.auth.auth
import com.google.firebase.Firebase

class LoginFragment : Fragment(R.layout.fragment_login) {

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!
    private lateinit var auth: FirebaseAuth

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentLoginBinding.bind(view)

        auth = Firebase.auth

        // Session management check
        if (auth.currentUser != null) {
            navigateToHome()
            return
        }

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.btnLogin.setOnClickListener {
            handleLogin()
        }

        binding.tvGoToRegister.setOnClickListener {
            if (findNavController().currentDestination?.id == R.id.loginFragment) {
                findNavController().navigate(R.id.action_login_to_register)
            }
        }

        binding.tvForgotPassword.setOnClickListener {
            handleForgotPassword()
        }
    }

    private fun handleLogin() {
        val email = binding.etLoginEmail.text?.toString()?.trim() ?: ""
        val password = binding.etLoginPassword.text?.toString()?.trim() ?: ""

        // Field Validation
        if (email.isEmpty()) {
            binding.tilLoginEmail.error = "Email is required"
            return
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilLoginEmail.error = "Enter a valid email address"
            return
        }
        binding.tilLoginEmail.error = null

        if (password.isEmpty()) {
            binding.tilLoginPassword.error = "Password is required"
            return
        }
        binding.tilLoginPassword.error = null

        showLoading(true)

        auth.signInWithEmailAndPassword(email, password)
            .addOnCompleteListener { task ->
                if (!isAdded) return@addOnCompleteListener
                
                showLoading(false)
                if (task.isSuccessful) {
                    navigateToHome()
                } else {
                    val exception = task.exception
                    val errorMessage = when (exception) {
                        is FirebaseAuthInvalidUserException -> "No account found with this email."
                        is FirebaseAuthInvalidCredentialsException -> "Invalid password."
                        else -> exception?.localizedMessage ?: "Connection error. Please try again."
                    }
                    showError(errorMessage)
                }
            }
    }

    private fun handleForgotPassword() {
        val email = binding.etLoginEmail.text?.toString()?.trim() ?: ""
        if (email.isEmpty() || !Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilLoginEmail.error = "Enter your email to reset password"
            return
        }
        
        showLoading(true)
        auth.sendPasswordResetEmail(email)
            .addOnCompleteListener { task ->
                if (!isAdded) return@addOnCompleteListener
                showLoading(false)
                if (task.isSuccessful) {
                    showError("Password reset link sent to your email.")
                } else {
                    showError(task.exception?.localizedMessage ?: "Failed to send reset email.")
                }
            }
    }

    private fun navigateToHome() {
        if (findNavController().currentDestination?.id == R.id.loginFragment) {
            findNavController().navigate(R.id.action_login_to_home)
        }
    }

    private fun showLoading(isLoading: Boolean) {
        binding.btnLogin.isEnabled = !isLoading
        binding.btnLogin.alpha = if (isLoading) 0.5f else 1.0f
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.tilLoginEmail.isEnabled = !isLoading
        binding.tilLoginPassword.isEnabled = !isLoading
        binding.tvGoToRegister.isEnabled = !isLoading
        binding.tvForgotPassword.isEnabled = !isLoading
    }

    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
