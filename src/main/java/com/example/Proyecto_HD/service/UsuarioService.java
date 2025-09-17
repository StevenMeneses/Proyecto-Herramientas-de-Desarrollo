package com.example.Proyecto_HD.service;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ✅ Método para buscar por email (FUERA de registrarUsuario)
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Usuario registrarUsuario(Usuario usuario) {
        // Verificar si el email ya existe
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Verificar si el DNI ya existe
        if (usuarioRepository.findByDni(usuario.getDni()).isPresent()) {
            throw new RuntimeException("El DNI ya está registrado");
        }
        
        // ⚠️ NO encriptar la contraseña - guardar en texto plano
        // usuario.setContrasena(usuario.getContrasena()); // Ya está en texto plano
        
        // Guardar el usuario en la BD
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> autenticarUsuario(String email, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // ⚠️ Comparar directamente sin encriptación
            if (usuario.getContrasena().equals(password)) {
                return Optional.of(usuario);
            } else {
                // Lanzar excepción con mensaje específico de contraseña incorrecta
                throw new RuntimeException("Contraseña incorrecta");
            }
        }
        
        // Si el usuario no existe
        throw new RuntimeException("Usuario no encontrado");
    }

    public List<Usuario> obtenerTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    // Método adicional para actualizar contraseña si luego quieres encriptar
    public void actualizarContrasena(Long idUsuario, String nuevaContrasena) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setContrasena(nuevaContrasena); // o passwordEncoder.encode(nuevaContrasena) si encriptas
            usuarioRepository.save(usuario);
        }
    }
}