package com.tuproyecto.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

@Component
@Profile("production") // Solo en producción (Render)
public class SQLiteInitializer implements CommandLineRunner {

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 ===========================================");
        System.out.println("🚀 INICIALIZANDO SQLITE PARA RENDER");
        System.out.println("🚀 ===========================================");
        
        // Extraer ruta del archivo de BD
        String dbPath = databaseUrl.replace("jdbc:sqlite:", "");
        System.out.println("📁 Ruta de base de datos: " + dbPath);
        
        Path path = Paths.get(dbPath);
        File dbFile = path.toFile();
        File dataDir = dbFile.getParentFile();
        
        // 1. CREAR DIRECTORIO SI NO EXISTE
        if (dataDir != null && !dataDir.exists()) {
            System.out.println("📂 Creando directorio para BD...");
            boolean created = dataDir.mkdirs();
            System.out.println("   Directorio creado: " + dataDir.getAbsolutePath());
            System.out.println("   Resultado: " + (created ? "✅ ÉXITO" : "❌ FALLÓ"));
            
            // Dar permisos completos
            if (created) {
                dataDir.setReadable(true, false);
                dataDir.setWritable(true, false);
                dataDir.setExecutable(true, false);
                System.out.println("   Permisos asignados: lectura/escritura ✅");
            }
        } else if (dataDir != null) {
            System.out.println("📂 Directorio ya existe: " + dataDir.getAbsolutePath());
            System.out.println("   Puede escribir: " + (dataDir.canWrite() ? "✅ SÍ" : "❌ NO"));
        }
        
        // 2. VERIFICAR SI LA BD YA EXISTE
        if (dbFile.exists()) {
            long size = Files.size(path);
            System.out.println("💾 Base de datos EXISTE");
            System.out.println("   Tamaño: " + size + " bytes");
            System.out.println("   Ruta completa: " + dbFile.getAbsolutePath());
            
            // Verificar que se puede conectar
            try (Connection conn = DriverManager.getConnection(databaseUrl)) {
                System.out.println("🔗 Conexión a BD exitosa ✅");
            }
            
            System.out.println("✅ Se usarán datos persistentes del disco");
            return;
        }
        
        // 3. CREAR NUEVA BD SI NO EXISTE
        System.out.println("🆕 Creando nueva base de datos SQLite...");
        
        try (Connection conn = DriverManager.getConnection(databaseUrl);
             Statement stmt = conn.createStatement()) {
            
            // Crear tabla de ejemplo para verificar
            String sql = """
                CREATE TABLE IF NOT EXISTS sistema_info (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    clave TEXT UNIQUE NOT NULL,
                    valor TEXT,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """;
            stmt.execute(sql);
            
            // Insertar información del sistema
            sql = """
                INSERT OR IGNORE INTO sistema_info (clave, valor) VALUES 
                ('app_nombre', 'Proyecto HD'),
                ('app_version', '1.0.0'),
                ('ambiente', 'produccion'),
                ('bd_tipo', 'SQLite'),
                ('inicializado_en', datetime('now'))
                """;
            stmt.execute(sql);
            
            System.out.println("✅ Base de datos creada exitosamente");
            System.out.println("💾 Ubicación: " + dbFile.getAbsolutePath());
            System.out.println("📊 Tablas iniciales creadas");
            
            // Verificar tamaño
            System.out.println("📏 Tamaño inicial: " + dbFile.length() + " bytes");
            
        } catch (Exception e) {
            System.err.println("❌ ERROR creando base de datos: " + e.getMessage());
            // NO lanzamos la excepción para que la aplicación pueda iniciar
        }
        
        System.out.println("🎯 SQLite listo para usar en Render");
        System.out.println("⚠️  NOTA: Los datos se guardarán en el disco persistente de Render");
        System.out.println("===========================================");
    }
}