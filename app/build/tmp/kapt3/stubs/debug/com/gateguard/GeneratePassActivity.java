package com.gateguard;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u00000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u000b\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\u0018\u00002\u00020\u0001B\u0007\u00a2\u0006\u0004\b\u0002\u0010\u0003J\u0012\u0010\u0015\u001a\u00020\u00162\b\u0010\u0017\u001a\u0004\u0018\u00010\u0018H\u0014J\b\u0010\u0019\u001a\u00020\u0016H\u0002J\u0010\u0010\u001a\u001a\u00020\u00162\u0006\u0010\u001b\u001a\u00020\u0005H\u0002R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\n\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000b\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\f\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\r\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000e\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000f\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0010\u001a\u00020\u0011X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0012\u001a\u00020\u0011X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0013\u001a\u00020\u0014X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001c"}, d2 = {"Lcom/gateguard/GeneratePassActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "<init>", "()V", "etVisitorName", "Lcom/google/android/material/textfield/TextInputEditText;", "etVisitorPhone", "etVisitorType", "etTowerBlock", "etFlatNumber", "etVehicleNumber", "etNoOfVisitors", "etVisitDate", "etFromTime", "etToTime", "etPurpose", "btnCreatePass", "Lcom/google/android/material/button/MaterialButton;", "btnBackHome", "repo", "Lcom/gateguard/FirebaseRepository;", "onCreate", "", "savedInstanceState", "Landroid/os/Bundle;", "showDatePicker", "showTimePicker", "editText", "app_debug"})
public final class GeneratePassActivity extends androidx.appcompat.app.AppCompatActivity {
    private com.google.android.material.textfield.TextInputEditText etVisitorName;
    private com.google.android.material.textfield.TextInputEditText etVisitorPhone;
    private com.google.android.material.textfield.TextInputEditText etVisitorType;
    private com.google.android.material.textfield.TextInputEditText etTowerBlock;
    private com.google.android.material.textfield.TextInputEditText etFlatNumber;
    private com.google.android.material.textfield.TextInputEditText etVehicleNumber;
    private com.google.android.material.textfield.TextInputEditText etNoOfVisitors;
    private com.google.android.material.textfield.TextInputEditText etVisitDate;
    private com.google.android.material.textfield.TextInputEditText etFromTime;
    private com.google.android.material.textfield.TextInputEditText etToTime;
    private com.google.android.material.textfield.TextInputEditText etPurpose;
    private com.google.android.material.button.MaterialButton btnCreatePass;
    private com.google.android.material.button.MaterialButton btnBackHome;
    @org.jetbrains.annotations.NotNull()
    private final com.gateguard.FirebaseRepository repo = null;
    
    public GeneratePassActivity() {
        super();
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    private final void showDatePicker() {
    }
    
    private final void showTimePicker(com.google.android.material.textfield.TextInputEditText editText) {
    }
}