'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ProductSectionCategoryCard,
  gridDominoVariants,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  PRODUCT_SECTION_CATEGORIES,
} from '@/components/products';

type ProductSectionCategoryGridProps = {
  reducedMotion: boolean;
};

export function ProductSectionCategoryGrid({
  reducedMotion,
}: ProductSectionCategoryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isGridInView = useInView(gridRef, { once: true, amount: 0.08 });

  return (
    <motion.div
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      variants={gridDominoVariants(reducedMotion)}
      initial="hidden"
      animate={isGridInView ? 'visible' : 'hidden'}
    >
      {PRODUCT_SECTION_CATEGORIES.map(({ slug, titleKey, index }) => (
        <ProductSectionCategoryCard
          key={slug}
          slug={slug}
          titleKey={titleKey}
          icon={CATEGORY_ICONS[index]}
          color={CATEGORY_COLORS[index]}
          reducedMotion={reducedMotion}
        />
      ))}
    </motion.div>
  );
}
