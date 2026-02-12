"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  currentSlug: string;
  onSelect: (slug: string) => void;
  disabled?: boolean;
};

export function CategorySelect({ currentSlug, onSelect, disabled }: Props) {
  const categories = useQuery(api.catalog.listCategories);
  const { t } = useLanguage();

  if (!categories)
    return <div className="h-8 w-32 bg-muted animate-pulse rounded" />;

  const getLabel = (cat: {
    slug: string;
    titleKey: string;
    displayName?: string;
  }) => {
    if (cat.displayName) return cat.displayName;
    const keys = cat.titleKey.split(".");
    let current: unknown = t;
    for (const key of keys) {
      current = (current as Record<string, unknown>)?.[key];
    }
    return typeof current === "string" ? current : cat.slug;
  };

  const sorted = [...categories].sort((a, b) =>
    getLabel(a).localeCompare(getLabel(b), undefined, { sensitivity: "base" }),
  );

  return (
    <select
      value={currentSlug}
      onChange={(e) => onSelect(e.target.value)}
      disabled={disabled}
      className="h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {sorted.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {getLabel(cat)}
        </option>
      ))}
    </select>
  );
}
