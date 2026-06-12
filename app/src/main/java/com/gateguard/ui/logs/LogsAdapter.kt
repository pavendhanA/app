package com.gateguard.ui.logs

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.gateguard.VisitorLogRemote
import com.gateguard.databinding.ItemLogBinding

class LogsAdapter(private var logs: List<VisitorLogRemote>) : RecyclerView.Adapter<LogsAdapter.LogViewHolder>() {

    fun updateLogs(newLogs: List<VisitorLogRemote>) {
        logs = newLogs
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LogViewHolder {
        val binding = ItemLogBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return LogViewHolder(binding)
    }

    override fun onBindViewHolder(holder: LogViewHolder, position: Int) {
        val log = logs[position]
        holder.bind(log)
    }

    override fun getItemCount(): Int = logs.size

    class LogViewHolder(private val binding: ItemLogBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(log: VisitorLogRemote) {
            binding.tvLogVisitorName.text = log.visitorName
            binding.tvLogPhone.text = log.phoneNumber
            binding.tvLogType.text = log.type
            binding.tvLogStatus.text = log.status
            binding.tvLogTime.text = "Scanned at: ${log.scannedAt}"
            
            // Set status color
            if (log.status.uppercase() == "APPROVED") {
                binding.tvLogStatus.setTextColor(Color.parseColor("#16A34A"))
            } else {
                binding.tvLogStatus.setTextColor(Color.parseColor("#DC2626"))
            }
        }
    }
}