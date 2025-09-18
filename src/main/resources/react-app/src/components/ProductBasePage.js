import React, { useState, useEffect, useCallback, useContext } from 'react';
import './Products.css';
import { CartContext } from '../context/CartContext'; // Corregido el nombre
import { FavoritesContext } from '../context/FavoriteContext'; // Asegúrate que el archivo se

const ProductBasePage = ({ category, title, subtitle }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavoritesContext);

  // Datos del formulario de gestión
  const [formData, setFormData] = useState({
    idProducto: '',
    nombreProducto: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    idCategoria: category,
    colecciones: []
  });

  // Clave para localStorage
  const STORAGE_KEY = 'joyeria_productos';

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
      1: [ // Anillos
        {
          idProducto: 1,
          nombreProducto: 'Anillo de Plata 925',
          descripcion: 'Hermoso anillo de plata con detalles artesanales',
          precio: 89.99,
          stock: 15,
          imagenUrl: '/images/anillo-plata.jpg',
          idCategoria: 1,
          colecciones: ['nueva', 'exclusivo']
        }
      ],
      2: [ // Aretes
        {
          idProducto: 3,
          nombreProducto: 'Aretes de Oro',
          descripcion: 'Elegantes aretes de oro 18k',
          precio: 149.99,
          stock: 12,
          imagenUrl: '/images/aretes-oro.jpg',
          idCategoria: 2,
          colecciones: ['clasico']
        }
      ],
      3: [ // Brazaletes
        {
          idProducto: 5,
          nombreProducto: 'Brazalete de Oro',
          descripcion: 'Brazalete elegante de oro para ocasiones especiales',
          precio: 199.99,
          stock: 6,
          imagenUrl: '/images/brazalete-oro.jpg',
          idCategoria: 3,
          colecciones: ['exclusivo']
        }
      ],
      4: [ // Aros
        {
          idProducto: 6,
          nombreProducto: 'Aros de Titanio',
          descripcion: 'Aros modernos de titanio hipoalergénicos',
          precio: 59.99,
          stock: 25,
          imagenUrl: '/images/aros-titanio.jpg',
          idCategoria: 4,
          colecciones: ['nueva']
        }
      ],
      5: [ // Collares
        {
          idProducto: 7,
          nombreProducto: 'Collar de Perlas',
          descripcion: 'Collar elegante con perlas naturales',
          precio: 129.99,
          stock: 10,
          imagenUrl: '/images/collar-perlas.jpg',
          idCategoria: 5,
          colecciones: ['clasico']
        }
      ]
    };
    
    // Guardar datos iniciales
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }, []);

  // Guardar productos en localStorage
  const saveProductsToStorage = useCallback((productsData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productsData));
    } catch (error) {
      console.error('Error al guardar productos en localStorage:', error);
      alert('Error al guardar los cambios. Los datos podrían ser demasiado grandes.');
    }
  }, []);

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos del usuario
        const userResponse = await fetch('http://localhost:8080/api/usuario/datos', {
          credentials: 'include'
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          // Usuario mock para desarrollo
          setUser({ idRol: 1, nombre: 'Administrador' });
        }

        // Cargar productos desde localStorage
        await fetchProducts();
        
        // Cargar colecciones
        await fetchCollections();
        
        // Cargar categorías
        await fetchCategories();

      } catch (error) {
        console.error('Error cargando datos:', error);
        // Datos mock para desarrollo cuando hay error
        setUser({ idRol: 1, nombre: 'Administrador' });
        await fetchProducts();
        await fetchCollections();
        await fetchCategories();
      }
    };

    fetchData();
  }, [category, loadProductsFromStorage]);

  const fetchProducts = useCallback(async () => {
    try {
      // Cargar desde localStorage
      const storedProducts = loadProductsFromStorage();
      const categoryProducts = storedProducts[category] || [];
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
    } catch (error) {
      console.error('Error cargando productos:', error);
      const emptyProducts = [];
      setProducts(emptyProducts);
      setFilteredProducts(emptyProducts);
    }
  }, [category, loadProductsFromStorage]);

  const fetchCollections = useCallback(async () => {
    try {
      // Usar datos mock para desarrollo
      const mockCollections = ['nueva', 'exclusivo', 'clasico', 'limitado', 'oferta'];
      setCollections(mockCollections);
    } catch (error) {
      console.error('Error cargando colecciones:', error);
      const mockCollections = ['nueva', 'exclusivo', 'clasico', 'limitado', 'oferta'];
      setCollections(mockCollections);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      // Usar datos mock para desarrollo
      const mockCategories = [
        { id: 1, nombre: 'Anillos' },
        { id: 2, nombre: 'Aretes' },
        { id: 3, nombre: 'Brazaletes' },
        { id: 4, nombre: 'Aros' },
        { id: 5, nombre: 'Collares' }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      const mockCategories = [
        { id: 1, nombre: 'Anillos' },
        { id: 2, nombre: 'Aretes' },
        { id: 3, nombre: 'Brazaletes' },
        { id: 4, nombre: 'Aros' },
        { id: 5, nombre: 'Collares' }
      ];
      setCategories(mockCategories);
    }
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtered = products.filter(product => 
      product.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCollection !== 'all') {
      filtered = filtered.filter(product => 
        product.colecciones && product.colecciones.includes(selectedCollection)
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCollection, products]);

  // Manejador de errores de imagen optimizado
  const handleImageError = useCallback((idProducto, e) => {
    // Solo procesar si la imagen aún no ha sido marcada como errónea
    if (!imageErrors.has(idProducto)) {
      e.target.src = '/images/placeholder-product.jpg';
      setImageErrors(prev => new Set(prev).add(idProducto));
    }
  }, [imageErrors]);

  // Handlers
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

    const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleToggleFavorite = (product) => {
    if (isFavorite(product.idProducto)) {
      removeFromFavorites(product.idProducto);
    } else {
      addToFavorites(product);
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
      idCategoria: product.idCategoria,
      colecciones: product.colecciones || []
    });
    setIsEditMode(true);
    setIsManagementOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        // Cargar todos los productos
        const allProducts = loadProductsFromStorage();
        
        // Encontrar la categoría del producto a eliminar
        let productCategory = category;
        if (!allProducts[category]?.some(p => p.idProducto === productId)) {
          // Si no está en la categoría actual, buscar en todas las categorías
          for (const cat in allProducts) {
            if (allProducts[cat].some(p => p.idProducto === productId)) {
              productCategory = parseInt(cat);
              break;
            }
          }
        }
        
        // Filtrar el producto eliminado
        const updatedCategoryProducts = allProducts[productCategory].filter(p => p.idProducto !== productId);
        
        // Actualizar el almacenamiento
        allProducts[productCategory] = updatedCategoryProducts;
        saveProductsToStorage(allProducts);
        
        // Actualizar el estado
        if (parseInt(category) === productCategory) {
          setProducts(updatedCategoryProducts);
        }
        
        alert('Producto eliminado exitosamente');
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
      idCategoria: category,
      colecciones: []
    });
    setIsEditMode(false);
    setIsManagementOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Cargar todos los productos existentes
      const allProducts = loadProductsFromStorage();
      
      if (isEditMode) {
        // Actualizar producto existente
        const updatedProducts = allProducts[formData.idCategoria].map(p => 
          p.idProducto === formData.idProducto ? { ...p, ...formData } : p
        );
        
        // Si cambió de categoría, mover el producto
        if (formData.idCategoria !== category) {
          // Eliminar de la categoría anterior
          allProducts[category] = allProducts[category].filter(p => p.idProducto !== formData.idProducto);
          // Agregar a la nueva categoría
          allProducts[formData.idCategoria] = updatedProducts;
        } else {
          allProducts[formData.idCategoria] = updatedProducts;
        }
        
        // Guardar cambios
        saveProductsToStorage(allProducts);
        
        // Actualizar estado si estamos en la misma categoría
        if (formData.idCategoria === category) {
          setProducts(updatedProducts);
        }
        
        alert('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        // Encontrar el ID más alto en todas las categorías
        let maxId = 0;
        Object.values(allProducts).forEach(categoryProducts => {
          categoryProducts.forEach(product => {
            if (product.idProducto > maxId) {
              maxId = product.idProducto;
            }
          });
        });
        
        const newProduct = {
          ...formData,
          idProducto: maxId + 1
        };
        
        // Agregar a la categoría correspondiente
        if (!allProducts[newProduct.idCategoria]) {
          allProducts[newProduct.idCategoria] = [];
        }
        
        allProducts[newProduct.idCategoria].push(newProduct);
        
        // Guardar cambios
        saveProductsToStorage(allProducts);
        
        // Actualizar estado si estamos en la misma categoría
        if (newProduct.idCategoria === category) {
          setProducts(prev => [...prev, newProduct]);
        }
        
        alert('Producto creado exitosamente');
      }
      
      setIsManagementOpen(false);
      setFormData({
        idProducto: '',
        nombreProducto: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagenUrl: '',
        idCategoria: category,
        colecciones: []
      });
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto');
    }
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.idProducto} className="product-card">
              <div className="product-image">
                <img 
                  src={product.imagenUrl || '/images/placeholder-product.jpg'} 
                  alt={product.nombreProducto}
                  onError={(e) => handleImageError(product.idProducto, e)}
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
                <div className="product-actions">
                  <button 
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
            <p>Intenta con otros términos de búsqueda o filtros diferentes</p>
          </div>
        )}
      </div>

      {/* Sección de gestión para administradores/vendedores */}
      {canManageProducts && (
        <div className="management-section">
          <div className="management-header">
            <h2 className="management-title">Gestión de Productos</h2>
            <button 
              className="add-product-btn"
              onClick={handleAddNewProduct}
            >
              <i className="fas fa-plus"></i>
              Agregar Nuevo Producto
            </button>
          </div>

          <div className="management-stats">
            <div className="stat-item">
              <i className="fas fa-box"></i>
              <span>{products.length} Productos</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-layer-group"></i>
              <span>{collections.length} Colecciones</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-tags"></i>
              <span>{categories.length} Categorías</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestión */}
      {isManagementOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              <button className="close-modal" onClick={() => setIsManagementOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="management-form">
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

              <div className="form-row">
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
                    placeholder="0.00"
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
                    placeholder="0"
                  />
                </div>
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

              <div className="form-group full-width">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleFormChange}
                  required
                  placeholder="Describe el producto detalladamente..."
                  rows="4"
                />
              </div>

              <div className="form-group full-width">
                <label>Imagen del Producto {!formData.imagenUrl && '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <div className="image-preview">
                  {formData.imagenUrl ? (
                    <>
                      <img src={formData.imagenUrl} alt="Vista previa" />
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
                      <i className="fas fa-image" style={{fontSize: '3rem', marginBottom: '1rem'}}></i>
                      <p>Selecciona una imagen o arrastra aquí</p>
                      <span>Recomendado: 500x500 px, formato JPG o PNG</span>
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
                          {formData.colecciones.includes(collection) && (
                            <i className="fas fa-check"></i>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-collections">
                      <i className="fas fa-inbox"></i>
                      <p>No hay colecciones creadas</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setIsManagementOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
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

export default ProductBasePage;