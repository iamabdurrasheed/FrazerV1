'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'nav' | 'auth';
  showText?: boolean;
  className?: string;
  href?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = false, 
  className = '',
  href = '/'
}) => {
  const sizeClasses = {
    xs: 'h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12',
    sm: 'h-12 w-12 sm:h-14 sm:w-14',
    md: 'h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20',
    lg: 'h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28',
    xl: 'h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32',
    nav: 'h-18 w-36 sm:h-20 sm:w-40 md:h-22 md:w-44 lg:h-24 lg:w-48',
    auth: 'h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32'
  };

  const imageSizes = {
    xs: 40,
    sm: 56,
    md: 80,
    lg: 112,
    xl: 144,
    nav: 112,
    auth: 128
  };

  const LogoImage = () => (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <Image
        src="/Flogo.png"
        alt="Frazer BMT Logo"
        width={imageSizes[size]}
        height={imageSizes[size]}
        className={`${size === 'nav' ? 'w-full h-full object-contain' : 'w-full h-full object-contain'}`}
        priority
      />
    </div>
  );

  if (href && href !== '') {
    return (
      <Link href={href} className={`flex items-center justify-center ${className}`}>
        <LogoImage />
      </Link>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LogoImage />
    </div>
  );
};

export default Logo;
