"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { CategorySection } from "@/components/admin/CatalogTable/CategorySection";
import { CatalogTableHeader } from "@/components/admin/CatalogTable/CatalogTableHeader";
import type { CatalogSection } from "@/lib/types";

type Props = {
  sections: CatalogSection[] | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredTotalCount: number;
  loading: boolean;
  error: string | null;
  isPreview: boolean;
};

export function CatalogTable({
  sections,
  searchQuery,
  onSearchChange,
  filteredTotalCount,
  loading,
  error,
  isPreview,
}: Props) {
  return (
    <section data-testid="catalog-table">
      <CatalogTableHeader
        isPreview={isPreview}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filteredTotalCount={filteredTotalCount}
      />

      <div className="mt-6">
        {loading && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-muted-foreground py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading catalog…
          </div>
        )}

        {error && (
          <div
            className="flex items-center gap-2 text-destructive py-4"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && sections && (
          <div className="space-y-8">
            {sections.map((section) => (
              <CategorySection
                key={section.slug}
                section={section}
                isPreview={isPreview}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
