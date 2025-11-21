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
        // Crear usuario Ferrer - ADAPTADO para Spring Security
        if (!usuarioRepository.existsByEmail("Ferrer@gmail.com")) {
            Usuario ferrer = new Usuario();
            ferrer.setNombre("Ferrer");
            ferrer.setApellido(""); 
            ferrer.setDni("76562543");
            ferrer.setEmail("Ferrer@gmail.com");
            ferrer.setCorreo("Ferrer@gmail.com"); // Mismo que email para consistencia
            ferrer.setContrasena(passwordEncoder.encode("ferrer123")); 
            ferrer.setTelefono("982287683");
            ferrer.setDireccion("Lima");
            ferrer.setIdRol(1); // Admin
            ferrer.setActivo(true);
            
            usuarioRepository.save(ferrer);
            System.out.println("=== USUARIO FERRER CREADO ===");
            System.out.println("Email: Ferrer@gmail.com");
            System.out.println("Contraseña: ferrer123");
            System.out.println("Rol: ADMIN");
            System.out.println("Activo: true");
            System.out.println("=============================");
        } else {
            System.out.println("=== USUARIO FERRER YA EXISTE ===");
            
            // Verificar que pueda loguearse
            Usuario existente = usuarioRepository.findByEmail("Ferrer@gmail.com").orElse(null);
            if (existente != null) {
                System.out.println("Estado: " + (existente.getActivo() ? "ACTIVO" : "INACTIVO"));
                System.out.println("Rol: " + existente.getIdRol());
                
                // Verificar contraseña
                boolean passwordMatch = passwordEncoder.matches("ferrer123", existente.getContrasena());
                System.out.println("Contraseña verifica: " + (passwordMatch ? "SÍ" : "NO"));
            }
        }
    }
}