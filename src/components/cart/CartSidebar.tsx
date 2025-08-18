'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

export default function CartSidebar() {
  const router = useRouter();
  const { 
    items, 
    isOpen, 
    closeCart, 
    itemCount, 
    subtotal, 
    removeFromCart, 
    updateQuantity 
  } = useCart();

  const goToCart = () => {
    closeCart();
    router.push('/cart');
  };

  // Add/remove body class for pushing content
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cart-sidebar-open');
    } else {
      document.body.classList.remove('cart-sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('cart-sidebar-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar - No backdrop, responsive right corner */}
      <div className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <p className="text-blue-100 text-sm">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="text-white hover:text-blue-200 p-1 rounded-full hover:bg-blue-500/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Cart Subtotal ({itemCount} items):</p>
            <p className="text-2xl font-bold text-gray-900">
              AED {subtotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-3">
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Product Name */}
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                        {item.productName}
                      </h3>
                      
                      {/* SKU */}
                      <p className="text-xs text-gray-500 mb-2">
                        SKU: {item.productSku}
                      </p>

                      {/* Price and Total */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            AED {parseFloat(item.price).toFixed(2)} each
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            Total: AED {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-3 py-1.5 font-medium text-gray-900 bg-gray-50 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3 bg-white">
            <Button
              onClick={goToCart}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 text-lg shadow-lg"
            >
              Go to Cart ({itemCount})
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2"
              onClick={closeCart}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
