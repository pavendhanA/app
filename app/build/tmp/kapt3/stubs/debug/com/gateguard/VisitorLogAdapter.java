package com.gateguard;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0007\u0018\u00002\b\u0012\u0004\u0012\u00020\u00020\u0001:\u0001\u0014B\u0015\u0012\f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004\u00a2\u0006\u0004\b\u0006\u0010\u0007J\u0018\u0010\b\u001a\u00020\u00022\u0006\u0010\t\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\fH\u0016J\u0018\u0010\r\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u00022\u0006\u0010\u0010\u001a\u00020\fH\u0016J\b\u0010\u0011\u001a\u00020\fH\u0016J\u0014\u0010\u0012\u001a\u00020\u000e2\f\u0010\u0013\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004R\u0014\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0015"}, d2 = {"Lcom/gateguard/VisitorLogAdapter;", "Landroidx/recyclerview/widget/RecyclerView$Adapter;", "Lcom/gateguard/VisitorLogAdapter$LogViewHolder;", "logs", "", "Lcom/gateguard/VisitorLogRemote;", "<init>", "(Ljava/util/List;)V", "onCreateViewHolder", "parent", "Landroid/view/ViewGroup;", "viewType", "", "onBindViewHolder", "", "holder", "position", "getItemCount", "updateData", "newLogs", "LogViewHolder", "app_debug"})
public final class VisitorLogAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter<com.gateguard.VisitorLogAdapter.LogViewHolder> {
    @org.jetbrains.annotations.NotNull()
    private java.util.List<com.gateguard.VisitorLogRemote> logs;
    
    public VisitorLogAdapter(@org.jetbrains.annotations.NotNull()
    java.util.List<com.gateguard.VisitorLogRemote> logs) {
        super();
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public com.gateguard.VisitorLogAdapter.LogViewHolder onCreateViewHolder(@org.jetbrains.annotations.NotNull()
    android.view.ViewGroup parent, int viewType) {
        return null;
    }
    
    @java.lang.Override()
    public void onBindViewHolder(@org.jetbrains.annotations.NotNull()
    com.gateguard.VisitorLogAdapter.LogViewHolder holder, int position) {
    }
    
    @java.lang.Override()
    public int getItemCount() {
        return 0;
    }
    
    public final void updateData(@org.jetbrains.annotations.NotNull()
    java.util.List<com.gateguard.VisitorLogRemote> newLogs) {
    }
    
    @kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\u0018\u00002\u00020\u0001B\u000f\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0004\b\u0004\u0010\u0005R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0006\u0010\u0007\u00a8\u0006\b"}, d2 = {"Lcom/gateguard/VisitorLogAdapter$LogViewHolder;", "Landroidx/recyclerview/widget/RecyclerView$ViewHolder;", "binding", "Lcom/gateguard/databinding/ItemLogBinding;", "<init>", "(Lcom/gateguard/databinding/ItemLogBinding;)V", "getBinding", "()Lcom/gateguard/databinding/ItemLogBinding;", "app_debug"})
    public static final class LogViewHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {
        @org.jetbrains.annotations.NotNull()
        private final com.gateguard.databinding.ItemLogBinding binding = null;
        
        public LogViewHolder(@org.jetbrains.annotations.NotNull()
        com.gateguard.databinding.ItemLogBinding binding) {
            super(null);
        }
        
        @org.jetbrains.annotations.NotNull()
        public final com.gateguard.databinding.ItemLogBinding getBinding() {
            return null;
        }
    }
}