import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';



// Importar páginas
import Anillos from './pages/Anillos';
import Aretes from './pages/Aretes';
import Brazaletes from './pages/Brazaletes';
import Collares from './pages/Collares';
import Aros from './pages/Aros';
import NuestroTrabajo from './pages/NuestroTrabajo';
import GestionVentas from './pages/GestionVentas';
import GestionProductos from './components/GestionProductos';
import Perfil from './pages/Perfil';
import Pedidos from './pages/Pedidos';
import Configuracion from './pages/Configuracion';
import CollectionsPanel from './components/CollectionsPanel';
import ShopPanel from './components/ShopPanel';
import SeaCollection from './pages/SeaCollection';
import MataritaCollection from './pages/MataritaCollection';
import BestSellers from './pages/BestSellers';
import GestionCollection from './components/GestionCollection';
import ProductDetail from './components/ProductDetail';


// Importar contextos
import { CartProvider, getCartCountFromStorage } from './context/CartContext';
import { FavoritesProvider, getFavoritesCountFromStorage } from './context/FavoriteContext';

// Importar componentes de paneles
import CartPanel from './components/CartPanel';
import FavoritesPanel from './components/FavoritesPanel';
import Header from './components/Header';


function App() {
  
  const [usuario, setUsuario] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [userRole, setUserRole] = useState(0);


  // ESTADO PARA NEW COLLECTION
  const [setNewCollectionData] = useState({
    title: "NEW COLLECTION",
    subtitle: "Lovelay with a sad soul. Art you carry with you.",
    buttonText: "Buy now",
    description: "For over 3 years, we've handcrafted bronze, sterling silver, and TK gold jewelry in our Lima studio using the ancient art of lost-wax casting. Each piece is inspired by our local landscape, captivating culture, and the beauty of being human.",
    images: [
      { id: 1, url: null, title: 'Sea Conchitas', alt: 'Sea Conchitas Collection' },
      { id: 2, url: null, title: 'Wild Flowers', alt: 'Wild Flowers Collection' },
      { id: 3, url: null, title: 'Interplanets', alt: 'Interplanets Collection' }
    ]
  });

  // ESTADO PARA MARLY COLLECTIONS
  const [marlyCollectionsData, setMarlyCollectionsData] = useState({
    bestSellers: [
      { id: 1, url: null, title: 'Best Sellers', alt: 'Best Seller' }
    ],
    seaCollection: [
      { id: 1, url: null, title: 'Sea Collection', alt: 'Sea Collection' }

    ],
    mataritaCollection: [
      { id: 1, url: null, title: 'Matarita Collection', alt: 'Matarita Collection' },
    ],
    oceanBlueImage: { id: 1, url: null, title: 'Ocean Blue Monk Tree', alt: 'Ocean Blue Monk Tree Look' }
  });

  // ESTADO PARA MEET THE MAKER
  const [meetTheMakerData, setMeetTheMakerData] = useState({
    title: "Meet the Maker",
    subtitle: "MEETMARLY",
    shopInPerson: "AT THE VOLUNY SHOPPING",
    address: "AC 30th to Nutrition (SNAH) Scan Miguel TRIKOS",
    phones: [
      "+33 866 368 145",
      "+33 866 368 245 - Saturday from 18 AM - 5 PM"
    ],
    images: [
      { id: 1, url: null, title: 'Marly Workshop', alt: 'Marly en su taller' },
      { id: 2, url: null, title: 'Artisan Process', alt: 'Proceso artesanal' },
      { id: 3, url: null, title: 'Finished Products', alt: 'Productos terminados' }
    ]
  });

  useEffect(() => {
    // Actualizar badges cada segundo
    /*const interval = setInterval(() => {
      setBadgeUpdate(prev => prev + 1);
    }, 1000);

    // Cargar datos guardados*/
    loadSavedData();

    // return () => clearInterval(interval);
  }, []);

  // Cargar todos los datos guardados
  const loadSavedData = () => {
    // Cargar rol de usuario
    const role = parseInt(sessionStorage.getItem("userRole") || localStorage.getItem("userRole") || "0", 10);
    setUserRole(role);

    // Cargar datos de localStorage
    const savedNewCollection = localStorage.getItem("newCollectionData");
    const savedMarlyCollections = localStorage.getItem("marlyCollectionsData");
    const savedMeetTheMaker = localStorage.getItem("meetTheMakerData");

    if (savedNewCollection) {
      try {
        setNewCollectionData(JSON.parse(savedNewCollection));
      } catch (error) {
        console.error('Error cargando newCollectionData:', error);
      }
    }

    if (savedMarlyCollections) {
      try {
        setMarlyCollectionsData(JSON.parse(savedMarlyCollections));
      } catch (error) {
        console.error('Error cargando marlyCollectionsData:', error);
      }
    }

    if (savedMeetTheMaker) {
      try {
        setMeetTheMakerData(JSON.parse(savedMeetTheMaker));
      } catch (error) {
        console.error('Error cargando meetTheMakerData:', error);
      }
    }
  };

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        console.log('🔍 Haciendo request a /api/usuario/datos');
        
        const response = await fetch('http://localhost:8080/api/usuario/datos', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log('📨 Status:', response.status, response.statusText);
        
        const responseText = await response.text();
        console.log('📝 Response:', responseText);
        
        if (response.ok) {
          try {
            const userData = JSON.parse(responseText);
            console.log('✅ JSON parseado:', userData);
            setUsuario(userData);
            
            // Actualizar el rol del usuario
            if (userData.idRol) {
              setUserRole(userData.idRol);
              // Guardar en sessionStorage
              sessionStorage.setItem("userRole", userData.idRol.toString());
            }
          } catch (jsonError) {
            console.error('❌ Error parseando JSON:', jsonError);
          }
        } else {
          console.log('❌ Error HTTP:', response.status);
          setUsuario(null);
        }
      } catch (error) {
        console.error('💥 Error de red:', error);
      }
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUsuario();
    } else {
      fetchUsuario();
    }
  }, []);

  // Función para activar input de imagen
