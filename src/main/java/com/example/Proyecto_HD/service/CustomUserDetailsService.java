package com.example.Proyecto_HD.service;

import com.example.Proyecto_HD.model.Usuario;
import com.example.Proyecto_HD.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isEmpty()) {
            throw new UsernameNotFoundException("Usuario no encontrado con email: " + email);
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Verificar si el usuario está activo
        if (!usuario.getActivo()) {
            throw new UsernameNotFoundException("Usuario inactivo: " + email);
        }
        
        return new CustomUserPrincipal(usuario);
    }
    
    // Clase interna para implementar UserDetails
    public static class CustomUserPrincipal implements UserDetails {
        private Usuario usuario;
        
        public CustomUserPrincipal(Usuario usuario) {
            this.usuario = usuario;
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            String role = getRoleFromId(usuario.getIdRol());
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
        }
        
        private String getRoleFromId(Integer idRol) {
            switch (idRol) {
                case 1: return "ADMIN";
                case 2: return "VENDEDOR";
                case 3: return "CLIENTE";
                default: return "CLIENTE";
            }
        }
        
        @Override
        public String getPassword() {
            return usuario.getContrasena();
        }
        
        @Override
        public String getUsername() {
            return usuario.getEmail();
        }
        
        @Override
        public boolean isAccountNonExpired() {
            return true;
        }
        
        @Override
        public boolean isAccountNonLocked() {
            return true;
        }
        
        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }
        
        @Override
        public boolean isEnabled() {
            return usuario.getActivo();
        }
        
        // Método para obtener el usuario completo
        public Usuario getUsuario() {
            return usuario;
        }
    }
}