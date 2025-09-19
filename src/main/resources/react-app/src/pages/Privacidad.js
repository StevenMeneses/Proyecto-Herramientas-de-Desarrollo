import React, { useState, useEffect } from 'react';
import '../components/Products.css';

const Privacidad = () => {
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

        <div className="products-page" style={{maxWidth: '900px', margin: '2rem auto', padding: '1rem'}}>
    <h1 className='page-title'>Política de Privacidad</h1>
    <div style={{textAlign: 'left', lineHeight: '1.6', fontSize: '1.1rem'}}>
        <h2>Información que recopilamos</h2>
        <p>Recopilamos información personal que usted nos proporciona directamente, como nombre, correo electrónico y cualquier otro dato que ingrese en nuestros formularios.</p>
    </div>
    <div style={{textAlign: 'left', lineHeight: '1.6', fontSize: '1.1rem'}}>
        <h2>Uso de la información</h2>
        <p>Utilizamos su información para mejorar nuestros servicios, responder a sus consultas y enviarle información relevante sobre nuestro sitio.</p>
    </div>
    <div style={{textAlign: 'left', lineHeight: '1.6', fontSize: '1.1rem'}}>
        <h2>Protección de datos</h2>
        <p>Implementamos medidas de seguridad para proteger sus datos personales y evitar accesos no autorizados.</p>
    </div>
    <div style={{textAlign: 'left', lineHeight: '1.6', fontSize: '1.1rem'}}>
        <h2>Compartir información</h2>
        <p>No compartimos su información personal con terceros, salvo que sea requerido por ley.</p>
    </div>
    <div style={{textAlign: 'left', lineHeight: '1.6', fontSize: '1.1rem'}}>
        <h2>Derechos del usuario</h2>
        <p>Usted puede solicitar el acceso, rectificación o eliminación de sus datos personales en cualquier momento contactándonos a través de nuestro correo electrónico.</p>
    </div>
    <div style={{textAlign: 'left', lineHeight: '1.6', fontSize: '1.1rem'}}>
        <h2>Cambios en la política</h2>
        <p>Nos reservamos el derecho de modificar esta política de privacidad. Cualquier cambio será publicado en esta página.</p>
    </div>
    <div style={{height: '50px'}}></div>
        <p>Última actualización: 19 de septiembre de 2025</p>
    </div>
    );
}
export default Privacidad;