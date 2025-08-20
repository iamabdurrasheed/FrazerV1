'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-800 border-t border-gray-200">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Main Footer Content */}
        <div className="py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            {/* Company Info */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
              <div className="mb-4 sm:mb-6">
                {/* Logo */}
                <div className="mb-4 sm:mb-6 flex justify-center md:justify-start">
                  <Logo size="lg" className="hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center md:text-left">
                  Leading supplier of premium industrial and building materials in the UAE. 
                  Your trusted partner for HVAC, electrical, plumbing, and industrial solutions.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 10.9a11.042 11.042 0 005.93 5.93l1.513-4.064a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+971-XXX-XXXX" className="text-sm sm:text-base text-gray-700 hover:text-blue-500 transition-colors duration-200">
                    +971-XXX-XXXX
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:sales@frazerbmt.com" className="text-sm sm:text-base text-gray-700 hover:text-blue-500 transition-colors duration-200">
                    sales@frazerbmt.com
                  </a>
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div className="lg:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 text-center md:text-left">Product Categories</h4>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-2 gap-x-4">
                {[
                  { name: 'HVAC Products', link: '/products?category=hvac' },
                  { name: 'Valves', link: '/products?category=valves' },
                  { name: 'Electrical Equipment', link: '/products?category=electrical' },
                  { name: 'Plumbing & Fittings', link: '/products?category=plumbing' },
                  { name: 'Adhesives & Lubricants', link: '/products?category=adhesives' },
                  { name: 'Pump Spare Parts', link: '/products?category=pumps' }
                ].map((item) => (
                  <Link key={item.name} href={item.link} className="text-sm sm:text-base text-gray-700 hover:text-blue-500 transition-colors duration-200 block text-center lg:text-left py-1">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 text-center md:text-left">Quick Links</h4>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-2 gap-x-4">
                {[
                  { name: 'About Us', link: '/about' },
                  { name: 'Contact Us', link: '/contact' },
                  { name: 'All Products', link: '/products' },
                  { name: 'Categories', link: '/categories' },
                  { name: 'Login', link: '/auth/login' },
                  { name: 'Register', link: '/auth/register' }
                ].map((item) => (
                  <Link key={item.name} href={item.link} className="text-sm sm:text-base text-gray-700 hover:text-blue-500 transition-colors duration-200 block text-center lg:text-left py-1">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Business Hours & Social */}
            <div className="lg:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 text-center md:text-left">Business Hours</h4>
              <div className="space-y-2 text-sm sm:text-base text-gray-700 mb-6 flex flex-col items-center md:items-start">
                <div className="flex items-center">
                  <span className="w-20">Mon - Fri:</span>
                  <span>8:00 - 18:00</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20">Saturday:</span>
                  <span>8:00 - 14:00</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20">Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="text-center md:text-left">
                <h5 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Follow Us</h5>
                <div className="flex justify-center md:justify-start space-x-3">
                  <a href="#" className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Features - Mobile Optimized */}
        <div className="border-t border-gray-300 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: 'Fast Shipping',
                description: 'Free delivery on orders above AED 500'
              },
              {
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Quality Guaranteed',
                description: 'Premium products from trusted brands'
              },
              {
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                ),
                title: '24/7 Support',
                description: 'Expert technical support'
              },
              {
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Best Prices',
                description: 'Competitive pricing'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-all duration-300">
                  {feature.icon}
                </div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">{feature.title}</h5>
                <p className="text-xs sm:text-sm text-gray-600 leading-tight">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer - Mobile Optimized */}
        <div className="border-t border-gray-300 py-4 sm:py-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              © {currentYear} Frazer BMT. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
