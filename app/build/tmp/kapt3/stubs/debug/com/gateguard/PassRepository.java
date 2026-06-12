package com.gateguard;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u00006\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0003\u0018\u00002\u00020\u0001B\u0007\u00a2\u0006\u0004\b\u0002\u0010\u0003J\u0018\u0010\u0006\u001a\u0004\u0018\u00010\u00072\u0006\u0010\b\u001a\u00020\tH\u0086@\u00a2\u0006\u0002\u0010\nJ\u001e\u0010\u000b\u001a\b\u0012\u0004\u0012\u00020\t0\f2\u0006\u0010\r\u001a\u00020\u0007H\u0086@\u00a2\u0006\u0004\b\u000e\u0010\u000fJ\u0018\u0010\u0010\u001a\u0004\u0018\u00010\u00112\u0006\u0010\b\u001a\u00020\tH\u0086@\u00a2\u0006\u0002\u0010\nJ\u001e\u0010\u0012\u001a\b\u0012\u0004\u0012\u00020\u00130\f2\u0006\u0010\r\u001a\u00020\u0011H\u0086@\u00a2\u0006\u0004\b\u0014\u0010\u0015R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0016"}, d2 = {"Lcom/gateguard/PassRepository;", "", "<init>", "()V", "firestore", "Lcom/google/firebase/firestore/FirebaseFirestore;", "getPass", "Lcom/gateguard/data/VisitorPass;", "passId", "", "(Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "createPass", "Lkotlin/Result;", "pass", "createPass-gIAlu-s", "(Lcom/gateguard/data/VisitorPass;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getPassRemote", "Lcom/gateguard/VisitorPassRemote;", "updatePassRemote", "", "updatePassRemote-gIAlu-s", "(Lcom/gateguard/VisitorPassRemote;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public final class PassRepository {
    @org.jetbrains.annotations.NotNull()
    private final com.google.firebase.firestore.FirebaseFirestore firestore = null;
    
    public PassRepository() {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getPass(@org.jetbrains.annotations.NotNull()
    java.lang.String passId, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.gateguard.data.VisitorPass> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getPassRemote(@org.jetbrains.annotations.NotNull()
    java.lang.String passId, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.gateguard.VisitorPassRemote> $completion) {
        return null;
    }
}