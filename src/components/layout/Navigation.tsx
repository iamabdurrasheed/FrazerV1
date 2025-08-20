'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { industrialCategories, Category } from '@/lib/industrial-categories';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const { itemCount } = useCart();
  const pathname = usePathname();

  // Navigation items for consistent rendering
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  // Check if current page is active
  const isActivePage = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`bg-white/95 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled ? 'shadow-xl shadow-gray-900/10' : 'shadow-lg shadow-gray-900/5'
      }`}>
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex justify-between h-18 sm:h-20 md:h-24 lg:h-26">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 mr-3 transition-transform duration-300 hover:scale-105">
                <Logo size="nav" href="" />
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 lg:ml-12 xl:ml-20 md:flex md:space-x-2 lg:space-x-4 xl:space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 lg:px-4 xl:px-6 py-2 lg:py-2.5 text-base lg:text-lg xl:text-xl font-semibold transition-all duration-300 group rounded-lg hover:bg-blue-50/50 ${
                      isActivePage(item.href)
                        ? 'text-blue-600 bg-blue-50/70'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute inset-x-0 bottom-0.5 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full transition-transform duration-300 ${
                      isActivePage(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex md:items-center md:space-x-3 lg:space-x-4 xl:space-x-6">
              {/* Cart Button - Goes to Cart Page */}
              <Link
                href="/cart"
                className="relative p-2 lg:p-2.5 text-gray-600 hover:text-blue-600 transition-all duration-300 group rounded-xl hover:bg-blue-50/50"
                title="View Cart"
              >
                <div className="relative">
                  {/* Modern Shopping Cart Icon */}
                  <svg className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l1.68 8.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L22 6H6M16 19a1 1 0 11-2 0 1 1 0 012 0zM9 19a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center min-w-[24px] text-[11px] font-bold shadow-lg animate-pulse">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transform scale-75 group-hover:scale-100 transition-all duration-300"></div>
                </div>
              </Link>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Link href="/auth/login" className="cursor-pointer">
                  <Button variant="ghost" size="lg" className="font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 text-sm lg:text-base xl:text-lg cursor-pointer px-4 lg:px-6 py-1.5 lg:py-2 rounded-xl">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" className="cursor-pointer">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm lg:text-base xl:text-lg cursor-pointer px-4 lg:px-6 py-1.5 lg:py-2 rounded-xl">
                    Register
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-300 group rounded-xl hover:bg-blue-50/50"
                title="View Cart"
              >
                <div className="relative">
                  <svg className="w-7 h-7 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l1.68 8.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L22 6H6M16 19a1 1 0 11-2 0 1 1 0 012 0zM9 19a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] text-[10px] font-bold shadow-lg animate-pulse">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
              </Link>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
                aria-label="Toggle navigation menu"
              >
                <svg 
                  className={`h-7 w-7 transition-all duration-300 transform ${
                    isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`} 
                  stroke="currentColor" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  className={`h-7 w-7 absolute transition-all duration-300 transform ${
                    isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`} 
                  stroke="currentColor" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className={`bg-white border-t border-gray-200 shadow-lg transform transition-all duration-500 ease-in-out ${
            isMobileMenuOpen 
              ? 'translate-y-0' 
              : '-translate-y-4'
          }`}>
            
            <div className="px-3 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 transform hover:translate-x-1 ${
                    isActivePage(item.href)
                      ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {isActivePage(item.href) && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                </Link>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
                <Link
                  href="/auth/login"
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Industrial Categories Mega Menu */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-center">
            <div className="hidden md:flex md:space-x-1 lg:space-x-2 xl:space-x-4 py-3">
              {industrialCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="flex items-center px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  >
                    {category.name}
                    <svg className="ml-1 h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {hoveredCategory === category.id && (
                    <div className="absolute top-full left-0 w-80 lg:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 mt-1 transform opacity-100 scale-100 transition-all duration-300">
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              href={`/products?category=${category.slug}&subcategory=${subcategory.slug}`}
                              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{subcategory.name}</div>
                                {subcategory.description && (
                                  <div className="text-xs text-gray-500 mt-1">{subcategory.description}</div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Link
                            href={`/products?category=${category.slug}`}
                            className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                          >
                            View All {category.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
