"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/language";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { ProductSectionCategoryCard } from "@/components/products/ProductSection/ProductSectionCategoryCard";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "@/components/products/ProductSection/productSectionData";

function getLabel(
  t: Record<string, unknown>,
  section: { slug: string; titleKey: string; displayName?: string },
): string {
  if (section.displayName) return section.displayName;
  const keys = section.titleKey.split(".");
  let current: unknown = t;
  for (const key of keys) {
    current = (current as Record<string, unknown>)?.[key];
  }
  return typeof current === "string" ? current : section.slug;
}

export function ProductSectionCategoryGrid() {
  const sectionsFromConvex = useQuery(api.catalog.listCatalogSections);
  const { t } = useLanguage();

  const sorted = useMemo(() => {
    if (!sectionsFromConvex) return [];
    const withItems = sectionsFromConvex.filter((s) => s.items.length > 0);
    return [...withItems].sort((a, b) =>
      getLabel(t as unknown as Record<string, unknown>, a).localeCompare(
        getLabel(t as unknown as Record<string, unknown>, b),
        undefined,
        { sensitivity: "base" },
      ),
    );
  }, [sectionsFromConvex, t]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {sorted.map((section, i) => (
        <ProductSectionCategoryCard
          key={section.slug}
          slug={section.slug}
          titleKey={section.titleKey}
          displayName={section.displayName}
          icon={CATEGORY_ICONS[i % CATEGORY_ICONS.length]}
          color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
        />
      ))}
    </div>
  );
}
