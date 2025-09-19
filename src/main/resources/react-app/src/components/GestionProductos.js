import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const GestionProductos = ({ categoria }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para manejo de imágenes
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);

  // Mapeo de categorías a IDs
  const categoryMap = {
    'anillos': 1,
    'aretes': 2,
    'brazaletes': 3,
    'aros': 4,
    'collares': 5
  };
  
  const categoryId = categoryMap[categoria] || 1;
  const categoryNames = {
    1: 'Anillos',
    2: 'Aretes', 
    3: 'Brazaletes',
    4: 'Aros',
    5: 'Collares'
  };

  // Datos del formulario de gestión
  const [formData, setFormData] = useState({
    idProducto: '',
    nombreProducto: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    idCategoria: categoryId,
    colecciones: []
  });

  // Estado para controlar la categoría original durante la edición
  const [originalCategory, setOriginalCategory] = useState(categoryId);

  // Claves para localStorage
  const STORAGE_KEY = 'joyeria_productos';
  const IMAGES_STORAGE_KEY = 'joyeria_imagenes';

  // Función para obtener imagen desde localStorage o ruta
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

  // Cargar datos desde localStorage
  const loadProductsFromStorage = useCallback(() => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY);
      if (storedProducts) {
        return JSON.parse(storedProducts);
      }
    } catch (error) {
      console.error('Error al cargar productos desde localStorage:', error);
    }
    
    // Datos iniciales por defecto si no hay nada en localStorage
    const initialProducts = {
      1: [], 2: [], 3: [], 4: [], 5: []
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }, []);

  // Guardar productos en localStorage
  const saveProductsToStorage = useCallback((productsData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productsData));
      return true;
    } catch (error) {
      console.error('Error al guardar productos en localStorage:', error);
      return false;
    }
  }, []);

  // Guardar imagen en localStorage
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
        } else {
          setUser({ idRol: 1, nombre: 'Administrador' });
        }

        // Cargar productos
        const storedProducts = loadProductsFromStorage();
        const categoryProducts = storedProducts[categoryId] || [];
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
        
        // Cargar colecciones y categorías
        setCollections(['nueva', 'exclusivo', 'clasico', 'limitado', 'oferta']);
        setCategories([
          { id: 1, nombre: 'Anillos' },
          { id: 2, nombre: 'Aretes' },
          { id: 3, nombre: 'Brazaletes' },
          { id: 4, nombre: 'Aros' },
          { id: 5, nombre: 'Collares' }
        ]);

      } catch (error) {
        console.error('Error cargando datos:', error);
        setUser({ idRol: 1, nombre: 'Administrador' });
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId, loadProductsFromStorage]);

  // Filtrar productos
  useEffect(() => {
    let filtered = products.filter(product => 
      product.nombreProducto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCollection !== 'all') {
      filtered = filtered.filter(product => 
        product.colecciones && product.colecciones.includes(selectedCollection)
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCollection, products]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCollectionFilter = (collection) => {
    setSelectedCollection(collection);
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
        
        // Generar nombre único para la imagen
        const timestamp = new Date().getTime();
        const extension = file.name.split('.').pop();
        const fileName = `producto_${timestamp}.${extension}`;
        
        setFormData(prev => ({
          ...prev,
          imagenUrl: `/images/productos/${fileName}`
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

  const handleEditProduct = (product) => {
    setFormData({
      idProducto: product.idProducto,
      nombreProducto: product.nombreProducto,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      imagenUrl: product.imagenUrl,
      idCategoria: product.idCategoria,
      colecciones: product.colecciones || []
    });
    // Guardar la categoría original para referencia
    setOriginalCategory(product.idCategoria);
    setIsEditMode(true);
    setIsManagementOpen(true);
    setImagenPreview(null);
    setImagenFile(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const allProducts = loadProductsFromStorage();
        const updatedProducts = allProducts[categoryId].filter(p => p.idProducto !== productId);
        allProducts[categoryId] = updatedProducts;
        
        if (saveProductsToStorage(allProducts)) {
          setProducts(updatedProducts);
          alert('Producto eliminado exitosamente');
        } else {
          alert('Error al guardar los cambios');
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
      idCategoria: categoryId,
      colecciones: []
    });
    // Establecer la categoría original como la categoría actual
    setOriginalCategory(categoryId);
    setIsEditMode(false);
    setIsManagementOpen(true);
    setImagenPreview(null);
    setImagenFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validaciones básicas
      if (!formData.nombreProducto || !formData.precio || !formData.stock) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }

      // Si hay una nueva imagen, guardarla
      if (imagenFile) {
        const guardadoExitoso = await guardarImagenEnStorage(imagenFile, formData.imagenUrl);
        if (!guardadoExitoso) {
          alert('Error al guardar la imagen');
          return;
        }
      }

      const allProducts = loadProductsFromStorage();
      
      if (isEditMode) {
        // Si la categoría cambió, mostrar confirmación
        const categoriaCambio = originalCategory !== parseInt(formData.idCategoria);
        
        if (categoriaCambio) {
          const confirmar = window.confirm(
            `¿Estás seguro de que quieres mover este producto a la categoría ${categoryNames[formData.idCategoria]}?`
          );
          
          if (!confirmar) {
            return; // Cancelar si el usuario no confirma
          }
        }
        
        // Actualizar producto existente
        const updatedProducts = allProducts[originalCategory].filter(p => 
          p.idProducto !== formData.idProducto
        );
        
        allProducts[originalCategory] = updatedProducts;
        
        // Agregar el producto a la nueva categoría
        if (!allProducts[formData.idCategoria]) {
          allProducts[formData.idCategoria] = [];
        }
        
        allProducts[formData.idCategoria].push(formData);
        
        if (saveProductsToStorage(allProducts)) {
          // Si estamos en la categoría original, actualizar la vista
          if (originalCategory === categoryId) {
            setProducts(updatedProducts);
          }
          // Si estamos en la nueva categoría, recargar los productos
          else if (parseInt(formData.idCategoria) === categoryId) {
            setProducts(allProducts[categoryId]);
          }
          
          alert('Producto actualizado exitosamente');
        }
      } else {
        // Crear nuevo producto
        let maxId = 0;
        Object.values(allProducts).forEach(categoryProducts => {
          categoryProducts.forEach(product => {
            if (product.idProducto > maxId) maxId = product.idProducto;
          });
        });
        
        const newProduct = {
          ...formData,
          idProducto: maxId + 1
        };
        
        if (!allProducts[newProduct.idCategoria]) {
          allProducts[newProduct.idCategoria] = [];
        }
        
        allProducts[newProduct.idCategoria].push(newProduct);
        
        if (saveProductsToStorage(allProducts)) {
          // Si estamos en la categoría del nuevo producto, actualizar la vista
          if (newProduct.idCategoria === categoryId) {
            setProducts(prev => [...prev, newProduct]);
          }
          alert('Producto creado exitosamente');
        }
      }
      
      // Cerrar modal
      setIsManagementOpen(false);
      
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const canManageProducts = user && (user.idRol === 1 || user.idRol === 2);

  if (isLoading) {
    return (
      <div className="products-page">
        <div className="page-header">
          <h1 className="page-title">Cargando...</h1>
          <p className="page-subtitle">Cargando productos de {categoryNames[categoryId]}</p>
        </div>
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    );
  }

  if (user && user.idRol !== 1 && user.idRol !== 2) {
    return (
      <div className="products-page">
        <div className="page-header">
          <h1 className="page-title">Acceso Denegado</h1>
          <p className="page-subtitle">No tienes permisos para acceder a esta sección</p>
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
          <i className="fas fa-arrow-left"></i> Volver
        </button>
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-cog"></i> Gestión de {categoryNames[categoryId]}
          </h1>
          <p className="page-subtitle">
            Administrando productos como {user?.idRol === 1 ? 'Administrador' : 'Vendedor'}
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

      {/* Filtros y búsqueda */}
      <div className="products-filters">
        <div className="search-filter">
          <div className="search-with-icon">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
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
                  loading="lazy"
                />
                {product.colecciones && product.colecciones.length > 0 && (
                  <span className="product-badge">
                    {product.colecciones[0]}
                  </span>
                )}
                
                {/* Botones de acción para administradores */}
                {canManageProducts && (
                  <div className="product-admin-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditProduct(product)}
                      title="Editar producto"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.idProducto)}
                      title="Eliminar producto"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.nombreProducto}</h3>
                <p className="product-description">{product.descripcion}</p>
                <div className="product-meta">
                  <span className="product-price">S/ {product.precio}</span>
                  <span className="product-stock">{product.stock} disponibles</span>
                </div>
                <div className="product-category-badge">
                  {categoryNames[product.idCategoria]}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <i className="fas fa-inbox"></i>
            <h3>No hay productos en esta categoría</h3>
            <p>Comienza agregando un nuevo producto</p>
            <button className="primary-btn" onClick={handleAddNewProduct}>
              <i className="fas fa-plus"></i> Crear primer producto
            </button>
          </div>
        )}
      </div>

      {/* Modal de gestión */}
      {isManagementOpen && (
        <div className="modal-overlay">
          <div className="modal management-modal">
            <div className="modal-header">
              <h2 className="modal-title">
                <i className={isEditMode ? 'fas fa-edit' : 'fas fa-plus'}></i>
                {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button className="close-modal" onClick={() => setIsManagementOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
              <div className="form-section">
                <h3 className="form-section-title">Información básica</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre del Producto *</label>
                    <input
                      type="text"
                      name="nombreProducto"
                      value={formData.nombreProducto}
                      onChange={handleFormChange}
                      required
                      placeholder="Ej: Anillo de Plata 925"
                    />
                  </div>

                  <div className="form-group">
                    <label>Categoría *</label>
                    <select
                      name="idCategoria"
                      value={formData.idCategoria}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isEditMode && originalCategory !== parseInt(formData.idCategoria) && (
                  <div className="category-change-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Estás cambiando la categoría de este producto. Se moverá a {categoryNames[formData.idCategoria]} al guardar.</span>
                  </div>
                )}

                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleFormChange}
                    required
                    placeholder="Describe el producto detalladamente..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Precio y Stock</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Precio (S/) *</label>
                    <div className="input-with-icon">
                      <i className="fas fa-tag"></i>
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleFormChange}
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Stock *</label>
                    <div className="input-with-icon">
                      <i className="fas fa-box"></i>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleFormChange}
                        min="0"
                        required
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Imagen del Producto</h3>
                <div className="form-group">
                  <label>Imagen {!formData.imagenUrl && '*'}</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                      id="product-image-upload"
                    />
                    <label htmlFor="product-image-upload" className="file-upload-label">
                      <i className="fas fa-upload"></i>
                      Seleccionar imagen
                    </label>
                    <span className="file-upload-info">Formatos: JPG, PNG, WEBP (Máx. 2MB)</span>
                  </div>
                  
                  <div className="image-preview">
                    {imagenPreview ? (
                      <>
                        <img src={imagenPreview} alt="Vista previa" />
                        <div className="image-preview-info">
                          <p>Imagen seleccionada: {imagenFile?.name}</p>
                          <button 
                            type="button" 
                            className="remove-image-btn"
                            onClick={() => {
                              setImagenPreview(null);
                              setImagenFile(null);
                              setFormData(prev => ({ ...prev, imagenUrl: '' }));
                            }}
                          >
                            <i className="fas fa-times"></i> Cambiar imagen
                          </button>
                        </div>
                      </>
                    ) : formData.imagenUrl ? (
                      <>
                        <img src={obtenerImagen(formData.imagenUrl)} alt="Vista previa" />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => setFormData(prev => ({ ...prev, imagenUrl: '' }))}
                        >
                          <i className="fas fa-times"></i> Eliminar imagen
                        </button>
                      </>
                    ) : (
                      <div className="image-preview-placeholder">
                        <i className="fas fa-image"></i>
                        <p>Sin imagen seleccionada</p>
                        <span>La imagen se mostrará aquí</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Colecciones</h3>
                <div className="collections-section">
                  <p>Selecciona las colecciones a las que pertenece este producto:</p>
                  <div className="collections-grid">
                    {collections.map(collection => (
                      <div
                        key={collection}
                        className={`collection-item ${formData.colecciones.includes(collection) ? 'selected' : ''}`}
                        onClick={() => handleCollectionToggle(collection)}
                      >
                        {collection}
                        {formData.colecciones.includes(collection) && (
                          <i className="fas fa-check"></i>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsManagementOpen(false)}
                >
                  <i className="fas fa-times"></i>
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">
                  <i className="fas fa-save"></i>
                  {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;