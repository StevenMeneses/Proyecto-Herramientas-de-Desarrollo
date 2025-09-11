package com.example.Proyecto_HD.repository;

import com.example.Proyecto_HD.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByDni(String dni);
    List<Usuario> findByIdRol(Integer idRol);
}