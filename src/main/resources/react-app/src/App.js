import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch('/api/usuario/datos', {
          credentials: 'include' // Importante para enviar cookies de sesión
        });

        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (response.ok) {
          const userData = await response.json();
          setUsuario(userData);
        } else if (response.status === 401) {
          console.log('Usuario no autenticado');
          setUsuario(null);
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      }
    };
    
    // Verificar si viene de un login exitoso
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUsuario();
    } else {
      // Verificar si hay sesión activa al cargar la app
      fetchUsuario();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      window.location.href = '/logout';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        // Hacer logout en el backend - Cambiado a GET
        await fetch('/logout', {
          method: 'GET', // Cambiado de POST a GET
          credentials: 'include'
        });
        
        // Limpiar el estado del usuario
        setUsuario(null);
        
        // Redirigir a la página de login de Spring Boot
        window.location.href = 'http://localhost:8080/login?logout=success';
      } catch (error) {
        console.error('Error durante el logout:', error);
        // Fallback: redirigir igualmente
        window.location.href = 'http://localhost:8080/login';
      }
    }
  };

  return (
    <Router>
      <div className="app-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header con navegación */}
      <header className="app-header">
        <nav className="navbar">
          <div className="nav-brand">
            <i className="fas fa-hands"></i>
            <span>Marly Handmade</span>
          </div>
          <div className="nav-links">
            {/* Mostrar nombre del usuario si está logueado */}
            {usuario && (
              <span className="nav-user">
                <i className="fas fa-user-circle"></i>
                Hola, {usuario.nombre} {usuario.apellido}
                <span className="user-role">
                  {usuario.idRol === 1 && '(Administrador)'}
                  {usuario.idRol === 2 && '(Vendedor)'}
                  {usuario.idRol === 3 && '(Cliente)'}
                </span>
              </span>
            )}
            
            <a href="/perfil" className="nav-link">
              <i className="fas fa-user-edit"></i>
              Mi Perfil
            </a>
            
            <a href="/productos" className="nav-link">
              <i className="fas fa-tshirt"></i>
              Productos
            </a>

            <a href="/pedidos" className="nav-link">
              <i className="fas fa-shopping-bag"></i>
              Pedidos
            </a>

            {/* Botón de cerrar sesión */}
            <a 
              href="/logout" 
              className="nav-link logout"
              onClick={(e) => {
                if (!window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                  e.preventDefault();
                }
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              Cerrar Sesión
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
          <h1 className="hero-title">
           {`¡Bienvenido${usuario && usuario.idRol === 2 ? 'a' : ''} a `}
          <span className="brand-highlight">Marly Handmade</span>!
          </h1>
            <p className="hero-subtitle">
              {usuario ? (
                <>
                  {usuario.idRol === 1 && 'Panel de Administración - Gestión completa del sistema'}
                  {usuario.idRol === 2 && 'Panel de Vendedor - Gestiona tus ventas y clientes'}
                  {usuario.idRol === 3 && 'Explora nuestro catálogo de productos artesanales'}
                </>
              ) : 'Sistema de gestión de productos artesanales'}
            </p>
            
            <div className="hero-stats">
              <div className="stat-card">
                <i className="fas fa-users"></i>
                <h3>+500</h3>
                <p>Clientes satisfechos</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-tshirt"></i>
                <h3>+200</h3>
                <p>Productos únicos</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-star"></i>
                <h3>4.9/5</h3>
                <p>Calificación promedio</p>
              </div>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="floating-card admin-card">
              <i className="fas fa-award"></i>
              <h4>Calidad Premium</h4>
              <p>Productos 100% artesanales</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>¿Qué deseas hacer hoy?</h2>
          <div className="action-grid">
            <a href="/productos" className="action-card">
              <i className="fas fa-shopping-cart"></i>
              <h3>Ver Productos</h3>
              <p>Explora nuestra colección</p>
            </a>
            
            <a href="/perfil" className="action-card">
              <i className="fas fa-user-edit"></i>
              <h3>Mi Perfil</h3>
              <p>Gestiona tu cuenta</p>
            </a>
            
            <a href="/pedidos" className="action-card">
              <i className="fas fa-clipboard-list"></i>
              <h3>Mis Pedidos</h3>
              <p>Revisa tus compras</p>
            </a>
            
            {usuario && usuario.idRol === 1 && (
              <a href="/admin" className="action-card">
                <i className="fas fa-cog"></i>
                <h3>Administración</h3>
                <p>Panel de control</p>
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Marly Handmade</h4>
            <p>Productos artesanales con amor y dedicación</p>
          </div>
          
          <div className="footer-section">
            <h4>Contacto</h4>
            <p><i className="fas fa-phone"></i> +51 987 654 321</p>
            <p><i className="fas fa-envelope"></i> hola@marlyhandmade.com</p>
          </div>
          
          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Marly Handmade. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;