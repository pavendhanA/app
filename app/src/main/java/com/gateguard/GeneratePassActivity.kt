package com.gateguard

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import java.util.Calendar
import java.util.UUID

class GeneratePassActivity : AppCompatActivity() {

    private lateinit var etVisitorName: TextInputEditText
    private lateinit var etVisitorPhone: TextInputEditText
    private lateinit var etVisitorType: TextInputEditText
    private lateinit var etTowerBlock: TextInputEditText
    private lateinit var etFlatNumber: TextInputEditText
    private lateinit var etVehicleNumber: TextInputEditText
    private lateinit var etNoOfVisitors: TextInputEditText
    private lateinit var etVisitDate: TextInputEditText
    private lateinit var etFromTime: TextInputEditText
    private lateinit var etToTime: TextInputEditText
    private lateinit var etPurpose: TextInputEditText
    private lateinit var btnCreatePass: MaterialButton
    private lateinit var btnBackHome: MaterialButton

    private val repo = FirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_generate_pass)

        etVisitorName = findViewById(R.id.etVisitorName)
        etVisitorPhone = findViewById(R.id.etVisitorPhone)
        etVisitorType = findViewById(R.id.etVisitorType)
        etTowerBlock = findViewById(R.id.etTowerBlock)
        etFlatNumber = findViewById(R.id.etFlatNumber)
        etVehicleNumber = findViewById(R.id.etVehicleNumber)
        etNoOfVisitors = findViewById(R.id.etNoOfVisitors)
        etVisitDate = findViewById(R.id.etVisitDate)
        etFromTime = findViewById(R.id.etFromTime)
        etToTime = findViewById(R.id.etToTime)
        etPurpose = findViewById(R.id.etPurpose)
        btnCreatePass = findViewById(R.id.btnCreatePass)
        btnBackHome = findViewById(R.id.btnBackHome)

        etVisitDate.setOnClickListener {
            showDatePicker()
        }

        etFromTime.setOnClickListener {
            showTimePicker(etFromTime)
        }

        etToTime.setOnClickListener {
            showTimePicker(etToTime)
        }

        btnCreatePass.setOnClickListener {
            val visitorName = etVisitorName.text.toString().trim()
            val visitorPhone = etVisitorPhone.text.toString().trim()
            val visitorType = etVisitorType.text.toString().trim()
            val towerBlock = etTowerBlock.text.toString().trim()
            val flatNumber = etFlatNumber.text.toString().trim()
            val vehicleNumber = etVehicleNumber.text.toString().trim()
            val noOfVisitors = etNoOfVisitors.text.toString().trim()
            val visitDate = etVisitDate.text.toString().trim()
            val fromTime = etFromTime.text.toString().trim()
            val toTime = etToTime.text.toString().trim()
            val purpose = etPurpose.text.toString().trim()

            if (visitorName.isEmpty()) {
                etVisitorName.error = "Enter visitor name"
                etVisitorName.requestFocus()
                return@setOnClickListener
            }

            if (visitorPhone.isEmpty()) {
                etVisitorPhone.error = "Enter phone number"
                etVisitorPhone.requestFocus()
                return@setOnClickListener
            }

            if (visitorType.isEmpty()) {
                etVisitorType.error = "Enter visitor type"
                etVisitorType.requestFocus()
                return@setOnClickListener
            }

            if (towerBlock.isEmpty()) {
                etTowerBlock.error = "Enter tower/block"
                etTowerBlock.requestFocus()
                return@setOnClickListener
            }

            if (flatNumber.isEmpty()) {
                etFlatNumber.error = "Enter flat number"
                etFlatNumber.requestFocus()
                return@setOnClickListener
            }

            if (noOfVisitors.isEmpty()) {
                etNoOfVisitors.error = "Enter number of visitors"
                etNoOfVisitors.requestFocus()
                return@setOnClickListener
            }

            if (visitDate.isEmpty()) {
                etVisitDate.error = "Select visit date"
                etVisitDate.requestFocus()
                return@setOnClickListener
            }

            if (fromTime.isEmpty()) {
                etFromTime.error = "Select from time"
                etFromTime.requestFocus()
                return@setOnClickListener
            }

            if (toTime.isEmpty()) {
                etToTime.error = "Select to time"
                etToTime.requestFocus()
                return@setOnClickListener
            }

            if (purpose.isEmpty()) {
                etPurpose.error = "Enter purpose"
                etPurpose.requestFocus()
                return@setOnClickListener
            }

            val passId = UUID.randomUUID().toString().substring(0, 8).uppercase()
            val hostUid = repo.getCurrentUid() ?: ""

            val pass = VisitorPassRemote(
                passId = passId,
                visitorName = visitorName,
                phoneNumber = visitorPhone,
                visitorType = visitorType,
                towerBlock = towerBlock,
                flatNumber = flatNumber,
                vehicleNumber = vehicleNumber,
                noOfVisitors = noOfVisitors,
                visitDate = visitDate,
                fromTime = fromTime,
                toTime = toTime,
                purpose = purpose,
                hostUid = hostUid,
                status = "ACTIVE",
                usedForEntry = false,
                usedForExit = false,
                createdAtMillis = System.currentTimeMillis()
            )

            lifecycleScope.launch {
                val result = repo.createVisitorPassRemote(pass)
                
                runOnUiThread {
                    result.onSuccess {
                        Toast.makeText(this@GeneratePassActivity, "Visitor pass generated successfully", Toast.LENGTH_SHORT).show()

                        val intent = Intent(this@GeneratePassActivity, PassPreviewActivity::class.java)
                        intent.putExtra("passId", passId)
                        intent.putExtra("visitorName", visitorName)
                        intent.putExtra("visitorPhone", visitorPhone)
                        intent.putExtra("visitorType", visitorType)
                        intent.putExtra("towerBlock", towerBlock)
                        intent.putExtra("flatNumber", flatNumber)
                        intent.putExtra("vehicleNumber", vehicleNumber)
                        intent.putExtra("noOfVisitors", noOfVisitors)
                        intent.putExtra("visitDate", visitDate)
                        intent.putExtra("fromTime", fromTime)
                        intent.putExtra("toTime", toTime)
                        intent.putExtra("purpose", purpose)

                        startActivity(intent)
                    }.onFailure {
                        Toast.makeText(this@GeneratePassActivity, "Failed to create pass: ${it.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        btnBackHome.setOnClickListener {
            finish()
        }
    }

    private fun showDatePicker() {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DAY_OF_MONTH)

        val datePickerDialog = DatePickerDialog(
            this,
            { _, selectedYear, selectedMonth, selectedDay ->
                val formattedDate = "$selectedDay/${selectedMonth + 1}/$selectedYear"
                etVisitDate.setText(formattedDate)
            },
            year,
            month,
            day
        )
        datePickerDialog.show()
    }

    private fun showTimePicker(editText: TextInputEditText) {
        val calendar = Calendar.getInstance()
        val hour = calendar.get(Calendar.HOUR_OF_DAY)
        val minute = calendar.get(Calendar.MINUTE)

        val timePickerDialog = TimePickerDialog(
            this,
            { _, selectedHour, selectedMinute ->
                val amPm = if (selectedHour >= 12) "PM" else "AM"
                val hour12 = when {
                    selectedHour == 0 -> 12
                    selectedHour > 12 -> selectedHour - 12
                    else -> selectedHour
                }
                val formattedMinute = String.format("%02d", selectedMinute)
                val formattedTime = "$hour12:$formattedMinute $amPm"
                editText.setText(formattedTime)
            },
            hour,
            minute,
            false
        )
        timePickerDialog.show()
    }
}