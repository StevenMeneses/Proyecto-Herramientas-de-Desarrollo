// src/pages/GestionVentas.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SalesCharts from '../components/SalesCharts';
import '../components/CategoryProducts.css';
import '../components/SalesCharts.css';

const GestionVentas = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('ventas');

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

  if (user === null) {
    return (
      <div className="management-page">
        <div className="management-header">
          <h1 className="management-title">Cargando...</h1>
          <p className="management-subtitle">Verificando permisos de acceso</p>
        </div>
      </div>
    );
  }

  if (user.idRol !== 1 && user.idRol !== 2) {
    return (
      <div className="management-page">
        <div className="management-header">
          <h1 className="management-title">Acceso Denegado</h1>
          <p className="management-subtitle">No tienes permisos para acceder a esta sección</p>
          <p>Tu rol actual: {user.idRol === 3 ? 'Cliente' : 'Desconocido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <h1 className="management-title">Gestión de Ventas</h1>
        <p className="management-subtitle">
          Panel de administración para {user.idRol === 1 ? 'Administrador' : 'Vendedor'} - {user.nombre}
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="management-tabs">
        <button
          className={`management-tab ${activeTab === 'ventas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ventas')}
        >
          <i className="fas fa-chart-line"></i>
          Reportes de Ventas
        </button>
        <button
          className={`management-tab ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          <i className="fas fa-box"></i>
          Gestión de Productos
        </button>
        <button
          className={`management-tab ${activeTab === 'colecciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('colecciones')}
        >
          <i className="fas fa-layer-group"></i>
          Colecciones
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="management-section">
        {activeTab === 'ventas' && <SalesCharts />}

        {activeTab === 'productos' && (
          <div>
            <h2>Gestión de Productos</h2>
            <p>Administra los productos por categoría:</p>
            <div className="action-grid">
              <Link to="/gestion/anillos" className="action-card">
                <i className="fas fa-ring"></i>
                <h3>Anillos</h3>
                <p>Gestionar productos de anillos</p>
              </Link>
              <Link to="/gestion/aretes" className="action-card">
                <i className="fas fa-gem"></i>
                <h3>Aretes</h3>
                <p>Gestionar productos de aretes</p>
              </Link>
              <Link to="/gestion/brazaletes" className="action-card">
                <i className="fas fa-bracelet"></i>
                <h3>Brazaletes</h3>
                <p>Gestionar productos de brazaletes</p>
              </Link>
              <Link to="/gestion/aros" className="action-card">
                <i className="fas fa-circle"></i>
                <h3>Aros</h3>
                <p>Gestionar productos de aros</p>
              </Link>
              <Link to="/gestion/collares" className="action-card">
                <i className="fas fa-necklace"></i>
                <h3>Collares</h3>
                <p>Gestionar productos de collares</p>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'colecciones' && (
          <div>
            <h2>Gestión de Colecciones</h2>
            <p>Selecciona la colección que deseas gestionar:</p>
            <div className="action-grid">
              <Link to="/gestion/sea-collection" className="action-card">
                <i className="fas fa-water"></i>
                <h3>Sea Collection</h3>
                <p>Gestionar productos de la colección marina</p>
              </Link>
              <Link to="/gestion/matarita-collection" className="action-card">
                <i className="fas fa-cocktail"></i>
                <h3>Matarita Collection</h3>
                <p>Gestionar productos exclusivos Matarita</p>
              </Link>
              <Link to="/gestion/best-sellers" className="action-card">
                <i className="fas fa-star"></i>
                <h3>Best Sellers</h3>
                <p>Gestionar productos más vendidos</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionVentas;