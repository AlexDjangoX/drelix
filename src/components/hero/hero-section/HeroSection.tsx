'use client';

import { useReducedMotion } from 'framer-motion';
import {
  HeroBackground,
  HeroContent,
  HeroDecorations,
  HeroScrollIndicator,
} from '@/components/hero/hero-section';

function scrollToSection(selector: string) {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = !!prefersReducedMotion;

  return (
    <section className="relative min-h-svh flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <HeroBackground />
        <HeroDecorations />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-12 lg:py-16">
        <HeroContent
          reducedMotion={reducedMotion}
          onScrollToProducts={() => scrollToSection('#products')}
        />
      </div>

      <HeroScrollIndicator onScrollToMap={() => scrollToSection('#contact')} />
    </section>
  );
}
