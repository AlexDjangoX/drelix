"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { CatalogSection } from "@/lib/types";

type Props = { section: CatalogSection };

export function CategorySectionTitle({ section }: Props) {
  const { t } = useLanguage();

  if (section.displayName) {
    return <span>{section.displayName}</span>;
  }

  const keys = section.titleKey.split(".");
  let current: unknown = t;
  for (const key of keys) {
    current = (current as Record<string, unknown>)?.[key];
  }
  const label = typeof current === "string" ? current : section.slug;
  return <span>{label}</span>;
}
