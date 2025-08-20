'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { industrialCategories, getCategoryById, getPriceRangeForCategory, getAllSubcategories } from '@/lib/industrial-categories';

interface Product {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  price: string;
  originalPrice?: string;
  sku: string;
  brand?: string;
  model?: string;
  stockQuantity: number;
  minOrderQuantity?: number;
  unit?: string;
  specifications?: Record<string, string>;
  categoryId: number;
  images?: string[];
  isActive: boolean;
  isFeatured?: boolean;
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
  const subcategoryFilter = searchParams.get('subcategory');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryFilter || '');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Dynamic price range based on selected category/subcategory
  const dynamicPriceRange = React.useMemo(() => {
    return getPriceRangeForCategory(selectedCategory, selectedSubcategory);
  }, [selectedCategory, selectedSubcategory]);

  // Update price range when category changes
  useEffect(() => {
    setPriceRange(dynamicPriceRange);
  }, [dynamicPriceRange]);

  // Get available subcategories for selected category
  const availableSubcategories = React.useMemo(() => {
    const category = getCategoryById(selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory]);

  // Get all categories with "All Categories" option
  const categories = [
    { id: '', name: 'All Categories', slug: '' },
    ...industrialCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug
    }))
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
    if (subcategoryFilter) {
      setSelectedSubcategory(subcategoryFilter);
    }
  }, [categoryFilter, subcategoryFilter]);

  // Handle category change and update URL
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(''); // Reset subcategory when category changes
    
    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    params.delete('subcategory'); // Remove subcategory when category changes
    
    router.push(`/products?${params.toString()}`);
  };

  // Handle subcategory change and update URL
  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    
    const params = new URLSearchParams(searchParams.toString());
    if (subcategoryId) {
      params.set('subcategory', subcategoryId);
    } else {
      params.delete('subcategory');
    }
    
    router.push(`/products?${params.toString()}`);
  };

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
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || product.categoryId.toString() === selectedCategory;
    const matchesBrand = !selectedBrand || (product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase());
    const productPrice = parseFloat(product.price);
    const matchesPrice = productPrice >= priceRange.min && productPrice <= priceRange.max;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'brand':
        return (a.brand || '').localeCompare(b.brand || '');
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Get unique brands from products
  const availableBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort();

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setPriceRange({ min: 0, max: 10000 });
    setSelectedBrand('');
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

      {/* Enhanced Search and Filters Section */}
      <div className="border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for industrial products, brands, models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-14 pr-12 py-5 text-lg border-0 border-b-4 border-gray-200 focus:border-blue-500 focus:ring-0 bg-gray-50 rounded-t-xl transition-all duration-300 placeholder-gray-500 font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Compact Modern Filter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            {/* Category Filter Card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="p-3">
                <label className="text-xs font-bold text-gray-700 mb-2 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-2 py-2 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-700 font-medium transition-all duration-300 text-sm"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subcategory Filter Card - Only show if category is selected */}
            {selectedCategory && availableSubcategories.length > 0 && (
              <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="p-3">
                  <label className="text-xs font-bold text-gray-700 mb-2 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Subcategory
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                    className="w-full px-2 py-2 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-700 font-medium transition-all duration-300 text-sm"
                  >
                    <option value="">All Subcategories</option>
                    {availableSubcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Brand Filter Card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="p-3">
                <label className="text-xs font-bold text-gray-700 mb-2 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-2 py-2 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:bg-white text-gray-700 font-medium transition-all duration-300 text-sm"
                >
                  <option value="">All Brands</option>
                  {availableBrands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range Card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md lg:col-span-2">
              <div className="p-3">
                <label className="text-xs font-bold text-gray-700 mb-2 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Price Range (AED)
                  {(selectedCategory || selectedSubcategory) && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({dynamicPriceRange.min} - {dynamicPriceRange.max} AED)
                    </span>
                  )}
                </label>
                
                {/* Price Display */}
                <div className="mb-3 p-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="text-center text-sm font-bold text-orange-700">
                    {priceRange.min} - {priceRange.max} AED
                  </div>
                  {(selectedCategory || selectedSubcategory) && (
                    <div className="text-center text-xs text-orange-600 mt-1">
                      Category range: {dynamicPriceRange.min} - {dynamicPriceRange.max} AED
                    </div>
                  )}
                </div>

                {/* Dual Range Slider */}
                <div className="space-y-2">
                  <div className="relative">
                    <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
                    <input
                      type="range"
                      min={dynamicPriceRange.min}
                      max={dynamicPriceRange.max}
                      step="10"
                      value={Math.max(priceRange.min, dynamicPriceRange.min)}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value <= priceRange.max) {
                          setPriceRange(prev => ({ ...prev, min: value }));
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${(priceRange.min / dynamicPriceRange.max) * 100}%, #e5e7eb ${(priceRange.min / dynamicPriceRange.max) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
                    <input
                      type="range"
                      min={dynamicPriceRange.min}
                      max={dynamicPriceRange.max}
                      step="10"
                      value={Math.min(priceRange.max, dynamicPriceRange.max)}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= priceRange.min) {
                          setPriceRange(prev => ({ ...prev, max: value }));
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(priceRange.max / dynamicPriceRange.max) * 100}%, #f97316 ${(priceRange.max / dynamicPriceRange.max) * 100}%, #f97316 100%)`
                      }}
                    />
                  </div>
                </div>

                {/* Dynamic Quick Price Buttons */}
                <div className="grid grid-cols-4 gap-1 mt-2">
                  {(() => {
                    const range = dynamicPriceRange.max - dynamicPriceRange.min;
                    const quarter = Math.floor(range / 4);
                    return [
                      { 
                        label: `${dynamicPriceRange.min}-${dynamicPriceRange.min + quarter}`, 
                        min: dynamicPriceRange.min, 
                        max: dynamicPriceRange.min + quarter 
                      },
                      { 
                        label: `${dynamicPriceRange.min + quarter}-${dynamicPriceRange.min + quarter * 2}`, 
                        min: dynamicPriceRange.min + quarter, 
                        max: dynamicPriceRange.min + quarter * 2 
                      },
                      { 
                        label: `${dynamicPriceRange.min + quarter * 2}-${dynamicPriceRange.min + quarter * 3}`, 
                        min: dynamicPriceRange.min + quarter * 2, 
                        max: dynamicPriceRange.min + quarter * 3 
                      },
                      { 
                        label: `${dynamicPriceRange.min + quarter * 3}+`, 
                        min: dynamicPriceRange.min + quarter * 3, 
                        max: dynamicPriceRange.max 
                      }
                    ];
                  })().map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange({ min: range.min, max: range.max })}
                      className="px-1 py-1 text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-md transition-colors duration-200 font-medium"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort & Actions Card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="p-3">
                <label className="text-xs font-bold text-gray-700 mb-2 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-2 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white text-gray-700 font-medium transition-all duration-300 mb-2 text-sm"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="brand">Brand A-Z</option>
                </select>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50 font-semibold py-1 transition-all duration-300 rounded-lg text-xs"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Results Summary and View Toggle */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* Results Info & Active Filters */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
                    <span className="text-lg font-bold text-gray-900">
                      {filteredProducts.length}
                    </span>
                    <span className="text-gray-600 ml-1">
                      of {products.length} products
                    </span>
                  </div>
                  
                  {/* Active Filter Badges */}
                  {selectedCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <button
                        onClick={() => setSelectedCategory('')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {selectedBrand && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {selectedBrand}
                      <button
                        onClick={() => setSelectedBrand('')}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {(priceRange.min || priceRange.max) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      AED {priceRange.min || '0'} - {priceRange.max || '∞'}
                      <button
                        onClick={() => setPriceRange({ min: 0, max: 10000 })}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
                
                {/* Search Term Display */}
                {searchTerm && (
                  <div className="text-sm text-gray-600">
                    Searching for: <span className="font-medium text-gray-900">"{searchTerm}"</span>
                  </div>
                )}
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </button>
              </div>
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
                      {/* Brand and Model */}
                      {(product.brand || product.model) && (
                        <div className="flex items-center space-x-2 mb-2">
                          {product.brand && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs font-semibold rounded-md uppercase">
                              {product.brand}
                            </span>
                          )}
                          {product.model && (
                            <span className="text-gray-500 text-xs">
                              Model: {product.model}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${viewMode === 'grid' ? 'text-lg' : 'text-xl'}`}>
                        {product.name}
                      </h3>
                      
                      {(product.shortDescription || product.description) && (
                        <p className={`text-gray-600 mb-4 line-clamp-3 leading-relaxed ${viewMode === 'grid' ? 'text-sm' : 'text-base'}`}>
                          {product.shortDescription || product.description}
                        </p>
                      )}

                      {/* Technical Info */}
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                        <span>SKU: {product.sku}</span>
                        {product.unit && product.unit !== 'piece' && (
                          <span>Unit: {product.unit}</span>
                        )}
                        {product.minOrderQuantity && product.minOrderQuantity > 1 && (
                          <span>Min Order: {product.minOrderQuantity}</span>
                        )}
                      </div>

                      <div className={`text-blue-600 font-bold mb-4 ${viewMode === 'grid' ? 'text-xl' : 'text-2xl'}`}>
                        AED {parseFloat(product.price).toFixed(2)}
                        {product.unit && product.unit !== 'piece' && (
                          <span className="text-sm text-gray-500 ml-1">
                            /{product.unit}
                          </span>
                        )}
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
