"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useLanguage } from "@/context/language";
import type { CatalogRow, CatalogSection } from "@/lib/types";

function getSectionLabel(
  t: Record<string, unknown>,
  section: CatalogSection,
): string {
  if (section.displayName) return section.displayName;
  const keys = (section.titleKey ?? "").split(".");
  let current: unknown = t;
  for (const key of keys) {
    current = (current as Record<string, unknown>)?.[key];
  }
  return typeof current === "string" ? current : section.slug;
}

export function useCatalogFilter(
  previewSections: CatalogSection[] | null,
  searchQuery: string,
) {
  const { t } = useLanguage();
  const sectionsFromConvex = useQuery(api.catalog.listCatalogSections);
  const catalogLoading = sectionsFromConvex === undefined;
  const catalogError = catalogLoading ? null : null;

  const activeSections = previewSections ?? sectionsFromConvex ?? null;

  const totalProductCount = useMemo(() => {
    if (!activeSections) return 0;
    return activeSections.reduce(
      (sum, section) => sum + section.items.length,
      0,
    );
  }, [activeSections]);

  const filteredSections = useMemo(() => {
    if (!activeSections) return null;
    let result: CatalogSection[];
    if (!searchQuery.trim()) {
      result = activeSections;
    } else {
      const query = searchQuery.toLowerCase();
      result = activeSections
        .map((section) => {
          const items = section.items.filter(
            (item: CatalogRow) =>
              (item.Kod ?? "").toLowerCase().includes(query) ||
              (item.Nazwa ?? "").toLowerCase().includes(query),
          );
          // Prioritise Kod matches: sort so Kod matches appear before Nazwa-only matches
          const sorted = [...items].sort((a, b) => {
            const aKodMatch = (a.Kod ?? "").toLowerCase().includes(query);
            const bKodMatch = (b.Kod ?? "").toLowerCase().includes(query);
            if (aKodMatch && !bKodMatch) return -1;
            if (!aKodMatch && bKodMatch) return 1;
            return 0;
          });
          return { ...section, items: sorted };
        })
        .filter((section) => section.items.length > 0);
    }
    return [...result].sort((a, b) =>
      getSectionLabel(t as unknown as Record<string, unknown>, a).localeCompare(
        getSectionLabel(t as unknown as Record<string, unknown>, b),
        undefined,
        { sensitivity: "base" },
      ),
    );
  }, [activeSections, searchQuery, t]);

  const filteredTotalCount = useMemo(() => {
    if (!filteredSections) return 0;
    return filteredSections.reduce(
      (sum, section) => sum + section.items.length,
      0,
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
