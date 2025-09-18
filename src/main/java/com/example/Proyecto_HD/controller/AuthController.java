package com.example.Proyecto_HD.controller;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    // Redirige a la página de login por defecto
    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }

    // Muestra la página de login (THYMELEAF - NO React)
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
        return "login"; // Devuelve la plantilla Thymeleaf
    }

    // Muestra la página de registro (THYMELEAF - NO React)
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
        return "registro"; // Devuelve la plantilla Thymeleaf
    }

    // Procesa el registro de cliente (FORMULARIO THYMELEAF)
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

    // Procesa el registro de vendedor (FORMULARIO THYMELEAF)
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

    // Procesa el login (FORMULARIO THYMELEAF)
    @PostMapping("/login")
    public String processLogin(@RequestParam String email,
                          @RequestParam String contrasena,
                          HttpSession session,
                          HttpServletResponse response,
                          Model model) {
    

        try {
            Optional<Usuario> usuarioOpt = usuarioService.autenticarUsuario(email, contrasena);
            
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                
                // DEBUG: Verificar datos
                System.out.println("Login exitoso: " + usuario.getEmail());
                System.out.println("Rol: " + usuario.getIdRol());
                
                // Guardar usuario en sesión
                session.setAttribute("usuario", usuario);
                
                // Configurar cookie manualmente para CORS
                response.setHeader("Set-Cookie", 
                    "JSESSIONID=" + session.getId() + 
                    "; Path=/; " + 
                    "Domain=localhost; " + 
                    "SameSite=None; " + 
                    "Secure=false; " + 
                    "HttpOnly=false; " + 
                    "Max-Age=3600");
                
                return "redirect:http://localhost:3000?login=success";
            } else {
                model.addAttribute("error", "El correo o contraseña son incorrectos");
                return "login";
            }
            
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "login";
        } catch (Exception e) {
            model.addAttribute("error", "Error en el login: " + e.getMessage());
            return "login";

        }
    }

    // Endpoint para cerrar sesión
    @RequestMapping(value = "/logout", method = {RequestMethod.GET, RequestMethod.POST})
    public String logout(HttpSession session, HttpServletResponse response) {
        // Invalidar la sesión
        session.invalidate();
        
        // Limpiar cookies (opcional pero recomendado)
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        return "redirect:/login?logout=success";
    }

    // APIs JSON para React (OPCIONAL - si las necesitas)
    @PostMapping("/api/login")
    @ResponseBody
    public ResponseEntity<Map<String, String>> apiLogin(@RequestBody Map<String, String> loginData,
                                                       HttpSession session) {
        Map<String, String> response = new HashMap<>();
        
        try {
            // CORRECCIÓN: Agregar .orElse(null) ↓
            Usuario usuario = usuarioService.autenticarUsuario(
                loginData.get("email"), 
                loginData.get("contrasena")
            ).orElse(null); // ← ESTO FALTABA
            
            if (usuario != null) {
                session.setAttribute("usuario", usuario);
                response.put("success", "Login exitoso");
                response.put("redirect", "http://localhost:3000");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Credenciales incorrectas");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("error", "Error en el login: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}