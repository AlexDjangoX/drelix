"use client";

import { ProductSectionCategoryCard } from "@/components/products/ProductSection/ProductSectionCategoryCard";
import {
  CATEGORY_CARDS,
  CATEGORY_ICONS,
} from "@/components/products/ProductSection/productSectionData";

export function ProductSectionCategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {CATEGORY_CARDS.map((card, i) => (
        <ProductSectionCategoryCard
          key={card.slug}
          slug={card.slug}
          titleKey={card.titleKey}
          thumbnail={card.thumbnail}
          icon={CATEGORY_ICONS[i % CATEGORY_ICONS.length]}
        />
      ))}
    </div>
  );
}
