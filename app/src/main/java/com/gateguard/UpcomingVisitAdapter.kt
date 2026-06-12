package com.gateguard

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.card.MaterialCardView

class UpcomingVisitAdapter(
    private var visits: List<UpcomingVisit>,
    private val onItemClick: (UpcomingVisit) -> Unit
) : RecyclerView.Adapter<UpcomingVisitAdapter.UpcomingVisitViewHolder>() {

    class UpcomingVisitViewHolder(card: MaterialCardView) : RecyclerView.ViewHolder(card) {
        val tvUpcomingVisitorName: TextView = card.findViewById(R.id.tvUpcomingVisitorName)
        val tvUpcomingVisitorTime: TextView = card.findViewById(R.id.tvUpcomingTime)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UpcomingVisitViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_upcoming_visit, parent, false) as MaterialCardView
        return UpcomingVisitViewHolder(view)
    }

    override fun onBindViewHolder(holder: UpcomingVisitViewHolder, position: Int) {
        val visit = visits[position]
        holder.tvUpcomingVisitorName.text = visit.visitorName
        holder.tvUpcomingVisitorTime.text = "◷ ${visit.fromTime}"

        holder.itemView.setOnClickListener {
            onItemClick(visit)
        }
    }

    override fun getItemCount(): Int = visits.size

    fun updateData(newVisits: List<UpcomingVisit>) {
        visits = newVisits
        notifyDataSetChanged()
    }
}