'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronDown, Shield, HardHat, Glasses } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo, TwoToneHeading, AnimateText } from '@/components';

const HeroSection: React.FC = () => {
  const handleScrollToProducts = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToMap = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image – thumbnail from /thumbnails */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Hero image for the homepage"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-br from-background/95 via-background/90 to-secondary/80" />

      {/* Decorative elements – desaturated orange-brown, subtle */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-[0.12]">
          <HardHat size={200} className="text-primary-muted" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-[0.12]">
          <Shield size={250} className="text-primary-muted" />
        </div>
      </div>

      {/* Grid pattern – neutral grey, not orange */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--grid-pattern)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--grid-pattern)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content – same container as navbar for width alignment */}
      <div className="relative z-10 container mx-auto px-4 text-center w-full">
        {/* Logo – full container width to align with navbar */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <Logo size="lg" />
        </div>

        {/* Title, subtitle, CTA – constrained for readability */}
        <div className="max-w-4xl mx-auto">
          <TwoToneHeading
            as="h1"
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <AnimateText k="hero.title" />
          </TwoToneHeading>

          <p
            className="text-lg md:text-xl text-muted-foreground/95 max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <AnimateText k="hero.subtitle" />
          </p>

          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              size="lg"
              onClick={handleScrollToProducts}
              className="bg-gradient-primary text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-glow hover:scale-105 transition-transform"
            >
              <AnimateText k="hero.cta" />
            </Button>
          </div>
        </div>

        {/* Trust indicators – full container width to align with navbar */}
        <div
          className="mt-16 flex flex-wrap justify-center gap-6 sm:gap-8 animate-fade-in"
          style={{ animationDelay: '0.8s' }}
        >
          <div className="flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2.5 border border-primary/20">
            <Shield className="shrink-0 text-primary" size={24} strokeWidth={2} />
            <span className="text-sm font-medium text-muted-foreground">
              <AnimateText k="hero.trust1" />
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2.5 border border-primary/20">
            <HardHat className="shrink-0 text-primary" size={24} strokeWidth={2} />
            <span className="text-sm font-medium text-muted-foreground">
              <AnimateText k="hero.trust2" />
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2.5 border border-primary/20">
            <Glasses className="shrink-0 text-primary" size={24} strokeWidth={2} />
            <span className="text-sm font-medium text-muted-foreground">
              <AnimateText k="hero.trust3" />
            </span>
          </div>
        </div>
      </div>

      {/* Scroll to location map */}
      <button
        type="button"
        onClick={handleScrollToMap}
        className="absolute bottom-8 left-1/2 flex flex-col items-center gap-1 -translate-x-1/2 text-foreground/70 hover:text-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
        aria-label="Scroll to location map"
      >
        <ChevronDown size={32} className="animate-bounce" />
        <span className="text-xs font-medium">
          <AnimateText k="hero.scrollToMap" animate={false} />
        </span>
      </button>
    </section>
  );
};

export default HeroSection;
