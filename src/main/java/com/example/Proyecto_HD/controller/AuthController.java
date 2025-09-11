package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Página de login
    @GetMapping("/login")
    public String mostrarLogin() {
        return "login"; // Se va a /templates/login.html
    }

    // Procesar login
    @PostMapping("/login")
    public String procesarLogin(@RequestParam String correo,
                                @RequestParam String contrasena,
                                Model model) {
        Usuario usuario = usuarioRepository.findByCorreoAndContrasena(correo, contrasena);

        if (usuario != null) {
            model.addAttribute("nombreUsuario", usuario.getNombre());
            return "dashboard"; // Redirige a /templates/dashboard.html
        } else {
            model.addAttribute("error", "Correo o contraseña incorrectos");
            return "login";
        }
    }
}
