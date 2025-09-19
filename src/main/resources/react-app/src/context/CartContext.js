// src/context/CartContext.js (COMPLETA Y CORREGIDA)
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext();

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;
    
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.idProducto === action.payload.idProducto);
      
      if (existingItem) {
        return state.map(item =>
          item.idProducto === action.payload.idProducto
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
    
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.idProducto !== action.payload);
    
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return state.filter(item => item.idProducto !== action.payload.idProducto);
      }
      return state.map(item =>
        item.idProducto === action.payload.idProducto
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    console.log('🔄 Cargando carrito desde localStorage...');
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('📦 Carrito cargado:', savedCart);
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    } catch (error) {
      console.error('❌ Error al cargar carrito:', error);
      dispatch({ type: 'LOAD_CART', payload: [] });
    }
    setIsLoaded(true);
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isLoaded) {
      console.log('💾 Guardando carrito en localStorage:', cartItems);
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        console.log('✅ Carrito guardado exitosamente');
      } catch (error) {
        console.error('❌ Error al guardar carrito:', error);
      }
    }
  }, [cartItems, isLoaded]);

  // Función para agregar producto al carrito
  const addToCart = (product) => {
    console.log('➕ Agregando al carrito:', product);
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  // Función para eliminar producto del carrito
  const removeFromCart = (productId) => {
    console.log('➖ Eliminando del carrito:', productId);
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  // Función para actualizar cantidad
  const updateQuantity = (productId, quantity) => {
    console.log('🔄 Actualizando cantidad:', productId, quantity);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { idProducto: productId, quantity } });
  };

  // Función para calcular el total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  // Función para limpiar el carrito
  const clearCart = () => {
    console.log('🧹 Limpiando carrito');
    dispatch({ type: 'CLEAR_CART' });
  };

  // Función para obtener la cantidad total de items
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartItemsCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Función para leer directamente del localStorage
export const getCartCountFromStorage = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  } catch (error) {
    console.error('Error reading cart from storage:', error);
    return 0;
  }
};

export default CartContext;