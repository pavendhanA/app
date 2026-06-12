package com.gateguard

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.gateguard.databinding.ItemLogBinding

class VisitorLogAdapter(
    private var logs: List<VisitorLogRemote>
) : RecyclerView.Adapter<VisitorLogAdapter.LogViewHolder>() {

    class LogViewHolder(val binding: ItemLogBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LogViewHolder {
        val binding = ItemLogBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return LogViewHolder(binding)
    }

    override fun onBindViewHolder(holder: LogViewHolder, position: Int) {
        val log = logs[position]

        holder.binding.tvLogVisitorName.text = log.visitorName
        holder.binding.tvLogPhone.text = log.phoneNumber
        holder.binding.tvLogType.text = log.type
        holder.binding.tvLogStatus.text = log.status
        holder.binding.tvLogTime.text = log.scannedAt

        // Dynamic status color for smooth UX
        val statusColor = if (log.status.equals("APPROVED", ignoreCase = true)) {
            "#16A34A"
        } else {
            "#DC2626"
        }
        holder.binding.tvLogStatus.setTextColor(android.graphics.Color.parseColor(statusColor))
    }

    override fun getItemCount(): Int = logs.size

    fun updateData(newLogs: List<VisitorLogRemote>) {
        logs = newLogs
        notifyDataSetChanged()
    }
}