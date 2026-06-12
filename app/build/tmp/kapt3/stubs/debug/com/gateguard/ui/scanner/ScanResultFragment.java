package com.gateguard.ui.scanner;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000T\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0003\u0018\u00002\u00020\u0001B\u0007\u00a2\u0006\u0004\b\u0002\u0010\u0003J\u001a\u0010\u0013\u001a\u00020\u00142\u0006\u0010\u0015\u001a\u00020\u00162\b\u0010\u0017\u001a\u0004\u0018\u00010\u0018H\u0016J\u0010\u0010\u0019\u001a\u00020\u00142\u0006\u0010\u001a\u001a\u00020\u001bH\u0002J&\u0010\u001c\u001a\u00020\u00142\u0006\u0010\u001d\u001a\u00020\u001b2\u0006\u0010\u001e\u001a\u00020\u001b2\f\u0010\u001f\u001a\b\u0012\u0004\u0012\u00020\u00140 H\u0002J\u0010\u0010!\u001a\u00020\u00142\u0006\u0010\"\u001a\u00020\u001bH\u0002J\u0018\u0010#\u001a\u00020\u00142\u0006\u0010$\u001a\u00020%2\u0006\u0010&\u001a\u00020\u001bH\u0002J\b\u0010\'\u001a\u00020\u0014H\u0016R\u0010\u0010\u0004\u001a\u0004\u0018\u00010\u0005X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0014\u0010\u0006\u001a\u00020\u00058BX\u0082\u0004\u00a2\u0006\u0006\u001a\u0004\b\u0007\u0010\bR\u001b\u0010\t\u001a\u00020\n8BX\u0082\u0084\u0002\u00a2\u0006\f\n\u0004\b\r\u0010\u000e\u001a\u0004\b\u000b\u0010\fR\u0010\u0010\u000f\u001a\u0004\u0018\u00010\u0010X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0011\u001a\u00020\u0012X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006("}, d2 = {"Lcom/gateguard/ui/scanner/ScanResultFragment;", "Landroidx/fragment/app/Fragment;", "<init>", "()V", "_binding", "Lcom/gateguard/databinding/FragmentScanResultBinding;", "binding", "getBinding", "()Lcom/gateguard/databinding/FragmentScanResultBinding;", "args", "Lcom/gateguard/ui/scanner/ScanResultFragmentArgs;", "getArgs", "()Lcom/gateguard/ui/scanner/ScanResultFragmentArgs;", "args$delegate", "Landroidx/navigation/NavArgsLazy;", "passObj", "Lcom/gateguard/VisitorPassRemote;", "repo", "Lcom/gateguard/FirebaseRepository;", "onViewCreated", "", "view", "Landroid/view/View;", "savedInstanceState", "Landroid/os/Bundle;", "loadPassAndValidation", "passId", "", "showValidState", "message", "buttonText", "action", "Lkotlin/Function0;", "showInvalidState", "reason", "performLog", "pass", "Lcom/gateguard/data/VisitorPass;", "type", "onDestroyView", "app_debug"})
public final class ScanResultFragment extends androidx.fragment.app.Fragment {
    @org.jetbrains.annotations.Nullable()
    private com.gateguard.databinding.FragmentScanResultBinding _binding;
    @org.jetbrains.annotations.NotNull()
    private final androidx.navigation.NavArgsLazy args$delegate = null;
    @org.jetbrains.annotations.Nullable()
    private com.gateguard.VisitorPassRemote passObj;
    @org.jetbrains.annotations.NotNull()
    private final com.gateguard.FirebaseRepository repo = null;
    
    public ScanResultFragment() {
        super();
    }
    
    private final com.gateguard.databinding.FragmentScanResultBinding getBinding() {
        return null;
    }
    
    private final com.gateguard.ui.scanner.ScanResultFragmentArgs getArgs() {
        return null;
    }
    
    @java.lang.Override()
    public void onViewCreated(@org.jetbrains.annotations.NotNull()
    android.view.View view, @org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    private final void loadPassAndValidation(java.lang.String passId) {
    }
    
    private final void showValidState(java.lang.String message, java.lang.String buttonText, kotlin.jvm.functions.Function0<kotlin.Unit> action) {
    }
    
    private final void showInvalidState(java.lang.String reason) {
    }
    
    private final void performLog(com.gateguard.data.VisitorPass pass, java.lang.String type) {
    }
    
    @java.lang.Override()
    public void onDestroyView() {
    }
}