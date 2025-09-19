import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Importar páginas
import Anillos from './pages/Anillos';
import Aretes from './pages/Aretes';
import Brazaletes from './pages/Brazaletes';
import Collares from './pages/Collares';
import Aros from './pages/Aros';
import NuestroTrabajo from './pages/NuestroTrabajo';
import GestionVentas from './pages/GestionVentas';
import GestionProductos from './components/GestionProductos';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import TerminosCondiciones from './pages/TerminosCondiciones';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';

// Importar contextos
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoriteContext';

// Importar componentes de paneles
import CartPanel from './components/CartPanel';
import FavoritesPanel from './components/FavoritesPanel';
import Privacidad from './pages/Privacidad';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Obtener datos del usuario al cargar el componente
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
        
        // Leer como texto primero para debuggear
        const responseText = await response.text();
        console.log('📝 Response:', responseText);
        
        if (response.ok) {
          try {
            const userData = JSON.parse(responseText);
            console.log('✅ JSON parseado:', userData);
            setUsuario(userData);
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
    
    // Verificar si viene de un login exitoso
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUsuario();
    } else {
      // Verificar si hay sesión activa al cargar la app
      fetchUsuario();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        // Hacer logout en el backend - Cambiado a GET
        await fetch('/logout', {
          method: 'GET', // Cambiado de POST a GET
          credentials: 'include'
        });
        
        // Limpiar el estado del usuario
        setUsuario(null);
        
        // Redirigir a la página de login de Spring Boot
        window.location.href = 'http://localhost:8080/login?logout=success';
      } catch (error) {
        console.error('Error durante el logout:', error);
        // Fallback: redirigir igualmente
        window.location.href = 'http://localhost:8080/login';
      }
    }
  };

  return (
    <CartProvider>
      <FavoritesProvider>
        <Router>
          <div className="app-container">
            {/* Header Superior con Iconos */}
            <header className="top-header">
              <div className="header-container">
                <div className="left-section">
                  <div className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  <form className="search-bar" onSubmit={handleSearch}>
                    <input 
                      type="text" 
                      placeholder="Buscar en tienda..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                      <i className="fas fa-search"></i>
                    </button>
                  </form>
                </div>
                
                <div className="center-section">
                  <Link to="/" className="store-title">
                        Marly Handmade
                  </Link>
                </div>
                
                <div className="right-section">
                  <button 
                    className="icon-link" 
                    title="Favoritos"
                    onClick={() => setIsFavoritesOpen(true)}
                  >
                    <i className="fa-regular fa-heart"></i>
                    <span className="icon-badge">3</span>
                  </button>
                  
                  <button 
                    className="icon-link" 
                    title="Carrito"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    <span className="icon-badge">5</span>
                  </button>
                  
                  <div className="user-dropdown">
                    <button className="user-btn">
                      <i className="fa-regular fa-user"></i>
                      {usuario && (
                        <span className="user-name">
                          {usuario.nombre} {usuario.apellido}
                        </span>
                      )}
                      <i className="fas fa-chevron-down"></i>
                    </button>
                    
                    <div className="dropdown-menu">
                      <Link to="/perfil" className="dropdown-item">
                        <i className="fas fa-user"></i>
                        Mi Perfil {usuario && `(${usuario.nombre})`}
                      </Link>

                      {console.log('Usuario:', usuario, 'Rol:', usuario?.idRol)}
                      
                      {/* Mostrar Gestión de Ventas solo para administradores y vendedores */}
                      {(usuario?.idRol === 1 || usuario?.idRol === 2) && (
                        <Link to="/gestion-ventas" className="dropdown-item">
                          <i className="fas fa-store"></i>
                          Gestión de Ventas
                        </Link>
                      )}
                      
                      <Link to="/pedidos" className="dropdown-item">
                        <i className="fas fa-shopping-bag"></i>
                        Mis Pedidos
                      </Link>
                      <Link to="/configuracion" className="dropdown-item">
                        <i className="fas fa-cog"></i>
                        Configuración
                      </Link>
                      <hr className="dropdown-divider" />
                      <Link to="/logout" className="dropdown-item logout-item" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        Cerrar Sesión
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Header Inferior con Categorías */}
            <nav className="categories-header">
              <div className="categories-container">
                <ul className="categories-list">
                  <li><Link to="/anillos"><i className="fas fa-ring"></i> Anillos</Link></li>
                  <li><Link to="/aretes"><i className="fas fa-gem"></i> Aretes</Link></li>
                  <li><Link to="/brazaletes"><i className="fas fa-bracelet"></i> Brazaletes</Link></li>
                  <li><Link to="/aros"><i className="fas fa-circle"></i> Aros</Link></li>
                  <li><Link to="/collares"><i className="fas fa-necklace"></i> Collares</Link></li>
                  <li><Link to="/nuestro-trabajo"><i className="fas fa-hands"></i> Nuestro Trabajo</Link></li>
                </ul>
              </div>
            </nav>

            {/* Menú móvil desplegable */}
            {isMenuOpen && (
              <div className="mobile-menu">
                <div className="mobile-menu-header">
                  <h3>Marly Handmade</h3>
                  <button className="close-menu" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="mobile-search">
                  <form onSubmit={handleSearch}>
                    <input 
                      type="text" 
                      placeholder="Buscar productos..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">
                      <i className="fas fa-search"></i>
                    </button>
                  </form>
                </div>
                
                <ul className="mobile-categories">
                  <li><Link to="/anillos" onClick={() => setIsMenuOpen(false)}><i className="fas fa-ring"></i> Anillos</Link></li>
                  <li><Link to="/aretes" onClick={() => setIsMenuOpen(false)}><i className="fas fa-gem"></i> Aretes</Link></li>
                  <li><Link to="/brazaletes" onClick={() => setIsMenuOpen(false)}><i className="fas fa-bracelet"></i> Brazaletes</Link></li>
                  <li><Link to="/aros" onClick={() => setIsMenuOpen(false)}><i className="fas fa-circle"></i> Aros</Link></li>
                  <li><Link to="/collares" onClick={() => setIsMenuOpen(false)}><i className="fas fa-necklace"></i> Collares</Link></li>
                  <li><Link to="/nuestro-trabajo" onClick={() => setIsMenuOpen(false)}><i className="fas fa-hands"></i> Nuestro Trabajo</Link></li>
                </ul>
                
                <div className="mobile-user-menu">
                  <Link to="/perfil" onClick={() => setIsMenuOpen(false)}><i className="fas fa-user"></i> Mi Perfil {usuario && `(${usuario.nombre})`}</Link>
                  
                  {/* Mostrar Gestión de Ventas solo para administradores y vendedores */}
                  {(usuario?.idRol === 1 || usuario?.idRol === 2) && (
                    <Link to="/gestion-ventas" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-store"></i> Gestión de Ventas
                    </Link>
                  )}
                  
                  <button onClick={() => { setIsMenuOpen(false); setIsFavoritesOpen(true); }}>
                    <i className="fas fa-heart"></i> Favoritos
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); setIsCartOpen(true); }}>
                    <i className="fas fa-shopping-cart"></i> Carrito
                  </button>
                  <Link to="/logout" onClick={(e) => { setIsMenuOpen(false); handleLogout(e); }}><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</Link>
                </div>
              </div>
            )}

            {/* Contenido Principal con Rutas */}
            <main className="main-content">
              <Routes>
                {/* Ruta para la página principal */}
                <Route path="/" element={
                  <>
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
                        
                        <div className="hero-stats">
                          <div className="stat-card">
                            <i className="fas fa-users"></i>
                            <h3>+500</h3>
                            <p>Clientes satisfechos</p>
                          </div>
                          <div className="stat-card">
                            <i className="fas fa-tshirt"></i>
                            <h3>+200</h3>
                            <p>Productos únicos</p>
                          </div>
                          <div className="stat-card">
                            <i className="fas fa-star"></i>
                            <h3>4.9/5</h3>
                            <p>Calificación promedio</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="hero-image">
                        <div className="floating-card admin-card">
                          <i className="fas fa-award"></i>
                          <h4>Calidad Premium</h4>
                          <p>Productos 100% artesanales</p>
                        </div>
                      </div>
                    </section>

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

            {/* Rutas para las categorías (EXISTENTES) */}
            {/* Rutas para las categorías PÚBLICAS */}
            <Route path="/anillos" element={<Anillos />} />
            <Route path="/aretes" element={<Aretes />} />
            <Route path="/brazaletes" element={<Brazaletes />} />
            <Route path="/aros" element={<Aros />} />
            <Route path="/collares" element={<Collares />} />
            <Route path="/nuestro-trabajo" element={<NuestroTrabajo />} />
    
            {/* Rutas de gestión (NUEVAS - AGREGA ESTAS LÍNEAS) */}
            <Route path="/gestion-ventas" element={<GestionVentas />} />
            <Route path="/gestion/anillos" element={<GestionProductos categoria="anillos" />} />
            <Route path="/gestion/aretes" element={<GestionProductos categoria="aretes" />} />
            <Route path="/gestion/brazaletes" element={<GestionProductos categoria="brazaletes" />} />
            <Route path="/gestion/aros" element={<GestionProductos categoria="aros" />} />
            <Route path="/gestion/collares" element={<GestionProductos categoria="collares" />} />
            <Route path="/nuestro-trabajo" element={<NuestroTrabajo />} />

            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/terminos" element={<TerminosCondiciones />} />
            <Route path="/preguntas" element={<PreguntasFrecuentes />} />
            </Routes>

            {/* Rutas de Enlaces Utiles */}
            </main>

            {/* Footer Completo */}
            <footer className="app-footer">
              <div className="footer-container">
                <div className="footer-content">
                  <div className="footer-section">
                    <h4>Marly Handmade</h4>
                    <p>Creando piezas únicas con amor y dedicación artesanal desde 2020.</p>
                    <div className="social-links">
                      <button className="social-btn" title="Facebook" onClick={() => alert('Facebook pronto')}>
                        <i className="fab fa-facebook"></i>
                      </button>
                      <button className="social-btn" title="Instagram" onClick={() => alert('Instagram pronto')}>
                        <i className="fab fa-instagram"></i>
                      </button>
                      <button className="social-btn" title="WhatsApp" onClick={() => alert('WhatsApp pronto')}>
                        <i className="fab fa-whatsapp"></i>
                      </button>
                      <button className="social-btn" title="Pinterest" onClick={() => alert('Pinterest pronto')}>
                        <i className="fab fa-pinterest"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="footer-section">
                    <h4>Categorías</h4>
                    <ul>
                      <li><Link to="/anillos">Anillos</Link></li>
                      <li><Link to="/aretes">Aretes</Link></li>
                      <li><Link to="/brazaletes">Brazaletes</Link></li>
                      <li><Link to="/collares">Collares</Link></li>
                      <li><Link to="/aros">Aros</Link></li>
                    </ul>
                  </div>
                  
                  <div className="footer-section">
                    <h4>Enlaces Útiles</h4>
                    <ul>
                      <li><Link to="/nosotros">Sobre Nosotros</Link></li>
                      <li><Link to="/contacto">Contacto</Link></li>
                      <li><Link to="/preguntas">Preguntas Frecuentes</Link></li>
                      <li><Link to="/terminos">Términos y Condiciones</Link></li>
                      <li><Link to="/privacidad">Política de Privacidad</Link></li>
                    </ul>
                  </div>
                  
                  <div className="footer-section">
                    <h4>Contacto</h4>
                    <div className="contact-info">
                      <p><i className="fas fa-map-marker-alt"></i> Av. Principal 123, Lima, Perú</p>
                      <p><i className="fas fa-phone"></i> +51 987 654 321</p>
                      <p><i className="fas fa-envelope"></i> hola@marlyhandmade.com</p>
                      <p><i className="fas fa-clock"></i> Lun-Sáb: 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="footer-bottom">
                  <div className="payment-methods">
                    <span>Aceptamos:</span>
                    <i className="fab fa-cc-visa" title="Visa"></i>
                    <i className="fab fa-cc-mastercard" title="MasterCard"></i>
                    <i className="fab fa-cc-paypal" title="PayPal"></i>
                    <i className="fas fa-money-bill-wave" title="Efectivo"></i>
                  </div>
                  <p>&copy; 2024 Marly Handmade. Todos los derechos reservados. | Hecho con <i className="fas fa-heart" style={{color: '#e74c3c'}}></i> en Perú</p>
                </div>
              </div>
            </footer>

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