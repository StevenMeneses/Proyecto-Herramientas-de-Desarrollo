package com.example.Proyecto_HD.service;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Usuario registrarUsuario(Usuario usuario) {
        // Verificar si el email ya existe
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Verificar si el DNI ya existe
        if (usuarioRepository.findByDni(usuario.getDni()).isPresent()) {
            throw new RuntimeException("El DNI ya está registrado");
        }
        
        // Encriptar la contraseña
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        
        // Guardar el usuario en la BD
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> autenticarUsuario(String email, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Verificar si la contraseña coincide
            if (passwordEncoder.matches(password, usuario.getContrasena())) {
                return Optional.of(usuario);
            }
        }
        
        return Optional.empty();
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
}