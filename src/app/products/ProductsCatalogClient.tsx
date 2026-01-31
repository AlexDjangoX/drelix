"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Loader2 } from "lucide-react";
import CatalogClient from "./CatalogClient";
import type { CatalogProduct, CatalogSection } from "@/data/catalogCategories";

const COD = "Kod";

function mapConvexSectionsToCatalog(
  sections: { slug: string; titleKey: string; items: Record<string, string>[] }[]
): CatalogSection[] {
  return sections.map(({ slug, titleKey, items }) => ({
    slug: slug as CatalogSection["slug"],
    titleKey,
    items: items.map((row) => ({
      ...row,
      image: row.imageUrl || `/${slug}/${row[COD] ?? ""}.jpg`,
    })) as CatalogProduct[],
  }));
}

export default function ProductsCatalogClient() {
  const sectionsFromConvex = useQuery(api.catalog.listCatalogSections);

  if (sectionsFromConvex === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  const sections = mapConvexSectionsToCatalog(sectionsFromConvex);
  const totalCount = sections.reduce((n, s) => n + s.items.length, 0);

  return <CatalogClient sections={sections} totalCount={totalCount} />;
}
