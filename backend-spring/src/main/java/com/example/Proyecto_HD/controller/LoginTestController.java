package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.service.CustomUserDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class LoginTestController {

    @GetMapping("/login-status")  
    public ResponseEntity<?> getLoginStatus(@RequestParam(required = false) String redirect, HttpServletResponse response) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        System.out.println("=== TEST LOGIN STATUS ===");
        System.out.println("🔍 Authentication: " + auth);
        System.out.println("🔍 Is Authenticated: " + (auth != null && auth.isAuthenticated()));
        System.out.println("🔍 Principal Type: " + (auth != null ? auth.getPrincipal().getClass().getSimpleName() : "null"));
        System.out.println("🔍 Principal: " + (auth != null ? auth.getPrincipal() : "null"));
        
        Map<String, Object> status = new HashMap<>();
        
        if (auth != null && auth.isAuthenticated()) {
            status.put("authenticated", true);
            status.put("principal", auth.getPrincipal().toString());
            status.put("authorities", auth.getAuthorities().toString());
            
            if (auth.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
                CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                    (CustomUserDetailsService.CustomUserPrincipal) auth.getPrincipal();
                status.put("user", Map.of(
                    "email", userPrincipal.getUsuario().getEmail(),
                    "nombre", userPrincipal.getUsuario().getNombre(),
                    "rol", userPrincipal.getUsuario().getIdRol()
                ));
                System.out.println("✅ Usuario autenticado: " + userPrincipal.getUsuario().getEmail());
            }
        } else {
            status.put("authenticated", false);
            status.put("message", "No hay usuario autenticado");
        }
        
        // Si es redirección después de login y está autenticado, redirigir a React
        if ("true".equals(redirect) && status.get("authenticated").equals(true)) {
            response.sendRedirect("http://localhost:3000?login=success");
            return null;
        }
        
        return ResponseEntity.ok(status);
    }

    @GetMapping("/simple")
    public ResponseEntity<String> simple() {
        return ResponseEntity.ok("Endpoint simple funcionando");
    }
}