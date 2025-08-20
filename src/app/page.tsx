'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: {
    id: number;
    name: string;
    description?: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  images?: string[];
  image?: string;
  isActive: boolean;
  stockQuantity: number;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Cart functionality
  const { addToCart: addItemToCart, getItemQuantity, getCartItem, updateQuantity, removeFromCart } = useCart();

  // Helper function to safely convert price to number
  const toNumber = (value: string | number): number => {
    return typeof value === 'string' ? parseFloat(value) : value;
  };

  // Helper function to format price
  const formatPrice = (price: string | number): string => {
    return toNumber(price).toFixed(2);
  };

  // Cart functionality
  const addToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    setAddingToCart(productId);
    try {
      await addItemToCart(parseInt(productId), 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleQuantityUpdate = async (productId: string, newQuantity: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = getCartItem(parseInt(productId));
    if (!cartItem) return;

    if (newQuantity <= 0) {
      await removeFromCart(cartItem.id);
    } else {
      await updateQuantity(cartItem.id, newQuantity);
    }
  };

  // Product showcase carousel data
  const productShowcase = [
    {
      title: "Premium Industrial & Building Materials",
      subtitle: "Leading supplier of HVAC, valves, electrical, plumbing and industrial materials in UAE. Your trusted partner for quality products from global manufacturers.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      backgroundColor: "bg-gradient-to-r from-blue-600 to-blue-800",
      buttonText: "EXPLORE PRODUCTS",
      secondaryButtonText: "VIEW CATEGORIES",
      link: "/products",
      secondaryLink: "/categories",
      isHero: true
    },
    {
      title: "ABB Industriovate",
      subtitle: "Powering industrial innovation with ABB's advanced control solutions global expertise, reliable performance, and cutting-edge efficiency.",
      image: "/ABB%20sol.jpg",
      backgroundColor: "bg-gradient-to-r from-slate-400 to-slate-500",
      buttonText: "SHOP NOW",
      link: "/products?category=electrical"
    },
    {
      title: "Valve Products",
      subtitle: "Precision-engineered for peak performance. FGV valves ensure flawless flow control across industrial applications—trusted, durable, and globally proven.",
      image: "/Valveplace.png",
      backgroundColor: "bg-gradient-to-r from-orange-400 to-red-500",
      buttonText: "SHOP NOW",
      link: "/products?category=valves"
    },
    {
      title: "Plumbing",
      subtitle: "Explore expert reviews, in-depth comparisons, and the latest trends in plumbing products. Get reliable recommendations to make the best choices for your business.",
      image: "/plumbing-material-suppliers-in-dubai.jpg",
      backgroundColor: "bg-gradient-to-r from-amber-300 to-orange-400",
      buttonText: "SHOP NOW",
      link: "/products?category=plumbing"
    },
    {
      title: "Solar Energy & Adhesives",
      subtitle: "Sustainable energy solutions and industrial-grade adhesives for modern applications.",
      image: "/SolarEnergyandAdhesive.jpg",
      backgroundColor: "bg-gradient-to-r from-blue-400 to-blue-600",
      buttonText: "SHOP NOW",
      link: "/products?category=solar"
    }
  ];

  const totalSlides = productShowcase.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('featured-products');
    if (nextSection) {
      nextSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=12');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      
      // The API returns { products: [...], pagination: {...} }
      if (data.products) {
        setFeaturedProducts(data.products || []);
      } else {
        console.error('API returned unexpected structure:', data);
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen w-full overflow-x-hidden">
      <Navigation />
      
      {/* Product Showcase Carousel */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {productShowcase.map((slide, index) => (
            <div 
              key={index} 
              className="min-w-full h-full relative overflow-hidden"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: slide.title === "Solar Energy & Adhesives" ? 'cover' : 'cover',
                backgroundPosition: slide.title === "Solar Energy & Adhesives" ? 'center' : 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: slide.title === "Solar Energy & Adhesives" ? '#f8fafc' : 'transparent'
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* Content overlay */}
              <div className="relative z-10 h-full flex items-center justify-start px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
                <div className="max-w-2xl text-white">
                  {!slide.isHero && (
                    <p className="text-sm sm:text-base md:text-lg mb-2 opacity-90">Products</p>
                  )}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed opacity-90 max-w-xl">
                    {slide.subtitle}
                  </p>
                  {slide.isHero ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={slide.link}>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                          {slide.buttonText}
                        </Button>
                      </Link>
                      <Link href={slide.secondaryLink}>
                        <Button className="bg-white/20 border border-white text-white hover:bg-white hover:text-gray-900 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                          {slide.secondaryButtonText}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Link href={slide.link}>
                      <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-md text-sm sm:text-base transition-all duration-300 transform hover:scale-105">
                        {slide.buttonText}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scroll Down Icon - Hidden on mobile, positioned appropriately on larger screens */}
        <div className="absolute bottom-8 sm:bottom-28 md:bottom-32 lg:bottom-36 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <button
            onClick={scrollToNextSection}
            className="group flex flex-col items-center text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll to next section"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center mb-2 transition-all duration-300 group-hover:animate-bounce">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-medium opacity-75 group-hover:opacity-100 transition-opacity duration-300">
              Scroll Down
            </span>
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {productShowcase.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div id="featured-products" className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Featured <span className="text-blue-500">Products</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mx-auto px-4 max-w-4xl">
              Premium industrial materials from trusted global manufacturers
            </p>
            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-1 bg-blue-500 mx-auto mt-4 sm:mt-6 md:mt-8 rounded"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-2xl mb-4 sm:mb-6 shadow-lg"></div>
                  <div className="h-4 sm:h-5 md:h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2 sm:mb-3"></div>
                  <div className="h-4 sm:h-5 md:h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden cursor-pointer h-full flex flex-col min-h-[420px] sm:min-h-[450px] md:min-h-[480px]">
                    {/* Product Image */}
                    <div className="relative overflow-hidden flex-shrink-0">
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                          {product.name}
                        </h3>
                        
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                            {product.description}
                          </p>
                        )}

                        <div className="text-xl text-blue-600 font-bold mb-4">
                          AED {formatPrice(product.price)}
                          {product.originalPrice && toNumber(product.originalPrice) > toNumber(product.price) && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              AED {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {getItemQuantity(parseInt(product.id)) > 0 ? (
                          // Quantity controls for items already in cart
                          <div className="flex items-center justify-between bg-green-50 border-2 border-green-200 rounded-lg p-2">
                            <button
                              onClick={(e) => handleQuantityUpdate(product.id, getItemQuantity(parseInt(product.id)) - 1, e)}
                              className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="font-semibold text-green-800 px-3">
                              {getItemQuantity(parseInt(product.id))} in cart
                            </span>
                            <button
                              onClick={(e) => handleQuantityUpdate(product.id, getItemQuantity(parseInt(product.id)) + 1, e)}
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
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m0 0h15M4.5 18h15m0 0a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                              </div>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Check back later for featured products</p>
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Explore Our <span className="text-blue-500">Categories</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of industrial and building materials
            </p>
            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-1 bg-blue-500 mx-auto mt-4 sm:mt-6 rounded"></div>
          </div>
          
          {/* Static Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { name: 'HVAC Products', description: 'Heating, ventilation, and air conditioning systems', icon: '🏭', link: '/products?category=hvac' },
              { name: 'Valves', description: 'Industrial and commercial valve solutions', icon: '⚙️', link: '/products?category=valves' },
              { name: 'Electrical Equipment', description: 'Power distribution and electrical components', icon: '⚡', link: '/products?category=electrical' },
              { name: 'Plumbing & Fittings', description: 'Water systems and pipe fittings', icon: '🔧', link: '/products?category=plumbing' },
              { name: 'Adhesives & Lubricants', description: 'Industrial grade adhesives and lubricants', icon: '🧴', link: '/products?category=adhesives' },
              { name: 'Pump Spare Parts', description: 'Replacement parts for industrial pumps', icon: '🔩', link: '/products?category=pumps' },
              { name: 'Welding Equipment', description: 'Professional welding tools and supplies', icon: '🔥', link: '/products?category=welding' },
              { name: 'Heat Exchangers', description: 'Thermal management solutions', icon: '🌡️', link: '/products?category=heat-exchangers' }
            ].map((category, index) => (
              <Link key={index} href={category.link} className="group">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 md:mb-6">
                      {category.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 group-hover:text-blue-500 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-4 sm:mt-6 inline-flex items-center text-blue-500 font-semibold text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-300">
                      Explore <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gradient-to-br from-gray-50 via-blue-50/40 to-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 px-2">
              Why Choose <span className="text-blue-500">Frazer BMT</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium mx-auto leading-relaxed px-4 max-w-3xl">
              Your trusted partner for premium industrial and building materials
            </p>
            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-1 bg-blue-500 mx-auto mt-4 sm:mt-6 md:mt-8 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: "Fast Delivery",
                description: "Quick and reliable delivery across UAE"
              },
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Quality Guarantee",
                description: "Premium products from trusted manufacturers"
              },
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                ),
                title: "Expert Support",
                description: "Technical expertise and customer support"
              },
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Competitive Pricing",
                description: "Best prices for premium quality products"
              }
            ].map((feature, index) => (
              <div key={index} className="group text-center p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-gray-100/50">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 md:mb-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 relative overflow-hidden">
                  {feature.icon}
                  <div className="absolute inset-0 w-16 sm:w-20 md:w-24 lg:w-28 h-16 sm:h-20 md:h-24 lg:h-28 bg-blue-500/20 rounded-2xl sm:rounded-3xl mx-auto blur-xl group-hover:bg-blue-500/40 transition-all duration-300"></div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 px-2">{feature.title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium px-2 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
