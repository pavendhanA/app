package com.smartbudget.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigReader {
    private static Properties properties;

    static {
        try {
            FileInputStream in = new FileInputStream("src/test/resources/config.properties");
            properties = new Properties();
            properties.load(in);
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load config.properties");
        }
    }

    public static String getProperty(String key) {
        return properties.getProperty(key);
    }
}
