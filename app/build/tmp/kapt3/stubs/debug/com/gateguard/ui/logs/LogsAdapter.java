package com.gateguard.ui.logs;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u00000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0006\u0018\u00002\b\u0012\u0004\u0012\u00020\u00020\u0001:\u0001\u0014B\u0015\u0012\f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004\u00a2\u0006\u0004\b\u0006\u0010\u0007J\u0014\u0010\b\u001a\u00020\t2\f\u0010\n\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004J\u0018\u0010\u000b\u001a\u00020\u00022\u0006\u0010\f\u001a\u00020\r2\u0006\u0010\u000e\u001a\u00020\u000fH\u0016J\u0018\u0010\u0010\u001a\u00020\t2\u0006\u0010\u0011\u001a\u00020\u00022\u0006\u0010\u0012\u001a\u00020\u000fH\u0016J\b\u0010\u0013\u001a\u00020\u000fH\u0016R\u0014\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0015"}, d2 = {"Lcom/gateguard/ui/logs/LogsAdapter;", "Landroidx/recyclerview/widget/RecyclerView$Adapter;", "Lcom/gateguard/ui/logs/LogsAdapter$LogViewHolder;", "logs", "", "Lcom/gateguard/VisitorLogRemote;", "<init>", "(Ljava/util/List;)V", "updateLogs", "", "newLogs", "onCreateViewHolder", "parent", "Landroid/view/ViewGroup;", "viewType", "", "onBindViewHolder", "holder", "position", "getItemCount", "LogViewHolder", "app_debug"})
public final class LogsAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter<com.gateguard.ui.logs.LogsAdapter.LogViewHolder> {
    @org.jetbrains.annotations.NotNull()
    private java.util.List<com.gateguard.VisitorLogRemote> logs;
    
    public LogsAdapter(@org.jetbrains.annotations.NotNull()
    java.util.List<com.gateguard.VisitorLogRemote> logs) {
        super();
    }
    
    public final void updateLogs(@org.jetbrains.annotations.NotNull()
    java.util.List<com.gateguard.VisitorLogRemote> newLogs) {
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public com.gateguard.ui.logs.LogsAdapter.LogViewHolder onCreateViewHolder(@org.jetbrains.annotations.NotNull()
    android.view.ViewGroup parent, int viewType) {
        return null;
    }
    
    @java.lang.Override()
    public void onBindViewHolder(@org.jetbrains.annotations.NotNull()
    com.gateguard.ui.logs.LogsAdapter.LogViewHolder holder, int position) {
    }
    
    @java.lang.Override()
    public int getItemCount() {
        return 0;
    }
    
    @kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000\u001e\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\u0018\u00002\u00020\u0001B\u000f\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0004\b\u0004\u0010\u0005J\u000e\u0010\u0006\u001a\u00020\u00072\u0006\u0010\b\u001a\u00020\tR\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\n"}, d2 = {"Lcom/gateguard/ui/logs/LogsAdapter$LogViewHolder;", "Landroidx/recyclerview/widget/RecyclerView$ViewHolder;", "binding", "Lcom/gateguard/databinding/ItemLogBinding;", "<init>", "(Lcom/gateguard/databinding/ItemLogBinding;)V", "bind", "", "log", "Lcom/gateguard/VisitorLogRemote;", "app_debug"})
    public static final class LogViewHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {
        @org.jetbrains.annotations.NotNull()
        private final com.gateguard.databinding.ItemLogBinding binding = null;
        
        public LogViewHolder(@org.jetbrains.annotations.NotNull()
        com.gateguard.databinding.ItemLogBinding binding) {
            super(null);
        }
        
        public final void bind(@org.jetbrains.annotations.NotNull()
        com.gateguard.VisitorLogRemote log) {
        }
    }
}