package com.gateguard

import android.os.Bundle
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {

    private val repo = FirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val etFullName = findViewById<TextInputEditText>(R.id.etFullName)
        val etRegisterEmail = findViewById<TextInputEditText>(R.id.etRegisterEmail)
        val etPhoneNumber = findViewById<TextInputEditText>(R.id.etPhoneNumber)
        val etRegisterPassword = findViewById<TextInputEditText>(R.id.etRegisterPassword)
        val etConfirmPassword = findViewById<TextInputEditText>(R.id.etConfirmPassword)
        val btnRegister = findViewById<MaterialButton>(R.id.btnRegister)
        val tvGoToLogin = findViewById<TextView>(R.id.tvGoToLogin)
        val roleGroup = findViewById<RadioGroup>(R.id.radioGroupRegisterRole)
        val rbRegisterHost = findViewById<RadioButton>(R.id.rbRegisterHost)
        val rbRegisterGuard = findViewById<RadioButton>(R.id.rbRegisterGuard)

        tvGoToLogin.setOnClickListener {
            finish()
        }

        btnRegister.setOnClickListener {
            val name = etFullName.text.toString().trim()
            val email = etRegisterEmail.text.toString().trim()
            val phone = etPhoneNumber.text.toString().trim()
            val password = etRegisterPassword.text.toString().trim()
            val confirmPassword = etConfirmPassword.text.toString().trim()

            if (name.isEmpty()) {
                etFullName.error = "Enter full name"
                etFullName.requestFocus()
                return@setOnClickListener
            }

            if (email.isEmpty()) {
                etRegisterEmail.error = "Enter email"
                etRegisterEmail.requestFocus()
                return@setOnClickListener
            }

            if (phone.isEmpty()) {
                etPhoneNumber.error = "Enter phone number"
                etPhoneNumber.requestFocus()
                return@setOnClickListener
            }

            if (password.isEmpty()) {
                etRegisterPassword.error = "Enter password"
                etRegisterPassword.requestFocus()
                return@setOnClickListener
            }

            if (confirmPassword.isEmpty()) {
                etConfirmPassword.error = "Confirm your password"
                etConfirmPassword.requestFocus()
                return@setOnClickListener
            }

            if (password != confirmPassword) {
                etConfirmPassword.error = "Passwords do not match"
                etConfirmPassword.requestFocus()
                return@setOnClickListener
            }

            if (roleGroup.checkedRadioButtonId == -1) {
                Toast.makeText(this, "Select role", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val role = when {
                rbRegisterHost.isChecked -> "HOST"
                rbRegisterGuard.isChecked -> "GUARD"
                else -> ""
            }

            lifecycleScope.launch {
                val result = repo.registerUser(name, email, password, role)

                runOnUiThread {
                    result.onSuccess {
                        Toast.makeText(this@RegisterActivity, "Registration successful", Toast.LENGTH_SHORT).show()
                        finish()
                    }.onFailure {
                        Toast.makeText(
                            this@RegisterActivity,
                            it.message ?: "Registration failed",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            }
        }
    }
}