const triggerImageInput = (collectionType, imageId, userRole, navigate) => {
  if (userRole === 1) {
    const wantsToEdit = window.confirm('¿Quieres cambiar la imagen? Presiona "Cancelar" para entrar al vínculo.');

    if (wantsToEdit) {
      const inputId = `${collectionType}-upload-${imageId}`;
      const fileInput = document.getElementById(inputId);
      if (fileInput) {
        fileInput.click();
      }
    } else {
      // Navegar a la ruta correcta según la colección
      switch(collectionType) {
        case 'seacollection':
          navigate('/SeaCollection');
          break;
        case 'matarita':
          navigate('/MataritaCollection');
          break;
        case 'bestseller':
          navigate('/BestSellers');
          break;
        case 'oceanblue':
          navigate('/SeaCollection'); // o la ruta que corresponda
          break;
        default:
          navigate('/');
      }
    }
  } else {
    // Para usuarios normales, también navegar a la ruta correcta
    switch(collectionType) {
      case 'seacollection':
        navigate('/SeaCollection');
        break;
      case 'matarita':
        navigate('/MataritaCollection');
        break;
      case 'bestseller':
        navigate('/BestSellers');
        break;
      case 'oceanblue':
        navigate('/SeaCollection'); // o la ruta que corresponda
        break;
      default:
        navigate('/');
    }
  }
};



  // FUNCIONES PARA MARLY COLLECTIONS
  const handleMarlyCollectionImageChange = (collectionType, imageId, event) => {
    if (userRole !== 1) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedData = { ...marlyCollectionsData };
        
        if (collectionType === 'oceanBlueImage') {
          updatedData.oceanBlueImage = { ...updatedData.oceanBlueImage, url: e.target.result };
        } else {
          updatedData[collectionType] = updatedData[collectionType].map(img => 
            img.id === imageId ? { ...img, url: e.target.result } : img
          );
        }
        
        setMarlyCollectionsData(updatedData);
        localStorage.setItem("marlyCollectionsData", JSON.stringify(updatedData));
      };
      reader.readAsDataURL(file);
    }
  };

  // FUNCIONES PARA MEET THE MAKER
  const handleMeetTheMakerImageChange = (imageId, event) => {
    if (userRole !== 1) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedImages = meetTheMakerData.images.map(img => 
          img.id === imageId ? { ...img, url: e.target.result } : img
        );
        const newData = { ...meetTheMakerData, images: updatedImages };
        setMeetTheMakerData(newData);
        localStorage.setItem("meetTheMakerData", JSON.stringify(newData));
      };
      reader.readAsDataURL(file);
    }
  };



  const handleLogout = async (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        await fetch('/logout', {
          method: 'GET',
          credentials: 'include'
        });
        
        setUsuario(null);
        setUserRole(0);
        sessionStorage.removeItem("userRole");
        localStorage.removeItem("userRole");
        window.location.href = 'http://localhost:8080/login?logout=success';
      } catch (error) {
        console.error('Error durante el logout:', error);
        window.location.href = 'http://localhost:8080/login';
      }
    }
  };

  // COMPONENTE NEW COLLECTION ACTUALIZADO
