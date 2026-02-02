'use client';

import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { CatalogRow, CatalogSection } from '@/lib/types';

export function useCatalogFilter(
  previewSections: CatalogSection[] | null,
  searchQuery: string
) {
  const sectionsFromConvex = useQuery(api.catalog.listCatalogSections);
  const catalogLoading = sectionsFromConvex === undefined;
  const catalogError = catalogLoading ? null : null;

  const activeSections = previewSections ?? sectionsFromConvex ?? null;

  const totalProductCount = useMemo(() => {
    if (!activeSections) return 0;
    return activeSections.reduce(
      (sum, section) => sum + section.items.length,
      0
    );
  }, [activeSections]);

  const filteredSections = useMemo(() => {
    if (!activeSections) return null;
    if (!searchQuery.trim()) return activeSections;

    const query = searchQuery.toLowerCase();
    return activeSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item: CatalogRow) =>
            (item.Nazwa ?? '').toLowerCase().includes(query) ||
            (item.Kod ?? '').toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [activeSections, searchQuery]);

  const filteredTotalCount = useMemo(() => {
    if (!filteredSections) return 0;
    return filteredSections.reduce(
      (sum, section) => sum + section.items.length,
      0
    );
  }, [filteredSections]);

  return {
    sectionsFromConvex,
    catalogLoading,
    catalogError,
    activeSections,
    totalProductCount,
    filteredSections,
    filteredTotalCount,
  };
}
