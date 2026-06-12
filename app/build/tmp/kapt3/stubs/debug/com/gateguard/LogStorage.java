package com.gateguard;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\b\u0002\b\u00c6\u0002\u0018\u00002\u00020\u0001B\t\b\u0002\u00a2\u0006\u0004\b\u0002\u0010\u0003J\u0016\u0010\u0007\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\fJ\u0014\u0010\r\u001a\b\u0012\u0004\u0012\u00020\f0\u000e2\u0006\u0010\t\u001a\u00020\nJ\u000e\u0010\u000f\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\nR\u000e\u0010\u0004\u001a\u00020\u0005X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0005X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0010"}, d2 = {"Lcom/gateguard/LogStorage;", "", "<init>", "()V", "PREF_NAME", "", "KEY_LOGS", "saveLog", "", "context", "Landroid/content/Context;", "log", "Lcom/gateguard/VisitorLog;", "getLogs", "", "clearLogs", "app_debug"})
public final class LogStorage {
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String PREF_NAME = "gateguard_logs";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String KEY_LOGS = "visitor_logs";
    @org.jetbrains.annotations.NotNull()
    public static final com.gateguard.LogStorage INSTANCE = null;
    
    private LogStorage() {
        super();
    }
    
    public final void saveLog(@org.jetbrains.annotations.NotNull()
    android.content.Context context, @org.jetbrains.annotations.NotNull()
    com.gateguard.VisitorLog log) {
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.gateguard.VisitorLog> getLogs(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
        return null;
    }
    
    public final void clearLogs(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
    }
}