'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';

export type SectionNavItem = { key: string; title: string };

type Props = {
  items: SectionNavItem[];
  className?: string;
};

/** Id used for each section so scroll-into-view works. */
export function sectionId(key: string): string {
  return `section-${key || '_'}`;
}

export function ProductSectionNav({ items, className }: Props) {
  const handleClick = useCallback((key: string) => {
    const el = document.getElementById(sectionId(key));
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Sekcje kategorii"
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 w-full',
        className,
      )}
    >
      {items.map(({ key, title }) => (
        <button
          key={key}
          type="button"
          onClick={() => handleClick(key)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium cursor-pointer',
            'bg-primary/10 text-muted-foreground border border-primary/20',
            'hover:bg-primary/15 hover:text-primary hover:border-primary/40',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          )}
        >
          {title}
        </button>
      ))}
    </nav>
  );
}
