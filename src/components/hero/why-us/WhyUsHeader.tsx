'use client';

import { motion } from 'framer-motion';
import { AnimateText } from '@/components/reusable/AnimateText';
import { TwoToneHeading } from '@/components/reusable/TwoToneHeading';
import { fromLeftVariants, fromRightVariants } from '@/lib/animations';

type WhyUsHeaderProps = {
  reducedMotion: boolean;
  isInView: boolean;
};

export function WhyUsHeader({ reducedMotion, isInView }: WhyUsHeaderProps) {
  return (
    <div className="text-center mb-16">
      <motion.div
        variants={fromLeftVariants(reducedMotion)}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="mb-4"
      >
        <TwoToneHeading as="h2" className="text-3xl md:text-5xl font-black">
          <AnimateText k="whyUs.title" />
        </TwoToneHeading>
      </motion.div>
      <motion.p
        variants={fromRightVariants(reducedMotion)}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-lg text-muted-foreground max-w-2xl mx-auto"
      >
        <AnimateText k="whyUs.subtitle" />
      </motion.p>
    </div>
  );
}
