// src/components/CartPanel.js
import React from 'react';
import { useCart } from '../context/CartContext';
import './CartPanel.css';

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

const CartPanel = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();

  const handleCheckout = () => {
    onClose();
    // Redirigir a la página de pedidos
    window.location.href = '/pedidos';
  };

  // Manejador de errores de imagen
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder-product.jpg';
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="panel-overlay" onClick={onClose}></div>
      <div className="cart-panel">
        <div className="panel-header">
          <h2>Tu Carrito ({getCartItemsCount()} items)</h2>
          <button className="close-panel" onClick={onClose}>×</button>
        </div>
        
        <div className="panel-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.idProducto} className="cart-item">
                    <img 
                      src={obtenerImagen(item.imagenUrl)} 
                      alt={item.nombreProducto}
                      className="cart-item-image"
                      onError={handleImageError}
                    />
                    <div className="cart-item-details">
                      <h4>{item.nombreProducto}</h4>
                      <p>S/ {item.precio}</p>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.idProducto, item.quantity - 1)}
                        >-</button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.idProducto, item.quantity + 1)}
                        >+</button>
                      </div>
                    </div>
                    <button 
                      className="remove-item"
                      onClick={() => removeFromCart(item.idProducto)}
                    >×</button>
                  </div>
                ))}
              </div>
              
              <div className="cart-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>S/ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Envío:</span>
                  <span>S/ 15.00</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>S/ {(getCartTotal() + 15).toFixed(2)}</span>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceder al Pago (S/ {(getCartTotal() + 15).toFixed(2)})
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPanel;