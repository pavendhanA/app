package com.gateguard.data;

@kotlin.Metadata(mv = {2, 1, 0}, k = 1, xi = 48, d1 = {"\u0000:\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u000e\n\u0002\b\u0005\u0018\u00002\u00020\u0001B\u0007\u00a2\u0006\u0004\b\u0002\u0010\u0003J\u000e\u0010\t\u001a\u00020\nH\u0086@\u00a2\u0006\u0002\u0010\u000bJ\u001e\u0010\f\u001a\n \u000e*\u0004\u0018\u00010\r0\r2\u0006\u0010\u000f\u001a\u00020\u0010H\u0086@\u00a2\u0006\u0002\u0010\u0011J:\u0010\u0012\u001a\n \u000e*\u0004\u0018\u00010\r0\r2\u0006\u0010\u0013\u001a\u00020\u00142\u0006\u0010\u0015\u001a\u00020\u00142\b\u0010\u0016\u001a\u0004\u0018\u00010\u00142\b\u0010\u0017\u001a\u0004\u0018\u00010\u0014H\u0086@\u00a2\u0006\u0002\u0010\u0018R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0019"}, d2 = {"Lcom/gateguard/data/FirebaseRepository;", "", "<init>", "()V", "db", "Lcom/google/firebase/firestore/FirebaseFirestore;", "visitorsCollection", "Lcom/google/firebase/firestore/CollectionReference;", "notificationsCollection", "getDatabase", "Lcom/gateguard/data/Database;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "addVisitor", "Ljava/lang/Void;", "kotlin.jvm.PlatformType", "visitor", "Lcom/gateguard/data/Visitor;", "(Lcom/gateguard/data/Visitor;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "updateVisitorStatus", "id", "", "newStatus", "entryTime", "exitTime", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public final class FirebaseRepository {
    @org.jetbrains.annotations.NotNull()
    private final com.google.firebase.firestore.FirebaseFirestore db = null;
    @org.jetbrains.annotations.NotNull()
    private final com.google.firebase.firestore.CollectionReference visitorsCollection = null;
    @org.jetbrains.annotations.NotNull()
    private final com.google.firebase.firestore.CollectionReference notificationsCollection = null;
    
    public FirebaseRepository() {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getDatabase(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.gateguard.data.Database> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object addVisitor(@org.jetbrains.annotations.NotNull()
    com.gateguard.data.Visitor visitor, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.lang.Void> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object updateVisitorStatus(@org.jetbrains.annotations.NotNull()
    java.lang.String id, @org.jetbrains.annotations.NotNull()
    java.lang.String newStatus, @org.jetbrains.annotations.Nullable()
    java.lang.String entryTime, @org.jetbrains.annotations.Nullable()
    java.lang.String exitTime, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.lang.Void> $completion) {
        return null;
    }
}