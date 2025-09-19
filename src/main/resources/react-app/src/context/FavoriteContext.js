// src/context/FavoriteContext.js (COMPLETA Y CORREGIDA)
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const FavoritesContext = createContext();

// Reducer para manejar las acciones de favoritos
const favoriteReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_FAVORITES':
      return action.payload;
    
    case 'ADD_TO_FAVORITES':
      // Evitar duplicados
      if (state.find(item => item.idProducto === action.payload.idProducto)) {
        return state;
      }
      return [...state, action.payload];
    
    case 'REMOVE_FROM_FAVORITES':
      return state.filter(item => item.idProducto !== action.payload);
    
    case 'CLEAR_FAVORITES':
      return [];
    
    default:
      return state;
  }
};

// Proveedor del contexto
export const FavoritesProvider = ({ children }) => {
  const [favorites, dispatch] = useReducer(favoriteReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar favoritos desde localStorage al inicializar
  useEffect(() => {
    console.log('🔄 Cargando favoritos desde localStorage...');
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      console.log('❤️ Favoritos cargados:', savedFavorites);
      dispatch({ type: 'LOAD_FAVORITES', payload: savedFavorites });
    } catch (error) {
      console.error('❌ Error al cargar favoritos:', error);
      dispatch({ type: 'LOAD_FAVORITES', payload: [] });
    }
    setIsLoaded(true);
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    if (isLoaded) {
      console.log('💾 Guardando favoritos en localStorage:', favorites);
      try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log('✅ Favoritos guardados exitosamente');
      } catch (error) {
        console.error('❌ Error al guardar favoritos:', error);
      }
    }
  }, [favorites, isLoaded]);

  // Función para agregar a favoritos
  const addToFavorites = (product) => {
    console.log('❤️ Agregando a favoritos:', product);
    dispatch({ type: 'ADD_TO_FAVORITES', payload: product });
  };

  // Función para eliminar de favoritos
  const removeFromFavorites = (productId) => {
    console.log('💔 Eliminando de favoritos:', productId);
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
  };

  // Función para verificar si un producto es favorito
  const isFavorite = (productId) => {
    return favorites.some(item => item.idProducto === productId);
  };

  // Función para limpiar favoritos
  const clearFavorites = () => {
    console.log('🧹 Limpiando favoritos');
    dispatch({ type: 'CLEAR_FAVORITES' });
  };

  // Función para obtener la cantidad de favoritos
  const getFavoritesCount = () => {
    return favorites.length;
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites,
      getFavoritesCount
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }
  return context;
};

// Función para leer directamente del localStorage
export const getFavoritesCountFromStorage = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.length;
  } catch (error) {
    console.error('Error reading favorites from storage:', error);
    return 0;
  }
};

export default FavoritesContext;