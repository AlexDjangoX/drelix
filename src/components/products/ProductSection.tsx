"use client";

import { useRef } from "react";
import { useReducedMotion, useInView } from "framer-motion";
import {
  ProductSectionHeader,
  ProductSectionCategoryGrid,
} from "@/components/products";

export default function ProductSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = !!prefersReducedMotion;

  return (
    <section
      id="products"
      data-testid="products-section"
      className="py-20 md:py-32 overflow-x-hidden"
    >
      <div ref={sectionRef} className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <ProductSectionHeader
            reducedMotion={reducedMotion}
            isInView={isInView}
          />
          <ProductSectionCategoryGrid reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  );
}
