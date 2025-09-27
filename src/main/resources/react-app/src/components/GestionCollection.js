// src/components/GestionSeaCollections.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionProductos.css';

const GestionSeaCollections = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para manejo de imágenes
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);

  // Claves para localStorage específicas de Sea Collections
  const STORAGE_KEY = 'sea_collections_products';
  const IMAGES_STORAGE_KEY = 'sea_collections_images';

  // Datos del formulario
  const [formData, setFormData] = useState({
    idProducto: '',
    nombreProducto: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    material: '',
    tipo: 'Collar',
    coleccion: 'sea' // Siempre será sea collection
  });

  // Función para obtener imagen
  const obtenerImagen = useCallback((imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    
    try {
      const imagenesGuardadas = JSON.parse(localStorage.getItem(IMAGES_STORAGE_KEY) || '{}');
      return imagenesGuardadas[imagePath] || imagePath;
    } catch (error) {
      console.error('Error al obtener imagen:', error);
      return '/images/placeholder-product.jpg';
    }
  }, []);

  // Cargar productos de Sea Collections
  const loadProductsFromStorage = useCallback(() => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY);
      if (storedProducts) {
        return JSON.parse(storedProducts);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
    
    // Datos iniciales para Sea Collections
    const initialProducts = [
      {
        idProducto: 1,
        nombreProducto: 'Collar con conchas marinas',
        descripcion: 'Hermoso collar con conchas naturales del mar',
        precio: 45.00,
        stock: 15,
        imagenUrl: '',
        material: 'Plata 925',
        tipo: 'Collar',
        coleccion: 'sea'
      },
      {
        idProducto: 2,
        nombreProducto: 'Aretes estrella de mar',
        descripcion: 'Aretes delicados con forma de estrella de mar',
        precio: 35.00,
        stock: 20,
        imagenUrl: '',
        material: 'Oro laminado',
        tipo: 'Aretes',
        coleccion: 'sea'
      }
    ];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }, []);

  // Guardar productos
  const saveProductsToStorage = useCallback((productsData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productsData));
      return true;
    } catch (error) {
      console.error('Error al guardar productos:', error);
      return false;
    }
  }, []);

  // Guardar imagen
  const guardarImagenEnStorage = useCallback(async (file, imagePath) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imagenesGuardadas = JSON.parse(localStorage.getItem(IMAGES_STORAGE_KEY) || '{}');
          imagenesGuardadas[imagePath] = e.target.result;
          localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(imagenesGuardadas));
          resolve(true);
        } catch (error) {
          console.error('Error al guardar imagen:', error);
          resolve(false);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Datos del usuario
        const userResponse = await fetch('http://localhost:8080/api/usuario/datos', {
          credentials: 'include'
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // Cargar productos de Sea Collections
        const seaProducts = loadProductsFromStorage();
        setProducts(seaProducts);
        setFilteredProducts(seaProducts);

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loadProductsFromStorage]);

  // Filtrar productos
  useEffect(() => {
    const filtered = products.filter(product => 
      product.nombreProducto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Handlers (similares a GestionProductos pero simplificados)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona solo archivos de imagen');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe exceder los 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenPreview(e.target.result);
        setImagenFile(file);
        
        const timestamp = new Date().getTime();
        const extension = file.name.split('.').pop();
        const fileName = `sea_product_${timestamp}.${extension}`;
        
        setFormData(prev => ({
          ...prev,
          imagenUrl: `/images/sea-collections/${fileName}`
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      idProducto: product.idProducto,
      nombreProducto: product.nombreProducto,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      imagenUrl: product.imagenUrl,
      material: product.material,
      tipo: product.tipo,
      coleccion: 'sea'
    });
    setIsEditMode(true);
    setIsManagementOpen(true);
    setImagenPreview(null);
    setImagenFile(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto de Sea Collections?')) {
      try {
        const updatedProducts = products.filter(p => p.idProducto !== productId);
        
        if (saveProductsToStorage(updatedProducts)) {
          setProducts(updatedProducts);
          alert('Producto eliminado exitosamente');
        }
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleAddNewProduct = () => {
    setFormData({
      idProducto: '',
      nombreProducto: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagenUrl: '',
      material: '',
      tipo: 'Collar',
      coleccion: 'sea'
    });
    setIsEditMode(false);
    setIsManagementOpen(true);
    setImagenPreview(null);
    setImagenFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nombreProducto || !formData.precio || !formData.stock) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }

      if (imagenFile) {
        const guardadoExitoso = await guardarImagenEnStorage(imagenFile, formData.imagenUrl);
        if (!guardadoExitoso) {
          alert('Error al guardar la imagen');
          return;
        }
      }

      let updatedProducts;
      
      if (isEditMode) {
        // Editar producto existente
        updatedProducts = products.map(p => 
          p.idProducto === formData.idProducto ? formData : p
        );
      } else {
        // Crear nuevo producto
        const maxId = Math.max(...products.map(p => p.idProducto), 0);
        const newProduct = {
          ...formData,
          idProducto: maxId + 1
        };
        updatedProducts = [...products, newProduct];
      }

      if (saveProductsToStorage(updatedProducts)) {
        setProducts(updatedProducts);
        alert(`Producto ${isEditMode ? 'actualizado' : 'creado'} exitosamente`);
        setIsManagementOpen(false);
      }
      
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto');
    }
  };

  if (isLoading) {
    return (
      <div className="products-page">
        <div className="page-header">
          <h1 className="page-title">Cargando Sea Collections...</h1>
        </div>
      </div>
    );
  }

  if (user && user.idRol !== 1 && user.idRol !== 2) {
    return (
      <div className="products-page">
        <div className="page-header">
          <h1 className="page-title">Acceso Denegado</h1>
          <p className="page-subtitle">No tienes permisos para gestionar colecciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page gestion-page">
      {/* Header */}
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/gestion-ventas')}
        >
          <i className="fas fa-arrow-left"></i> Volver a Gestión
        </button>
        <div className="header-content">
          <h1 className="page-title">
            🌊 Gestión de Sea Collections
          </h1>
          <p className="page-subtitle">
            Administra los productos exclusivos de la colección marina
          </p>
        </div>
        
        <button 
          className="add-product-btn primary-btn"
          onClick={handleAddNewProduct}
        >
          <i className="fas fa-plus"></i>
          Nuevo Producto
        </button>
      </div>

      {/* Búsqueda */}
      <div className="products-filters">
        <div className="search-filter">
          <div className="search-with-icon">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar en Sea Collections..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.idProducto} className="product-card joya-destacada">
              <div className="product-image">
                <img 
                  src={obtenerImagen(product.imagenUrl)} 
                  alt={product.nombreProducto}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
                />
                <span className="product-badge sea-badge">Sea Collection</span>
                
                <div className="product-admin-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditProduct(product)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(product.idProducto)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.nombreProducto}</h3>
                <p className="product-description">{product.descripcion}</p>
                <div className="product-meta">
                  <span className="product-price">S/ {product.precio}</span>
                  <span className="product-stock">{product.stock} disponibles</span>
                </div>
                <div className="product-details">
                  <span className="product-material">{product.material}</span>
                  <span className="product-type">{product.tipo}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <i className="fas fa-water" style={{fontSize: '4rem', color: '#667eea'}}></i>
            <h3>No hay productos en Sea Collections</h3>
            <p>Comienza agregando el primer producto de la colección marina</p>
            <button className="primary-btn" onClick={handleAddNewProduct}>
              <i className="fas fa-plus"></i> Crear primer producto
            </button>
          </div>
        )}
      </div>

      {/* Modal de gestión (similar al de GestionProductos) */}
      {isManagementOpen && (
        <div className="modal-overlay">
          <div className="modal management-modal">
            <div className="modal-header">
              <h2 className="modal-title">
                <i className={isEditMode ? 'fas fa-edit' : 'fas fa-plus'}></i>
                {isEditMode ? 'Editar Producto' : 'Nuevo Producto'} - Sea Collection
              </h2>
              <button className="close-modal" onClick={() => setIsManagementOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
              {/* Formulario similar al de GestionProductos pero adaptado para Sea Collections */}
              <div className="form-section">
                <h3 className="form-section-title">Información del producto marino</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre del Producto *</label>
                    <input
                      type="text"
                      name="nombreProducto"
                      value={formData.nombreProducto}
                      onChange={handleFormChange}
                      required
                      placeholder="Ej: Collar de conchas marinas"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tipo *</label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="Collar">Collar</option>
                      <option value="Aretes">Aretes</option>
                      <option value="Pulsera">Pulsera</option>
                      <option value="Anillo">Anillo</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleFormChange}
                    required
                    placeholder="Describe el producto inspirado en el mar..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Detalles específicos</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Material *</label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleFormChange}
                      required
                      placeholder="Ej: Plata 925, Conchas naturales"
                    />
                  </div>

                  <div className="form-group">
                    <label>Precio (S/) *</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleFormChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleFormChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Imagen del producto</h3>
                <div className="form-group">
                  <label>Imagen {!formData.imagenUrl && '*'}</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                      id="sea-product-image-upload"
                    />
                    <label htmlFor="sea-product-image-upload" className="file-upload-label">
                      <i className="fas fa-upload"></i>
                      Seleccionar imagen
                    </label>
                  </div>
                  
                  <div className="image-preview">
                    {imagenPreview ? (
                      <img src={imagenPreview} alt="Vista previa" />
                    ) : formData.imagenUrl ? (
                      <img src={obtenerImagen(formData.imagenUrl)} alt="Vista previa" />
                    ) : (
                      <div className="image-preview-placeholder">
                        <i className="fas fa-image"></i>
                        <p>Sin imagen seleccionada</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsManagementOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">
                  {isEditMode ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionSeaCollections;