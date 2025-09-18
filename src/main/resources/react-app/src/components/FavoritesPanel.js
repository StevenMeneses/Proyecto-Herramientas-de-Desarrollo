import React from 'react';
import { useFavorites } from '../context/FavoriteContext';
import './FavoritesPanel.css';

const FavoritesPanel = ({ isOpen, onClose }) => {
  const { favorites, removeFromFavorites } = useFavorites();

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
                    src={item.imagenUrl || '/images/placeholder-product.jpg'} 
                    alt={item.nombreProducto}
                    className="favorite-item-image"
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