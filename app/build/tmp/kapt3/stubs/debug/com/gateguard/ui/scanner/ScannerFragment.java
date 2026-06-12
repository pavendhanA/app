package com.gateguard.ui.scanner;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000P\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\u0018\u00002\u00020\u0001B\u0007\u00a2\u0006\u0004\b\u0002\u0010\u0003J\u001a\u0010\u0017\u001a\u00020\u00182\u0006\u0010\u0019\u001a\u00020\u001a2\b\u0010\u001b\u001a\u0004\u0018\u00010\u001cH\u0016J\b\u0010\u001d\u001a\u00020\fH\u0002J\b\u0010\u001e\u001a\u00020\u0018H\u0002J\u0010\u0010\u001f\u001a\u00020\u00182\u0006\u0010 \u001a\u00020!H\u0003J\b\u0010\"\u001a\u00020\u0018H\u0016R\u0010\u0010\u0004\u001a\u0004\u0018\u00010\u0005X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0014\u0010\u0006\u001a\u00020\u00058BX\u0082\u0004\u00a2\u0006\u0006\u001a\u0004\b\u0007\u0010\bR\u000e\u0010\t\u001a\u00020\nX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000b\u001a\u00020\fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u001b\u0010\r\u001a\u00020\u000e8BX\u0082\u0084\u0002\u00a2\u0006\f\n\u0004\b\u0011\u0010\u0012\u001a\u0004\b\u000f\u0010\u0010R\u001c\u0010\u0013\u001a\u0010\u0012\f\u0012\n \u0016*\u0004\u0018\u00010\u00150\u00150\u0014X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006#"}, d2 = {"Lcom/gateguard/ui/scanner/ScannerFragment;", "Landroidx/fragment/app/Fragment;", "<init>", "()V", "_binding", "Lcom/gateguard/databinding/FragmentScannerBinding;", "binding", "getBinding", "()Lcom/gateguard/databinding/FragmentScannerBinding;", "cameraExecutor", "Ljava/util/concurrent/ExecutorService;", "isScanning", "", "scanner", "Lcom/google/mlkit/vision/barcode/BarcodeScanner;", "getScanner", "()Lcom/google/mlkit/vision/barcode/BarcodeScanner;", "scanner$delegate", "Lkotlin/Lazy;", "requestPermissionLauncher", "Landroidx/activity/result/ActivityResultLauncher;", "", "kotlin.jvm.PlatformType", "onViewCreated", "", "view", "Landroid/view/View;", "savedInstanceState", "Landroid/os/Bundle;", "allPermissionsGranted", "startCamera", "processImageProxy", "imageProxy", "Landroidx/camera/core/ImageProxy;", "onDestroyView", "app_debug"})
public final class ScannerFragment extends androidx.fragment.app.Fragment {
    @org.jetbrains.annotations.Nullable()
    private com.gateguard.databinding.FragmentScannerBinding _binding;
    private java.util.concurrent.ExecutorService cameraExecutor;
    private boolean isScanning = true;
    @org.jetbrains.annotations.NotNull()
    private final kotlin.Lazy scanner$delegate = null;
    @org.jetbrains.annotations.NotNull()
    private final androidx.activity.result.ActivityResultLauncher<java.lang.String> requestPermissionLauncher = null;
    
    public ScannerFragment() {
        super();
    }
    
    private final com.gateguard.databinding.FragmentScannerBinding getBinding() {
        return null;
    }
    
    private final com.google.mlkit.vision.barcode.BarcodeScanner getScanner() {
        return null;
    }
    
    @java.lang.Override()
    public void onViewCreated(@org.jetbrains.annotations.NotNull()
    android.view.View view, @org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    private final boolean allPermissionsGranted() {
        return false;
    }
    
    private final void startCamera() {
    }
    
    @android.annotation.SuppressLint(value = {"UnsafeOptInUsageError"})
    private final void processImageProxy(androidx.camera.core.ImageProxy imageProxy) {
    }
    
    @java.lang.Override()
    public void onDestroyView() {
    }
}