// src/pages/Perfil.js
import React, { useState, useEffect } from 'react';
import '../components/Perfil.css';

const API_BASE = window.location.hostname.includes('render.com') 
  ? 'https://proyecto-herramientas-de-desarrollo-3.onrender.com'
  : 'http://localhost:8080';

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  

  useEffect(() => {
    // Obtener datos del usuario desde la API
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/usuario/datos`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUsuario(userData);
          setFormData({
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            dni: userData.dni || '',
            email: userData.email || '',
            telefono: userData.telefono || '',
            direccion: userData.direccion || ''
          });
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };
    
    fetchUsuario();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/usuario/actualizar`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUsuario(updatedUser);
        setEditMode(false);
        alert('Perfil actualizado correctamente');
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  const getRolNombre = (idRol) => {
    switch(idRol) {
      case 1: return 'Administrador';
      case 2: return 'Vendedor';
      case 3: return 'Cliente';
      default: return 'Usuario';
    }
  };

  if (!usuario) {
    return <div className="perfil-loading">Cargando perfil...</div>;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <button 
          className={`btn ${editMode ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      <div className="perfil-content">
        <div className="perfil-info-card">
          <div className="perfil-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          
          <div className="perfil-datos">
            <div className="campo-perfil">
              <label>Rol:</label>
              <span className="valor-campo rol-badge">{getRolNombre(usuario.idRol)}</span>
            </div>
            
            {editMode ? (
              <form onSubmit={handleSubmit} className="form-perfil">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido:</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>DNI:</label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    maxLength="8"
                    pattern="[0-9]{8}"
                    title="El DNI debe tener 8 dígitos"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Teléfono:</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    maxLength="9"
                    pattern="[0-9]{9}"
                    title="El teléfono debe tener 9 dígitos"
                  />
                </div>
                
                <div className="form-group">
                  <label>Dirección:</label>
                  <textarea
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Contraseña:</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    disabled
                    title="Para cambiar la contraseña, contacta con administración"
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              </form>
            ) : (
              <div className="datos-visualizacion">
                <div className="campo-perfil">
                  <label>Nombre:</label>
                  <span className="valor-campo">{usuario.nombre}</span>
                </div>
                
                <div className="campo-perfil">
                  <label>Apellido:</label>
                  <span className="valor-campo">{usuario.apellido}</span>
                </div>
                
                <div className="campo-perfil">
                  <label>DNI:</label>
                  <span className="valor-campo">{usuario.dni || 'No especificado'}</span>
                </div>
                
                <div className="campo-perfil">
                  <label>Email:</label>
                  <span className="valor-campo">{usuario.email}</span>
                </div>
                
                <div className="campo-perfil">
                  <label>Teléfono:</label>
                  <span className="valor-campo">{usuario.telefono || 'No especificado'}</span>
                </div>
                
                <div className="campo-perfil">
                  <label>Dirección:</label>
                  <span className="valor-campo">{usuario.direccion || 'No especificada'}</span>
                </div>
                
                <div className="campo-perfil">
                  <label>Contraseña:</label>
                  <span className="valor-campo">••••••••</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;