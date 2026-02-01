'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronDown, Shield, HardHat, Glasses } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TwoToneHeading, AnimateText } from '@/components';

const HeroSection: React.FC = () => {
  const handleScrollToProducts = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToMap = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-svh flex flex-col overflow-hidden">
      {/* Background image */}
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

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 sm:left-10 opacity-[0.08] sm:opacity-[0.12]">
          <HardHat className="text-primary-muted size-28 sm:size-40 lg:size-48" />
        </div>
        <div className="absolute bottom-24 right-4 sm:right-10 opacity-[0.08] sm:opacity-[0.12]">
          <Shield className="text-primary-muted size-32 sm:size-48 lg:size-56" />
        </div>
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--grid-pattern)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--grid-pattern)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main content area - flex-1 to fill available space, centered */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Heading */}
          <TwoToneHeading
            as="h1"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-5 lg:mb-6 animate-fade-in text-balance"
            style={{ animationDelay: '0.2s' }}
          >
            <AnimateText k="hero.title" />
          </TwoToneHeading>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg lg:text-xl text-muted-foreground/95 max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-10 animate-fade-in text-pretty leading-relaxed"
            style={{ animationDelay: '0.4s' }}
          >
            <AnimateText k="hero.subtitle" />
          </p>

          {/* CTA Button */}
          <div
            className="animate-fade-in mb-8 sm:mb-10 lg:mb-12"
            style={{ animationDelay: '0.6s' }}
          >
            <Button
              size="lg"
              onClick={handleScrollToProducts}
              className="bg-gradient-primary text-primary-foreground font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-glow hover:scale-105 transition-transform"
            >
              <AnimateText k="hero.cta" />
            </Button>
          </div>

          {/* Trust indicators - always horizontal, wrapping naturally */}
          <div
            className="flex flex-wrap justify-center gap-2 sm:gap-3 animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 border border-primary/20">
              <Shield
                className="shrink-0 text-primary size-4 sm:size-5"
                strokeWidth={2}
              />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                <AnimateText k="hero.trust1" />
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 border border-primary/20">
              <HardHat
                className="shrink-0 text-primary size-4 sm:size-5"
                strokeWidth={2}
              />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                <AnimateText k="hero.trust2" />
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 border border-primary/20">
              <Glasses
                className="shrink-0 text-primary size-4 sm:size-5"
                strokeWidth={2}
              />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                <AnimateText k="hero.trust3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - fixed at bottom */}
      <button
        type="button"
        onClick={handleScrollToMap}
        className="relative z-10 pb-4 sm:pb-6 mx-auto flex flex-col items-center gap-0.5 text-foreground/70 hover:text-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
        aria-label="Scroll to location map"
      >
        <ChevronDown className="size-6 sm:size-7 animate-bounce" />
        <span className="text-[10px] sm:text-xs font-medium">
          <AnimateText k="hero.scrollToMap" animate={false} />
        </span>
      </button>
    </section>
  );
};

export default HeroSection;
