'use client';

import React from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function CategoriesPage() {
  const categories = [
    {
      name: 'HVAC Products',
      slug: 'hvac',
      description: 'Complete HVAC systems, air conditioning units, heating solutions, and ventilation equipment',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      brands: ['Carrier', 'Trane', 'York', 'Daikin'],
      productCount: '250+'
    },
    {
      name: 'Valves',
      slug: 'valves',
      description: 'Industrial valves, ball valves, gate valves, check valves, and control valves',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      brands: ['Kitz', 'Cameron', 'Emerson', 'Flowserve'],
      productCount: '180+'
    },
    {
      name: 'Electrical Equipment',
      slug: 'electrical',
      description: 'Industrial electrical components, enclosures, power distribution systems, and control panels',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      brands: ['ABB', 'WALTHER-WERKE', 'nVent Hoffman', 'Schneider'],
      productCount: '300+'
    },
    {
      name: 'Plumbing & Fittings',
      slug: 'plumbing',
      description: 'Pipes, fittings, flanges, and plumbing accessories for industrial applications',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      brands: ['Victaulic', 'Mueller', 'Charlotte Pipe', 'NIBCO'],
      productCount: '200+'
    },
    {
      name: 'Adhesives & Lubricants',
      slug: 'adhesives',
      description: 'Industrial adhesives, sealants, lubricants, and chemical solutions',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      brands: ['3M', 'Loctite', 'Shell', 'Henkel'],
      productCount: '120+'
    },
    {
      name: 'Pump Spare Parts',
      slug: 'pumps',
      description: 'Quality pump components, impellers, seals, and maintenance parts',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-6.219-8.56" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 0l3-3m-3 3l3 3" />
        </svg>
      ),
      brands: ['Grundfos', 'KSB', 'Flowserve', 'Pentair'],
      productCount: '90+'
    },
    {
      name: 'Welding Accessories',
      slug: 'welding',
      description: 'Welding equipment, electrodes, gas supplies, and safety accessories',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      ),
      brands: ['Lincoln', 'ESAB', 'Miller', 'Hobart'],
      productCount: '80+'
    },
    {
      name: 'Thermal Management',
      slug: 'thermal',
      description: 'Heat exchangers, thermal insulation, and temperature control solutions',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      brands: ['Raktherm', 'Danfoss', 'Alfa Laval', 'Tranter'],
      productCount: '60+'
    }
  ];

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
              Product <span className="text-blue-500">Categories</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed mb-6 sm:mb-8 px-2">
              Explore our comprehensive range of industrial and building materials organized by category
            </p>
            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-1 bg-blue-500 mx-auto mt-4 sm:mt-6 md:mt-8 rounded"></div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 overflow-hidden border border-gray-100/50 h-full min-h-[320px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[440px] flex flex-col">
                <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col">
                  {/* Icon and Header */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl sm:rounded-3xl flex items-center justify-center text-blue-600 group-hover:from-blue-100 group-hover:to-blue-200 group-hover:text-blue-700 transition-all duration-300 relative overflow-hidden">
                      {category.icon}
                      <div className="absolute inset-0 bg-blue-600/20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                        {category.productCount}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed flex-grow text-center">
                    {category.description}
                  </p>
                  
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 text-center">Featured Brands:</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {category.brands.map((brand) => (
                        <span 
                          key={brand}
                          className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded transition-colors duration-200 group-hover:bg-blue-50 group-hover:text-blue-700"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors mt-auto">
                    <span className="text-sm sm:text-base font-medium">Browse Products</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-blue-50 to-gray-50 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center px-3 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
            Can't find what you're looking for?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
            Our extensive inventory includes thousands of products from leading manufacturers. 
            Contact us for specialized requirements or custom quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/contact">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base md:text-lg">
                Contact Us
              </button>
            </Link>
            <Link href="/products">
              <button className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base md:text-lg">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
