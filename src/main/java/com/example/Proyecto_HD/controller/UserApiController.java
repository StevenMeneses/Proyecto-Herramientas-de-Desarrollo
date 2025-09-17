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
    System.out.println("SESSION ID: " + session.getId()); // ← Debug
    System.out.println("USUARIO EN SESION: " + session.getAttribute("usuario")); // ← Debug
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        
        if (usuario != null) {
            // Crear un mapa con los datos del usuario (sin información sensible)
            Map<String, Object> usuarioData = new HashMap<>();
            usuarioData.put("id", usuario.getIdUsuario()); // CORREGIDO: getIdUsuario()
            usuarioData.put("nombre", usuario.getNombre());
            usuarioData.put("apellido", usuario.getApellido());
            usuarioData.put("email", usuario.getEmail());
            usuarioData.put("idRol", usuario.getIdRol());
            usuarioData.put("activo", usuario.getActivo()); // CORREGIDO: getActivo()
            
            return ResponseEntity.ok(usuarioData);
        }
        System.out.println("No hay usuario en sesión");
        // Devolver un error 401 si no hay usuario en sesión
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
    }
}