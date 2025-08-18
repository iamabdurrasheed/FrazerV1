'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = false, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-16 w-16 sm:h-18 sm:w-18',
    md: 'h-20 w-20 sm:h-22 sm:w-22 md:h-24 md:w-24',
    lg: 'h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32',
    xl: 'h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36'
  };

  const imageSizes = {
    sm: 72,
    md: 96,
    lg: 128,
    xl: 160
  };

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} relative overflow-hidden rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
        <Image
          src="/Flogo.png"
          alt="Frazer BMT Logo"
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="w-full h-full object-contain"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
