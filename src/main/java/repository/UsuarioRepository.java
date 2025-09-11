package com.example.Proyecto_HD.repository;

import com.example.Proyecto_HD.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByCorreoAndContrasena(String correo, String contrasena);
}
