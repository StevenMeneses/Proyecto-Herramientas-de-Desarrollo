package com.mariyhandmade.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/registro")
public class RegistrationController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Mostrar página de registro
    @GetMapping
    public String showRegistrationPage() {
        return "registro";
    }

    // Procesar registro de CLIENTE
    @PostMapping("/cliente")
    public String registerCliente(
            @RequestParam String nombre,
            @RequestParam String apellido,
            @RequestParam String dni,
            @RequestParam String email,
            @RequestParam String contrasena,
            @RequestParam String telefono,
            @RequestParam String direccion,
            @RequestParam String correo,
            RedirectAttributes redirectAttributes) {

        try {
            // Insertar directamente en la base de datos
            String sql = "INSERT INTO usuario (nombre, apellido, dni, email, contrasena, telefono, direccion, idRol, activo, correo, id_rol) " +
                       "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql, nombre, apellido, dni, email, contrasena, telefono, direccion, 3, 1, correo, 0);

            redirectAttributes.addFlashAttribute("success", 
                "¡Registro exitoso! Ahora puedes iniciar sesión como cliente.");
            return "redirect:/login";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", 
                "Error en el registro: " + e.getMessage());
            return "redirect:/registro";
        }
    }

    // Procesar registro de VENDEDOR
    @PostMapping("/vendedor")
    public String registerVendedor(
            @RequestParam String nombre,
            @RequestParam String apellido,
            @RequestParam String dni,
            @RequestParam String email,
            @RequestParam String contrasena,
            @RequestParam String telefono,
            @RequestParam String direccion,
            @RequestParam String correo,
            RedirectAttributes redirectAttributes) {

        try {
            // Insertar directamente en la base de datos
            String sql = "INSERT INTO usuario (nombre, apellido, dni, email, contrasena, telefono, direccion, idRol, activo, correo, id_rol) " +
                       "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql, nombre, apellido, dni, email, contrasena, telefono, direccion, 2, 1, correo, 0);

            redirectAttributes.addFlashAttribute("success", 
                "¡Solicitud de vendedor enviada! Tu cuenta será validada pronto.");
            return "redirect:/login";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", 
                "Error en el registro: " + e.getMessage());
            return "redirect:/registro";
        }
    }

    // Validar si email ya existe (para AJAX)
    @GetMapping("/check-email")
    @ResponseBody
    public boolean checkEmailExists(@RequestParam String email) {
        String sql = "SELECT COUNT(*) FROM usuario WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    // Validar si DNI ya existe (para AJAX)
    @GetMapping("/check-dni")
    @ResponseBody
    public boolean checkDniExists(@RequestParam String dni) {
        String sql = "SELECT COUNT(*) FROM usuario WHERE dni = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, dni);
        return count != null && count > 0;
    }
}