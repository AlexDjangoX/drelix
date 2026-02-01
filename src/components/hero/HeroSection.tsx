'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Shield, HardHat, Glasses } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TwoToneHeading, AnimateText } from '@/components';

const container = {
  visible: (reduced: boolean) => ({
    transition: reduced
      ? { staggerChildren: 0, delayChildren: 0 }
      : { staggerChildren: 0.1, delayChildren: 0.05 },
  }),
};

const item = (reduced: boolean) => ({
  hidden: { opacity: 0, y: reduced ? 0 : 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0 : 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
});

const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

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
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 xl:px-16 py-20 sm:py-24 lg:py-32">
        <motion.div
          className="w-full max-w-4xl mx-auto text-center"
          variants={container}
          initial="hidden"
          animate="visible"
          custom={!!prefersReducedMotion}
        >
          {/* Heading */}
          <motion.div variants={item(!!prefersReducedMotion)}>
            <TwoToneHeading
              as="h1"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-5 lg:mb-6 text-balance leading-[1.35] tracking-wide"
            >
              <AnimateText k="hero.title" />
            </TwoToneHeading>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={item(!!prefersReducedMotion)}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground/95 max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 text-pretty leading-relaxed"
          >
            <AnimateText k="hero.subtitle" />
          </motion.p>

          {/* CTA Button */}
          <motion.div
            variants={item(!!prefersReducedMotion)}
            className="mb-8 sm:mb-10 lg:mb-12"
          >
            <Button
              size="lg"
              onClick={handleScrollToProducts}
              className="bg-gradient-primary cursor-pointer text-primary-foreground font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-glow hover:scale-105 transition-transform"
            >
              <AnimateText k="hero.cta" />
            </Button>
          </motion.div>

          {/* Trust indicators - always horizontal, wrapping naturally */}
          <motion.div
            variants={item(!!prefersReducedMotion)}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8"
          >
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 sm:px-5 sm:py-2 border border-primary/20">
              <Shield
                className="shrink-0 text-primary size-4 sm:size-5"
                strokeWidth={2}
              />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                <AnimateText k="hero.trust1" />
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 sm:px-5 sm:py-2 border border-primary/20">
              <HardHat
                className="shrink-0 text-primary size-4 sm:size-5"
                strokeWidth={2}
              />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                <AnimateText k="hero.trust2" />
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 sm:px-5 sm:py-2 border border-primary/20">
              <Glasses
                className="shrink-0 text-primary size-4 sm:size-5"
                strokeWidth={2}
              />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                <AnimateText k="hero.trust3" />
              </span>
            </div>
          </motion.div>
        </motion.div>
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
