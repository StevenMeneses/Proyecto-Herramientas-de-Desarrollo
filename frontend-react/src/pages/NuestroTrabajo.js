import React, { useState, useEffect } from 'react';
import '../components/CategoryProducts.css';

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
    <div className="work-page">
      <div className="management-header">
        <h1 className="management-title">Nuestro Trabajo</h1>
        <p className="management-subtitle">
          Conoce el proceso artesanal detrás de cada una de nuestras piezas únicas
          {user && ` - Bienvenid${user.idRol === 2 ? 'a' : 'o'} ${user.nombre}`}
          {user && user.idRol === 1 && ' (Administrador)'} 
          {user && user.idRol === 2 && ' (Vendedor)'} 
          {user && user.idRol === 3 && ' (Cliente)'}
        </p>
      </div>

      <div className="work-description">
        Cada pieza que creamos es el resultado de horas de dedicación, amor por el arte 
        y compromiso con la calidad. Utilizamos técnicas tradicionales combinadas con 
        diseños contemporáneos para ofrecerte joyas únicas que cuentan una historia.
      </div>

      <div className="category-products-grid">
        {products.map(product => (
          <div key={product.idProducto} className="category-product-card">
            <div className="category-product-image">
              <img src={product.imagenUrl} alt={product.nombreProducto} />
              <span className="category-collection-badge">{product.categoria}</span>
            </div>
            <div className="category-product-info">
              <h3 className="category-product-name">{product.nombreProducto}</h3>
              <p className="category-product-description">{product.descripcion}</p>
              <div className="category-product-price">S/ {product.precio}</div>
              <div className="category-product-actions">
                <button className="category-btn-primary">
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
        <div className="process-grid">
          <div className="process-card">
            <i className="fas fa-drafting-compass"></i>
            <h3>Diseño</h3>
            <p>Cada pieza comienza con un diseño único creado por nuestros artesanos</p>
          </div>
          <div className="process-card">
            <i className="fas fa-hammer"></i>
            <h3>Elaboración</h3>
            <p>Técnicas tradicionales combinadas con precisión moderna</p>
          </div>
          <div className="process-card">
            <i className="fas fa-gem"></i>
            <h3>Acabado</h3>
            <p>Detalles perfectos y calidad excepcional en cada pieza</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuestroTrabajo;