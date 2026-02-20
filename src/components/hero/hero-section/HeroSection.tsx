"use client";

import { useReducedMotion } from "framer-motion";
import {
  HeroBackground,
  HeroContent,
  HeroDecorations,
  HeroScrollIndicator,
} from "@/components/hero/hero-section";

function scrollToSection(selector: string) {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
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

      <div className="relative z-10 flex-1 flex flex-col container mx-auto px-4 pt-32 sm:pt-36 md:pt-40 lg:pt-44">
        <div className="flex-1 flex flex-col justify-center">
          <HeroContent
            reducedMotion={reducedMotion}
            onScrollToProducts={() => scrollToSection("#products")}
          />
        </div>
        <div className="shrink-0 pb-8 flex justify-center">
          <HeroScrollIndicator
            onScrollToMap={() => scrollToSection("#contact")}
          />
        </div>
      </div>
    </section>
  );
}
