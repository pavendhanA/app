package com.gateguard;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u00006\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\f\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0006\u0018\u00002\u00020\u0001B\u0007\u00a2\u0006\u0004\b\u0002\u0010\u0003J\u0012\u0010\u0018\u001a\u00020\u00192\b\u0010\u001a\u001a\u0004\u0018\u00010\u001bH\u0014J\u0010\u0010\u001c\u001a\u00020\u00192\u0006\u0010\u001d\u001a\u00020\fH\u0002J\b\u0010\u001e\u001a\u00020\u0019H\u0002J\u0010\u0010\u001f\u001a\u00020\f2\u0006\u0010 \u001a\u00020\fH\u0002R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\n\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000b\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\r\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000e\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000f\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0010\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0011\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0012\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0013\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0014\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0015\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0016\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0017\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u0006!"}, d2 = {"Lcom/gateguard/PassPreviewActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "<init>", "()V", "tvVisitorDetails", "Landroid/widget/TextView;", "imgQrCode", "Landroid/widget/ImageView;", "btnDone", "Lcom/google/android/material/button/MaterialButton;", "btnShareWhatsApp", "visitorName", "", "visitorPhone", "visitorType", "towerBlock", "flatNumber", "vehicleNumber", "noOfVisitors", "visitDate", "fromTime", "toTime", "purpose", "passId", "onCreate", "", "savedInstanceState", "Landroid/os/Bundle;", "generateQrCode", "data", "shareQrToWhatsAppNumber", "formatPhoneNumberForWhatsApp", "phone", "app_debug"})
public final class PassPreviewActivity extends androidx.appcompat.app.AppCompatActivity {
    private android.widget.TextView tvVisitorDetails;
    private android.widget.ImageView imgQrCode;
    private com.google.android.material.button.MaterialButton btnDone;
    private com.google.android.material.button.MaterialButton btnShareWhatsApp;
    @org.jetbrains.annotations.NotNull()
    private java.lang.String visitorName = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String visitorPhone = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String visitorType = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String towerBlock = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String flatNumber = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String vehicleNumber = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String noOfVisitors = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String visitDate = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String fromTime = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String toTime = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String purpose = "";
    @org.jetbrains.annotations.NotNull()
    private java.lang.String passId = "";
    
    public PassPreviewActivity() {
        super();
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    private final void generateQrCode(java.lang.String data) {
    }
    
    private final void shareQrToWhatsAppNumber() {
    }
    
    private final java.lang.String formatPhoneNumberForWhatsApp(java.lang.String phone) {
        return null;
    }
}