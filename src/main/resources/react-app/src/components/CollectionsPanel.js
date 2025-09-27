import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function CollectionsPanel({ isOpen, onClose }) {
    const panelRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <div 
            ref={panelRef}
            className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-lg border border-gray-200 z-50 mt-2 animate-in slide-in-from-top-2 duration-300"
        >
            <div className="flex min-h-[400px]">
                
                {/* Columna izquierda - Navegación */}
                <div className="w-[30%] bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 p-6">
                    <ul className="space-y-1">
                        <li>
                            <button 
                                onClick={() => handleNavigation('/collections/featured')}
                                className="w-full text-left px-4 py-3 text-gray-900 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                            >
                                Featured
                            </button>
                        </li>
                        
                        <li className="mt-6">
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">CATEGORY</div>
                        </li>
                        {['Bracelets', 'Earrings', 'Necklaces', 'Rings'].map((item) => (
                            <li key={item}>
                                <button 
                                    onClick={() => handleNavigation(`/collections/${item.toLowerCase()}`)}
                                    className="w-full text-left px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-blue-300"
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                        
                        <li className="mt-6">
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">MATERIAL</div>
                        </li>
                        {['Polymer Clay', 'Copper Wire', 'Resin', 'Textile', 'Invisible Thread'].map((item) => (
                            <li key={item}>
                                <button 
                                    onClick={() => handleNavigation(`/collections/material/${item.toLowerCase().replace(' ', '-')}`)}
                                    className="w-full text-left px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-blue-300"
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Columna derecha - Contenido */}
                <div className="w-[70%] p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center relative">
                        Collections
                        <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                        {/* Mismas cards que ShopPanel pero para collections */}
                        {[
                            { name: 'SEA COLLECTION', desc: 'Colección marina', emoji: '🌊', color: 'blue' },
                            { name: 'MATARITA COLLECTION', desc: 'Colección tropical', emoji: '☀️', color: 'orange' },
                            { name: 'SEA COLLECTION', desc: 'Inspirado en el océano', emoji: '🐚', color: 'green' },
                            { name: 'MATARITA COLLECTION', desc: 'Estilo veraniego', emoji: '🌴', color: 'purple' }
                        ].map((item, index) => (
                            <div 
                                key={index}
                                onClick={() => handleNavigation(`/collections/${item.name.toLowerCase().replace(' ', '-')}`)}
                                className={`group cursor-pointer border-2 border-gray-200 rounded-xl p-6 hover:border-${item.color}-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white`}
                            >
                                <div className="text-center">
                                    <div className={`w-12 h-12 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-white font-bold text-lg">{item.emoji}</span>
                                    </div>
                                    <h4 className={`text-lg font-bold text-gray-900 group-hover:text-${item.color}-600 transition-colors mb-2`}>
                                        {item.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollectionsPanel;