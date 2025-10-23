import React, { useState, useEffect } from 'react';
import '../components/Collection.css';
import { useNavigate } from 'react-router-dom';

const currentUser = {
  rol: 1,
};

const BestSellers = () => {
  const navigate = useNavigate();
  const [headerImage, setHeaderImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    materials: [],
    types: [],
    sortBy: ''
  });
  const [uploading, setUploading] = useState(false);

  // Cargar imagen del header desde el backend
  useEffect(() => {
    const loadHeaderImage = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/best-sellers-header-image');
        if (response.ok) {
          const data = await response.json();
          if (data.imageUrl) {
            setHeaderImage(data.imageUrl);
          }
        }
      } catch (error) {
        console.error('Error al cargar la imagen del header:', error);
      }
    };

    loadHeaderImage();

    // Cargar productos desde localStorage
    const stored = localStorage.getItem('best-sellers_products');
    if (stored) {
      const productosGuardados = JSON.parse(stored);
      
      const productosMapeados = productosGuardados.map(producto => ({
        id: producto.idProducto,
        name: producto.nombreProducto,
        price: producto.precio,
        material: producto.material,
        type: producto.productType || producto.tipo,
        descripcion: producto.descripcion,
        imagenUrl: producto.imagenUrl,
        stock: producto.stock
      }));
      
      setProducts(productosMapeados);
    } else {
      setProducts([]);
    }
  }, []);

  // Materiales únicos para los filtros
  const uniqueMaterials = [...new Set(products.map(p => p.material))].filter(Boolean);
  const uniqueTypes = [...new Set(products.map(p => p.type))].filter(Boolean);

  const filteredProducts = products
    .filter(p => {
      const price = parseFloat(p.price) || 0;
      const minPrice = parseFloat(filters.priceRange.min) || 0;
      const maxPrice = parseFloat(filters.priceRange.max) || Infinity;
      
      return (
        price >= minPrice &&
        price <= maxPrice &&
        (filters.materials.length === 0 || filters.materials.includes(p.material)) &&
        (filters.types.length === 0 || filters.types.includes(p.type))
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === 'low') return (a.price || 0) - (b.price || 0);
      if (filters.sortBy === 'high') return (b.price || 0) - (a.price || 0);
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && currentUser.rol === 1) {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('headerImage', file);

      try {
        const response = await fetch('http://localhost:5000/api/upload-best-sellers-header-image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setHeaderImage(result.imageUrl);
          alert('Imagen subida exitosamente');
        } else {
          throw new Error('Error al subir la imagen');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al subir la imagen');
      } finally {
        setUploading(false);
      }
    }
  };

  // Función para obtener imagen - ACTUALIZADA PARA USAR BACKEND
  const obtenerImagen = (imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    
    // Si ya es una URL completa del backend, devuélvela directamente
    if (imagePath.startsWith('http://localhost:5000')) {
      return imagePath;
    }
    
    // Si es un nombre de archivo, intentar construir la URL según el tipo
    if (imagePath && !imagePath.startsWith('http')) {
      // Para imágenes existentes que aún no están en el backend
      return '/images/placeholder-product.jpg';
    }
    
    return '/images/placeholder-product.jpg';
  };

  const toggleMaterialFilter = (material) => {
    setFilters(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const toggleTypeFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      materials: [],
      types: [],
      sortBy: ''
    });
  };

  return (
    <div className="sea-collection-container">
      <div className="hero-image-section">
        <div className="hero-image-container">
          {headerImage ? (
            <img src={headerImage} alt="Best Sellers Header" className="hero-image" />
          ) : (
            <div className="hero-placeholder">
              Imagen destacada de Best Sellers
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
              disabled={uploading}
            />
            {uploading && <p>Subiendo imagen...</p>}
          </div>
        )}
      </div>

      {/* Filters Sidebar - Mismo diseño que SeaCollection */}
      <aside className="filters-sidebar">
        <div className="filters-header">
          <h2 className="filters-title">
            <span className="icon-filter"></span>
            Filters
          </h2>
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        </div>

        {/* Price Filter */}
        <div className="filter-section">
          <div className="filter-label">
            <span className="icon-price"></span>
            Price
          </div>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={e => setFilters(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, min: e.target.value }
              }))}
              className="price-input"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={e => setFilters(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, max: e.target.value }
              }))}
              className="price-input"
            />
          </div>
        </div>

        {/* Material Filter */}
        <div className="filter-section">
          <div className="filter-label">
            <span className="icon-material"></span>
            Material
          </div>
          <div className="filter-options">
            {uniqueMaterials.map(material => (
              <div
                key={material}
                className={`filter-option ${filters.materials.includes(material) ? 'selected' : ''}`}
                onClick={() => toggleMaterialFilter(material)}
              >
                <div className="filter-checkbox"></div>
                <span className="filter-text">{material}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Type Filter */}
        <div className="filter-section">
          <div className="filter-label">
            <span className="icon-type"></span>
            Product type
          </div>
          <div className="filter-options">
            {uniqueTypes.map(type => (
              <div
                key={type}
                className={`filter-option ${filters.types.includes(type) ? 'selected' : ''}`}
                onClick={() => toggleTypeFilter(type)}
              >
                <div className="filter-checkbox"></div>
                <span className="filter-text">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Products Section - Mismo diseño que SeaCollection */}
      <main className="products-section">
        <div className="products-header">
          <div className="products-count">
            {filteredProducts.length} products found
          </div>
          <select
            value={filters.sortBy}
            onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="sort-select"
          >
            <option value="">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              {/* CONTENEDOR DE IMAGEN CON NAVEGACIÓN */}
              <div 
                className="product-image-container"
                onClick={() => navigate(`/product/BestSellers/${product.id}`)}
                style={{cursor: 'pointer'}}
              >
                <img 
                  src={obtenerImagen(product.imagenUrl)} 
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
                />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <div className="product-details">
                <span className="product-material">🧵 {product.material}</span>
                <span className="product-type">📦 {product.type}</span>
              </div>
              {product.descripcion && (
                <p className="product-description">{product.descripcion}</p>
              )}
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p className="empty-state-text">No products found</p>
              <p className="empty-state-subtext">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BestSellers;