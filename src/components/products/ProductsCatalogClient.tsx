'use client';

import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ProductsCatalogContent from '@/components/products/ProductsCatalogContent';
import type { CatalogSection } from '@/lib/types';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/utils';

function getSectionLabel(
  t: Record<string, unknown>,
  section: CatalogSection
): string {
  if (section.displayName) return section.displayName;
  const keys = (section.titleKey ?? '').split('.');
  let current: unknown = t;
  for (const key of keys) {
    current = (current as Record<string, unknown>)?.[key];
  }
  return typeof current === 'string' ? current : section.slug;
}

function mapConvexSectionsToCatalog(
  sections: {
    slug: string;
    titleKey: string;
    displayName?: string;
    items: Record<string, string>[];
  }[]
): CatalogSection[] {
  return sections.map(({ slug, titleKey, displayName, items }) => ({
    slug,
    titleKey,
    displayName,
    items: items.map((row) => ({
      ...row,
      imageUrl: row.imageUrl || PLACEHOLDER_PRODUCT_IMAGE,
      thumbnailUrl:
        row.thumbnailUrl || row.imageUrl || PLACEHOLDER_PRODUCT_IMAGE,
    })),
  }));
}

export default function ProductsCatalogClient() {
  const { t } = useLanguage();
  const sectionsFromConvex = useQuery(api.catalog.listCatalogSections);

  const sections = useMemo(() => {
    if (sectionsFromConvex === undefined) return null;
    const mapped = mapConvexSectionsToCatalog(sectionsFromConvex).filter(
      (s) => s.items.length > 0
    );
    return [...mapped].sort((a, b) =>
      getSectionLabel(t as unknown as Record<string, unknown>, a).localeCompare(
        getSectionLabel(t as unknown as Record<string, unknown>, b),
        undefined,
        { sensitivity: 'base' }
      )
    );
  }, [sectionsFromConvex, t]);

  if (sectionsFromConvex === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2
          className="w-10 h-10 animate-spin text-muted-foreground"
          aria-hidden
        />
      </div>
    );
  }

  const totalCount = sections?.reduce((n, s) => n + s.items.length, 0) ?? 0;

  return (
    <ProductsCatalogContent sections={sections ?? []} totalCount={totalCount} />
  );
}
