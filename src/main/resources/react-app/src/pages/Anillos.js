import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import '../components/CategoryProducts.css'; // Cambiar a nuevo CSS

const Anillos = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Clave para localStorage
  const STORAGE_KEY = 'joyeria_productos';
  const IMAGES_STORAGE_KEY = 'joyeria_imagenes';
  const categoryId = 1; // ID para Anillos

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
      button.style.background = 'var(--category-primary)';
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
    <div className="category-page">
      <div className="category-header">
        <span className="category-icon">💍</span>
        <h1 className="category-title">Anillos Exclusivos</h1>
        <p className="category-subtitle">
          Descubre nuestra colección de anillos elaborados con los mejores materiales y diseño único
        </p>
      </div>

      {/* Búsqueda */}
      <div className="category-search">
        <i className="fas fa-search category-search-icon"></i>
        <input
          type="text"
          placeholder="Buscar anillos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="category-search-input"
        />
      </div>

      {/* Grid de productos */}
      <div className="category-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.idProducto} className="category-product-card jewel-sparkle">
              <div className="category-product-image">
                <img 
                  src={obtenerImagen(product.imagenUrl)} 
                  alt={product.nombreProducto}
                  onError={handleImageError}
                  loading="lazy"
                />
                {product.colecciones && product.colecciones.length > 0 && (
                  <span className="category-collection-badge">
                    {product.colecciones[0]}
                  </span>
                )}

                {/* Botón de favoritos */}
                <button 
                  className={`category-btn-secondary ${isFavorite(product.idProducto) ? 'favorited' : ''}`}
                  onClick={() => handleToggleFavorite(product)}
                  title={isFavorite(product.idProducto) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    zIndex: '2'
                  }}
                >
                  <i className={`${isFavorite(product.idProducto) ? 'fas' : 'far'} fa-heart`}></i>
                </button>
              </div>
              
              <div className="category-product-info">
                <h3 className="category-product-name">{product.nombreProducto}</h3>
                <p className="category-product-description">{product.descripcion}</p>
                <div className="category-product-meta">
                  <span className="category-product-price">{product.precio}</span>
                  <span className="category-product-stock">{product.stock} disponibles</span>
                </div>
                <div className="category-product-details">
                  <span className="category-product-material">{product.material || 'Material premium'}</span>
                  <span className="category-product-type">Anillo</span>
                </div>
                <div className="category-product-actions">
                  <button 
                    id={`cart-btn-${product.idProducto}`}
                    className="category-btn-primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="category-empty-state">
            <span className="category-empty-icon">💍</span>
            <h3 className="category-empty-title">No se encontraron anillos</h3>
            <p className="category-empty-text">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Anillos;