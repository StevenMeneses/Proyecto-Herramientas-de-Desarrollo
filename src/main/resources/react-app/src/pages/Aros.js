import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import '../components/Products.css';

const Aros = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Clave para localStorage
  const STORAGE_KEY = 'joyeria_productos';
  const IMAGES_STORAGE_KEY = 'joyeria_imagenes';
  const categoryId = 4; // ID para Anillos

  // Función para obtener imagen desde localStorage o ruta
  const obtenerImagen = (imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    
    try {
      const imagenesGuardadas = JSON.parse(localStorage.getItem(IMAGES_STORAGE_KEY) || '{}');
      return imagenesGuardadas[imagePath] || imagePath;
    } catch (error) {
      console.error('Error al obtener imagen:', error);
      return imagePath || '/images/placeholder-product.jpg';
    }
  };

  // Cargar datos desde localStorage
  const loadProductsFromStorage = () => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY);
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        return allProducts[categoryId] || [];
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
    return [];
  };

  // Cargar productos
  useEffect(() => {
    const categoryProducts = loadProductsFromStorage();
    setProducts(categoryProducts);
    setFilteredProducts(categoryProducts);
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtered = products.filter(product => 
      product.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Manejador de errores de imagen
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder-product.jpg';
  };

  // Handlers para carrito y favoritos
  const handleAddToCart = (product) => {
    addToCart(product);
    // Feedback visual
    const button = document.getElementById(`cart-btn-${product.idProducto}`);
    if (button) {
      button.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
      button.style.background = 'var(--success)';
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Agregar';
        button.style.background = '';
      }, 1500);
    }
  };

  const handleToggleFavorite = (product) => {
    if (isFavorite(product.idProducto)) {
      removeFromFavorites(product.idProducto);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">Aros</h1>
        <p className="page-subtitle">Descubre nuestra colección de aros</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="products-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.idProducto} className="product-card">
              <div className="product-image">
                <img 
                  src={obtenerImagen(product.imagenUrl)} 
                  alt={product.nombreProducto}
                  onError={handleImageError}
                  loading="lazy"
                />
                {product.colecciones && product.colecciones.length > 0 && (
                  <span className="product-badge">
                    {product.colecciones[0]}
                  </span>
                )}

                {/* Botón de favoritos */}
                <button 
                  className={`favorite-btn ${isFavorite(product.idProducto) ? 'favorited' : ''}`}
                  onClick={() => handleToggleFavorite(product)}
                  title={isFavorite(product.idProducto) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <i className={`${isFavorite(product.idProducto) ? 'fas' : 'far'} fa-heart`}></i>
                </button>
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.nombreProducto}</h3>
                <p className="product-description">{product.descripcion}</p>
                <div className="product-meta">
                  <span className="product-price">S/ {product.precio}</span>
                  <span className="product-stock">{product.stock} disponibles</span>
                </div>
                <div className="product-actions">
                  <button 
                    id={`cart-btn-${product.idProducto}`}
                    className="btn-primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <i className="fas fa-search" style={{fontSize: '3rem', marginBottom: '1rem'}}></i>
            <h3>No se encontraron productos</h3>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Aros;