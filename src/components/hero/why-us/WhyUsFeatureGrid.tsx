'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { WhyUsFeatureCard, WHY_US_FEATURES } from '@/components/hero/why-us';
import { gridStaggerVariants } from '@/lib/animations';

type WhyUsFeatureGridProps = {
  reducedMotion: boolean;
  isInView?: boolean;
};

export function WhyUsFeatureGrid({ reducedMotion }: WhyUsFeatureGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isGridInView = useInView(gridRef, { once: true, amount: 0.08 });

  return (
    <motion.div
      ref={gridRef}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
      variants={gridStaggerVariants(reducedMotion)}
      initial="hidden"
      animate={isGridInView ? 'visible' : 'hidden'}
    >
      {WHY_US_FEATURES.map((feature, index) => (
        <WhyUsFeatureCard
          key={feature.id}
          {...feature}
          index={index}
          reducedMotion={reducedMotion}
        />
      ))}
    </motion.div>
  );
}
