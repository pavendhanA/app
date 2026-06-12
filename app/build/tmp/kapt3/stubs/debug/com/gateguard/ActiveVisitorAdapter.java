package com.gateguard;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u00002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\b\u0018\u00002\b\u0012\u0004\u0012\u00020\u00020\u0001:\u0001\u0016B)\u0012\f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004\u0012\u0012\u0010\u0006\u001a\u000e\u0012\u0004\u0012\u00020\u0005\u0012\u0004\u0012\u00020\b0\u0007\u00a2\u0006\u0004\b\t\u0010\nJ\u0018\u0010\u000b\u001a\u00020\u00022\u0006\u0010\f\u001a\u00020\r2\u0006\u0010\u000e\u001a\u00020\u000fH\u0016J\u0018\u0010\u0010\u001a\u00020\b2\u0006\u0010\u0011\u001a\u00020\u00022\u0006\u0010\u0012\u001a\u00020\u000fH\u0016J\b\u0010\u0013\u001a\u00020\u000fH\u0016J\u0014\u0010\u0014\u001a\u00020\b2\f\u0010\u0015\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004R\u0014\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u001a\u0010\u0006\u001a\u000e\u0012\u0004\u0012\u00020\u0005\u0012\u0004\u0012\u00020\b0\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0017"}, d2 = {"Lcom/gateguard/ActiveVisitorAdapter;", "Landroidx/recyclerview/widget/RecyclerView$Adapter;", "Lcom/gateguard/ActiveVisitorAdapter$ActiveVisitorViewHolder;", "visitors", "", "Lcom/gateguard/ActiveVisitor;", "onItemClick", "Lkotlin/Function1;", "", "<init>", "(Ljava/util/List;Lkotlin/jvm/functions/Function1;)V", "onCreateViewHolder", "parent", "Landroid/view/ViewGroup;", "viewType", "", "onBindViewHolder", "holder", "position", "getItemCount", "updateData", "newVisitors", "ActiveVisitorViewHolder", "app_debug"})
public final class ActiveVisitorAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter<com.gateguard.ActiveVisitorAdapter.ActiveVisitorViewHolder> {
    @org.jetbrains.annotations.NotNull()
    private java.util.List<com.gateguard.ActiveVisitor> visitors;
    @org.jetbrains.annotations.NotNull()
    private final kotlin.jvm.functions.Function1<com.gateguard.ActiveVisitor, kotlin.Unit> onItemClick = null;
    
    public ActiveVisitorAdapter(@org.jetbrains.annotations.NotNull()
    java.util.List<com.gateguard.ActiveVisitor> visitors, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super com.gateguard.ActiveVisitor, kotlin.Unit> onItemClick) {
        super();
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public com.gateguard.ActiveVisitorAdapter.ActiveVisitorViewHolder onCreateViewHolder(@org.jetbrains.annotations.NotNull()
    android.view.ViewGroup parent, int viewType) {
        return null;
    }
    
    @java.lang.Override()
    public void onBindViewHolder(@org.jetbrains.annotations.NotNull()
    com.gateguard.ActiveVisitorAdapter.ActiveVisitorViewHolder holder, int position) {
    }
    
    @java.lang.Override()
    public int getItemCount() {
        return 0;
    }
    
    public final void updateData(@org.jetbrains.annotations.NotNull()
    java.util.List<com.gateguard.ActiveVisitor> newVisitors) {
    }
    
    @kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000\u001a\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0005\u0018\u00002\u00020\u0001B\u000f\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0004\b\u0004\u0010\u0005R\u0011\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\b\u0010\tR\u0011\u0010\n\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\t\u00a8\u0006\f"}, d2 = {"Lcom/gateguard/ActiveVisitorAdapter$ActiveVisitorViewHolder;", "Landroidx/recyclerview/widget/RecyclerView$ViewHolder;", "card", "Lcom/google/android/material/card/MaterialCardView;", "<init>", "(Lcom/google/android/material/card/MaterialCardView;)V", "tvActiveVisitorName", "Landroid/widget/TextView;", "getTvActiveVisitorName", "()Landroid/widget/TextView;", "tvActiveVisitorTime", "getTvActiveVisitorTime", "app_debug"})
    public static final class ActiveVisitorViewHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView tvActiveVisitorName = null;
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView tvActiveVisitorTime = null;
        
        public ActiveVisitorViewHolder(@org.jetbrains.annotations.NotNull()
        com.google.android.material.card.MaterialCardView card) {
            super(null);
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getTvActiveVisitorName() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getTvActiveVisitorTime() {
            return null;
        }
    }
}