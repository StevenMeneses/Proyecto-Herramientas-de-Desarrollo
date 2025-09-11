package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.model.Usuario;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/usuario")
public class UserApiController {

    @GetMapping("/datos")
    public Usuario getDatosUsuario(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            // No devolver la contraseña por seguridad
            usuario.setContrasena(null);
            return usuario;
        }
        return null;
    }
}