package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.model.Usuario;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpSession;

@Controller
public class ReactController {
    
    // SOLO captura rutas de la app React, NO login/registro
    

 
    @GetMapping("/productos")
    public String serveProducts() {
        return "forward:/index.html";
    }
    
    // Agrega aquí otras rutas de tu app React
    @GetMapping("/configuracion")
    public String serveSettings() {
        return "forward:/index.html";
    }
    
    @GetMapping("/dashboard")
    public String serveDashboard(HttpSession session) {
        // Verificar si el usuario está autenticado
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) {
            return "redirect:/login?error=Por favor inicia sesión";
        }
        return "forward:/index.html";
    }
    
    @GetMapping("/perfil")
    public String serveProfile(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) {
            return "redirect:/login";
        }
        return "forward:/index.html";
    }
}