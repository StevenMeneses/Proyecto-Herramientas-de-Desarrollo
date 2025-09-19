// src/pages/Pedidos.js
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import '../components/Pedidos.css';

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

const Pedidos = () => {
  const { cartItems, clearCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId] = useState(Math.floor(100000 + Math.random() * 900000));
  const [customerInfo, setCustomerInfo] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  useEffect(() => {
    // Obtener información del usuario si está disponible
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setCustomerInfo({
        nombre: `${userData.nombre || ''} ${userData.apellido || ''}`,
        direccion: userData.direccion || '',
        telefono: userData.telefono || '',
        email: userData.email || ''
      });
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };

  // Manejador de errores de imagen
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder-product.jpg';
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // Validar información del cliente
    if (!customerInfo.nombre || !customerInfo.direccion || !customerInfo.telefono) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    // Obtener fecha actual
    const now = new Date();
    const saleDate = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const saleDateTime = now.toISOString();
    
    // Crear objeto de venta
    const saleData = {
      orderId,
      items: cartItems.map(item => ({
        ...item,
        // Guardar la imagen real para los reportes
        imagenReal: obtenerImagen(item.imagenUrl)
      })),
      customerInfo,
      total: calculateTotal() + 15,
      date: saleDate,
      datetime: saleDateTime,
      timestamp: now.getTime()
    };
    
    // Guardar venta en localStorage
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    sales.push(saleData);
    localStorage.setItem('sales', JSON.stringify(sales));
    
    // Simular procesamiento de pedido
    setOrderComplete(true);
    
    // Limpiar el carrito usando la función del contexto
    clearCart();
    
    console.log('Pedido procesado:', saleData);
  };

  if (orderComplete) {
    return (
      <div className="pedidos-container">
        <div className="order-success">
          <i className="fas fa-check-circle"></i>
          <h2>¡Pedido Completado!</h2>
          <p>Tu pedido ha sido procesado exitosamente.</p>
          <p>Número de orden: <strong>{orderId}</strong></p>
          <p>Te contactaremos pronto para coordinar la entrega.</p>
          <p>Total pagado: <strong>S/ {(calculateTotal() + 15).toFixed(2)}</strong></p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/'}
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pedidos-container">
      <h1>Finalizar Compra</h1>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Resumen del Pedido</h2>
          
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <p>No hay productos en tu carrito</p>
              <a href="/" className="btn btn-primary">Seguir Comprando</a>
            </div>
          ) : (
            <>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.idProducto} className="order-item">
                    <img 
                      src={obtenerImagen(item.imagenUrl)} 
                      alt={item.nombreProducto}
                      onError={handleImageError}
                    />
                    <div className="item-details">
                      <h4>{item.nombreProducto}</h4>
                      <p>Cantidad: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      S/. {(item.precio * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-totals">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>S/. {calculateTotal().toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>Envío:</span>
                  <span>S/. 15.00</span>
                </div>
                <div className="total-line grand-total">
                  <span>Total:</span>
                  <span>S/. {(calculateTotal() + 15).toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="payment-section">
            <h2>Información de Entrega</h2>
            <form onSubmit={handleSubmitOrder} className="checkout-form">
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={customerInfo.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Dirección de entrega *</label>
                <textarea
                  name="direccion"
                  value={customerInfo.direccion}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Teléfono de contacto *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={customerInfo.telefono}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-section">
                <h3>Método de Pago</h3>
                <p>Pago contra entrega (efectivo o tarjeta)</p>
                <p className="payment-note">
                  Al confirmar tu pedido, nos contactaremos contigo para coordinar la entrega y el pago.
                </p>
              </div>
              
              <button type="submit" className="btn btn-primary btn-pagar">
                Confirmar Pedido (S/. {(calculateTotal() + 15).toFixed(2)})
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedidos;