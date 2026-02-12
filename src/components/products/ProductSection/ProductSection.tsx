"use client";

import { useRef } from "react";
import { useReducedMotion, useInView } from "framer-motion";
import { ProductSectionHeader } from "@/components/products/ProductSection/ProductSectionHeader";
import { ProductSectionCategoryGrid } from "@/components/products/ProductSection/ProductSectionCategoryGrid";

export default function ProductSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.05,
    margin: "150px 0px 0px 0px",
  });
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = !!prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id="products"
      data-testid="products-section"
      className="py-20 md:py-32 overflow-x-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <ProductSectionHeader
            reducedMotion={reducedMotion}
            isInView={isInView}
          />
          <ProductSectionCategoryGrid />
        </div>
      </div>
    </section>
  );
}
