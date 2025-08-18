'use client';

import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        category: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
              Contact <span className="text-blue-500">Us</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8 px-2">
              Get in touch with our experts for all your industrial material needs
            </p>
            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-1 bg-blue-500 mx-auto mt-4 sm:mt-6 md:mt-8 rounded"></div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
                Get in Touch
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                We're here to help you find the perfect industrial solutions for your business. 
                Contact our expert team for personalized assistance and competitive quotes.
              </p>
              
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Phone */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 10.9a11.042 11.042 0 005.93 5.93l1.513-4.064a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Phone</h3>
                    <p className="text-sm sm:text-base text-gray-600">+971-XXX-XXXX</p>
                    <p className="text-xs sm:text-sm text-gray-500">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Email</h3>
                    <p className="text-sm sm:text-base text-gray-600">sales@frazerbmt.com</p>
                    <p className="text-xs sm:text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Address</h3>
                    <p className="text-sm sm:text-base text-gray-600">United Arab Emirates</p>
                    <p className="text-xs sm:text-sm text-gray-500">Serving all Emirates</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Business Hours</h3>
                    <div className="text-sm sm:text-base text-gray-600 space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 8:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
                Send us a Message
              </h3>
              
              {submitStatus === 'success' && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Thank you for your message! We'll get back to you within 24 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="+971-XXX-XXXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Inquiry Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                    >
                      <option value="">Select a category</option>
                      <option value="general">General Inquiry</option>
                      <option value="quote">Request Quote</option>
                      <option value="hvac">HVAC Products</option>
                      <option value="valves">Valves</option>
                      <option value="electrical">Electrical Equipment</option>
                      <option value="plumbing">Plumbing & Fittings</option>
                      <option value="adhesives">Adhesives & Lubricants</option>
                      <option value="pumps">Pump Spare Parts</option>
                      <option value="support">Technical Support</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-vertical"
                    placeholder="Please provide details about your requirements..."
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base md:text-lg rounded-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
