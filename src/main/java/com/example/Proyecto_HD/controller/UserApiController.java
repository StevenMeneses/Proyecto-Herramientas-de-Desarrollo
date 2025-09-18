package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.model.Usuario;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> getDatosUsuario(HttpSession session) {
        System.out.println("=== SOLICITUD API /api/usuario/datos ===");
        System.out.println("Session ID: " + session.getId());
        
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        
        if (usuario != null) {
            System.out.println("✅ Usuario en sesión: " + usuario.getEmail());
            
            Map<String, Object> usuarioData = new HashMap<>();
            usuarioData.put("id", usuario.getIdUsuario());
            usuarioData.put("nombre", usuario.getNombre());
            usuarioData.put("apellido", usuario.getApellido());
            usuarioData.put("email", usuario.getEmail());
            usuarioData.put("idRol", usuario.getIdRol());
            usuarioData.put("activo", usuario.getActivo());
            
            return ResponseEntity.ok(usuarioData);
        }
        
        System.out.println("❌ No hay usuario en sesión - Devolviendo 401");
        
        // Devuelve JSON en lugar de redirigir
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Usuario no autenticado");
        errorResponse.put("status", "401");
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
}