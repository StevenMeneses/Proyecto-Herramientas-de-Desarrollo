package com.example.Proyecto_HD.config;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataLoader implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Crear SOLO el usuario Ferrer
        if (!usuarioRepository.existsByEmail("Ferrer@gmail.com")) {
            Usuario ferrer = new Usuario();
            ferrer.setNombre("Ferrer");
            ferrer.setApellido(""); 
            ferrer.setDni("76562543");
            ferrer.setEmail("Ferrer@gmail.com");
            ferrer.setCorreo("Ferrer@gmail.com");
            ferrer.setContrasena(passwordEncoder.encode("ferrer123")); // ✅ ENCRIPTADO CON SPRING SECURITY
            ferrer.setTelefono("982287683");
            ferrer.setDireccion("Lima");
            ferrer.setIdRol(1); // Admin
            ferrer.setActivo(true);
            
            usuarioRepository.save(ferrer);
            System.out.println("=== USUARIO FERRER CREADO EN SQLite ===");
            System.out.println("Email: Ferrer@gmail.com");
            System.out.println("Contraseña: ferrer123");
            System.out.println("Contraseña encriptada: " + ferrer.getContrasena());
            System.out.println("=======================================");
        }
    }
}