/*package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.service.CustomUserDetailsService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthTestController {

    @GetMapping("/check")
    public Map<String, Object> checkAuth() {
        Map<String, Object> response = new HashMap<>();
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        System.out.println("🔍 Verificando autenticación actual:");
        System.out.println("   - Authentication: " + auth);
        System.out.println("   - Is Authenticated: " + (auth != null && auth.isAuthenticated()));
        System.out.println("   - Principal: " + (auth != null ? auth.getPrincipal() : "null"));
        System.out.println("   - Authorities: " + (auth != null ? auth.getAuthorities() : "null"));
        
        if (auth != null && auth.isAuthenticated() && 
            auth.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
            
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                (CustomUserDetailsService.CustomUserPrincipal) auth.getPrincipal();
            
            response.put("authenticated", true);
            response.put("username", userPrincipal.getUsername());
            response.put("authorities", userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
            response.put("usuario", Map.of(
                "id", userPrincipal.getUsuario().getIdUsuario(),
                "nombre", userPrincipal.getUsuario().getNombre(),
                "apellido", userPrincipal.getUsuario().getApellido(),
                "email", userPrincipal.getUsuario().getEmail(),
                "idRol", userPrincipal.getUsuario().getIdRol()
            ));
            
        } else {
            response.put("authenticated", false);
            response.put("message", "No hay usuario autenticado");
        }
        
        return response;
    }
    
    @GetMapping("/roles")
    public Map<String, Object> checkRoles() {
        Map<String, Object> response = new HashMap<>();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth != null && auth.isAuthenticated()) {
            response.put("hasAdminRole", auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
            response.put("hasVendedorRole", auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_VENDEDOR")));
            response.put("hasClienteRole", auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CLIENTE")));
            response.put("allAuthorities", auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        } else {
            response.put("error", "Usuario no autenticado");
        }
        
        return response;
    }
}
*/  // <-- ¡ESTO ES LO QUE TE FALTA!