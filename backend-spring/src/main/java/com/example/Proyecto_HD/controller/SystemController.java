package com.tuproyecto.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
public class SystemController {
    
    @Value("${spring.datasource.url}")
    private String databaseUrl;
    
    @GetMapping("/api/system/info")
    public Map<String, Object> getSystemInfo() {
        Map<String, Object> info = new HashMap<>();
        
        try {
            info.put("status", "online");
            info.put("service", "Proyecto HD Backend");
            info.put("profile", System.getenv("SPRING_PROFILES_ACTIVE"));
            
            // Información de BD
            if (databaseUrl != null && databaseUrl.startsWith("jdbc:sqlite:")) {
                String dbPath = databaseUrl.replace("jdbc:sqlite:", "");
                File dbFile = new File(dbPath);
                File dataDir = dbFile.getParentFile();
                
                Map<String, Object> dbInfo = new HashMap<>();
                dbInfo.put("type", "SQLite");
                dbInfo.put("url", databaseUrl);
                dbInfo.put("path", dbPath);
                dbInfo.put("exists", dbFile.exists());
                dbInfo.put("size", dbFile.exists() ? Files.size(Paths.get(dbPath)) : 0);
                dbInfo.put("directory", dataDir != null ? dataDir.getAbsolutePath() : "N/A");
                dbInfo.put("writable", dataDir != null && dataDir.canWrite());
                dbInfo.put("readable", dataDir != null && dataDir.canRead());
                
                info.put("database", dbInfo);
            }
            
            // Información del sistema
            Map<String, Object> systemInfo = new HashMap<>();
            systemInfo.put("workingDir", System.getProperty("user.dir"));
            systemInfo.put("javaVersion", System.getProperty("java.version"));
            systemInfo.put("os", System.getProperty("os.name"));
            systemInfo.put("freeMemory", Runtime.getRuntime().freeMemory());
            systemInfo.put("totalMemory", Runtime.getRuntime().totalMemory());
            
            info.put("system", systemInfo);
            
            // Variables de entorno importantes
            Map<String, String> env = new HashMap<>();
            String[] envVars = {"SPRING_PROFILES_ACTIVE", "RENDER", "PORT", "DATABASE_URL"};
            for (String var : envVars) {
                String value = System.getenv(var);
                if (value != null) {
                    env.put(var, value);
                }
            }
            info.put("environment", env);
            
        } catch (Exception e) {
            info.put("status", "error");
            info.put("error", e.getMessage());
        }
        
        return info;
    }
    
    @GetMapping("/api/system/health")
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Proyecto HD API");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}