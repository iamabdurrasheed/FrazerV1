'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ChevronDown } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function UserLoginPage() {
  // Authentication method: 'password', 'email-otp', 'phone-otp'
  const [authMethod, setAuthMethod] = useState<'password' | 'email-otp' | 'phone-otp'>('password');
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const resetForm = () => {
    setOtpSent(false);
    setOtp('');
    setError('');
    setSuccess('');
    setShowAlternatives(false);
  };

  const sendOtp = async () => {
    const identifier = authMethod === 'email-otp' ? email : phone;
    const method = authMethod === 'email-otp' ? 'email' : 'phone';

    if (!identifier.trim()) {
      setError(`Please enter your ${method}`);
      return;
    }

    setOtpLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method,
          email: authMethod === 'email-otp' ? email : undefined,
          phone: authMethod === 'phone-otp' ? phone : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setSuccess(`OTP sent to your ${method}`);
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('An error occurred while sending OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // For OTP methods, send OTP first if not sent
    if ((authMethod === 'email-otp' || authMethod === 'phone-otp') && !otpSent) {
      await sendOtp();
      return;
    }

    // Validation
    if (authMethod === 'password') {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
    } else if (authMethod === 'email-otp') {
      if (!email || !otp) {
        setError('Please enter both email and OTP');
        return;
      }
    } else if (authMethod === 'phone-otp') {
      if (!phone || !otp) {
        setError('Please enter both phone and OTP');
        return;
      }
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: authMethod === 'password' || authMethod === 'email-otp' ? email : '',
        phone: authMethod === 'phone-otp' ? phone : '',
        password: authMethod === 'password' ? password : '',
        otp: authMethod !== 'password' ? otp : '',
        role: 'user',
        loginType: authMethod === 'password' ? 'password' : 'otp',
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/app/dashboard');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo className="h-16 w-auto mx-auto mb-6" />
          <h2 className="text-black text-3xl font-bold">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        {/* Main Login Form */}
        <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Default Email & Password Login */}
            {authMethod === 'password' && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Email OTP Login */}
            {authMethod === 'email-otp' && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <div className="flex space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={otp[index] || ''}
                          onChange={(e) => {
                            const newOtp = otp.split('');
                            newOtp[index] = e.target.value;
                            setOtp(newOtp.join(''));
                            
                            // Auto-focus next input
                            if (e.target.value && index < 5) {
                              const nextInput = (e.target as HTMLInputElement).parentElement?.children[index + 1] as HTMLInputElement;
                              nextInput?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            // Auto-focus previous input on backspace
                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                              const prevInput = (e.target as HTMLInputElement).parentElement?.children[index - 1] as HTMLInputElement;
                              prevInput?.focus();
                            }
                          }}
                          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={otpLoading}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {otpLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Phone OTP Login */}
            {authMethod === 'phone-otp' && (
              <>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <div className="flex space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={otp[index] || ''}
                          onChange={(e) => {
                            const newOtp = otp.split('');
                            newOtp[index] = e.target.value;
                            setOtp(newOtp.join(''));
                            
                            // Auto-focus next input
                            if (e.target.value && index < 5) {
                              const nextInput = (e.target as HTMLInputElement).parentElement?.children[index + 1] as HTMLInputElement;
                              nextInput?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            // Auto-focus previous input on backspace
                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                              const prevInput = (e.target as HTMLInputElement).parentElement?.children[index - 1] as HTMLInputElement;
                              prevInput?.focus();
                            }
                          }}
                          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={otpLoading}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {otpLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otpLoading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading || otpLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {otpLoading ? 'Sending OTP...' : 'Signing in...'}
                </div>
              ) : (
                <div className="flex items-center">
                  {authMethod === 'password' 
                    ? 'Sign in' 
                    : otpSent 
                      ? 'Verify & Sign in' 
                      : 'Send OTP'
                  }
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Alternative Login Methods */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="w-full flex items-center justify-center py-2 px-4 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <span>Try another way to sign in</span>
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${showAlternatives ? 'rotate-180' : ''}`} />
            </button>

            {showAlternatives && (
              <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                {authMethod !== 'email-otp' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email-otp');
                      resetForm();
                    }}
                    className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <Mail className="h-5 w-5 text-blue-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-gray-700">Email OTP</div>
                      <div className="text-sm text-gray-500">Login with email verification</div>
                    </div>
                  </button>
                )}

                {authMethod !== 'phone-otp' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone-otp');
                      resetForm();
                    }}
                    className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <Phone className="h-5 w-5 text-blue-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-gray-700">Phone OTP</div>
                      <div className="text-sm text-gray-500">Login with SMS verification</div>
                    </div>
                  </button>
                )}

                {authMethod !== 'password' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('password');
                      resetForm();
                    }}
                    className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <Lock className="h-5 w-5 text-blue-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-gray-700">Email & Password</div>
                      <div className="text-sm text-gray-500">Traditional login method</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Admin?{' '}
              <Link href="/auth/admin/login" className="font-medium text-blue-600 hover:text-blue-500">
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
