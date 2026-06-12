package com.gateguard;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000d\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\t\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\b\u0018\u00002\u00020\u0001B\u0007\u00a2\u0006\u0004\b\u0002\u0010\u0003J\u0012\u0010(\u001a\u00020)2\b\u0010*\u001a\u0004\u0018\u00010+H\u0014J\b\u0010,\u001a\u00020)H\u0014J\b\u0010-\u001a\u00020)H\u0002J\b\u0010.\u001a\u00020)H\u0002J\b\u0010/\u001a\u00020)H\u0002J\b\u00100\u001a\u00020\'H\u0002J\u0010\u00101\u001a\u00020\'2\u0006\u00102\u001a\u00020\'H\u0002R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\n\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000b\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\f\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\r\u001a\u00020\u000eX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000f\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0010\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0011\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0012\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0013\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0014\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0015\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0016\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0017\u001a\u00020\u0018X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0019\u001a\u00020\u001aX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u001b\u001a\u00020\u0018X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u001c\u001a\u00020\u001dX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u001e\u001a\u00020\u001fX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010 \u001a\u00020\u001fX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010!\u001a\u00020\u001fX\u0082.\u00a2\u0006\u0002\n\u0000R\u001c\u0010\"\u001a\u0010\u0012\f\u0012\n %*\u0004\u0018\u00010$0$0#X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0010\u0010&\u001a\u0004\u0018\u00010\'X\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u00063"}, d2 = {"Lcom/gateguard/AdminDashboardActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "<init>", "()V", "firestore", "Lcom/google/firebase/firestore/FirebaseFirestore;", "repo", "Lcom/gateguard/FirebaseRepository;", "tvAdminName", "Landroid/widget/TextView;", "tvAdminRole", "tvAdminProfileSubInfo", "tvAdminProfileAvatar", "imgAdminProfilePhoto", "Landroid/widget/ImageView;", "tvTotalScans", "tvApprovedCount", "tvDeniedCount", "tvEntryCount", "tvExitCount", "tvCurrentlyInsideCount", "tvNoAdminActiveVisitors", "tvNoAdminUpcomingVisits", "recyclerAdminActiveVisitors", "Landroidx/recyclerview/widget/RecyclerView;", "activeVisitorAdapter", "Lcom/gateguard/ActiveVisitorAdapter;", "recyclerAdminUpcomingVisits", "upcomingVisitAdapter", "Lcom/gateguard/UpcomingVisitAdapter;", "btnAdminLogs", "Lcom/google/android/material/button/MaterialButton;", "btnAdminLogout", "btnAdminOpenProfile", "profileLauncher", "Landroidx/activity/result/ActivityResultLauncher;", "Landroid/content/Intent;", "kotlin.jvm.PlatformType", "currentUid", "", "onCreate", "", "savedInstanceState", "Landroid/os/Bundle;", "onResume", "loadAdminProfile", "loadSavedPhoto", "listenToDashboardData", "getTodayDate", "getInitials", "name", "app_debug"})
public final class AdminDashboardActivity extends androidx.appcompat.app.AppCompatActivity {
    @org.jetbrains.annotations.NotNull()
    private final com.google.firebase.firestore.FirebaseFirestore firestore = null;
    @org.jetbrains.annotations.NotNull()
    private final com.gateguard.FirebaseRepository repo = null;
    private android.widget.TextView tvAdminName;
    private android.widget.TextView tvAdminRole;
    private android.widget.TextView tvAdminProfileSubInfo;
    private android.widget.TextView tvAdminProfileAvatar;
    private android.widget.ImageView imgAdminProfilePhoto;
    private android.widget.TextView tvTotalScans;
    private android.widget.TextView tvApprovedCount;
    private android.widget.TextView tvDeniedCount;
    private android.widget.TextView tvEntryCount;
    private android.widget.TextView tvExitCount;
    private android.widget.TextView tvCurrentlyInsideCount;
    private android.widget.TextView tvNoAdminActiveVisitors;
    private android.widget.TextView tvNoAdminUpcomingVisits;
    private androidx.recyclerview.widget.RecyclerView recyclerAdminActiveVisitors;
    private com.gateguard.ActiveVisitorAdapter activeVisitorAdapter;
    private androidx.recyclerview.widget.RecyclerView recyclerAdminUpcomingVisits;
    private com.gateguard.UpcomingVisitAdapter upcomingVisitAdapter;
    private com.google.android.material.button.MaterialButton btnAdminLogs;
    private com.google.android.material.button.MaterialButton btnAdminLogout;
    private com.google.android.material.button.MaterialButton btnAdminOpenProfile;
    @org.jetbrains.annotations.NotNull()
    private final androidx.activity.result.ActivityResultLauncher<android.content.Intent> profileLauncher = null;
    @org.jetbrains.annotations.Nullable()
    private java.lang.String currentUid;
    
    public AdminDashboardActivity() {
        super();
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    @java.lang.Override()
    protected void onResume() {
    }
    
    private final void loadAdminProfile() {
    }
    
    private final void loadSavedPhoto() {
    }
    
    private final void listenToDashboardData() {
    }
    
    private final java.lang.String getTodayDate() {
        return null;
    }
    
    private final java.lang.String getInitials(java.lang.String name) {
        return null;
    }
}