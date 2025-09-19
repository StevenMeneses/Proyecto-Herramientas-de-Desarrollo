// GestionVentas.js - Página principal de gestión
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../components/Products.css';

const GestionVentas = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('productos');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('🔍 GestionVentas: Solicitando datos de usuario');
        const response = await fetch('http://localhost:8080/api/usuario/datos', {
          credentials: 'include'
        });
        
        console.log('📨 GestionVentas - Status:', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('✅ GestionVentas - Usuario:', userData);
          setUser(userData);
        } else {
          console.log('❌ GestionVentas - Error:', response.status);
        }
      } catch (error) {
        console.error('💥 GestionVentas - Error:', error);
      }
    };

    fetchUserData();
  }, []);

  // Mostrar loading mientras se cargan los datos
  if (user === null) {
    return (
      <div className="products-page">
        <div className="page-header">
          <h1 className="page-title">Cargando...</h1>
          <p className="page-subtitle">Verificando permisos de acceso</p>
        </div>
      </div>
    );
  }

  if (user.idRol !== 1 && user.idRol !== 2) {
    return (
      <div className="products-page">
        <div className="page-header">
          <h1 className="page-title">Acceso Denegado</h1>
          <p className="page-subtitle">No tienes permisos para acceder a esta sección</p>
          <p>Tu rol actual: {user.idRol === 3 ? 'Cliente' : 'Desconocido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">Gestión de Ventas</h1>
        <p className="page-subtitle">
          Panel de administración para {user.idRol === 1 ? 'Administrador' : 'Vendedor'} - {user.nombre}
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="products-filters">
        <div className="category-filter">
          <button
            className={`filter-btn ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            <i className="fas fa-box"></i>
            Productos
          </button>
          <button
            className={`filter-btn ${activeTab === 'ventas' ? 'active' : ''}`}
            onClick={() => setActiveTab('ventas')}
          >
            <i className="fas fa-chart-line"></i>
            Ventas
          </button>
          <button
            className={`filter-btn ${activeTab === 'colecciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('colecciones')}
          >
            <i className="fas fa-layer-group"></i>
            Colecciones
          </button>
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="management-section">
        {activeTab === 'productos' && (
          <div>
            <h2>Gestión de Productos</h2>
            <p>Administra los productos por categoría:</p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem'}}>
              <Link to="/gestion/anillos" className="action-card" style={{textDecoration: 'none'}}>
                <i className="fas fa-ring" style={{fontSize: '2rem', color: 'var(--gold-primary)'}}></i>
                <h3>Anillos</h3>
                <p>Gestionar productos de anillos</p>
              </Link>
              <Link to="/gestion/aretes" className="action-card" style={{textDecoration: 'none'}}>
                <i className="fas fa-gem" style={{fontSize: '2rem', color: 'var(--gold-primary)'}}></i>
                <h3>Aretes</h3>
                <p>Gestionar productos de aretes</p>
              </Link>
              <Link to="/gestion/brazaletes" className="action-card" style={{textDecoration: 'none'}}>
                <i className="fas fa-bracelet" style={{fontSize: '2rem', color: 'var(--gold-primary)'}}></i>
                <h3>Brazaletes</h3>
                <p>Gestionar productos de brazaletes</p>
              </Link>
              <Link to="/gestion/aros" className="action-card" style={{textDecoration: 'none'}}>
                <i className="fas fa-circle" style={{fontSize: '2rem', color: 'var(--gold-primary)'}}></i>
                <h3>Aros</h3>
                <p>Gestionar productos de aros</p>
              </Link>
              <Link to="/gestion/collares" className="action-card" style={{textDecoration: 'none'}}>
                <i className="fas fa-necklace" style={{fontSize: '2rem', color: 'var(--gold-primary)'}}></i>
                <h3>Collares</h3>
                <p>Gestionar productos de collares</p>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'ventas' && (
          <div>
            <h2>Reportes de Ventas</h2>
            <p>Funcionalidad de reportes de ventas en desarrollo...</p>
          </div>
        )}

        {activeTab === 'colecciones' && (
          <div>
            <h2>Gestión de Colecciones</h2>
            <p>Funcionalidad de gestión de colecciones en desarrollo...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionVentas;