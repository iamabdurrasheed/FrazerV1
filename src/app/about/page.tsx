'use client';

import React from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
              About <span className="text-blue-500">Frazer</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8 px-2">
              Your trusted partner for premium industrial and building materials in the UAE
            </p>
            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-1 bg-blue-500 mx-auto mt-4 sm:mt-6 md:mt-8 rounded"></div>
          </div>
        </div>
      </div>

      {/* Company Overview */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
                Leading Supplier in the UAE
              </h2>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                <p>
                  Frazer has been at the forefront of supplying premium industrial and building materials 
                  across the United Arab Emirates. With years of experience and a commitment to excellence, 
                  we have established ourselves as a trusted partner for businesses across various industries.
                </p>
                <p>
                  Our comprehensive range includes HVAC systems, valves, electrical equipment, plumbing 
                  solutions, adhesives, lubricants, pump spare parts, and thermal management systems. 
                  We work exclusively with renowned global manufacturers to ensure the highest quality standards.
                </p>
                <p>
                  From small-scale projects to large industrial installations, Frazer BMT provides 
                  reliable solutions backed by technical expertise and exceptional customer service.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12">
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">15+</div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">1000+</div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">50+</div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Global Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">24/7</div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Our Core Values
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              The principles that guide everything we do
            </p>
            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mt-4 sm:mt-6 md:mt-8 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Quality First",
                description: "We never compromise on quality, ensuring all products meet international standards"
              },
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Innovation",
                description: "Constantly seeking new technologies and solutions to serve our customers better"
              },
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                ),
                title: "Customer Focus",
                description: "Your success is our success. We build lasting partnerships with every client"
              },
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Reliability",
                description: "Dependable supply chain and consistent delivery performance you can count on"
              }
            ].map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 md:mb-6 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center text-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Brands */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Trusted Global Brands
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              We partner with world-renowned manufacturers to bring you the finest industrial solutions
            </p>
            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mt-4 sm:mt-6 md:mt-8 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6 md:gap-8">
            {[
              'ABB', 'Carrier', 'Trane', 'Kitz', 'Cameron', 'Grundfos', 
              '3M', 'Loctite', 'WALTHER-WERKE', 'nVent Hoffman', 'Flowserve', 'KSB',
              'Daikin', 'York', 'Emerson', 'Schneider', 'Lincoln', 'ESAB'
            ].map((brand, index) => (
              <div key={index} className="group">
                <div className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md h-full flex items-center justify-center min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">
                  <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 text-center">
                    {brand}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center px-3 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
            Ready to work with us?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
            Let's discuss your industrial material requirements and find the perfect solutions for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
                Contact Us Today
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full transform hover:scale-105 transition-all duration-300">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
