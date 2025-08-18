'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface CartItem {
  id: string;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  price: string;
  product?: {
    id: number;
    name: string;
    price: string;
    sku: string;
    stockQuantity: number;
    category?: {
      name: string;
    };
  };
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  loading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: number, quantity: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotalPrice: () => number;
  getItemQuantity: (productId: number) => number;
  getCartItem: (productId: number) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState<string>('');
  const pathname = usePathname();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

  const openCart = () => {
    // Don't open sidebar if we're already on the cart page
    if (pathname === '/cart') {
      return;
    }
    
    // Only open sidebar on shopping-related pages
    const shoppingPages = ['/products', '/products/'];
    const isShoppingPage = shoppingPages.some(page => pathname.startsWith(page)) || 
                          pathname.match(/^\/products\/\d+$/); // individual product pages
    
    if (isShoppingPage) {
      setIsOpen(true);
    }
  };
  const closeCart = () => setIsOpen(false);

  // Close sidebar when navigating to cart page
  useEffect(() => {
    if (pathname === '/cart') {
      setIsOpen(false);
    }
  }, [pathname]);
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const getItemQuantity = (productId: number): number => {
    const item = items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const getCartItem = (productId: number): CartItem | undefined => {
    return items.find(item => item.productId === productId);
  };

  const refreshCart = async () => {
    try {
      if (!cartId) {
        // Create a new cart if none exists
        const cartResponse = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: null }),
        });
        if (cartResponse.ok) {
          const newCart = await cartResponse.json();
          setCartId(newCart.id);
          localStorage.setItem('cartId', newCart.id);
        }
        return;
      }
      
      const response = await fetch(`/api/cart/items?cartId=${cartId}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId: number, quantity: number): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Ensure we have a cartId
      let currentCartId = cartId;
      if (!currentCartId) {
        const cartResponse = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: null }),
        });
        if (cartResponse.ok) {
          const newCart = await cartResponse.json();
          currentCartId = newCart.id;
          setCartId(currentCartId);
          localStorage.setItem('cartId', currentCartId);
        } else {
          return false;
        }
      }

      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: currentCartId,
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        await refreshCart();
        openCart(); // Open sidebar when item is added
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  useEffect(() => {
    // Get cartId from localStorage on component mount
    const savedCartId = localStorage.getItem('cartId');
    if (savedCartId) {
      setCartId(savedCartId);
    }
    refreshCart();
  }, [cartId]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        subtotal,
        loading,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
        getTotalPrice,
        getItemQuantity,
        getCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
