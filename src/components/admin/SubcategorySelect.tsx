"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

type Props = {
  categorySlug: string;
  currentSlug: string;
  onSelect: (slug: string) => void;
  disabled?: boolean;
  id?: string;
};

export function SubcategorySelect({
  categorySlug,
  currentSlug,
  onSelect,
  disabled,
  id,
}: Props) {
  const subcategories = useQuery(
    api.catalog.listSubcategories,
    categorySlug ? { categorySlug } : "skip",
  );

  if (!categorySlug) {
    return (
      <select
        id={id}
        data-testid="subcategory-select"
        value=""
        disabled
        className="h-8 w-full rounded-md border border-input bg-muted px-2 py-1 text-xs text-muted-foreground"
      >
        <option value="">— Wybierz kategorię —</option>
      </select>
    );
  }

  if (!subcategories) {
    return (
      <div
        data-testid="subcategory-select-loading"
        className="h-8 w-32 bg-muted animate-pulse rounded"
        aria-hidden
      />
    );
  }

  return (
    <select
      id={id}
      data-testid="subcategory-select"
      value={currentSlug}
      onChange={(e) => onSelect(e.target.value)}
      disabled={disabled}
      className="h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">— Brak —</option>
      {subcategories.map((sub) => (
        <option key={sub.slug} value={sub.slug}>
          {sub.displayName}
        </option>
      ))}
    </select>
  );
}
