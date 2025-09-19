import React, { useState, useEffect } from 'react';
import '../components/Products.css';

const TerminosCondiciones = () => {
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
    <h1 className='page-title'>Términos y Condiciones</h1>
    <p>Bienvenido a nuestro sitio web. Al acceder y utilizar este sitio, aceptas cumplir con los siguientes términos y condiciones:</p>
    
    <h2>1. Uso del sitio</h2>
    <p>El contenido de este sitio es solo para información general. Nos reservamos el derecho de modificar o eliminar cualquier parte del contenido sin previo aviso.</p>
    
    <h2>2. Propiedad intelectual</h2>
    <p>Todos los materiales, textos, imágenes y logotipos son propiedad de sus respectivos dueños y están protegidos por las leyes de derechos de autor.</p>
    
    <h2>3. Responsabilidad</h2>
    <p>No nos hacemos responsables por daños o pérdidas derivados del uso de este sitio web.</p>
    
    <h2>4. Enlaces externos</h2>
    <p>Este sitio puede contener enlaces a sitios externos. No tenemos control sobre el contenido de esos sitios y no asumimos ninguna responsabilidad por ellos.</p>
    
    <h2>5. Modificaciones</h2>
    <p>Nos reservamos el derecho de actualizar estos términos y condiciones en cualquier momento. Te recomendamos revisarlos periódicamente.</p>
    
    <h2>6. Contacto</h2>
    <p>Si tienes alguna pregunta sobre estos términos y condiciones, puedes contactarnos a través del formulario de contacto.</p>
</div>
    );
}
export default TerminosCondiciones;