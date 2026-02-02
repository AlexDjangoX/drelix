'use client';

import Link from 'next/link';
import { AnimateText } from '@/components';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/components/navbar';

type NavbarMobileMenuProps = {
  items: readonly NavItem[];
  isHome: boolean;
  activeSection: string;
  onNavClick: (href: string) => void;
  onClose: () => void;
};

export function NavbarMobileMenu({
  items,
  isHome,
  activeSection,
  onNavClick,
  onClose,
}: NavbarMobileMenuProps) {
  const baseClass =
    'block w-full text-left py-3 px-4 transition-colors font-medium uppercase border-b-2 border-transparent';

  return (
    <div className="lg:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
      {items.map((item) =>
        isHome ? (
          <button
            key={item.id}
            onClick={() => onNavClick(item.href)}
            className={cn(
              'cursor-pointer',
              baseClass,
              activeSection === item.href
                ? 'text-primary bg-primary/10 border-primary'
                : 'text-foreground/80 hover:text-primary hover:bg-secondary/50'
            )}
          >
            <AnimateText k={item.key} />
          </button>
        ) : (
          <Link
            key={item.id}
            href={`/${item.href}`}
            onClick={onClose}
            className={cn(
              baseClass,
              'text-foreground/80 hover:text-primary hover:bg-secondary/50'
            )}
          >
            <AnimateText k={item.key} />
          </Link>
        )
      )}
    </div>
  );
}
