package com.gateguard.ui.notifications

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.gateguard.data.Notification
import com.gateguard.databinding.ItemNotificationBinding

class NotificationsAdapter(private var list: List<Notification>) : RecyclerView.Adapter<NotificationsAdapter.ViewHolder>() {

    fun updateData(newList: List<Notification>) {
        list = newList
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemNotificationBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(list[position])
    }

    override fun getItemCount(): Int = list.size

    class ViewHolder(private val binding: ItemNotificationBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: Notification) {
            binding.tvMessage.text = item.message
            binding.tvTime.text = item.timestamp
            binding.vUnread.visibility = if (item.isRead) View.GONE else View.VISIBLE
        }
    }
}
