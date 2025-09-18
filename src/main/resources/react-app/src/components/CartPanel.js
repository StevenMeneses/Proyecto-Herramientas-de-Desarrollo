import React from 'react';
import { useCart } from '../context/CartContext';
import './CartPanel.css';

const CartPanel = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="panel-overlay" onClick={onClose}></div>
      <div className="cart-panel">
        <div className="panel-header">
          <h2>Tu Carrito</h2>
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
                      src={item.imagenUrl || '/images/placeholder-product.jpg'} 
                      alt={item.nombreProducto}
                      className="cart-item-image"
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
                  <span>Total:</span>
                  <span>S/ {getCartTotal().toFixed(2)}</span>
                </div>
                <button className="checkout-btn">
                  Pagar (S/ {getCartTotal().toFixed(2)})
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