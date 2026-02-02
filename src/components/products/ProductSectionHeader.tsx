'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimateText, TwoToneHeading } from '@/components';
import {
  headerFromLeftVariants,
  headerFromRightVariants,
} from '@/components/products';

type ProductSectionHeaderProps = {
  reducedMotion: boolean;
  isInView: boolean;
};

export function ProductSectionHeader({
  reducedMotion,
  isInView,
}: ProductSectionHeaderProps) {
  return (
    <div className="text-center mb-16">
      <motion.div
        variants={headerFromLeftVariants(reducedMotion)}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="mb-4"
      >
        <TwoToneHeading as="h2" className="text-3xl md:text-5xl font-black">
          <AnimateText k="products.title" />
        </TwoToneHeading>
      </motion.div>
      <motion.div
        variants={headerFromRightVariants(reducedMotion)}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          <AnimateText k="products.subtitle" />
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          <AnimateText k="products.viewFullCatalog" />
        </Link>
      </motion.div>
    </div>
  );
}
