"use client";

import Link from "next/link";
import { AnimateText } from "@/components";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/navbar";

type NavbarDesktopLinksProps = {
  items: readonly NavItem[];
  isHome: boolean;
  activeSection: string;
  onNavClick: (href: string) => void;
};

export function NavbarDesktopLinks({
  items,
  isHome,
  activeSection,
  onNavClick,
}: NavbarDesktopLinksProps) {
  const baseClass =
    "transition-colors font-medium uppercase border-b-2 border-transparent pb-0.5";

  return (
    <div className="hidden lg:flex items-center gap-8">
      {items.map((item) =>
        isHome ? (
          <button
            key={item.id}
            onClick={() => onNavClick(item.href)}
            className={cn(
              "cursor-pointer",
              baseClass,
              activeSection === item.href
                ? "text-primary border-primary"
                : "text-foreground/80 hover:text-primary",
            )}
          >
            <AnimateText k={item.key} />
          </button>
        ) : (
          <Link
            key={item.id}
            href={`/${item.href}`}
            className={cn(baseClass, "text-foreground/80 hover:text-primary")}
          >
            <AnimateText k={item.key} />
          </Link>
        ),
      )}
    </div>
  );
}
