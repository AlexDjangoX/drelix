'use client';

import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { useLanguage } from '@/context/LanguageContext';

type Props = { slug: string };

export function CategoryLabel({ slug }: Props) {
  const categories = useQuery(api.catalog.listCategories);
  const { t } = useLanguage();

  if (!categories) return <span className="text-xs animate-pulse">...</span>;

  const cat = categories.find((c) => c.slug === slug);
  if (!cat)
    return (
      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
        {slug}
      </span>
    );

  const keys = cat.titleKey.split('.');
  let current: unknown = t;
  for (const key of keys) {
    current = (current as Record<string, unknown>)?.[key];
  }
  const label = typeof current === 'string' ? current : slug;

  return (
    <span className="text-xs font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">
      {label}
    </span>
  );
}
