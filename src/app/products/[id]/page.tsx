'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  originalPrice?: string;
  sku: string;
  stockQuantity: number;
  categoryId: number;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart: addToCartContext, openCart } = useCart();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      const success = await addToCartContext(product.id, quantity);
      
      if (success) {
        // Open cart sidebar immediately after adding item
        openCart();
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    await addToCart();
    router.push('/cart');
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-600 mb-8">
          <button onClick={() => router.push('/')} className="hover:text-blue-600">
            Home
          </button>
          <span className="mx-2">/</span>
          <button onClick={() => router.push('/products')} className="hover:text-blue-600">
            Products
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
              </svg>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {product.category?.name || 'Product'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.stockQuantity > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} In Stock` : 'Out of Stock'}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* SKU */}
            <p className="text-gray-600">
              SKU: <span className="font-mono font-semibold">{product.sku}</span>
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blue-600">
                AED {parseFloat(product.price).toFixed(2)}
              </span>
              {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                <span className="text-xl text-gray-500 line-through">
                  AED {parseFloat(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-16 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stockQuantity}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Available: {product.stockQuantity} units
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={addToCart}
                  disabled={product.stockQuantity === 0 || addingToCart}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 text-lg disabled:opacity-50"
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding to Cart...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart
                    </div>
                  )}
                </Button>

                <Button
                  onClick={buyNow}
                  disabled={product.stockQuantity === 0 || addingToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 text-lg disabled:opacity-50"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Buy Now
                  </div>
                </Button>
              </div>

              <Button
                onClick={() => router.push('/products')}
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500 font-semibold py-3"
              >
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
