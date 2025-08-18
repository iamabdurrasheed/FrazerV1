'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/20 sticky top-0 z-50 w-full">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 md:h-24 lg:h-28">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <Logo size="sm" className="sm:hidden" />
                <Logo size="md" className="hidden sm:block" />
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-6 lg:ml-12 xl:ml-16 md:flex md:space-x-1 lg:space-x-2 xl:space-x-4">
                <Link
                  href="/"
                  className="relative px-2 lg:px-3 xl:px-4 py-2 lg:py-3 text-sm lg:text-base xl:text-lg font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
                >
                  Home
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  href="/products"
                  className="relative px-2 lg:px-3 xl:px-4 py-2 lg:py-3 text-sm lg:text-base xl:text-lg font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
                >
                  Products
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  href="/categories"
                  className="relative px-2 lg:px-3 xl:px-4 py-2 lg:py-3 text-sm lg:text-base xl:text-lg font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
                >
                  Categories
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  href="/about"
                  className="relative px-2 lg:px-3 xl:px-4 py-2 lg:py-3 text-sm lg:text-base xl:text-lg font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
                >
                  About Us
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  href="/contact"
                  className="relative px-2 lg:px-3 xl:px-4 py-2 lg:py-3 text-sm lg:text-base xl:text-lg font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
                >
                  Contact
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-3 xl:space-x-4">
              {/* Cart Button - Goes to Cart Page */}
              <Link
                href="/cart"
                className="relative p-2 lg:p-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
                title="View Cart"
              >
                <div className="relative">
                  {/* Shopping Trolley Icon */}
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] text-[10px] font-bold">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-blue-600 rounded-full opacity-0 group-hover:opacity-20 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
                </div>
              </Link>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 text-xs lg:text-sm xl:text-base">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs lg:text-sm xl:text-base">
                    Register
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
                title="View Cart"
              >
                <div className="relative">
                  {/* Shopping Trolley Icon */}
                  <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[9px] font-bold">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
              </Link>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
              >
                <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-3 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
                <Link
                  href="/auth/login"
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
