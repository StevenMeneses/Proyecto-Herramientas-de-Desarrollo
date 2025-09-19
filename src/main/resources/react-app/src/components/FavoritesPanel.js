// src/components/FavoritesPanel.js
import React from 'react';
import { useFavorites } from '../context/FavoriteContext';
import './FavoritesPanel.css';

// Función para obtener imagen desde localStorage
const obtenerImagen = (imagePath) => {
  if (!imagePath) return '/images/placeholder-product.jpg';
  
  try {
    const imagenesGuardadas = JSON.parse(localStorage.getItem('joyeria_imagenes') || '{}');
    return imagenesGuardadas[imagePath] || imagePath;
  } catch (error) {
    console.error('Error al obtener imagen:', error);
    return imagePath || '/images/placeholder-product.jpg';
  }
};

const FavoritesPanel = ({ isOpen, onClose }) => {
  const { favorites, removeFromFavorites } = useFavorites();

  // Manejador de errores de imagen
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder-product.jpg';
  };

  if (!isOpen) return null;

  const handleProductClick = (productId) => {
    // Aquí puedes navegar a la página del producto o destacarlo de alguna manera
    console.log("Ir al producto:", productId);
    onClose();
  };

  return (
    <>
      <div className="panel-overlay" onClick={onClose}></div>
      <div className="favorites-panel">
        <div className="panel-header">
          <h2>Tus Favoritos</h2>
          <button className="close-panel" onClick={onClose}>×</button>
        </div>
        
        <div className="panel-content">
          {favorites.length === 0 ? (
            <div className="empty-favorites">
              <i className="far fa-heart"></i>
              <p>No tienes favoritos aún</p>
            </div>
          ) : (
            <div className="favorites-items">
              {favorites.map(item => (
                <div key={item.idProducto} className="favorite-item">
                  <img 
                    src={obtenerImagen(item.imagenUrl)} 
                    alt={item.nombreProducto}
                    className="favorite-item-image"
                    onError={handleImageError}
                  />
                  <div className="favorite-item-details">
                    <h4>{item.nombreProducto}</h4>
                    <p>S/ {item.precio}</p>
                    <button 
                      className="view-product-btn"
                      onClick={() => handleProductClick(item.idProducto)}
                    >
                      Ver producto
                    </button>
                  </div>
                  <button 
                    className="remove-favorite"
                    onClick={() => removeFromFavorites(item.idProducto)}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPanel;