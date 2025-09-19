import React, { useState, useEffect } from 'react';
import '../components/Products.css';

const Contacto = () => {
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/usuario/datos', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error obteniendo datos del usuario:', error);
            }
        };

        fetchUserData();
    }, []);

    return (

        <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">Contacto</h1>
        <p className="page-subtitle">
          ¿Tienes alguna pregunta o comentario? ¡Contáctanos!
        </p>
      </div>
      <div className="hero-content" style={{textAlign: 'center', marginBottom: '3rem'}}>
        <form style={{maxWidth: '400px', margin: '0 auto', textAlign: 'left'}}>
          <div style={{marginBottom: '1rem'}}>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              required
              style={{width: '100%', padding: '0.5rem'}}
            />
          </div>
          <div style={{marginBottom: '1rem'}}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
              style={{width: '100%', padding: '0.5rem'}}
            />
          </div>
          <div style={{marginBottom: '1rem'}}>
            <label>Mensaje:</label>
            <textarea
              name="mensaje"
              required
              rows={4}
              style={{width: '100%', padding: '0.5rem'}}
            />
          </div>
          <button className="btn-primary" type="submit">Enviar</button>
        </form>
      </div>
    </div>
    );
}
export default Contacto;