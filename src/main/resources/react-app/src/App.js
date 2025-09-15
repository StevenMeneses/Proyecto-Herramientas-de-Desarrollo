import React, { useState, useEffect } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch('/api/usuario/datos');
        if (response.ok) {
          const userData = await response.json();
          setUsuario(userData);
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      window.location.href = '/logout';
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header Superior con Iconos */}
      <header className="top-header">
        <div className="header-container">
          <div className="left-section">
            <div className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <i class="fa-solid fa-bars"></i>
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
            <h1 className="store-title">Marly Handmade</h1>
          </div>
          
          <div className="right-section">
            <a href="/favoritos" className="icon-link" title="Favoritos">
              <i className="fa-regular fa-heart"></i>
              <span className="icon-badge">3</span>
            </a>
            
            <a href="/carrito" className="icon-link" title="Carrito">
              <i className="fas fa-shopping-cart"></i>
              <span className="icon-badge">5</span>
            </a>
            
            <div className="user-dropdown">
              <button className="user-btn">
                <i class="fa-regular fa-user"></i>
                {usuario && (
                  <span className="user-name">
                    {usuario.nombre} {usuario.apellido}
                  </span>
                )}
                <i className="fas fa-chevron-down"></i>
              </button>
              
              <div className="dropdown-menu">
                <a href="/perfil" className="dropdown-item">
                  <i className="fas fa-user"></i>
                  Mi Perfil
                </a>
                <a href="/pedidos" className="dropdown-item">
                  <i className="fas fa-shopping-bag"></i>
                  Mis Pedidos
                </a>
                <a href="/configuracion" className="dropdown-item">
                  <i className="fas fa-cog"></i>
                  Configuración
                </a>
                <hr className="dropdown-divider" />
                <a href="/logout" className="dropdown-item logout-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Cerrar Sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Header Inferior con Categorías */}
      <nav className="categories-header">
        <div className="categories-container">
          <ul className="categories-list">
            <li><a href="/anillos"><i className="fas fa-ring"></i> Anillos</a></li>
            <li><a href="/aretes"><i className="fas fa-gem"></i> Aretes</a></li>
            <li><a href="/brazaletes"><i className="fas fa-bracelet"></i> Brazaletes</a></li>
            <li><a href="/aros"><i className="fas fa-circle"></i> Aros</a></li>
            <li><a href="/collares"><i className="fas fa-necklace"></i> Collares</a></li>
            <li><a href="/nuestro-trabajo"><i className="fas fa-hands"></i> Nuestro Trabajo</a></li>
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
            <li><a href="/anillos"><i className="fas fa-ring"></i> Anillos</a></li>
            <li><a href="/aretes"><i className="fas fa-gem"></i> Aretes</a></li>
            <li><a href="/brazaletes"><i className="fas fa-bracelet"></i> Brazaletes</a></li>
            <li><a href="/aros"><i className="fas fa-circle"></i> Aros</a></li>
            <li><a href="/collares"><i className="fas fa-necklace"></i> Collares</a></li>
            <li><a href="/nuestro-trabajo"><i className="fas fa-hands"></i> Nuestro Trabajo</a></li>
          </ul>
          
          <div className="mobile-user-menu">
            <a href="/perfil"><i className="fas fa-user"></i> Mi Perfil</a>
            <a href="/favoritos"><i className="fas fa-heart"></i> Favoritos</a>
            <a href="/carrito"><i className="fas fa-shopping-cart"></i> Carrito</a>
            <a href="/logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
          </div>
        </div>
      )}

      {/* Resto del contenido */}
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              {`¡Bienvenido${usuario && usuario.idRol === 2 ? 'a' : ''} a `}
              <span className="brand-highlight">Marly Handmade</span>!
            </h1>
            <p className="hero-subtitle">
              {usuario ? (
                <>
                  {usuario.idRol === 1 && 'Panel de Administración - Gestión completa del sistema'}
                  {usuario.idRol === 2 && 'Panel de Vendedor - Gestiona tus ventas y clientes'}
                  {usuario.idRol === 3 && 'Explora nuestro catálogo de productos artesanales'}
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
            <a href="/productos" className="action-card">
              <i className="fas fa-shopping-cart"></i>
              <h3>Ver Productos</h3>
              <p>Explora nuestra colección exclusiva</p>
            </a>
            
            <a href="/perfil" className="action-card">
              <i className="fas fa-user-edit"></i>
              <h3>Mi Perfil</h3>
              <p>Gestiona tu cuenta personal</p>
            </a>
            
            <a href="/pedidos" className="action-card">
              <i className="fas fa-clipboard-list"></i>
              <h3>Mis Pedidos</h3>
              <p>Revisa tus compras recientes</p>
            </a>
            
            {usuario && usuario.idRol === 1 && (
              <a href="/admin" className="action-card">
                <i className="fas fa-cog"></i>
                <h3>Administración</h3>
                <p>Panel de control del sistema</p>
              </a>
            )}
          </div>
        </section>
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
                <li><a href="/anillos">Anillos</a></li>
                <li><a href="/aretes">Aretes</a></li>
                <li><a href="/brazaletes">Brazaletes</a></li>
                <li><a href="/collares">Collares</a></li>
                <li><a href="/aros">Aros</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Enlaces Útiles</h4>
              <ul>
                <li><a href="/nosotros">Sobre Nosotros</a></li>
                <li><a href="/contacto">Contacto</a></li>
                <li><a href="/preguntas">Preguntas Frecuentes</a></li>
                <li><a href="/terminos">Términos y Condiciones</a></li>
                <li><a href="/privacidad">Política de Privacidad</a></li>
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
    </div>
  );
}

export default App;