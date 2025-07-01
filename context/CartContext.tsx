import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/services/productsService';
import supermarketsData from '@/productos_supermercados_actualizado.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  [supermarketId: string]: CartItem[];
}

interface CartContextType {
  cart: Cart;
  addToCartInAllSupermarkets: (productName: string, brand: string, quantity?: number) => void;
  removeFromCart: (supermarketId: string, productId: string) => void;
  updateQuantity: (supermarketId: string, productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemQuantity: (supermarketId: string, productId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: (supermarketId?: string) => number;
  // Métodos antiguos (deprecated)
  cartItems: CartItem[]; // deprecated
  addToCart: (product: Product, quantity?: number) => void; // deprecated
  isInCart: (productId: string) => boolean; // deprecated
  removeFromCartDeprecated?: (productId: string) => void; // deprecated
  updateQuantityDeprecated?: (productId: string, quantity: number) => void; // deprecated
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({});
  const [loading, setLoading] = useState(true);

  // Cargar carrito desde AsyncStorage al iniciar
  useEffect(() => {
    (async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (e) {
        console.error('Error loading cart from storage', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Guardar carrito en AsyncStorage cada vez que cambie
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem('cart', JSON.stringify(cart)).catch(e => {
        console.error('Error saving cart to storage', e);
      });
    }
  }, [cart, loading]);

  // Nueva función: agrega el producto a todos los supermercados donde esté disponible
  const addToCartInAllSupermarkets = (productName: string, brand: string, quantity: number = 1) => {
    const supermarkets = (supermarketsData as any).supermarkets;
    let updatedCart = { ...cart };
    supermarkets.forEach((supermarket: any) => {
      const foundProduct = supermarket.products.find(
        (p: any) => p.name === productName && p.brand === brand
      );
      if (foundProduct) {
        const existingItems = updatedCart[supermarket.id] || [];
        const existingItem = existingItems.find(item => item.product.id === foundProduct.id);
        if (existingItem) {
          // Si ya existe, aumentar la cantidad
          updatedCart[supermarket.id] = existingItems.map(item =>
            item.product.id === foundProduct.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Si no existe, agregar nuevo item
          updatedCart[supermarket.id] = [...existingItems, { product: foundProduct, quantity }];
        }
      }
    });
    setCart(updatedCart);
  };

  const removeFromCart = (supermarketId: string, productId: string) => {
    setCart(prevCart => {
      const updated = { ...prevCart };
      updated[supermarketId] = (updated[supermarketId] || []).filter(item => item.product.id !== productId);
      if (updated[supermarketId].length === 0) delete updated[supermarketId];
      return updated;
    });
  };

  const updateQuantity = (supermarketId: string, productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(supermarketId, productId);
      return;
    }
    setCart(prevCart => {
      const updated = { ...prevCart };
      updated[supermarketId] = (updated[supermarketId] || []).map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return updated;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const getCartItemQuantity = (supermarketId: string, productId: string) => {
    const items = cart[supermarketId] || [];
    const item = items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, items) =>
      total + items.reduce((t, item) => t + item.quantity, 0), 0
    );
  };

  const getTotalPrice = (supermarketId?: string) => {
    if (supermarketId) {
      return (cart[supermarketId] || []).reduce((total, item) => {
        const price = item.product.price || 0;
        return total + (price * item.quantity);
      }, 0);
    }
    // Total de todos los supermercados
    return Object.values(cart).reduce((total, items) =>
      total + items.reduce((t, item) => t + (item.product.price || 0) * item.quantity, 0), 0
    );
  };

  // Métodos antiguos (deprecated)
  const cartItems: CartItem[] = Object.values(cart).flat();
  const addToCart = (product: Product, quantity: number = 1) => {
    // Solo para compatibilidad: agrega al primer supermercado que lo tenga
    const supermarkets = (supermarketsData as any).supermarkets;
    for (const supermarket of supermarkets) {
      const foundProduct = supermarket.products.find((p: any) => p.id === product.id);
      if (foundProduct) {
        const existingItems = cart[supermarket.id] || [];
        const existingItem = existingItems.find(item => item.product.id === foundProduct.id);
        if (existingItem) {
          updateQuantity(supermarket.id, foundProduct.id, existingItem.quantity + quantity);
        } else {
          setCart(prevCart => ({
            ...prevCart,
            [supermarket.id]: [...existingItems, { product: foundProduct, quantity }]
          }));
        }
        break;
      }
    }
  };
  const isInCart = (productId: string) => {
    return Object.values(cart).some(items => items.some(item => item.product.id === productId));
  };
  const removeFromCartDeprecated = (productId: string) => {
    setCart(prevCart => {
      const updated = { ...prevCart };
      Object.keys(updated).forEach(supermarketId => {
        updated[supermarketId] = (updated[supermarketId] || []).filter(item => item.product.id !== productId);
        if (updated[supermarketId].length === 0) delete updated[supermarketId];
      });
      return updated;
    });
  };
  const updateQuantityDeprecated = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const updated = { ...prevCart };
      Object.keys(updated).forEach(supermarketId => {
        updated[supermarketId] = (updated[supermarketId] || []).map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      });
      return updated;
    });
  };

  if (loading) return null;

  return (
    <CartContext.Provider value={{
      cart,
      addToCartInAllSupermarkets,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemQuantity,
      getTotalItems,
      getTotalPrice,
      // Métodos antiguos (deprecated)
      cartItems,
      addToCart,
      isInCart,
      removeFromCartDeprecated,
      updateQuantityDeprecated
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};