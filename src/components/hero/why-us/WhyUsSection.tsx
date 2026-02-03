'use client';

import { useRef } from 'react';
import { useReducedMotion, useInView } from 'framer-motion';
import { WhyUsFeatureGrid, WhyUsHeader } from '@/components/hero/why-us';

export default function WhyUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = !!prefersReducedMotion;

  return (
    <section
      id="why-us"
      className="py-20 md:py-32 bg-secondary/30 overflow-x-hidden"
    >
      <div ref={sectionRef} className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <WhyUsHeader reducedMotion={reducedMotion} isInView={isInView} />
          <WhyUsFeatureGrid reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  );
}
