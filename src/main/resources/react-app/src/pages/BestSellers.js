import React, { useState, useEffect } from 'react';
import '../components/Collection.css';

const currentUser = {
  rol: 1,
};

const BestSellers = () => {
  const [headerImage, setHeaderImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    price: '',
    material: '',
    type: '',
    sortBy: '',
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
        type: producto.tipo,
        descripcion: producto.descripcion,
        imagenUrl: producto.imagenUrl,
        stock: producto.stock
      }));
      
      setProducts(productosMapeados);
    } else {
      setProducts([]);
    }
  }, []);

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
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Función para obtener imagen desde localStorage
  const obtenerImagen = (imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    try {
      const imagenesGuardadas = JSON.parse(localStorage.getItem('best-sellers_images') || '{}');
      return imagenesGuardadas[imagePath] || imagePath;
    } catch (error) {
      return '/images/placeholder-product.jpg';
    }
  };

  return (
    <div className="sea-collection-container">
      {/* Eliminado el header con título y breadcrumb como en SeaCollection */}
      
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

      {/* Filters Section (manteniendo tu diseño original) */}
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
              <option value="150">$150</option>
              <option value="200">$200</option>
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
              <option value="Oro laminado">Oro laminado</option>
              <option value="Plata 925">Plata 925</option>
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
              <option value="Set">Set</option>
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

      <div className="products-section">
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
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
              <p className="empty-state-text">No se encontraron productos en Best Sellers</p>
              <p className="empty-state-subtext">Los productos gestionados aparecerán aquí automáticamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;