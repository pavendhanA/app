package com.gateguard

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream

class ProfileActivity : AppCompatActivity() {

    private lateinit var tvProfileName: TextView
    private lateinit var tvProfileRole: TextView
    private lateinit var tvProfileEmail: TextView
    private lateinit var tvProfileUid: TextView
    private lateinit var tvProfileAvatar: TextView
    private lateinit var imgProfilePhoto: ImageView
    private lateinit var btnTakePhoto: MaterialButton
    private lateinit var btnGalleryPhoto: MaterialButton
    private lateinit var etEditProfileName: TextInputEditText
    private lateinit var etEditProfilePhone: TextInputEditText
    private lateinit var btnSaveProfileChanges: MaterialButton
    private lateinit var tvChangePhotoOption: TextView
    private lateinit var tvAboutApp: TextView
    private lateinit var tvHelpSupport: TextView
    private lateinit var tvLogoutProfile: TextView

    private val repo = FirebaseRepository()
    private var currentUid: String? = null

    private val galleryLauncher =
        registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
            if (uri != null) {
                saveGalleryImageToInternalStorage(uri)
            }
        }

    private val cameraPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            if (granted) {
                cameraLauncher.launch(null)
            } else {
                Toast.makeText(this, "Camera permission denied", Toast.LENGTH_SHORT).show()
            }
        }

    private val cameraLauncher =
        registerForActivityResult(ActivityResultContracts.TakePicturePreview()) { bitmap ->
            if (bitmap != null) {
                saveBitmapToInternalStorage(bitmap)
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        currentUid = repo.getCurrentUid()

        tvProfileName = findViewById(R.id.tvProfileName)
        tvProfileRole = findViewById(R.id.tvProfileRole)
        tvProfileEmail = findViewById(R.id.tvProfileEmail)
        tvProfileUid = findViewById(R.id.tvProfileUid)
        tvProfileAvatar = findViewById(R.id.tvProfileAvatar)
        imgProfilePhoto = findViewById(R.id.imgProfilePhoto)
        btnTakePhoto = findViewById(R.id.btnTakePhoto)
        btnGalleryPhoto = findViewById(R.id.btnGalleryPhoto)
        etEditProfileName = findViewById(R.id.etEditProfileName)
        etEditProfilePhone = findViewById(R.id.etEditProfilePhone)
        btnSaveProfileChanges = findViewById(R.id.btnSaveProfileChanges)
        tvChangePhotoOption = findViewById(R.id.tvChangePhotoOption)
        tvAboutApp = findViewById(R.id.tvAboutApp)
        tvHelpSupport = findViewById(R.id.tvHelpSupport)
        tvLogoutProfile = findViewById(R.id.tvLogoutProfile)

        btnTakePhoto.setOnClickListener {
            openCamera()
        }

        btnGalleryPhoto.setOnClickListener {
            galleryLauncher.launch("image/*")
        }

        btnSaveProfileChanges.setOnClickListener {
            saveProfileChanges()
        }

        tvChangePhotoOption.setOnClickListener {
            galleryLauncher.launch("image/*")
        }

        tvAboutApp.setOnClickListener {
            Toast.makeText(this, "GateGuard - Smart Visitor Management App", Toast.LENGTH_SHORT).show()
        }

        tvHelpSupport.setOnClickListener {
            Toast.makeText(this, "Support feature coming soon", Toast.LENGTH_SHORT).show()
        }

        tvLogoutProfile.setOnClickListener {
            repo.logout()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        loadProfile()
        loadSavedPhoto()
    }

    override fun onResume() {
        super.onResume()
        currentUid = repo.getCurrentUid()
        loadProfile()
        loadSavedPhoto()
    }

    private fun loadProfile() {
        val uid = currentUid ?: return

        lifecycleScope.launch {
            val result = repo.getUserProfile(uid)
            runOnUiThread {
                result.onSuccess { user ->
                    val name = if (user.name.isBlank()) "User" else user.name
                    val role = if (user.role.isBlank()) "HOST" else user.role
                    val email = if (user.email.isBlank()) "No email" else user.email
                    val phone = if (user.phone.isBlank()) "" else user.phone

                    tvProfileName.text = name
                    tvProfileRole.text = role
                    tvProfileEmail.text = email
                    tvProfileUid.text = uid
                    tvProfileAvatar.text = getInitials(name)

                    etEditProfileName.setText(name)
                    etEditProfilePhone.setText(phone)
                }.onFailure {
                    tvProfileName.text = "User"
                    tvProfileRole.text = "HOST"
                    tvProfileEmail.text = "No email"
                    tvProfileUid.text = uid
                    tvProfileAvatar.text = "U"

                    etEditProfileName.setText("")
                    etEditProfilePhone.setText("")
                }
            }
        }
    }

    private fun saveProfileChanges() {
        val uid = currentUid ?: return
        val newName = etEditProfileName.text?.toString()?.trim().orEmpty()
        val newPhone = etEditProfilePhone.text?.toString()?.trim().orEmpty()

        if (newName.isEmpty()) {
            Toast.makeText(this, "Enter full name", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            val result = repo.updateUserProfile(uid, newName, newPhone)
            result.onSuccess {
                tvProfileName.text = newName
                tvProfileAvatar.text = getInitials(newName)

                val resultIntent = Intent()
                resultIntent.putExtra("profile_updated", true)
                setResult(RESULT_OK, resultIntent)

                Toast.makeText(this@ProfileActivity, "Profile updated", Toast.LENGTH_SHORT).show()
            }.onFailure {
                Toast.makeText(this@ProfileActivity, "Failed to update profile", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun openCamera() {
        when {
            ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) ==
                PackageManager.PERMISSION_GRANTED -> {
                cameraLauncher.launch(null)
            }
            else -> {
                cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
        }
    }

    private fun getPhotoFileName(): String {
        val uid = currentUid ?: "default_user"
        return "profile_photo_$uid.jpg"
    }

    private fun saveBitmapToInternalStorage(bitmap: Bitmap) {
        try {
            val file = File(filesDir, getPhotoFileName())
            FileOutputStream(file).use { out ->
                bitmap.compress(Bitmap.CompressFormat.JPEG, 90, out)
            }
            showPhotoFromFile(file)
        } catch (e: Exception) {
            Toast.makeText(this, "Failed to save camera photo", Toast.LENGTH_SHORT).show()
        }
    }

    private fun saveGalleryImageToInternalStorage(uri: android.net.Uri) {
        try {
            val inputStream = contentResolver.openInputStream(uri) ?: return
            val bitmap = BitmapFactory.decodeStream(inputStream)
            inputStream.close()

            if (bitmap != null) {
                saveBitmapToInternalStorage(bitmap)
            } else {
                Toast.makeText(this, "Unable to load selected image", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Toast.makeText(this, "Failed to load gallery image", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadSavedPhoto() {
        val file = File(filesDir, getPhotoFileName())
        if (file.exists()) {
            showPhotoFromFile(file)
        } else {
            imgProfilePhoto.setImageDrawable(null)
            tvProfileAvatar.visibility = View.VISIBLE
        }
    }

    private fun showPhotoFromFile(file: File) {
        try {
            val bitmap = BitmapFactory.decodeFile(file.absolutePath)
            if (bitmap != null) {
                imgProfilePhoto.setImageBitmap(bitmap)
                imgProfilePhoto.visibility = View.VISIBLE
                tvProfileAvatar.visibility = View.GONE
            } else {
                imgProfilePhoto.setImageDrawable(null)
                tvProfileAvatar.visibility = View.VISIBLE
            }
        } catch (e: Exception) {
            imgProfilePhoto.setImageDrawable(null)
            tvProfileAvatar.visibility = View.VISIBLE
        }
    }

    private fun getInitials(name: String): String {
        val parts = name.trim().split(" ").filter { it.isNotEmpty() }
        return when {
            parts.isEmpty() -> "U"
            parts.size == 1 -> parts[0].take(1).uppercase()
            else -> (parts[0].take(1) + parts[1].take(1)).uppercase()
        }
    }
}
