import React, { useState, useEffect } from 'react';
import '../components/Products.css';

const NuestroTrabajo = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/usuario/datos', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        // Simular datos de todos los productos
        const mockProducts = [
          {
            idProducto: 1,
            nombreProducto: 'Anillo de Plata',
            descripcion: 'Hermoso anillo de plata con detalles artesanales',
            precio: 89.99,
            imagenUrl: 'https://via.placeholder.com/300x300?text=Anillo+Plata',
            categoria: 'Anillos',
            colecciones: ['nueva']
          },
          {
            idProducto: 2,
            nombreProducto: 'Aretes de Oro',
            descripcion: 'Elegantes aretes de oro 18k',
            precio: 149.99,
            imagenUrl: 'https://via.placeholder.com/300x300?text=Aretes+Oro',
            categoria: 'Aretes',
            colecciones: ['clasico']
          },
          // Agregar más productos de ejemplo...
        ];
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error cargando productos:', error);
      }
    };

    fetchUserData();
    fetchAllProducts();
  }, []);

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">Nuestro Trabajo</h1>
        <p className="page-subtitle">
          Conoce el proceso artesanal detrás de cada una de nuestras piezas únicas
          {user && ` - Bienvenid${user.idRol === 2 ? 'a' : 'o'} ${user.nombre}`}
          {user && user.idRol === 1 && ' (Administrador)'} {user && user.idRol === 2 && ' (Vendedor)'} 
          {user && user.idRol === 3 && ' (Cliente)'}
        </p>
      </div>

      <div className="hero-content" style={{textAlign: 'center', marginBottom: '3rem'}}>
        <p style={{fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto'}}>
          Cada pieza que creamos es el resultado de horas de dedicación, amor por el arte 
          y compromiso con la calidad. Utilizamos técnicas tradicionales combinadas con 
          diseños contemporáneos para ofrecerte joyas únicas que cuentan una historia.
        </p>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.idProducto} className="product-card">
            <div className="product-image">
              <img src={product.imagenUrl} alt={product.nombreProducto} />
              <span className="product-badge">{product.categoria}</span>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.nombreProducto}</h3>
              <p className="product-description">{product.descripcion}</p>
              <div className="product-price">S/ {product.precio}</div>
              <div className="product-actions">
                <button className="btn-primary">
                  <i className="fas fa-eye"></i>
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de proceso artesanal */}
      <div className="management-section">
        <h2 className="management-title">Nuestro Proceso Artesanal</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem'}}>
          <div style={{textAlign: 'center', padding: '1.5rem', background: 'var(--gold-light)', borderRadius: '10px'}}>
            <i className="fas fa-drafting-compass" style={{fontSize: '3rem', color: 'var(--gold-primary)', marginBottom: '1rem'}}></i>
            <h3>Diseño</h3>
            <p>Cada pieza comienza con un diseño único creado por nuestros artesanos</p>
          </div>
          <div style={{textAlign: 'center', padding: '1.5rem', background: 'var(--gold-light)', borderRadius: '10px'}}>
            <i className="fas fa-hammer" style={{fontSize: '3rem', color: 'var(--gold-primary)', marginBottom: '1rem'}}></i>
            <h3>Elaboración</h3>
            <p>Técnicas tradicionales combinadas con precisión moderna</p>
          </div>
          <div style={{textAlign: 'center', padding: '1.5rem', background: 'var(--gold-light)', borderRadius: '10px'}}>
            <i className="fas fa-gem" style={{fontSize: '3rem', color: 'var(--gold-primary)', marginBottom: '1rem'}}></i>
            <h3>Acabado</h3>
            <p>Detalles perfectos y calidad excepcional en cada pieza</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuestroTrabajo;