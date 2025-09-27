import React, { useState, useEffect } from 'react';
import '../components/Collection.css';

// Simulación de usuario actual
const currentUser = {
  rol: 1, // Cambia a otro número para probar restricciones
};

const defaultProducts = [
  { id: 1, name: 'Collar con conchas', price: 24, material: 'Oro', type: 'Collar' },
  { id: 2, name: 'Pulsera azul marina', price: 50, material: 'Plata', type: 'Pulsera' },
  { id: 3, name: 'Aretes conchas rosadas', price: 38, material: 'Resina', type: 'Aretes' },
  { id: 4, name: 'Collar estrella de mar', price: 70, material: 'Multicolor', type: 'Collar' },
];

const BestSellers = () => {
  const [headerImage, setHeaderImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    price: '',
    material: '',
    type: '',
    sortBy: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('seaProducts');
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      localStorage.setItem('seaProducts', JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    }
  }, []);

  const filteredProducts = products
    .filter(p => {
      return (
        (!filters.price || p.price <= parseInt(filters.price)) &&
        (!filters.material || p.material === filters.material) &&
        (!filters.type || p.type === filters.type)
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === 'low') return a.price - b.price;
      if (filters.sortBy === 'high') return b.price - a.price;
      return 0;
    });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && currentUser.rol === 1) {
      const reader = new FileReader();
      reader.onloadend = () => setHeaderImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sea-collection-container">
      {/* Header y Breadcrumb */}
      <div className="collection-header">
        <h1 className="collection-title"> </h1>
        <div className="breadcrumb">
          <span>MarlyHandmade</span>
          <span className="breadcrumb-separator">/</span>
          <span>SEA COLLECTION</span>
        </div>
      </div>

      {/* Imagen destacada */}
      <div className="hero-image-section">
        <div className="hero-image-container">
          {headerImage ? (
            <img src={headerImage} alt="Sea Collection Header" className="hero-image" />
          ) : (
            <div className="hero-placeholder">
              Imagen destacada de Sea Collection
            </div>
          )}
        </div>
        {currentUser.rol === 1 && (
          <div className="admin-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="upload-input"
            />
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <span className="filter-label">Price</span>
            <select
              value={filters.price}
              onChange={e => setFilters({ ...filters, price: e.target.value })}
              className="filter-select"
            >
              <option value="">+</option>
              <option value="25">$25</option>
              <option value="50">$50</option>
              <option value="75">$75</option>
              <option value="100">$100</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Material</span>
            <select
              value={filters.material}
              onChange={e => setFilters({ ...filters, material: e.target.value })}
              className="filter-select"
            >
              <option value="">+</option>
              <option value="Oro">Oro</option>
              <option value="Plata">Plata</option>
              <option value="Resina">Resina</option>
              <option value="Multicolor">Multicolor</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Product type</span>
            <select
              value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}
              className="filter-select"
            >
              <option value="">+</option>
              <option value="Collar">Collar</option>
              <option value="Pulsera">Pulsera</option>
              <option value="Aretes">Aretes</option>
              <option value="Anillo">Anillo</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Sort by</span>
            <select
              value={filters.sortBy}
              onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
              className="filter-select"
            >
              <option value="">–</option>
              <option value="low">Precio: bajo a alto</option>
              <option value="high">Precio: alto a bajo</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="products-section">
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <div className="product-details">
                <span className="product-material">🧵 {product.material}</span>
                <span className="product-type">📦 {product.type}</span>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p className="empty-state-text">No se encontraron productos con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;