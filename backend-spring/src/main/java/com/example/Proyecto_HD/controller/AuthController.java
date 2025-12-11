package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class AuthController {

    // Redirige a la página de login por defecto
    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }

    // Muestra la página de login (THYMELEAF - NO React)
    @GetMapping("/login")
    public String showLoginPage(@RequestParam(value = "error", required = false) String error,
                               @RequestParam(value = "logout", required = false) String logout,
                               Model model) {
        if (error != null) {
            model.addAttribute("error", "Credenciales incorrectas. Inténtalo de nuevo.");
        }
        if (logout != null) {
            model.addAttribute("success", "Has cerrado sesión correctamente.");
        }
        return "login"; // Devuelve la plantilla Thymeleaf
    }

    // Dashboard después del login exitoso
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                (CustomUserDetailsService.CustomUserPrincipal) auth.getPrincipal();
            Usuario usuario = userPrincipal.getUsuario();
            model.addAttribute("usuario", usuario);
        }
        return "dashboard";
    }

    // API para obtener información del usuario logueado (para React)
    @GetMapping("/api/user-info")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getUserInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (auth != null && auth.isAuthenticated() && 
            auth.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
            
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                (CustomUserDetailsService.CustomUserPrincipal) auth.getPrincipal();
            Usuario usuario = userPrincipal.getUsuario();
            
            response.put("authenticated", true);
            response.put("usuario", Map.of(
                "id", usuario.getIdUsuario(),
                "nombre", usuario.getNombre(),
                "apellido", usuario.getApellido(),
                "email", usuario.getEmail(),
                "rol", usuario.getIdRol()
            ));
            
            return ResponseEntity.ok(response);
        } else {
            response.put("authenticated", false);
            return ResponseEntity.ok(response);
        }
    }

    // 🆕 ENDPOINT DE LOGOUT ESPECÍFICO PARA REACT
@GetMapping("/api/logout")
@ResponseBody
public ResponseEntity<Map<String, Object>> logoutApi(HttpServletRequest request, 
                                                     HttpServletResponse response) {
    Map<String, Object> responseMap = new HashMap<>();
    
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    
    if (auth != null) {
        // Usar SecurityContextLogoutHandler para logout seguro
        new SecurityContextLogoutHandler().logout(request, response, auth);
        
        responseMap.put("success", true);
        responseMap.put("message", "Sesión cerrada exitosamente");
        responseMap.put("username", auth.getName());
        
        // DETERMINAR LA URL BASE SEGÚN EL ENTORNO
        String host = request.getServerName();
        String baseUrl;
        
        if (host.contains("render.com") || host.contains("proyecto-herramientas-de-desarrollo-3")) {
            // PRODUCCIÓN (RENDER)
            baseUrl = "https://proyecto-herramientas-de-desarrollo-3.onrender.com";
        } else {
            // DESARROLLO LOCAL
            baseUrl = "http://localhost:8080";
        }
        
        // Agregar la URL de redirección a la respuesta JSON
        responseMap.put("redirectUrl", baseUrl);
        
    } else {
        responseMap.put("success", true);
        responseMap.put("message", "No había sesión activa");
        responseMap.put("redirectUrl", "http://localhost:8080"); // Por defecto
    }
    
    return ResponseEntity.ok(responseMap);
}

    // 🆕 ENDPOINT PARA VERIFICAR SI HAY SESIÓN ACTIVA (para React)
    @GetMapping("/api/auth/check")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        response.put("authenticated", auth != null && auth.isAuthenticated());
        response.put("username", auth != null ? auth.getName() : null);
        response.put("authorities", auth != null ? auth.getAuthorities().toString() : null);
        
        return ResponseEntity.ok(response);
    }

    // 🆕 ENDPOINT PARA OBTENER DATOS COMPLETOS DEL USUARIO (usado por React)
    @GetMapping("/api/usuario/datos")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getUsuarioDatos() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (auth != null && auth.isAuthenticated() && 
            auth.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
            
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                (CustomUserDetailsService.CustomUserPrincipal) auth.getPrincipal();
            Usuario usuario = userPrincipal.getUsuario();
            
            response.put("authenticated", true);
            response.put("id", usuario.getIdUsuario());
            response.put("nombre", usuario.getNombre());
            response.put("apellido", usuario.getApellido());
            response.put("email", usuario.getEmail());
            response.put("dni", usuario.getDni());
            response.put("telefono", usuario.getTelefono());
            response.put("direccion", usuario.getDireccion());
            response.put("idRol", usuario.getIdRol());
            response.put("activo", usuario.getActivo());
            response.put("authorities", auth.getAuthorities().stream()
                .map(Object::toString)
                .toArray(String[]::new));
            
            return ResponseEntity.ok(response);
        } else {
            response.put("authenticated", false);
            response.put("error", "No autenticado");
            return ResponseEntity.status(401).body(response);
        }
    }
}