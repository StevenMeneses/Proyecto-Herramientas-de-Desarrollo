// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { productId, collectionType } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Configuración de colecciones
  const collectionConfig = {
    'SeaCollection': {
      name: 'Sea Collection',
      storageKey: 'sea-collection_products',
      color: '#667eea'
    },
    'MataritaCollection': {
      name: 'Matarita Collection',
      storageKey: 'matarita-collection_products',
      color: '#fd79a8'
    },
    'BestSellers': {
      name: 'Best Sellers',
      storageKey: 'best-sellers_products',
      color: '#fdcb6e'
    }
  };

  // Función para obtener imagen
const obtenerImagen = (imagePath, tipo) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    
    // Detectar entorno
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    const backendUrl = isLocalhost 
        ? 'http://localhost:5000' 
        : 'https://proyecto-herramientas-de-desarrollo-1.onrender.com';
    
    // Caso 1: URL completa del backend
    if (imagePath.startsWith('http://localhost:5000') || 
        imagePath.startsWith('https://proyecto-herramientas-de-desarrollo-1.onrender.com')) {
        
        // Si estamos en producción pero la URL tiene localhost, corregirla
        if (!isLocalhost && imagePath.includes('localhost:5000')) {
            return imagePath.replace('http://localhost:5000', backendUrl);
        }
        return imagePath;
    }
    
    // Caso 2: Ruta relativa (/uploads/...)
    if (imagePath.startsWith('/uploads/')) {
        return `${backendUrl}${imagePath}`;
    }
    
    // Caso 3: Si es solo nombre de archivo - SIN mapTipoToFolderName
    if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
        // Si tienes 'tipo' y necesitas una carpeta específica
        if (tipo) {
            // Opción A: Carpeta por defecto basada en tipo (si no tienes la función map)
            const folderName = tipo.toLowerCase().replace(/\s+/g, '-');
            return `${backendUrl}/uploads/${folderName}/${imagePath}`;
        } else {
            // Opción B: Carpeta genérica
            return `${backendUrl}/uploads/products/${imagePath}`;
        }
    }
    
    return '/images/placeholder-product.jpg';
};

  // Cargar producto
  useEffect(() => {
    const loadProduct = () => {
      try {
        const config = collectionConfig[collectionType];
        if (!config) return;

        const storedProducts = localStorage.getItem(config.storageKey);
        if (storedProducts) {
          const products = JSON.parse(storedProducts);
          const foundProduct = products.find(p => p.idProducto === productId);
          if (foundProduct) {
            setProduct(foundProduct);
            loadRelatedProducts(foundProduct, products);
          }
        }
      } catch (error) {
        console.error('Error cargando producto:', error);
      }
    };

    loadProduct();
  }, [productId, collectionType]);

  // Cargar productos relacionados
  const loadRelatedProducts = (currentProduct, allProducts) => {
    const related = allProducts
      .filter(p => p.idProducto !== currentProduct.idProducto)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setRelatedProducts(related);
  };

  // Manejar favoritos
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Manejar accordion
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Manejar agregar al carrito
  const addToCart = () => {
    const cartItem = {
      ...product,
      quantity: quantity,
      collectionType: collectionType
    };
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => 
      item.idProducto === product.idProducto && item.collectionType === collectionType
    );
    
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert('Producto agregado al carrito');
  };

  // Manejar compra inmediata
  const handleBuyNow = () => {
    addToCart();
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  const accordionItems = [
    {
      title: 'Description',
      content: product.moreDescription || product.descripcion || 'No hay descripción disponible.'
    },
    {
      title: 'Product Details',
      content: product.productDetails || 'No hay detalles adicionales disponibles.'
    },
    {
      title: 'Jewelry Care',
      content: product.jewelryCare || 'Instrucciones de cuidado estándar para joyería.'
    },
    {
      title: 'Shipping Info',
      content: product.shippingInfo || 'Información de envío estándar.'
    }
  ];

  return (
    <div className="product-detail-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Menu</Link>
        <span> / </span>
        <span>SEA BREEZES</span>
      </div>

      <div className="product-detail-content">
        {/* Imagen del producto */}
        <div className="product-image-section">
          <div className="main-product-image">
            <img 
              src={obtenerImagen(product.imagenUrl, collectionType)} 
              alt={product.nombreProducto}
              onError={(e) => e.target.src = '/images/placeholder-product.jpg'}
            />
          </div>
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            <i className={`fas fa-heart ${isFavorite ? 'fas' : 'far'}`}></i>
          </button>
        </div>

        {/* Información del producto */}
        <div className="product-info-section">
          <div className="product-header">
            <div className="product-category tracking-wide text-sm">SEA BREEZES</div>
            <h1 className="product-title text-serif">{product.nombreProducto}</h1>
          </div>

          <div className="product-price">${product.precio}</div>

          {/* Botones de acción */}
          <div className="product-actions">
            <button className="add-to-cart-btn" onClick={addToCart}>
              Add to Cart
            </button>
          </div>

          {/* Sección Buy Now */}
          <div className="buy-now-section">
            <span className="buy-now-label">Buy Now</span>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              BUY NOW
            </button>
          </div>

          {/* Accordion de información */}
          <div className="product-accordion">
            {accordionItems.map((item, index) => (
              <div key={index} className="accordion-item">
                <button 
                  className={`accordion-header ${activeAccordion === index ? 'active' : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  {item.title}
                  <span className="accordion-icon">+</span>
                </button>
                <div className={`accordion-content ${activeAccordion === index ? 'active' : ''}`}>
                  {item.content}
                </div>
              </div>
            ))}
          </div>

          {/* Share Section */}
          <div className="share-section">
            <div className="share-label">Share</div>
            <div className="share-buttons">
              <button className="pinterest-share">
                Pin it
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2 className="related-products-title">You May Also Like</h2>
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => (
              <div 
                key={relatedProduct.idProducto} 
                className="related-product-card"
                onClick={() => navigate(`/product/${collectionType}/${relatedProduct.idProducto}`)}
              >
                <div className="related-product-image">
                  <img 
                    src={obtenerImagen(relatedProduct.imagenUrl, collectionType)} 
                    alt={relatedProduct.nombreProducto}
                    onError={(e) => e.target.src = '/images/placeholder-product.jpg'}
                  />
                </div>
                <div className="related-product-info">
                  <h4 className="text-serif">{relatedProduct.nombreProducto}</h4>
                  <p className="related-product-price">$ {relatedProduct.precio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;