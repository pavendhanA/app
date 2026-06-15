package com.gateguard

import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.animation.AccelerateDecelerateInterpolator
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import android.view.View
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        val logo = findViewById<ImageView>(R.id.imgLogo)
        val glow = findViewById<View>(R.id.glowView)
        val appName = findViewById<TextView>(R.id.tvAppName)
        val tagline = findViewById<TextView>(R.id.tvTagline)
        val progressBar = findViewById<ProgressBar>(R.id.progressBar)
        val loading = findViewById<TextView>(R.id.tvLoading)

        // Logo Animation
        logo.animate()
            .alpha(1f)
            .scaleX(1f)
            .scaleY(1f)
            .setDuration(1200)
            .setInterpolator(AccelerateDecelerateInterpolator())
            .start()

        // Glow Fade
        glow.animate()
            .alpha(1f)
            .setDuration(1400)
            .start()

        // Text Reveal
        Handler(Looper.getMainLooper()).postDelayed({

            appName.animate()
                .alpha(1f)
                .setDuration(600)
                .start()

            tagline.animate()
                .alpha(1f)
                .setDuration(600)
                .start()

        }, 800)

        // Progress Bar Animation
        Handler(Looper.getMainLooper()).postDelayed({

            progressBar.animate()
                .alpha(1f)
                .setDuration(400)
                .start()

            loading.animate()
                .alpha(1f)
                .setDuration(400)
                .start()

            val animator = ObjectAnimator.ofInt(progressBar, "progress", 0, 100)
            animator.duration = 1800
            animator.interpolator = AccelerateDecelerateInterpolator()
            animator.start()

        }, 1200)

        // Move to Login
        Handler(Looper.getMainLooper()).postDelayed({

            startActivity(Intent(this, MainActivity::class.java))
            finish()

        }, 3500)
    }
}