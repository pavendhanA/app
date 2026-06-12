package com.gateguard

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.card.MaterialCardView

class ActiveVisitorAdapter(
    private var visitors: List<ActiveVisitor>,
    private val onItemClick: (ActiveVisitor) -> Unit
) : RecyclerView.Adapter<ActiveVisitorAdapter.ActiveVisitorViewHolder>() {

    class ActiveVisitorViewHolder(card: MaterialCardView) : RecyclerView.ViewHolder(card) {
        val tvActiveVisitorName: TextView = card.findViewById(R.id.tvActiveVisitorName)
        val tvActiveVisitorTime: TextView = card.findViewById(R.id.tvActiveVisitorTime)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ActiveVisitorViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_active_visitor, parent, false) as MaterialCardView
        return ActiveVisitorViewHolder(view)
    }

    override fun onBindViewHolder(holder: ActiveVisitorViewHolder, position: Int) {
        val visitor = visitors[position]
        holder.tvActiveVisitorName.text = visitor.visitorName
        holder.tvActiveVisitorTime.text = "◷ ${visitor.scannedAt}"

        holder.itemView.setOnClickListener {
            onItemClick(visitor)
        }
    }

    override fun getItemCount(): Int = visitors.size

    fun updateData(newVisitors: List<ActiveVisitor>) {
        visitors = newVisitors
        notifyDataSetChanged()
    }
}