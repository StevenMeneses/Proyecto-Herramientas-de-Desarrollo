import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShopPanel from './ShopPanel';
import CollectionsPanel from './CollectionsPanel';
import { getCartCountFromStorage } from '../context/CartContext';
import { getFavoritesCountFromStorage } from '../context/FavoriteContext';

function Header({ 
  usuario, 
  userRole, 
  onLogout, 
  onCartOpen, 
  onFavoritesOpen 
}) {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  return (
    <header className="top-header">
      <div className="header-container">
        <div className="left-section">
          <nav className="nav-menu">
            <div className="nav-item">
              <button className="nav-link" onClick={() => {
                setIsShopOpen(!isShopOpen);
                setIsCollectionsOpen(false);
              }}>
                Shop
              </button>
              <ShopPanel 
                isOpen={isShopOpen} 
                onClose={() => setIsShopOpen(false)}
                userRole={userRole}
              />
            </div>
            
            <div className="nav-item">
              <button className="nav-link" onClick={() => {
                setIsCollectionsOpen(!isCollectionsOpen);
                setIsShopOpen(false);
              }}>
                Collections
              </button>
              <CollectionsPanel 
                isOpen={isCollectionsOpen} 
                onClose={() => setIsCollectionsOpen(false)} 
              />
            </div>
            
            <Link to="/nuestro-trabajo" className="nav-link">Our Story</Link>
          </nav>
        </div>
        
        <div className="center-section">
          <button 
            className="store-title-button"
            onClick={() => window.location.href = 'http://localhost:3000/'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              font: 'inherit',
              color: 'inherit'
            }}
          >
            <h1 className="store-title">Marly Handmade</h1>
          </button>
        </div>
        
        <div className="right-section">
          <button className="icon-link" title="Favoritos" onClick={onFavoritesOpen}>
            <i className="fa-regular fa-heart"></i>
            <span className="icon-badge">{getFavoritesCountFromStorage()}</span>
          </button>

          <button className="icon-link" title="Carrito" onClick={onCartOpen}>
            <i className="fas fa-shopping-cart"></i>
            <span className="icon-badge">{getCartCountFromStorage()}</span>
          </button>
          
          <div className="user-dropdown">
            <button className="user-btn">
              <i className="fa-regular fa-user"></i>
              {usuario && (
                <span className="user-name">
                  {usuario.nombre} {usuario.apellido}
                </span>
              )}
              <i className="fas fa-chevron-down"></i>
            </button>
            
            <div className="dropdown-menu">
              <Link to="/perfil" className="dropdown-item">
                <i className="fas fa-user"></i>
                Mi Perfil {usuario && `(${usuario.nombre})`}
              </Link>

              {(usuario?.idRol === 1 || usuario?.idRol === 2) && (
                <Link to="/gestion-ventas" className="dropdown-item">
                  <i className="fas fa-store"></i>
                  Gestión de Ventas
                </Link>
              )}
              
              <Link to="/pedidos" className="dropdown-item">
                <i className="fas fa-shopping-bag"></i>
                Mis Pedidos
              </Link>
              <Link to="/configuracion" className="dropdown-item">
                <i className="fas fa-cog"></i>
                Configuración
              </Link>
              <hr className="dropdown-divider" />
              <Link to="/logout" className="dropdown-item logout-item" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Cerrar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;