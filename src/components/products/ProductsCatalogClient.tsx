'use client';

import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Loader2 } from 'lucide-react';
import CatalogClient from '@/components/products/CatalogClient';
import { CatalogSection } from '@/lib/catalogCategorize';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/utils';

function mapConvexSectionsToCatalog(
  sections: {
    slug: string;
    titleKey: string;
    items: Record<string, string>[];
  }[]
): CatalogSection[] {
  return sections.map(({ slug, titleKey, items }) => ({
    slug,
    titleKey,
    items: items.map((row) => ({
      ...row,
      imageUrl: row.imageUrl || PLACEHOLDER_PRODUCT_IMAGE,
    })),
  }));
}

export default function ProductsCatalogClient() {
  const sectionsFromConvex = useQuery(api.catalog.listCatalogSections);

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

  const sections = mapConvexSectionsToCatalog(sectionsFromConvex);
  const totalCount = sections.reduce((n, s) => n + s.items.length, 0);

  return <CatalogClient sections={sections} totalCount={totalCount} />;
}
