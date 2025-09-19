import React, { useState, useEffect } from 'react';
import '../components/Products.css';

const Nosotros = () => {
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

        <div className="about-us-card" style={{
            maxWidth: '500px',
            margin: '2rem auto',
            padding: '2rem',
            background: 'var(--gold-light)',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center'
        }}>
            <i className="fas fa-users" style={{ fontSize: '2.5rem', color: 'var(--gold-primary)', marginBottom: '1rem' }}></i>
            <h2 style={{ marginBottom: '1rem' }}>Sobre Nosotros</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Somos un equipo apasionado por la joyería artesanal. Nuestra misión es crear piezas únicas que reflejen la belleza, la tradición y la innovación. Cada joya cuenta una historia y está hecha con dedicación y amor por el arte.
            </p>
        </div>
    );
}
export default Nosotros;