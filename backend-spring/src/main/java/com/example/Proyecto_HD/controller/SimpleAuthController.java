package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class SimpleAuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/simple-login")
    public ResponseEntity<?> simpleLogin(@RequestBody Map<String, String> loginData, HttpSession session, HttpServletRequest request) {
        String email = loginData.get("email");
        String password = loginData.get("contrasena");
        
        System.out.println("=== SIMPLE LOGIN ATTEMPT ===");
        System.out.println("📧 Email: " + email);
        System.out.println("🔑 Password length: " + (password != null ? password.length() : 0));
        System.out.println("🆔 Session ID BEFORE: " + session.getId());
        
        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
            
            if (usuarioOpt.isEmpty()) {
                System.out.println("❌ Usuario no encontrado");
                return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));
            }
            
            Usuario usuario = usuarioOpt.get();
            System.out.println("✅ Usuario encontrado: " + usuario.getNombre());
            System.out.println("🔐 Verificando contraseña...");
            
            if (passwordEncoder.matches(password, usuario.getContrasena())) {
                System.out.println("✅ Contraseña correcta");
                
                // Guardar en sesión HTTP
                session.setAttribute("usuario", usuario);
                session.setAttribute("authenticated", true);
                session.setAttribute("email", usuario.getEmail());
                session.setAttribute("rol", usuario.getIdRol());
                
                System.out.println("🆔 Session ID AFTER: " + session.getId());
                System.out.println("💾 Usuario guardado en sesión");
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login exitoso");
                response.put("sessionId", session.getId());
                response.put("user", Map.of(
                    "id", usuario.getIdUsuario(),
                    "email", usuario.getEmail(),
                    "nombre", usuario.getNombre(),
                    "rol", usuario.getIdRol()
                ));
                
                return ResponseEntity.ok(response);
            } else {
                System.out.println("❌ Contraseña incorrecta");
                return ResponseEntity.badRequest().body(Map.of("error", "Contraseña incorrecta"));
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error en login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno"));
        }
    }

    @GetMapping("/session-status")
    public ResponseEntity<?> getSessionStatus(HttpSession session) {
        System.out.println("=== SESSION STATUS CHECK ===");
        System.out.println("🆔 Session ID: " + session.getId());
        
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        Boolean authenticated = (Boolean) session.getAttribute("authenticated");
        
        Map<String, Object> status = new HashMap<>();
        status.put("sessionId", session.getId());
        status.put("authenticated", authenticated != null ? authenticated : false);
        
        if (usuario != null) {
            System.out.println("✅ Usuario en sesión: " + usuario.getEmail());
            status.put("user", Map.of(
                "id", usuario.getIdUsuario(),
                "email", usuario.getEmail(),
                "nombre", usuario.getNombre(),
                "rol", usuario.getIdRol()
            ));
        } else {
            System.out.println("❌ No hay usuario en sesión");
            status.put("user", null);
        }
        
        return ResponseEntity.ok(status);
    }
}