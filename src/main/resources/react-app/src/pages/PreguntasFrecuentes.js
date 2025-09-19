import React, { useState, useEffect } from 'react';
import '../components/Products.css';

const PreguntasFrecuentes = () => {
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

        <div className="products-page" style={{maxWidth: '800px', margin: '2rem auto', padding: '1rem'}}>
    <h1 className='page-title'>Preguntas Frecuentes</h1>
    <div class="faq">
        <h2>¿Qué es este proyecto?</h2>
        <div class="answer">Este proyecto es una herramienta de desarrollo diseñada para facilitar la gestión y creación de aplicaciones web.</div>
    </div>
    <div class="faq">
        <h2 class="question">¿Cómo puedo instalar la herramienta?</h2>
        <div class="answer">Puedes instalar la herramienta siguiendo las instrucciones en la sección de instalación de la documentación oficial.</div>
    </div>
    <div class="faq">
        <h2 class="question">¿Dónde puedo reportar errores?</h2>
        <div class="answer">Los errores pueden ser reportados en el repositorio de GitHub en la sección de "Issues".</div>
    </div>
    <div class="faq">
        <h2 class="question">¿La herramienta es gratuita?</h2>
        <div class="answer">Sí, la herramienta es de código abierto y gratuita para uso personal y comercial.</div>
    </div>
    <div class="faq">
        <h2 class="question">¿Dónde encuentro la documentación?</h2>
        <div class="answer">La documentación está disponible en el sitio web oficial y en el repositorio de GitHub.</div>
    </div>
</div>
    );
}
export default PreguntasFrecuentes;