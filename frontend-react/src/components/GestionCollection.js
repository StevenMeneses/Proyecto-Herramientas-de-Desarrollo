import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './GestionProductos.css';

const GestionCollection = () => {
  const navigate = useNavigate();
  const { coleccion } = useParams();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProductOriginalTipo, setEditingProductOriginalTipo] = useState(null);
  
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const API_BASE = window.location.hostname.includes('render.com') 
  ? 'https://proyecto-herramientas-de-desarrollo-3.onrender.com'
  : 'http://localhost:8080';

  // NUEVOS CAMPOS PARA FILTROS
  const productTypeOptions = ['Anillo', 'Brazalete', 'Arete', 'Aro', 'Collar'];
  const materialOptions = ['Oro', 'Plata', 'Acero quirúrgico', 'Chapado en oro', 'Otro'];

  // Configuración por TIPO de producto
  const collectionConfig = {
    'SeaCollection': {
      name: 'Sea Collection',
      icon: '🌊',
      color: '#667eea',
      publicPage: '/SeaCollection',
      storageKey: 'sea-collection_products'
    },
    'MataritaCollection': {
      name: 'Matarita Collection',
      icon: '🍹',
      color: '#fd79a8',
      publicPage: '/MataritaCollection',
      storageKey: 'matarita-collection_products'
    },
    'BestSellers': {
      name: 'Best Sellers',
      icon: '⭐',
      color: '#fdcb6e',
      publicPage: '/BestSellers',
      storageKey: 'best-sellers_products'
    }
  };

  // Función para mapear tipo a nombre de carpeta
  const mapTipoToFolderName = (tipo) => {
    const mapping = {
      'SeaCollection': 'sea-collection',
      'MataritaCollection': 'matarita-collection',
      'BestSellers': 'best-sellers'
    };
    return mapping[tipo] || 'sea-collection';
  };

  const tiposProducto = ['SeaCollection', 'MataritaCollection', 'BestSellers'];

  // ESTADO DEL FORMULARIO ACTUALIZADO CON NUEVOS CAMPOS
  const [formData, setFormData] = useState({
    idProducto: '',
    nombreProducto: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    material: materialOptions[0],
    productType: productTypeOptions[0],
    tipo: 'SeaCollection',
    categoria: 'Joyería',
    // NUEVOS CAMPOS PARA DETALLES ADICIONALES
    moreDescription: '',
    productDetails: '',
    jewelryCare: '',
    shippingInfo: ''
  });

  const getConfigByTipo = (tipo) => {
    return collectionConfig[tipo] || {
      name: 'Colección',
      icon: '📦',
      color: '#6c757d',
      publicPage: '/',
      storageKey: 'default_products'
    };
  };

  const currentConfig = getConfigByTipo(formData.tipo);

  // FUNCIÓN PARA SUBIR IMAGEN AL BACKEND
  const subirImagenAlBackend = useCallback(async (file, tipo) => {
    try {
      const formData = new FormData();
      formData.append('productImage', file);
      formData.append('collectionType', tipo);

      console.log('📤 Subiendo imagen al backend...', { 
        tipo, 
        folder: mapTipoToFolderName(tipo),
        file: file.name 
      });

      const response = await fetch('http://localhost:5000/api/upload-product-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Imagen subida exitosamente:', result);
      
      if (result.success && result.imageUrl) {
        return result.imageUrl;
      } else {
        throw new Error('El servidor no devolvió la URL de la imagen');
      }

    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  }, []);

  // Función para obtener imagen - MEJORADA
  const obtenerImagen = useCallback((imagePath, tipo) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    
    // Si ya es una URL completa del backend, devuélvela directamente
    if (imagePath.startsWith('http://localhost:5000')) {
      return imagePath;
    }
    
    // Si es solo el path (ej: /uploads/sea-collection/filename.png)
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    // Si es solo el nombre del archivo, construir la URL con el mapeo correcto
    if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
      const folderName = mapTipoToFolderName(tipo);
      return `http://localhost:5000/uploads/${folderName}/${imagePath}`;
    }
    
    return '/images/placeholder-product.jpg';
  }, []);

  // Cargar TODOS los productos de TODAS las colecciones
  const loadAllProductsFromStorage = useCallback(() => {
    let allProducts = [];
    
    tiposProducto.forEach(tipo => {
      const config = getConfigByTipo(tipo);
      try {
        const storedProducts = localStorage.getItem(config.storageKey);
        if (storedProducts) {
          const productos = JSON.parse(storedProducts);
          // Asegurar que cada producto tenga el tipo correcto
          const productosConTipo = productos.map(producto => ({
            ...producto,
            tipo: tipo,
            // Asegurar que los nuevos campos tengan valores por defecto si no existen
            moreDescription: producto.moreDescription || '',
            productDetails: producto.productDetails || '',
            jewelryCare: producto.jewelryCare || '',
            shippingInfo: producto.shippingInfo || ''
          }));
          allProducts = [...allProducts, ...productosConTipo];
        }
      } catch (error) {
        console.error(`Error cargando productos de ${tipo}:`, error);
      }
    });
    
    return allProducts;
  }, []);

  // ELIMINAR producto de una colección específica
  const deleteProductFromCollection = useCallback((productId, tipo) => {
    try {
      const config = getConfigByTipo(tipo);
      const storedProducts = localStorage.getItem(config.storageKey);
      
      if (storedProducts) {
        let productsArray = JSON.parse(storedProducts);
        productsArray = productsArray.filter(p => p.idProducto !== productId);
        localStorage.setItem(config.storageKey, JSON.stringify(productsArray));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      return false;
    }
  }, []);

  // GUARDAR producto en una colección específica - ACTUALIZADO
  const saveProductToCollection = useCallback((product, targetTipo) => {
    try {
      const config = getConfigByTipo(targetTipo);
      const storedProducts = localStorage.getItem(config.storageKey);
      let productsArray = [];
      
      if (storedProducts) {
        productsArray = JSON.parse(storedProducts);
      }
      
      // Asegurar que el producto tenga todos los campos necesarios
      const productToSave = {
        ...product,
        tipo: targetTipo,
        productType: product.productType || productTypeOptions[0],
        material: product.material || materialOptions[0],
        precio: parseFloat(product.precio) || 0,
        stock: parseInt(product.stock) || 0,
        // Asegurar los nuevos campos
        moreDescription: product.moreDescription || '',
        productDetails: product.productDetails || '',
        jewelryCare: product.jewelryCare || '',
        shippingInfo: product.shippingInfo || ''
      };

      if (product.idProducto) {
        // Buscar si el producto ya existe en esta colección
        const existingIndex = productsArray.findIndex(p => p.idProducto === product.idProducto);
        if (existingIndex !== -1) {
          // Actualizar producto existente
          productsArray[existingIndex] = productToSave;
        } else {
          // Agregar nuevo producto a esta colección
          productsArray.push(productToSave);
        }
      } else {
        // Nuevo producto
        const maxId = Math.max(...productsArray.map(p => parseInt(p.idProducto) || 0), 0);
        const newProduct = { 
          ...productToSave, 
          idProducto: (maxId + 1).toString()
        };
        productsArray.push(newProduct);
      }
      
      localStorage.setItem(config.storageKey, JSON.stringify(productsArray));
      return true;
    } catch (error) {
      console.error('Error guardando producto:', error);
      return false;
    }
  }, []);

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        try {
          const userResponse = await fetch(`${API_BASE}/api/usuario/datos`, {
            credentials: 'include'
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          } else if (userResponse.status === 401) {
            setUser({ idRol: 1 });
          }
        } catch (userError) {
          setUser({ idRol: 1 });
        }

        const allProducts = loadAllProductsFromStorage();
        setProducts(allProducts);
        setFilteredProducts(allProducts);

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loadAllProductsFromStorage]);

  // Filtrar productos
  useEffect(() => {
    const filtered = products.filter(product => 
      product.nombreProducto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // FUNCIÓN MEJORADA PARA SUBIR IMAGEN CON BOTÓN
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagenPreview(e.target.result);
      setImagenFile(file);
    };
    
    reader.readAsDataURL(file);
  };

  // FUNCIÓN PARA ACTIVAR EL INPUT FILE AL HACER CLICK EN EL BOTÓN
  const triggerFileInput = () => {
    const fileInput = document.getElementById('image-upload-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleEditProduct = (product) => {
    setFormData({ 
      ...product,
      productType: product.productType || productTypeOptions[0],
      material: product.material || materialOptions[0],
      // Asegurar los nuevos campos
      moreDescription: product.moreDescription || '',
      productDetails: product.productDetails || '',
      jewelryCare: product.jewelryCare || '',
      shippingInfo: product.shippingInfo || ''
    });
    setEditingProductOriginalTipo(product.tipo);
    setIsEditMode(true);
    setIsManagementOpen(true);
    
    if (product.imagenUrl) {
      const imagenExistente = obtenerImagen(product.imagenUrl, product.tipo);
      setImagenPreview(imagenExistente);
    } else {
      setImagenPreview(null);
    }
    setImagenFile(null);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`¿Eliminar producto de ${getConfigByTipo(product.tipo).name}?`)) {
      try {
        if (deleteProductFromCollection(product.idProducto, product.tipo)) {
          const updatedProducts = products.filter(p => p.idProducto !== product.idProducto);
          setProducts(updatedProducts);
          alert('Producto eliminado');
        }
      } catch (error) {
        alert('Error al eliminar');
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
      material: materialOptions[0],
      productType: productTypeOptions[0],
      tipo: 'SeaCollection',
      categoria: 'Joyería',
      // NUEVOS CAMPOS INICIALIZADOS
      moreDescription: '',
      productDetails: '',
      jewelryCare: '',
      shippingInfo: ''
    });
    setEditingProductOriginalTipo(null);
    setIsEditMode(false);
    setIsManagementOpen(true);
    setImagenPreview(null);
    setImagenFile(null);
  };

  // GUARDAR PRODUCTO - COMPLETAMENTE ACTUALIZADO PARA USAR BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombreProducto.trim()) { 
      alert('El nombre del producto es requerido'); 
      return;
    }
    
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert('El stock no puede ser negativo');
      return;
    }

    if (!formData.imagenUrl && !imagenFile) {
      alert('Por favor selecciona una imagen para el producto');
      return;
    }

    try {
      let imagenUrlFinal = formData.imagenUrl;

      // Guardar imagen en el BACKEND si hay archivo nuevo
      if (imagenFile) {
        setUploadingImage(true);
        console.log('🔄 Subiendo nueva imagen al backend...');
        
        try {
          // Subir al backend
          const imagenUrlBackend = await subirImagenAlBackend(imagenFile, formData.tipo);
          imagenUrlFinal = imagenUrlBackend;
          console.log('✅ Imagen subida, URL final:', imagenUrlFinal);
        } catch (uploadError) {
          console.error('❌ Error en subida de imagen:', uploadError);
          throw new Error(`No se pudo subir la imagen: ${uploadError.message}`);
        } finally {
          setUploadingImage(false);
        }
      } else if (!imagenUrlFinal) {
        alert('Por favor selecciona una imagen para el producto');
        return;
      }

      // Preparar datos del producto con la URL del backend
      const productData = {
        ...formData,
        imagenUrl: imagenUrlFinal,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      };

      console.log('💾 Guardando producto:', {
        ...productData,
        folder: mapTipoToFolderName(formData.tipo)
      });

      if (isEditMode) {
        // MODO EDICIÓN
        const originalTipo = editingProductOriginalTipo;
        const nuevoTipo = formData.tipo;

        if (originalTipo === nuevoTipo) {
          // Mismo tipo: solo actualizar
          saveProductToCollection(productData, nuevoTipo);
        } else {
          // Diferente tipo: eliminar del original y agregar al nuevo
          deleteProductFromCollection(formData.idProducto, originalTipo);
          saveProductToCollection(productData, nuevoTipo);
        }
      } else {
        // MODO NUEVO: guardar en la colección seleccionada
        saveProductToCollection(productData, formData.tipo);
      }

      // Recargar todos los productos
      const allProducts = loadAllProductsFromStorage();
      setProducts(allProducts);
      
      alert(`Producto ${isEditMode ? 'actualizado' : 'creado'} exitosamente en ${currentConfig.name}`);
      setIsManagementOpen(false);
      
    } catch (error) {
      console.error('❌ Error al guardar el producto:', error);
      setUploadingImage(false);
      alert('Error al guardar el producto: ' + error.message);
    }
  };

  if (isLoading) return <div className="loading">Cargando productos...</div>;

  if (user && user.idRol && user.idRol !== 1 && user.idRol !== 2) {
    return (
      <div className="products-page">
        <div className="page-header">
          <h1 className="page-title">Acceso Denegado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-collection-container">
      {/* Header */}
      <div className="gestion-page-header" style={{borderBottom: `4px solid #6c757d`}}>
        <button className="gestion-back-button" onClick={() => navigate('/gestion-ventas')}>
          <i className="fas fa-arrow-left"></i> Volver
        </button>
        <div className="gestion-header-content">
          <h1 className="gestion-page-title">
            <span style={{fontSize: '2rem', marginRight: '0.5rem'}}>📦</span>
            Gestión General de Productos
          </h1>
          <p className="gestion-page-subtitle">
            Gestiona todos los productos de todas las colecciones
          </p>
        </div>
        
        <button 
          className="gestion-add-product-btn"
          onClick={handleAddNewProduct}
          style={{backgroundColor: '#6c757d'}}
        >
          <i className="fas fa-plus"></i> Nuevo Producto
        </button>
      </div>

      {/* Búsqueda */}
      <div className="gestion-products-filters">
        <div className="gestion-search-filter">
          <div className="gestion-search-with-icon">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar por nombre, descripción, tipo o material..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="gestion-search-input"
            />
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="gestion-products-section">
        <div className="gestion-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            const productConfig = getConfigByTipo(product.tipo);
            return (
              <div key={`${product.tipo}-${product.idProducto}`} className="gestion-product-card">
                <div className="gestion-product-image">
                  <img 
                    src={obtenerImagen(product.imagenUrl, product.tipo)} 
                    alt={product.nombreProducto}
                    onError={(e) => e.target.src = '/images/placeholder-product.jpg'}
                  />
                  <span className="gestion-product-badge" style={{backgroundColor: productConfig.color}}>
                    {productConfig.name}
                  </span>
                  
                  <div className="gestion-product-admin-actions">
                    <button className="gestion-edit-btn" onClick={() => handleEditProduct(product)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="gestion-delete-btn" onClick={() => handleDeleteProduct(product)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <div className="gestion-product-info">
                  <h3 className="gestion-product-name">{product.nombreProducto}</h3>
                  <p className="gestion-product-description">{product.descripcion}</p>
                  <div className="gestion-product-meta">
                    <span className="gestion-product-price">S/ {product.precio}</span>
                    <span className="gestion-product-stock">{product.stock} disponibles</span>
                  </div>
                  <div className="gestion-product-details">
                    <span className="gestion-product-material">{product.material}</span>
                    <span className="gestion-product-type">{product.productType}</span>
                    <span className="gestion-product-collection" style={{color: productConfig.color}}>
                      {productConfig.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
            <div className="gestion-empty-state">
            <span className="gestion-empty-state-icon">📦</span>
            <h3 className="gestion-empty-state-text">No hay productos</h3>
            <p className="gestion-empty-state-subtext">Crea el primer producto para comenzar</p>
            <button className="gestion-add-product-btn" onClick={handleAddNewProduct}>
              <i className="fas fa-plus"></i> Crear primer producto
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
              <span style={{marginRight: '0.5rem'}}>{currentConfig.icon}</span>
              {isEditMode ? 'Editar' : 'Nuevo'} Producto - {currentConfig.name}
            </h2>
            <button className="gestion-close-modal" onClick={() => setIsManagementOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

            <form onSubmit={handleSubmit} className="gestion-management-form">
              <div className="form-section">
                <h3 className="form-section-title">Información del producto</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input 
                      type="text" 
                      name="nombreProducto" 
                      value={formData.nombreProducto} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Colección *</label>
                    <select name="tipo" value={formData.tipo} onChange={handleFormChange} required>
                      {tiposProducto.map(tipo => {
                        const config = getConfigByTipo(tipo);
                        return (
                          <option key={tipo} value={tipo}>
                            {config.name}
                          </option>
                        );
                      })}
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
                    rows="3" 
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Detalles del Producto</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Producto *</label>
                    <select 
                      name="productType" 
                      value={formData.productType} 
                      onChange={handleFormChange} 
                      required
                    >
                      {productTypeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Material *</label>
                    <select 
                      name="material" 
                      value={formData.material} 
                      onChange={handleFormChange} 
                      required
                    >
                      {materialOptions.map(material => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Precio (S/) *</label>
                    <input 
                      type="number" 
                      name="precio" 
                      value={formData.precio} 
                      onChange={handleFormChange} 
                      step="0.01" 
                      required 
                      min="0"
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
                <div className="form-group">
                  <label>Categoría del Producto *</label>
                  <input 
                    type="text" 
                    name="categoria" 
                    value={formData.categoria} 
                    onChange={handleFormChange}
                    required
                    placeholder="Ej: Joyería, Accesorios, etc."
                  />
                </div>
              </div>

              {/* NUEVA SECCIÓN: INFORMACIÓN ADICIONAL DEL PRODUCTO */}
              <div className="form-section">
                <h3 className="form-section-title">Información Adicional del Producto</h3>
                
                <div className="form-group">
                  <label>More Description</label>
                  <textarea 
                    name="moreDescription" 
                    value={formData.moreDescription} 
                    onChange={handleFormChange} 
                    rows="3" 
                    placeholder="Descripción adicional detallada del producto..."
                  />
                </div>

                <div className="form-group">
                  <label>Product Details</label>
                  <textarea 
                    name="productDetails" 
                    value={formData.productDetails} 
                    onChange={handleFormChange} 
                    rows="3" 
                    placeholder="Detalles técnicos, especificaciones, medidas, etc."
                  />
                </div>

                <div className="form-group">
                  <label>Jewelry Care</label>
                  <textarea 
                    name="jewelryCare" 
                    value={formData.jewelryCare} 
                    onChange={handleFormChange} 
                    rows="3" 
                    placeholder="Instrucciones de cuidado y mantenimiento..."
                  />
                </div>

                <div className="form-group">
                  <label>Shipping Info</label>
                  <textarea 
                    name="shippingInfo" 
                    value={formData.shippingInfo} 
                    onChange={handleFormChange} 
                    rows="3" 
                    placeholder="Información de envío, tiempos de entrega, políticas..."
                  />
                </div>
              </div>

              {/* SECCIÓN DE IMAGEN MEJORADA CON BOTÓN */}
              <div className="form-section">
                <h3 className="form-section-title">Imagen del Producto</h3>
                <div className="form-group">
                  <label>Imagen del Producto *</label>
                  
                  {/* Input file oculto */}
                  <input 
                    type="file" 
                    id="image-upload-input"
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }}
                    disabled={uploadingImage}
                  />
                  
                  {/* Botón para subir imagen */}
                  <button 
                    type="button" 
                    className="image-upload-button"
                    onClick={triggerFileInput}
                    disabled={uploadingImage}
                    style={{ 
                      backgroundColor: uploadingImage ? '#ccc' : currentConfig.color,
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      cursor: uploadingImage ? 'not-allowed' : 'pointer',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className={`fas ${uploadingImage ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
                    {uploadingImage ? 'Subiendo...' : (imagenFile ? 'Cambiar Imagen' : 'Seleccionar Imagen')}
                  </button>
                  
                  {/* Información del archivo seleccionado */}
                  {imagenFile && (
                    <div className="file-info" style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '5px',
                      marginBottom: '15px'
                    }}>
                      <strong>Archivo seleccionado:</strong> {imagenFile.name}
                      <br />
                      <small>Tamaño: {(imagenFile.size / 1024 / 1024).toFixed(2)} MB</small>
                      <br />
                      <small style={{color: 'green'}}>✅ Esta imagen se guardará en: uploads/{mapTipoToFolderName(formData.tipo)}/</small>
                    </div>
                  )}
                  
                  {/* Vista previa de la imagen */}
                  <div className="image-preview-container">
                    <h4>Vista previa:</h4>
                    <div className="image-preview">
                      {imagenPreview ? (
                        <img src={imagenPreview} alt="Vista previa" style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '5px' 
                        }} />
                      ) : formData.imagenUrl ? (
                        <img 
                          src={obtenerImagen(formData.imagenUrl, formData.tipo)} 
                          alt="Imagen actual" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '200px', 
                            borderRadius: '5px' 
                          }} 
                        />
                      ) : (
                        <div className="image-preview-placeholder" style={{
                          width: '100%',
                          height: '150px',
                          border: '2px dashed #ccc',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          color: '#666'
                        }}>
                          <i className="fas fa-image" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                          <span>No hay imagen seleccionada</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="image-help" style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    marginTop: '10px' 
                  }}>
                    Formatos aceptados: JPG, PNG, WEBP. Tamaño máximo: 5MB
                    <br />
                    <strong>✅ Las imágenes se guardan en: uploads/{mapTipoToFolderName(formData.tipo)}/</strong>
                  </p>
                </div>
              </div>

              <div className="form-info">
                <p><strong>Colección seleccionada:</strong> {currentConfig.name}</p>
                <p><strong>Carpeta de destino:</strong> uploads/{mapTipoToFolderName(formData.tipo)}/</p>
                {isEditMode && editingProductOriginalTipo && editingProductOriginalTipo !== formData.tipo && (
                  <p style={{color: 'orange'}}>
                    <strong>⚠️ Atención:</strong> El producto se moverá de {getConfigByTipo(editingProductOriginalTipo).name} a {currentConfig.name}
                  </p>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsManagementOpen(false)} disabled={uploadingImage}>
                  Cancelar
                </button>
                <button type="submit" className="submit-btn" style={{backgroundColor: currentConfig.color}} disabled={uploadingImage}>
                  {uploadingImage ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Subiendo...
                    </>
                  ) : (
                    `${isEditMode ? 'Actualizar' : 'Crear'} en ${currentConfig.name}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCollection;