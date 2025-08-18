'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some products to get started with your order.</p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg">
              {items.map((item) => (
                <div key={item.id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0">
                      <img
                        src="/placeholder.svg"
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            <Link href={`/products/${item.productId}`} className="hover:text-blue-600">
                              {item.productName}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm">SKU: {item.productSku}</p>
                          <p className="text-gray-600 text-sm">
                            {item.product?.stockQuantity && item.product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            AED {parseFloat(item.price).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Total: AED {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Quantity and Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">AED {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      AED {getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium">
                  Proceed to Checkout
                </Button>
                <Link href="/products">
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
              

            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
