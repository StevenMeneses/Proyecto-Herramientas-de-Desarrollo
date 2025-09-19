// src/pages/Configuracion.js
import React, { useState } from 'react';
import '../components/Configuracion.css';

const Configuracion = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
    },
    cookies: {
      necessary: true,
      analytics: false,
      marketing: false
    },
    permissions: {
      camera: false,
      location: false,
      contacts: false
    }
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelectChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  return (
    <div className="configuracion-container">
      <h1>Configuración</h1>
      
      <div className="settings-sections">
        {/* Notificaciones */}
        <div className="settings-card">
          <h2><i className="fas fa-bell"></i> Notificaciones</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Notificaciones por Email</h3>
              <p>Recibe notificaciones sobre tus pedidos y promociones por correo electrónico</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.notifications.email}
                onChange={() => handleToggle('notifications', 'email')}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Notificaciones Push</h3>
              <p>Permite notificaciones en tu navegador</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.notifications.push}
                onChange={() => handleToggle('notifications', 'push')}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Notificaciones SMS</h3>
              <p>Recibe mensajes de texto sobre tus pedidos importantes</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.notifications.sms}
                onChange={() => handleToggle('notifications', 'sms')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        
        {/* Privacidad */}
        <div className="settings-card">
          <h2><i className="fas fa-lock"></i> Privacidad</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Visibilidad del Perfil</h3>
              <p>Quién puede ver tu perfil público</p>
            </div>
            <select 
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSelectChange('privacy', 'profileVisibility', e.target.value)}
              className="setting-select"
            >
              <option value="public">Público</option>
              <option value="friends">Solo amigos</option>
              <option value="private">Privado</option>
            </select>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Compartir datos para análisis</h3>
              <p>Permitir que utilicemos tus datos de forma anónima para mejorar nuestros servicios</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.privacy.dataSharing}
                onChange={() => handleToggle('privacy', 'dataSharing')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        
        {/* Cookies */}
        <div className="settings-card">
          <h2><i className="fas fa-cookie"></i> Preferencias de Cookies</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Cookies Necesarias</h3>
              <p>Estas cookies son esenciales para el funcionamiento del sitio web</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.cookies.necessary}
                onChange={() => handleToggle('cookies', 'necessary')}
                disabled
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Cookies Analíticas</h3>
              <p>Nos ayudan a entender cómo interactúas con nuestro sitio web</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.cookies.analytics}
                onChange={() => handleToggle('cookies', 'analytics')}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Cookies de Marketing</h3>
              <p>Se utilizan para rastrear visitantes en los sitios web y mostrar anuncios relevantes</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.cookies.marketing}
                onChange={() => handleToggle('cookies', 'marketing')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        
        {/* Permisos */}
        <div className="settings-card">
          <h2><i className="fas fa-shield-alt"></i> Permisos de la App</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Acceso a la Cámara</h3>
              <p>Permitir el uso de la cámara para subir fotos de perfil o productos</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.permissions.camera}
                onChange={() => handleToggle('permissions', 'camera')}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Acceso a la Ubicación</h3>
              <p>Permitir conocer tu ubicación para ofrecerte servicios cercanos</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.permissions.location}
                onChange={() => handleToggle('permissions', 'location')}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Acceso a Contactos</h3>
              <p>Permitir acceder a tus contactos para invitarlos a la plataforma</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.permissions.contacts}
                onChange={() => handleToggle('permissions', 'contacts')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;