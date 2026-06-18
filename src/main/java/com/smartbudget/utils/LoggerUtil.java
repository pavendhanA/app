package com.smartbudget.utils;

public class LoggerUtil {
    public static void info(String message) {
        System.out.println(new java.util.Date() + " [INFO]: " + message);
    }

    public static void warn(String message) {
        System.out.println(new java.util.Date() + " [WARN]: " + message);
    }

    public static void error(String message) {
        System.err.println(new java.util.Date() + " [ERROR]: " + message);
    }
}
