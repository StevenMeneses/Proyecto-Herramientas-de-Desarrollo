/*package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.service.CustomUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
public class UserApiController {

    @GetMapping("/datos")
    public ResponseEntity<?> getDatosUsuario(Authentication authentication, HttpSession session) {
        System.out.println("=== SOLICITUD API /api/usuario/datos ===");
        System.out.println("Session ID: " + session.getId());
        
        // Spring Security ya validó la autenticación en SecurityConfig
        System.out.println("🔍 Authentication: " + authentication);
        System.out.println("🔍 Is Authenticated: " + authentication.isAuthenticated());
        System.out.println("🔍 Principal: " + authentication.getPrincipal().getClass().getSimpleName());
        
        if (authentication.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
            Usuario usuario = userPrincipal.getUsuario();
            
            System.out.println("✅ Usuario autenticado: " + usuario.getEmail());
            System.out.println("🎭 Rol del usuario: " + usuario.getIdRol());
            
            Map<String, Object> usuarioData = new HashMap<>();
            usuarioData.put("id", usuario.getIdUsuario());
            usuarioData.put("nombre", usuario.getNombre());
            usuarioData.put("apellido", usuario.getApellido());
            usuarioData.put("email", usuario.getEmail());
            usuarioData.put("telefono", usuario.getTelefono());
            usuarioData.put("direccion", usuario.getDireccion());
            usuarioData.put("dni", usuario.getDni());
            usuarioData.put("idRol", usuario.getIdRol());
            usuarioData.put("activo", usuario.getActivo());
            usuarioData.put("authorities", userPrincipal.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toList());
            
            return ResponseEntity.ok(usuarioData);
        }
        
        System.out.println("❌ Principal no es CustomUserPrincipal: " + authentication.getPrincipal().getClass());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Error de autenticación", "message", "Tipo de principal inesperado"));
    }
}
*/ //