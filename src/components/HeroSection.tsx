"use client";

import React from 'react';
import { ChevronDown, Shield, HardHat, Glasses } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  const handleScrollToProducts = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-10">
          <HardHat size={200} className="text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <Shield size={250} className="text-primary" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-5">
          <Glasses size={180} className="text-accent" />
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <Logo size="lg" />
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-foreground">
              {t.hero.title.split(' ')[0]}{' '}
            </span>
            <span className="text-gradient">
              {t.hero.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            {t.hero.subtitle}
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              size="lg"
              onClick={handleScrollToProducts}
              className="bg-gradient-primary text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-glow hover:scale-105 transition-transform"
            >
              {t.hero.cta}
            </Button>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <div className="flex items-center gap-2">
              <Shield className="text-primary" size={20} />
              <span className="text-sm font-medium">CE Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <HardHat className="text-primary" size={20} />
              <span className="text-sm font-medium">EN Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <Glasses className="text-primary" size={20} />
              <span className="text-sm font-medium">ISO 9001</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-muted-foreground" />
      </div>
    </section>
  );
};

export default HeroSection;
