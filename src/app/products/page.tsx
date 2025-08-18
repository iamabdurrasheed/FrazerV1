'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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

interface ApiResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { 
    addToCart: addToCartContext, 
    loading: cartLoading, 
    getItemQuantity, 
    getCartItem, 
    updateQuantity, 
    removeFromCart 
  } = useCart();
  const categoryFilter = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const categories = [
    { id: '', name: 'All Categories', slug: '' },
    { id: '1', name: 'HVAC Products', slug: 'hvac' },
    { id: '2', name: 'Valves & Fittings', slug: 'valves' },
    { id: '3', name: 'Electrical Equipment', slug: 'electrical' },
    { id: '4', name: 'Plumbing & Pipes', slug: 'plumbing' },
    { id: '5', name: 'Adhesives & Sealants', slug: 'adhesives' },
    { id: '6', name: 'Pump Components', slug: 'pumps' },
    { id: '7', name: 'Welding Supplies', slug: 'welding' },
    { id: '8', name: 'Thermal Solutions', slug: 'thermal' },
    { id: '9', name: 'Solar Energy', slug: 'solar' },
    { id: '10', name: 'Safety Equipment', slug: 'safety' },
    { id: '11', name: 'Industrial Tools', slug: 'tools' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
  }, [categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        console.log('Failed to fetch products');
        setProducts([]);
        return;
      }
      
      const data: ApiResponse = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.log('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || product.categoryId.toString() === selectedCategory;
    const productPrice = parseFloat(product.price);
    const matchesPrice = (!priceRange.min || productPrice >= Number(priceRange.min)) &&
                        (!priceRange.max || productPrice <= Number(priceRange.max));
    
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
  };

  const addToCart = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setAddingToCart(productId);
      const success = await addToCartContext(productId, 1);
      
      if (success) {
        // Cart context already opens the sidebar
        console.log('Product added to cart successfully');
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleQuantityUpdate = async (productId: number, newQuantity: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = getCartItem(productId);
    if (!cartItem) return;

    try {
      if (newQuantity <= 0) {
        await removeFromCart(cartItem.id);
      } else {
        await updateQuantity(cartItem.id, newQuantity);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const openProductDetails = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">
      <Navigation />
      
      {/* Professional Header - No Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Industrial Products
              </h1>
              <p className="text-gray-600 text-lg">
                High-quality industrial and building materials from trusted manufacturers
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <span className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold">
                {products.length} Products Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-gray-50/95">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg"
              />
              <svg className="absolute left-4 top-4 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-4 h-6 w-6 text-gray-400 hover:text-gray-600"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            {/* Category Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex space-x-2 lg:col-span-2">
              <input
                type="number"
                placeholder="Min AED"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max AED"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Clear Filters */}
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500 font-medium py-3"
            >
              Clear All
            </Button>
          </div>

          {/* Results Summary and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-semibold text-gray-900">
                {filteredProducts.length} of {products.length} products
              </span>
              {selectedCategory && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 bg-white rounded-lg border-2 border-gray-300 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className={`bg-gray-200 rounded-2xl mb-4 ${viewMode === 'grid' ? 'h-64' : 'h-32'}`}></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={`group ${viewMode === 'list' ? 'flex space-x-6' : ''}`}>
                <div 
                  className={`bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden cursor-pointer ${viewMode === 'grid' ? 'h-full flex flex-col' : 'flex-1 flex space-x-6 p-6'}`}
                  onClick={() => openProductDetails(product.id)}
                >
                  {/* Product Image */}
                  <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'flex-shrink-0' : 'w-32 h-32 flex-shrink-0'}`}>
                    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${viewMode === 'grid' ? 'h-48' : 'h-full rounded-lg'}`}>
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
                      </svg>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                      {product.category?.name || 'Product'}
                    </div>

                    {/* Stock Badge */}
                    <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stockQuantity > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className={`${viewMode === 'grid' ? 'flex-1 p-6' : 'flex-1'} flex flex-col justify-between`}>
                    <div className="flex-1">
                      <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${viewMode === 'grid' ? 'text-lg' : 'text-xl'}`}>
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className={`text-gray-600 mb-4 line-clamp-3 leading-relaxed ${viewMode === 'grid' ? 'text-sm' : 'text-base'}`}>
                          {product.description}
                        </p>
                      )}

                      <div className={`text-blue-600 font-bold mb-4 ${viewMode === 'grid' ? 'text-xl' : 'text-2xl'}`}>
                        AED {parseFloat(product.price).toFixed(2)}
                        {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            AED {parseFloat(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full font-medium">
                          SKU: {product.sku}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {getItemQuantity(product.id) > 0 ? (
                          // Quantity controls for items already in cart
                          <div className="flex-1 flex items-center justify-between bg-green-50 border-2 border-green-200 rounded-lg p-2">
                            <button
                              onClick={(e) => handleQuantityUpdate(product.id, getItemQuantity(product.id) - 1, e)}
                              className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="font-semibold text-green-800 px-3">
                              {getItemQuantity(product.id)} in cart
                            </span>
                            <button
                              onClick={(e) => handleQuantityUpdate(product.id, getItemQuantity(product.id) + 1, e)}
                              className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          // Add to Cart button for items not in cart
                          <Button 
                            onClick={(e) => addToCart(product.id, e)}
                            disabled={product.stockQuantity === 0 || addingToCart === product.id}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {addingToCart === product.id ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
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
                        )}

                        <Button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openProductDetails(product.id);
                          }}
                          variant="outline"
                          className="px-4 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-8 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No products found</h3>
            <p className="text-gray-500 text-xl mb-8 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your search or filter options.
            </p>
            <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
