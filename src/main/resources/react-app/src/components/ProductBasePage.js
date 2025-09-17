import React, { useState, useEffect } from 'react';
import './Products.css';


const ProductBasePage = ({ category, title, subtitle }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [collections, setCollections] = useState([]);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Datos del formulario de gestión
  const [formData, setFormData] = useState({
    nombreProducto: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    idCategoria: category,
    colecciones: []
  });

  // Cargar datos del usuario y productos
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

    const fetchProducts = async () => {
      try {
        // Simular datos de productos (reemplazar con API real)
        const mockProducts = [
          {
            idProducto: 1,
            nombreProducto: 'Anillo de Plata',
            descripcion: 'Hermoso anillo de plata con detalles artesanales',
            precio: 89.99,
            stock: 15,
            imagenUrl: 'https://via.placeholder.com/300x300?text=Anillo+Plata',
            idCategoria: 1,
            colecciones: ['nueva', 'exclusivo']
          },
          {
            idProducto: 2,
            nombreProducto: 'Aretes de Oro',
            descripcion: 'Elegantes aretes de oro 18k',
            precio: 149.99,
            stock: 8,
            imagenUrl: 'https://via.placeholder.com/300x300?text=Aretes+Oro',
            idCategoria: 2,
            colecciones: ['clasico']
          }
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (error) {
        console.error('Error cargando productos:', error);
      }
    };

    const fetchCollections = async () => {
      try {
        // Simular colecciones (reemplazar con API real)
        const mockCollections = ['nueva', 'exclusivo', 'clasico', 'limitado'];
        setCollections(mockCollections);
      } catch (error) {
        console.error('Error cargando colecciones:', error);
      }
    };

    fetchUserData();
    fetchProducts();
    fetchCollections();
  }, [category]);

  // Filtrar productos
  useEffect(() => {
    let filtered = products.filter(product => 
      product.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCollection !== 'all') {
      filtered = filtered.filter(product => 
        product.colecciones.includes(selectedCollection)
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCollection, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCollectionFilter = (collection) => {
    setSelectedCollection(collection === selectedCollection ? 'all' : collection);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          imagenUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCollectionToggle = (collection) => {
    setFormData(prev => ({
      ...prev,
      colecciones: prev.colecciones.includes(collection)
        ? prev.colecciones.filter(c => c !== collection)
        : [...prev.colecciones, collection]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el producto al backend
    console.log('Producto a enviar:', formData);
    alert('Producto guardado (simulación)');
    setIsManagementOpen(false);
  };

  const canManageProducts = user && (user.idRol === 1 || user.idRol === 2);

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="products-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="category-filter">
          <button
            className={`filter-btn ${selectedCollection === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('all')}
          >
            Todos
          </button>
          {collections.map(collection => (
            <button
              key={collection}
              className={`filter-btn ${selectedCollection === collection ? 'active' : ''}`}
              onClick={() => handleCollectionFilter(collection)}
            >
              {collection.charAt(0).toUpperCase() + collection.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.idProducto} className="product-card">
            <div className="product-image">
              <img src={product.imagenUrl} alt={product.nombreProducto} />
              {product.colecciones.length > 0 && (
                <span className="product-badge">
                  {product.colecciones[0]}
                </span>
              )}
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.nombreProducto}</h3>
              <p className="product-description">{product.descripcion}</p>
              <div className="product-price">S/ {product.precio}</div>
              <div className="product-actions">
                <button className="btn-primary">
                  <i className="fas fa-shopping-cart"></i>
                  Agregar
                </button>
                <button className="btn-secondary">
                  <i className="far fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de gestión para administradores/vendedores */}
      {canManageProducts && (
        <div className="management-section">
          <div className="management-header">
            <h2 className="management-title">Gestión de Productos</h2>
            <button 
              className="add-product-btn"
              onClick={() => setIsManagementOpen(true)}
            >
              <i className="fas fa-plus"></i>
              Agregar Producto
            </button>
          </div>

          <p>Como {user.idRol === 1 ? 'Administrador' : 'Vendedor'}, puedes gestionar los productos de esta categoría.</p>
        </div>
      )}

      {/* Modal de gestión */}
      {isManagementOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Agregar Nuevo Producto</h2>
              <button className="close-modal" onClick={() => setIsManagementOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input
                  type="text"
                  name="nombreProducto"
                  value={formData.nombreProducto}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Precio (S/)</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleFormChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Imagen del Producto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="image-preview">
                  {formData.imagenUrl ? (
                    <img src={formData.imagenUrl} alt="Vista previa" />
                  ) : (
                    <div className="image-preview-placeholder">
                      <i className="fas fa-image" style={{fontSize: '3rem', marginBottom: '1rem'}}></i>
                      <p>Selecciona una imagen</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Colecciones</label>
                <div className="collections-section">
                  <h4 className="collections-title">Selecciona colecciones:</h4>
                  {collections.length > 0 ? (
                    <div className="collections-grid">
                      {collections.map(collection => (
                        <div
                          key={collection}
                          className={`collection-item ${formData.colecciones.includes(collection) ? 'selected' : ''}`}
                          onClick={() => handleCollectionToggle(collection)}
                        >
                          {collection}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-collections">
                      <i className="fas fa-inbox" style={{fontSize: '2rem', marginBottom: '1rem'}}></i>
                      <p>No hay colecciones creadas</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <button type="submit" className="btn-primary" style={{width: '100%'}}>
                  <i className="fas fa-save"></i>
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductBasePage;