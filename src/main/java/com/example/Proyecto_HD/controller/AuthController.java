package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    // Redirige a la página de login por defecto
    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }

    // Muestra la página de login
    @GetMapping("/login")
    public String showLoginPage(@RequestParam(value = "error", required = false) String error,
                               @RequestParam(value = "success", required = false) String success,
                               Model model) {
        if (error != null) {
            model.addAttribute("error", error);
        }
        if (success != null) {
            model.addAttribute("success", success);
        }
        return "login";
    }

    // Muestra la página de registro
    @GetMapping("/registro")
    public String showRegisterPage(@RequestParam(value = "error", required = false) String error,
                                  @RequestParam(value = "success", required = false) String success,
                                  Model model) {
        if (error != null) {
            model.addAttribute("error", error);
        }
        if (success != null) {
            model.addAttribute("success", success);
        }
        return "registro";
    }

    // Procesa el registro de cliente
    @PostMapping("/registro/cliente")
    public String registerCliente(@RequestParam String nombre,
                                 @RequestParam String apellido,
                                 @RequestParam String dni,
                                 @RequestParam String email,
                                 @RequestParam String correo,
                                 @RequestParam String telefono,
                                 @RequestParam String direccion,
                                 @RequestParam String contrasena,
                                 @RequestParam String confirmPassword,
                                 Model model) {
        
        try {
            // Verificar si los correos coinciden
            if (!email.equals(correo)) {
                model.addAttribute("error", "Los correos electrónicos no coinciden");
                return "registro";
            }
            
            // Verificar si las contraseñas coinciden
            if (!contrasena.equals(confirmPassword)) {
                model.addAttribute("error", "Las contraseñas no coinciden");
                return "registro";
            }
            
            // Crear el objeto Usuario
            Usuario usuario = new Usuario();
            usuario.setNombre(nombre);
            usuario.setApellido(apellido);
            usuario.setDni(dni);
            usuario.setEmail(email);
            usuario.setCorreo(correo);
            usuario.setTelefono(telefono);
            usuario.setDireccion(direccion);
            usuario.setContrasena(contrasena);
            usuario.setIdRol(3); // Rol de cliente
            usuario.setActivo(true);
            
            // Guardar el usuario en la BD
            usuarioService.registrarUsuario(usuario);
            
            return "redirect:/login?success=Registro exitoso. Ahora puedes iniciar sesión.";
        } catch (Exception e) {
            model.addAttribute("error", "Error en el registro: " + e.getMessage());
            return "registro";
        }
    }

    // Procesa el registro de vendedor
    @PostMapping("/registro/vendedor")
    public String registerVendedor(@RequestParam String nombre,
                                  @RequestParam String apellido,
                                  @RequestParam String dni,
                                  @RequestParam String email,
                                  @RequestParam String correo,
                                  @RequestParam String telefono,
                                  @RequestParam String direccion,
                                  @RequestParam String contrasena,
                                  @RequestParam String confirmPassword,
                                  Model model) {
        
        try {
            // Verificar si los correos coinciden
            if (!email.equals(correo)) {
                model.addAttribute("error", "Los correos electrónicos no coinciden");
                return "registro";
            }
            
            // Verificar si las contraseñas coinciden
            if (!contrasena.equals(confirmPassword)) {
                model.addAttribute("error", "Las contraseñas no coinciden");
                return "registro";
            }
            
            // Crear el objeto Usuario
            Usuario usuario = new Usuario();
            usuario.setNombre(nombre);
            usuario.setApellido(apellido);
            usuario.setDni(dni);
            usuario.setEmail(email);
            usuario.setCorreo(correo);
            usuario.setTelefono(telefono);
            usuario.setDireccion(direccion);
            usuario.setContrasena(contrasena);
            usuario.setIdRol(2); // Rol de vendedor
            usuario.setActivo(false); // Inactivo hasta que admin active
            
            // Guardar el usuario en la BD
            usuarioService.registrarUsuario(usuario);
            
            return "redirect:/login?success=Registro de vendedor exitoso. Espera la activación por administración.";
        } catch (Exception e) {
            model.addAttribute("error", "Error en el registro: " + e.getMessage());
            return "registro";
        }
    }
}