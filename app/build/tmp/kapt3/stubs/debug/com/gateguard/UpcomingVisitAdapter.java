package com.gateguard;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u00002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\b\u0018\u00002\b\u0012\u0004\u0012\u00020\u00020\u0001:\u0001\u0016B)\u0012\f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004\u0012\u0012\u0010\u0006\u001a\u000e\u0012\u0004\u0012\u00020\u0005\u0012\u0004\u0012\u00020\b0\u0007\u00a2\u0006\u0004\b\t\u0010\nJ\u0018\u0010\u000b\u001a\u00020\u00022\u0006\u0010\f\u001a\u00020\r2\u0006\u0010\u000e\u001a\u00020\u000fH\u0016J\u0018\u0010\u0010\u001a\u00020\b2\u0006\u0010\u0011\u001a\u00020\u00022\u0006\u0010\u0012\u001a\u00020\u000fH\u0016J\b\u0010\u0013\u001a\u00020\u000fH\u0016J\u0014\u0010\u0014\u001a\u00020\b2\f\u0010\u0015\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004R\u0014\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u001a\u0010\u0006\u001a\u000e\u0012\u0004\u0012\u00020\u0005\u0012\u0004\u0012\u00020\b0\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0017"}, d2 = {"Lcom/gateguard/UpcomingVisitAdapter;", "Landroidx/recyclerview/widget/RecyclerView$Adapter;", "Lcom/gateguard/UpcomingVisitAdapter$UpcomingVisitViewHolder;", "visits", "", "Lcom/gateguard/UpcomingVisit;", "onItemClick", "Lkotlin/Function1;", "", "<init>", "(Ljava/util/List;Lkotlin/jvm/functions/Function1;)V", "onCreateViewHolder", "parent", "Landroid/view/ViewGroup;", "viewType", "", "onBindViewHolder", "holder", "position", "getItemCount", "updateData", "newVisits", "UpcomingVisitViewHolder", "app_debug"})
public final class UpcomingVisitAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter<com.gateguard.UpcomingVisitAdapter.UpcomingVisitViewHolder> {
    @org.jetbrains.annotations.NotNull()
    private java.util.List<com.gateguard.UpcomingVisit> visits;
    @org.jetbrains.annotations.NotNull()
    private final kotlin.jvm.functions.Function1<com.gateguard.UpcomingVisit, kotlin.Unit> onItemClick = null;
    
    public UpcomingVisitAdapter(@org.jetbrains.annotations.NotNull()
    java.util.List<com.gateguard.UpcomingVisit> visits, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super com.gateguard.UpcomingVisit, kotlin.Unit> onItemClick) {
        super();
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public com.gateguard.UpcomingVisitAdapter.UpcomingVisitViewHolder onCreateViewHolder(@org.jetbrains.annotations.NotNull()
    android.view.ViewGroup parent, int viewType) {
        return null;
    }
    
    @java.lang.Override()
    public void onBindViewHolder(@org.jetbrains.annotations.NotNull()
    com.gateguard.UpcomingVisitAdapter.UpcomingVisitViewHolder holder, int position) {
    }
    
    @java.lang.Override()
    public int getItemCount() {
        return 0;
    }
    
    public final void updateData(@org.jetbrains.annotations.NotNull()
    java.util.List<com.gateguard.UpcomingVisit> newVisits) {
    }
    
    @kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000\u001a\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0005\u0018\u00002\u00020\u0001B\u000f\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0004\b\u0004\u0010\u0005R\u0011\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\b\u0010\tR\u0011\u0010\n\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\t\u00a8\u0006\f"}, d2 = {"Lcom/gateguard/UpcomingVisitAdapter$UpcomingVisitViewHolder;", "Landroidx/recyclerview/widget/RecyclerView$ViewHolder;", "card", "Lcom/google/android/material/card/MaterialCardView;", "<init>", "(Lcom/google/android/material/card/MaterialCardView;)V", "tvUpcomingVisitorName", "Landroid/widget/TextView;", "getTvUpcomingVisitorName", "()Landroid/widget/TextView;", "tvUpcomingVisitorTime", "getTvUpcomingVisitorTime", "app_debug"})
    public static final class UpcomingVisitViewHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView tvUpcomingVisitorName = null;
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView tvUpcomingVisitorTime = null;
        
        public UpcomingVisitViewHolder(@org.jetbrains.annotations.NotNull()
        com.google.android.material.card.MaterialCardView card) {
            super(null);
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getTvUpcomingVisitorName() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getTvUpcomingVisitorTime() {
            return null;
        }
    }
}