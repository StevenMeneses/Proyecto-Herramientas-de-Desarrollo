import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionProductos.css';

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
  const [uploadingImage, setUploadingImage] = useState(false);

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
  const SERVER_URL = 'http://localhost:5000';

  // Función para subir imagen al servidor
  const subirImagenAlServidor = async (file) => {
    try {
      setUploadingImage(true);
      console.log('📤 Iniciando subida de imagen...', file.name);
      
      const formData = new FormData();
      formData.append('productImage', file);
      formData.append('category', `category-${categoryId}`);

      const response = await fetch(`${SERVER_URL}/api/upload-product-image`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          imageUrl: result.imageUrl,
          filename: result.filename
        };
      } else {
        throw new Error('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return {
        success: false,
        error: 'Error al subir la imagen al servidor'
      };
    } finally {
      setUploadingImage(false);
    }
  };

  // Función para obtener imagen desde el servidor
  const obtenerImagen = useCallback((imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    
    // Si ya es una URL completa del servidor, usarla directamente
    if (imagePath.includes('http://localhost:5000')) {
      return imagePath;
    }
    
    // Si es una ruta relativa, construir la URL del servidor
    if (imagePath.startsWith('/')) {
      return `${SERVER_URL}${imagePath}`;
    }
    
    return '/images/placeholder-product.jpg';
  }, [SERVER_URL]);

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
        
        // Ya no generamos el nombre aquí, lo hará el servidor
        setFormData(prev => ({
          ...prev,
          imagenUrl: '' // Se establecerá después de subir al servidor
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

      let imagenUrlFinal = formData.imagenUrl;

      // Si hay una nueva imagen, subirla al servidor
      if (imagenFile) {
        setUploadingImage(true);
        const uploadResult = await subirImagenAlServidor(imagenFile);
        
        if (!uploadResult.success) {
          alert(uploadResult.error || 'Error al subir la imagen');
          setUploadingImage(false);
          return;
        }
        
        imagenUrlFinal = uploadResult.imageUrl;
        setUploadingImage(false);
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
            return;
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
        
        const productoActualizado = {
          ...formData,
          imagenUrl: imagenUrlFinal
        };
        
        allProducts[formData.idCategoria].push(productoActualizado);
        
        if (saveProductsToStorage(allProducts)) {
          if (originalCategory === categoryId) {
            setProducts(updatedProducts);
          } else if (parseInt(formData.idCategoria) === categoryId) {
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
          idProducto: maxId + 1,
          imagenUrl: imagenUrlFinal
        };
        
        if (!allProducts[newProduct.idCategoria]) {
          allProducts[newProduct.idCategoria] = [];
        }
        
        allProducts[newProduct.idCategoria].push(newProduct);
        
        if (saveProductsToStorage(allProducts)) {
          if (newProduct.idCategoria === categoryId) {
            setProducts(prev => [...prev, newProduct]);
          }
          alert('Producto creado exitosamente');
        }
      }
      
      setIsManagementOpen(false);
      
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto');
    } finally {
      setUploadingImage(false);
    }
  };

  const canManageProducts = user && (user.idRol === 1 || user.idRol === 2);

  if (isLoading) {
    return (
      <div className="gestion-page">
        <div className="gestion-page-header">
          <h1 className="gestion-page-title">Cargando...</h1>
          <p className="gestion-page-subtitle">Cargando gestión de joyas</p>
        </div>
        <div className="gestion-loading">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    );
  }

  if (user && user.idRol !== 1 && user.idRol !== 2) {
    return (
      <div className="gestion-page">
        <div className="gestion-page-header">
          <h1 className="gestion-page-title">Acceso Denegado</h1>
          <p className="gestion-page-subtitle">No tienes permisos para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-page">
      {/* Header */}
      <div className="gestion-page-header">
        <button 
          className="gestion-back-button"
          onClick={() => navigate('/gestion-ventas')}
        >
          <i className="fas fa-arrow-left"></i> Volver
        </button>
        <div className="gestion-header-content">
          <h1 className="gestion-page-title">
            <i className="fas fa-gem"></i> Gestión de Joyas
          </h1>
          <p className="gestion-page-subtitle">
            Administrando productos como {user?.idRol === 1 ? 'Administrador' : 'Vendedor'}
          </p>
        </div>
        
        <button 
          className="gestion-add-product-btn"
          onClick={handleAddNewProduct}
        >
          <i className="fas fa-plus"></i>
          Nueva Joya
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="gestion-products-filters">
        <div className="gestion-search-filter">
          <div className="gestion-search-with-icon">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar joyas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="gestion-search-input"
            />
          </div>
        </div>
        <div className="gestion-category-filter">
          <button
            className={`gestion-filter-btn ${selectedCollection === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('all')}
          >
            Todas las Joyas
          </button>
          {collections.map(collection => (
            <button
              key={collection}
              className={`gestion-filter-btn ${selectedCollection === collection ? 'active' : ''}`}
              onClick={() => handleCollectionFilter(collection)}
            >
              {collection.charAt(0).toUpperCase() + collection.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="gestion-products-section">
        <h2 className="gestion-section-title">Joyas en {categoryNames[categoryId]}</h2>
        <div className="gestion-products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.idProducto} className="gestion-product-card">
                <div className="gestion-product-image">
                  <img 
                    src={obtenerImagen(product.imagenUrl)} 
                    alt={product.nombreProducto}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                    loading="lazy"
                  />
                  {product.colecciones && product.colecciones.length > 0 && (
                    <span className="gestion-product-badge">
                      {product.colecciones[0]}
                    </span>
                  )}
                  
                  {canManageProducts && (
                    <div className="gestion-product-admin-actions">
                      <button 
                        className="gestion-edit-btn"
                        onClick={() => handleEditProduct(product)}
                        title="Editar joya"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="gestion-delete-btn"
                        onClick={() => handleDeleteProduct(product.idProducto)}
                        title="Eliminar joya"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="gestion-product-info">
                  <h3 className="gestion-product-name">{product.nombreProducto}</h3>
                  <p className="gestion-product-description">{product.descripcion}</p>
                  <div className="gestion-product-meta">
                    <span className="gestion-product-price">S/ {product.precio}</span>
                    <span className="gestion-product-stock">{product.stock} disponibles</span>
                  </div>
                  <div className="gestion-product-category">
                    {categoryNames[product.idCategoria]}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="gestion-empty-state">
              <i className="fas fa-gem gestion-empty-state-icon"></i>
              <h3 className="gestion-empty-state-text">No hay joyas en esta categoría</h3>
              <p className="gestion-empty-state-subtext">Comienza agregando una nueva joya</p>
              <button className="gestion-add-product-btn" onClick={handleAddNewProduct}>
                <i className="fas fa-plus"></i> Crear primera joya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de gestión */}
      {isManagementOpen && (
        <div className="gestion-modal-overlay">
          <div className="gestion-modal">
            <div className="gestion-modal-header">
              <h2 className="gestion-modal-title">
                <i className={isEditMode ? 'fas fa-edit' : 'fas fa-plus'}></i>
                {isEditMode ? 'Editar Joya' : 'Nueva Joya'}
              </h2>
              <button className="gestion-close-modal" onClick={() => setIsManagementOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="gestion-management-form">
              <div className="gestion-form-section">
                <h3 className="gestion-form-section-title">Información básica</h3>
                <div className="gestion-form-row">
                  <div className="gestion-form-group">
                    <label>Nombre de la Joya *</label>
                    <input
                      type="text"
                      name="nombreProducto"
                      value={formData.nombreProducto}
                      onChange={handleFormChange}
                      required
                      placeholder="Ej: Anillo de Plata 925"
                    />
                  </div>

                  <div className="gestion-form-group">
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
                  <div className="gestion-category-change-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Estás cambiando la categoría de esta joya. Se moverá a {categoryNames[formData.idCategoria]} al guardar.</span>
                  </div>
                )}

                <div className="gestion-form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleFormChange}
                    required
                    placeholder="Describe la joya detalladamente..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="gestion-form-section">
                <h3 className="gestion-form-section-title">Precio y Stock</h3>
                <div className="gestion-form-row">
                  <div className="gestion-form-group">
                    <label>Precio (S/) *</label>
                    <div className="gestion-input-with-icon">
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

                  <div className="gestion-form-group">
                    <label>Stock *</label>
                    <div className="gestion-input-with-icon">
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

              <div className="gestion-form-section">
                <h3 className="gestion-form-section-title">Imagen de la Joya</h3>
                <div className="gestion-form-group">
                  <label>Imagen {!formData.imagenUrl && '*'}</label>
                  <div className="gestion-file-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="gestion-file-input"
                      id="gestion-product-image-upload"
                      disabled={uploadingImage}
                    />
                    <label htmlFor="gestion-product-image-upload" className="gestion-file-upload-label">
                      <i className="fas fa-upload"></i>
                      {uploadingImage ? 'Subiendo...' : 'Seleccionar imagen'}
                    </label>
                    <span className="gestion-file-upload-info">Formatos: JPG, PNG, WEBP (Máx. 2MB)</span>
                  </div>
                  
                  <div className="gestion-image-preview">
                    {imagenPreview ? (
                      <>
                        <img src={imagenPreview} alt="Vista previa" />
                        <div className="gestion-image-preview-info">
                          <p>Imagen seleccionada: {imagenFile?.name}</p>
                          <button 
                            type="button" 
                            className="gestion-remove-image-btn"
                            onClick={() => {
                              setImagenPreview(null);
                              setImagenFile(null);
                              setFormData(prev => ({ ...prev, imagenUrl: '' }));
                            }}
                            disabled={uploadingImage}
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
                          className="gestion-remove-image-btn"
                          onClick={() => setFormData(prev => ({ ...prev, imagenUrl: '' }))}
                          disabled={uploadingImage}
                        >
                          <i className="fas fa-times"></i> Eliminar imagen
                        </button>
                      </>
                    ) : (
                      <div className="gestion-image-preview-placeholder">
                        <i className="fas fa-gem"></i>
                        <p>Sin imagen seleccionada</p>
                        <span>La imagen se mostrará aquí</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="gestion-form-section">
                <h3 className="gestion-form-section-title">Colecciones</h3>
                <div className="gestion-collections-section">
                  <p>Selecciona las colecciones a las que pertenece esta joya:</p>
                  <div className="gestion-collections-grid">
                    {collections.map(collection => (
                      <div
                        key={collection}
                        className={`gestion-collection-item ${formData.colecciones.includes(collection) ? 'selected' : ''}`}
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

              <div className="gestion-form-actions">
                <button 
                  type="button" 
                  className="gestion-cancel-btn"
                  onClick={() => setIsManagementOpen(false)}
                  disabled={uploadingImage}
                >
                  <i className="fas fa-times"></i>
                  Cancelar
                </button>
                <button type="submit" className="gestion-submit-btn" disabled={uploadingImage}>
                  <i className="fas fa-save"></i>
                  {uploadingImage ? 'Subiendo imagen...' : (isEditMode ? 'Actualizar Joya' : 'Crear Joya')}
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