// COMPONENTE NEW COLLECTION SIMPLIFICADO
const NewCollectionSection = () => {
  // Estado para la imagen principal
  const [mainImage, setMainImage] = useState(() => {
    const saved = localStorage.getItem("newCollectionMainImage");
    return saved || null;
  });

  // Estado para el texto
  const [collectionText, setCollectionText] = useState(() => {
    const saved = localStorage.getItem("newCollectionText");
    return saved || "For over 3 years, we've handcrafted bronze, sterling silver, and 7K gold jewelry in our Lima studio using the ancient art of lost-wax casting. Each piece is inspired by our local landscape, captivating culture, and the beauty of being human.";
  });

  // Función para cambiar la imagen principal
  const handleMainImageChange = (event) => {
    if (userRole !== 1) return;
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setMainImage(imageUrl);
        localStorage.setItem("newCollectionMainImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para cambiar el texto
  const handleTextChange = (e) => {
    if (userRole !== 1) return;
    const newText = e.target.value;
    setCollectionText(newText);
    localStorage.setItem("newCollectionText", newText);
  };

  // Función para activar input de imagen principal
  const triggerMainImageInput = () => {
    if (userRole !== 1) return;
    const fileInput = document.getElementById('newcollection-main-image-upload');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <section className="new-collection-section">
      <div className="new-collection-container">
        {/* Imagen Principal Grande */}
        <div className="main-image-section">
          <div 
            className={`main-image-container ${userRole === 1 ? 'editable' : ''}`}
            onClick={triggerMainImageInput}
          >
            <div 
              className="main-collection-image"
              style={{
                backgroundImage: mainImage ? `url(${mainImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {!mainImage && (
                <div className="image-placeholder-content">
                  <span className="placeholder-text">Imagen Principal New Collection</span>
                  {userRole === 1 && (
                    <span className="upload-hint">Haz clic para subir una imagen</span>
                  )}
                </div>
              )}
              {userRole === 1 && mainImage && (
                <div className="image-overlay">
                  <span className="edit-icon">📷 Cambiar imagen</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              id="newcollection-main-image-upload"
              accept="image/*"
              onChange={handleMainImageChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Texto debajo de la imagen */}
        <div className="collection-text-section">
          {userRole === 1 ? (
            <textarea
              className="editable-text"
              value={collectionText}
              onChange={handleTextChange}
              rows="3"
              placeholder="Texto descriptivo de la colección..."
            />
          ) : (
            <h2 className="collection-text">{collectionText}</h2>
          )}
        </div>
      </div>
    </section>
  );
};

const MostLovedSection = () => {  // ✅ Recibe userRole como prop
  // Estado específico para Most Loved
  const [mostLovedData, setMostLovedData] = useState(() => {
    const saved = localStorage.getItem("mostLovedData");
    return saved ? JSON.parse(saved) : {
      images: [
        { id: 1, url: null, title: 'Sea Conchitas', alt: 'Sea Conchitas Collection' },
        { id: 2, url: null, title: 'Wild Flowers', alt: 'Wild Flowers Collection' },
        { id: 3, url: null, title: 'Interplanets', alt: 'Interplanets Collection' }
      ]
    };
  });

  // Función para cambiar imágenes de Most Loved
  const handleMostLovedImageChange = (imageId, event) => {
    if (userRole !== 1) return;  // ✅ Ahora userRole está disponible
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedImages = mostLovedData.images.map(img => 
          img.id === imageId ? { ...img, url: e.target.result } : img
        );
        const newData = { ...mostLovedData, images: updatedImages };
        setMostLovedData(newData);
        localStorage.setItem("mostLovedData", JSON.stringify(newData));
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para activar input de Most Loved
  const triggerMostLovedInput = (imageId) => {
    if (userRole !== 1) return;  // ✅ Ahora userRole está disponible
    const inputId = `mostloved-upload-${imageId}`;
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <section className="most-loved-section">
      <div className="most-loved-container">
        <h2 className="section-subtitle">Most Loved</h2>
        <div className="collection-grid">
          {mostLovedData.images.map((image) => (
            <div key={image.id} className="collection-item">
              <div 
                className={`image-container ${userRole === 1 ? 'editable' : ''}`}  // ✅ Ahora funciona
                onClick={() => triggerMostLovedInput(image.id)}
              >
                <div 
                  className="collection-image standard-collection-image"
                  style={{
                    backgroundImage: image.url ? `url(${image.url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {!image.url && <span className="image-placeholder">{image.title}</span>}
                  {userRole === 1 && (  // ✅ Ahora funciona
                    <div className="image-overlay">
                      <span className="edit-icon">📷 Editar</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  id={`mostloved-upload-${image.id}`}
                  accept="image/*"
                  onChange={(e) => handleMostLovedImageChange(image.id, e)}
                  style={{ display: 'none' }}
                />
              </div>
              <h3 className="image-title">{image.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MarlyCollectionsSection = () => {
  const navigate = useNavigate(); // ✅ useNavigate dentro del componente

  return (
    <section className="marly-collections-section">
      <div className="collections-header">
        <h2 className="collections-title">MARLY Collections</h2>
      </div>

      {/* CONTENEDOR PRINCIPAL CON LAS 3 IMÁGENES EN HORIZONTAL */}
      <div className="marly-collections-grid">
        {/* BEST SELLERS - SOLO 1 IMAGEN */}
        {marlyCollectionsData.bestSellers.slice(0, 1).map((image) => (
          <div key={image.id} className="marly-collection-item">
            <div 
              className={`image-container ${userRole === 1 ? 'editable' : ''}`}
              onClick={() => triggerImageInput('bestseller', image.id, userRole, navigate)}
            >
              <div 
                className="collection-image"
                style={{
                  backgroundImage: image.url ? `url(${image.url})` : 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                }}
              >
                {!image.url && <span className="image-placeholder">Best Sellers</span>}
                {userRole === 1 && (
                  <div className="image-overlay">
                    <span className="edit-icon">📷 Click para editar</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                id={`bestseller-upload-${image.id}`}
                accept="image/*"
                onChange={(e) => handleMarlyCollectionImageChange('bestSellers', image.id, e)}
                style={{ display: 'none' }}
              />
            </div>
            {/* TÍTULO DEBAJO DE LA IMAGEN */}
            <h3 className="collection-item-title">Best Sellers</h3>
          </div>
        ))}

        {/* SEA COLLECTION - SOLO 1 IMAGEN */}
        {marlyCollectionsData.seaCollection.slice(0, 1).map((image) => (
          <div key={image.id} className="marly-collection-item">
            <div 
              className={`image-container ${userRole === 1 ? 'editable' : ''}`}
              onClick={() => triggerImageInput('seacollection', image.id, userRole, navigate)}
            >
              <div 
                className="collection-image"
                style={{
                  backgroundImage: image.url ? `url(${image.url})` : 'linear-gradient(135deg, #00cec9 0%, #0984e3 100%)',
                }}
              >
                {!image.url && <span className="image-placeholder">Sea Collection</span>}
                {userRole === 1 && (
                  <div className="image-overlay">
                    <span className="edit-icon">📷 Click para editar</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                id={`seacollection-upload-${image.id}`}
                accept="image/*"
                onChange={(e) => handleMarlyCollectionImageChange('seaCollection', image.id, e)}
                style={{ display: 'none' }}
              />
            </div>
            {/* TÍTULO DEBAJO DE LA IMAGEN */}
            <h3 className="collection-item-title">Sea Collection</h3>
          </div>
        ))}

        {/* MATARITA COLLECTION - SOLO 1 IMAGEN */}
        {marlyCollectionsData.mataritaCollection.slice(0, 1).map((image) => (
          <div key={image.id} className="marly-collection-item">
            <div 
              className={`image-container ${userRole === 1 ? 'editable' : ''}`}
              onClick={() => triggerImageInput('matarita', image.id, userRole, navigate)}
            >
              <div 
                className="collection-image"
                style={{
                  backgroundImage: image.url ? `url(${image.url})` : 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
                }}
              >
                {!image.url && <span className="image-placeholder">Matarita Collection</span>}
                {userRole === 1 && (
                  <div className="image-overlay">
                    <span className="edit-icon">📷 Click para editar</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                id={`matarita-upload-${image.id}`}
                accept="image/*"
                onChange={(e) => handleMarlyCollectionImageChange('mataritaCollection', image.id, e)}
                style={{ display: 'none' }}
              />
            </div>
            {/* TÍTULO DEBAJO DE LA IMAGEN */}
            <h3 className="collection-item-title">Matarita Collection</h3>
          </div>
        ))}
      </div>

      {/* Shop by look */}
      <div className="shop-by-look">
        <h3 className="look-title">Shop by look</h3>
        <div className="look-container">
          <div 
            className={`ocean-blue-monk-tree ${userRole === 1 ? 'editable' : ''}`}
            onClick={() => triggerImageInput('oceanblue', 1, userRole, navigate)}
            style={{
              backgroundImage: marlyCollectionsData.oceanBlueImage.url 
                ? `url(${marlyCollectionsData.oceanBlueImage.url})` 
                : 'linear-gradient(135deg, #00cec9 0%, #0984e3 100%)',
            }}
          >
            {!marlyCollectionsData.oceanBlueImage.url && marlyCollectionsData.oceanBlueImage.title}
            {userRole === 1 && (
              <div className="image-overlay">
                <span className="edit-icon">📷 Click para cambiar imagen</span>
              </div>
            )}
            <input 
              type="file" 
              id="oceanblue-upload-1"
              accept="image/*"
              onChange={(e) => handleMarlyCollectionImageChange('oceanBlueImage', 1, e)}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};


// COMPONENTE MEET THE MAKER - CORREGIDO (SIN TÍTULO DUPLICADO)
  const MeetTheMakerSection = () => (
    <section className="meet-the-maker-section">
      <div className="meet-maker-container">
        {/* SOLO UN ENCABEZADO - EL NUEVO ESTILO MARLY COLLECTIONS */}
        <div className="collections-header">
          <h2 className="collections-title">{meetTheMakerData.title}</h2>
        </div>

        {/* PARTE 1: IMAGEN PRINCIPAL */}
        <div className="meet-maker-top">
          <div className="meet-maker-single-image">
            {meetTheMakerData.images.slice(0, 1).map((image) => (
              <div key={image.id} className="maker-image-item">
                <div 
                  className={`image-container ${userRole === 1 ? 'editable' : ''}`}
                  onClick={() => triggerImageInput('meetmaker', image.id)}
                >
                  <div 
                    className="first-maker-image"
                    style={{
                      backgroundImage: image.url ? `url(${image.url})` : 'none',
                      backgroundColor: image.url ? 'transparent' : '#f5f5f5'
                    }}
                  >
                    {!image.url && <span className="image-placeholder">Meet the Maker</span>}
                    {userRole === 1 && (
                      <div className="image-overlay">
                        <span className="edit-icon">📷 Editar imagen</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id={`meetmaker-upload-${image.id}`}
                    accept="image/*"
                    onChange={(e) => handleMeetTheMakerImageChange(image.id, e)}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARTE 2: SHOP IN PERSON CON TÍTULO SECUNDARIO */}
        <div className="shop-in-person-section">
          <div className="shop-in-person-image">
            {meetTheMakerData.images.slice(1, 2).map((image) => (
              <div key={image.id} className="shop-image-item">
                <div 
                  className={`image-container large-image ${userRole === 1 ? 'editable' : ''}`}
                  onClick={() => triggerImageInput('meetmaker', image.id)}
                >
                  <div 
                    className="second-maker-image"
                    style={{
                      backgroundImage: image.url ? `url(${image.url})` : 'none',
                      
                    }}
                  >
                    {!image.url && <span className="image-placeholder">Shop in Person</span>}
                    {userRole === 1 && (
                      <div className="image-overlay">
                        <span className="edit-icon">📷 Editar imagen</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id={`meetmaker-upload-${image.id}`}
                    accept="image/*"
                    onChange={(e) => handleMeetTheMakerImageChange(image.id, e)}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
  // FOOTER
  const AppFooter = () => (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* POLICY LINES */}
          <div className="footer-section">
            <h4>POLICY LINES</h4>
            <ul>
              <li><a href="/terms">Terms and Conditions</a></li>
              <li><a href="/story">Our Story</a></li>
              <li><a href="/delivery">Our delivery terms</a></li>
              <li><a href="/join">Join us to get 15% off your first order</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li className="email">contact@marly.com</li>
              <li className="email">For wholesale inquiries: wholesale@marly.com</li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/wholesale">Drop us your email</a></li>
              <li><a href="/shipping">Shipping Policy</a></li>
              <li><a href="/returns">Returns - Exchange - Repairs</a></li>
              <li><a href="/exchange">Exchange & Returns Policy</a></li>
            </ul>
          </div>
          
          {/* QUICK LINES */}
          <div className="footer-section">
            <h4>QUICK LINES</h4>
            <ul>
              <li><a href="/shop-all">SHOP ALL</a></li>
              <li><a href="/best">Best over earphones 500</a></li>
              <li><a href="/dose">Dose Losses</a></li>
              <li><a href="/makeup">Makeup water? Keep all delivery</a></li>
              <li><a href="/makeup-water">Makeup water?</a></li>
            </ul>
          </div>
          
          {/* CONTACT US */}
          <div className="footer-section">
            <h4>CONTACT US</h4>
            <ul>
              <li><a href="/contact">Our Story</a></li>
              <li><a href="/team">Our team</a></li>
              <li><a href="/delivery-info">Delivery information</a></li>
              <li><a href="/join-insider">Join us to get 15% off your first order</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/contact-form">Contact Us</a></li>
              <li className="email">contact@marly.com</li>
              <li className="email">For wholesale services and space: wholesale@marly.com</li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/email-list">Drop us your email</a></li>
              <li><a href="/shipping-info">Shipping Policy</a></li>
              <li><a href="/returns-info">Postage - Exchange - Repairs</a></li>
              <li><a href="/exchange-info">Exchange & Repair Policy</a></li>
            </ul>
          </div>
          
          {/* BE AN INSIDER */}
          <div className="footer-section">
            <h4>BE AN INSIDER</h4>
            <div className="newsletter">
              <p>Join our newsletter for updates and offers</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Subscribe</button>
              </div>
              <div className="social-links">
                <button className="social-btn" title="Instagram">
                  <i className="fab fa-instagram"></i>
                </button>
                <button className="social-btn" title="Facebook">
                  <i className="fab fa-facebook"></i>
                </button>
                <button className="social-btn" title="Pinterest">
                  <i className="fab fa-pinterest"></i>
                </button>
                <button className="social-btn" title="TikTok">
                  <i className="fab fa-tiktok"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-brand">
            <h3>MARLY</h3>
            <p>@ 2025 MARLY Handmade</p>
          </div>
          <div className="payment-methods">
            <span>We accept:</span>
            <i className="fab fa-cc-visa" title="Visa"></i>
            <i className="fab fa-cc-mastercard" title="MasterCard"></i>
            <i className="fab fa-cc-paypal" title="PayPal"></i>
            <i className="fab fa-cc-apple-pay" title="Apple Pay"></i>
          </div>
        </div>
      </div>
    </footer>
  );

 return (
    <CartProvider>
      <FavoritesProvider>
        <Router>
          <div className="app-container">
            {/* Header importado como componente independiente */}
            <Header 
              usuario={usuario}
              userRole={userRole}
              onLogout={handleLogout}
              onCartOpen={() => setIsCartOpen(true)}
              onFavoritesOpen={() => setIsFavoritesOpen(true)}
            />

            {/* Contenido Principal */}
            <main className="main-content">
              <section className="hero-section">
                <div className="hero-content">
                  <h1 className="hero-title">
                    {usuario ? (
                      `¡Bienvenid${usuario.idRol === 2 ? 'a' : 'o'} ${usuario.nombre} a `
                    ) : '¡Bienvenido a '}
                    <span className="brand-highlight">Marly Handmade</span>!
                  </h1>
                  <p className="hero-subtitle">
                    {usuario ? (
                      <>
                        {usuario.idRol === 1 && `Administrador - ${usuario.email}`}
                        {usuario.idRol === 2 && `Vendedor - ${usuario.email}`}
                        {usuario.idRol === 3 && `Cliente - ${usuario.email}`}
                      </>
                    ) : 'Sistema de gestión de productos artesanales'}
                  </p>
                </div>
              </section>
              
              <Routes>
                <Route path="/" element={
                  <>
                    {/* Sección NEW COLLECTION */}
                    <NewCollectionSection />

                    {<MostLovedSection/>}

                    {/* Sección MARLY COLLECTIONS */}
                    <MarlyCollectionsSection />

                    {/* Sección MEET THE MAKER */}
                    <MeetTheMakerSection />

                    {/* Quick Actions Section */}
                    <section className="quick-actions">
                      <h2>¿Qué deseas hacer hoy?</h2>
                      <div className="action-grid">
                        <Link to="/anillos" className="action-card">
                          <i className="fas fa-shopping-cart"></i>
                          <h3>Ver Productos</h3>
                          <p>Explora nuestra colección exclusiva</p>
                        </Link>
                        
                        <Link to="/perfil" className="action-card">
                          <i className="fas fa-user-edit"></i>
                          <h3>Mi Perfil</h3>
                          <p>Gestiona tu cuenta personal</p>
                        </Link>
                        
                        <Link to="/pedidos" className="action-card">
                          <i className="fas fa-clipboard-list"></i>
                          <h3>Mis Pedidos</h3>
                          <p>Revisa tus compras recientes</p>
                        </Link>
                        
                        {usuario && usuario.idRol === 1 && (
                          <Link to="/admin" className="action-card">
                            <i className="fas fa-cog"></i>
                            <h3>Administración</h3>
                            <p>Panel de control del sistema</p>
                          </Link>
                        )}
                        
                        {(usuario?.idRol === 1 || usuario?.idRol === 2) && (
                          <Link to="/gestion-ventas" className="action-card">
                            <i className="fas fa-store"></i>
                            <h3>Gestión de Ventas</h3>
                            <p>Administra productos y colecciones</p>
                          </Link>
                        )}
                      </div>
                    </section>
                  </>
                } />

                {/* Resto de tus rutas... */}
                
                <Route path="/anillos" element={<Anillos />} />
                <Route path="/aretes" element={<Aretes />} />
                <Route path="/brazaletes" element={<Brazaletes />} />
                <Route path="/aros" element={<Aros />} />
                <Route path="/collares" element={<Collares />} />
                <Route path="/nuestro-trabajo" element={<NuestroTrabajo />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/shop" element={<Anillos />} />
                <Route path="/collections" element={<Aretes />} />
                <Route path="/SeaCollection" element={<SeaCollection />} />
                <Route path="/MataritaCollection" element={<MataritaCollection />} />
                <Route path="/BestSellers" element={<BestSellers />} />
                <Route path="/gestion-ventas" element={<GestionVentas />} />
                <Route path="/gestion/anillos" element={<GestionProductos categoria="anillos" />} />
                <Route path="/gestion/aretes" element={<GestionProductos categoria="aretes" />} />
                <Route path="/gestion/brazaletes" element={<GestionProductos categoria="brazaletes" />} />
                <Route path="/gestion/aros" element={<GestionProductos categoria="aros" />} />
                <Route path="/gestion/collares" element={<GestionProductos categoria="collares" />} />
                <Route path="/gestion/sea-collection" element={<GestionCollection />} />
                <Route path="/gestion/matarita-collection" element={<GestionCollection />} />
                <Route path="/gestion/best-sellers" element={<GestionCollection />} />
                <Route path="/product/:collectionType/:productId" element={<ProductDetail />} />
              </Routes>
            </main>

            {/* Footer */}
            <AppFooter />

            {/* Overlay para menú móvil */}
            {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}

            {/* Paneles de Carrito y Favoritos */}
            <CartPanel 
              isOpen={isCartOpen} 
              onClose={() => setIsCartOpen(false)} 
            />
            
            <FavoritesPanel 
              isOpen={isFavoritesOpen} 
              onClose={() => setIsFavoritesOpen(false)} 
            />
          </div>
        </Router>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;