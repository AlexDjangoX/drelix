import Link from 'next/link';
import React from 'react';
import { Shield } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40,
  };

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Shield
          size={iconSizes[size]}
          className="text-primary fill-primary/20"
          strokeWidth={2}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: iconSizes[size] * 0.35 }}
        >
          <span className="font-black text-primary-foreground">D</span>
        </div>
      </div>
      <span className={`font-black tracking-tight ${sizeClasses[size]}`}>
        <span className="text-foreground">DRE</span>
        <span className="text-primary">LIX</span>
      </span>
    </Link>
  );
};

export default Logo;
