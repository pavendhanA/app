package com.gateguard

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private val repo = FirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val etLoginEmail = findViewById<TextInputEditText>(R.id.etLoginEmail)
        val etLoginPassword = findViewById<TextInputEditText>(R.id.etLoginPassword)
        val btnLogin = findViewById<MaterialButton>(R.id.btnLogin)
        val tvGoToRegister = findViewById<TextView>(R.id.tvGoToRegister)
        val tvForgotPassword = findViewById<TextView>(R.id.tvForgotPassword)

        tvGoToRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        tvForgotPassword.setOnClickListener {
            Toast.makeText(this, "Forgot Password feature coming soon", Toast.LENGTH_SHORT).show()
        }

        btnLogin.setOnClickListener {
            val email = etLoginEmail.text.toString().trim()
            val password = etLoginPassword.text.toString().trim()

            if (email.isEmpty()) {
                etLoginEmail.error = "Enter email"
                etLoginEmail.requestFocus()
                return@setOnClickListener
            }

            if (password.isEmpty()) {
                etLoginPassword.error = "Enter password"
                etLoginPassword.requestFocus()
                return@setOnClickListener
            }

            lifecycleScope.launch {
                val result = repo.loginUser(email, password)

                runOnUiThread {
                    result.onSuccess { user ->
                        when (user.role.uppercase()) {
                            "HOST" -> startActivity(Intent(this@LoginActivity, HostDashboardActivity::class.java))
                            "GUARD" -> startActivity(Intent(this@LoginActivity, GuardDashboardActivity::class.java))
                            "ADMIN" -> startActivity(Intent(this@LoginActivity, AdminDashboardActivity::class.java))
                            else -> {
                                Toast.makeText(this@LoginActivity, "Unknown role", Toast.LENGTH_SHORT).show()
                                return@onSuccess
                            }
                        }
                        finish()
                    }.onFailure {
                        Toast.makeText(
                            this@LoginActivity,
                            it.message ?: "Invalid login",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            }
        }
    }
}