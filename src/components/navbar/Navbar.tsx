'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import LanguageSelector from '@/components/reusable/LanguageSelector';
import DarkToggle from '@/components/reusable/DarkToggle';
import {
  NavbarScrollProgress,
  NavbarLogo,
  NavbarDesktopLinks,
  NavbarMobileMenu,
  NavbarMenuButton,
  useNavbarScroll,
  NAV_ITEMS,
} from '@/components/navbar';

function scrollToSection(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled, activeSection, scaleX } = useNavbarScroll(isHome);

  const handleNavClick = useCallback((href: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(href);
  }, []);

  return (
    <>
      <NavbarScrollProgress scaleX={scaleX} />
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-40 min-w-[320px] transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center h-14 sm:h-16 lg:h-20 w-full gap-1 sm:gap-2">
            <div className="flex items-center shrink-0 min-w-0">
              <LanguageSelector />
            </div>

            <NavbarLogo />

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0 min-w-0">
              <NavbarDesktopLinks
                items={NAV_ITEMS}
                isHome={isHome}
                activeSection={activeSection}
                onNavClick={handleNavClick}
              />
              <DarkToggle />
              <NavbarMenuButton
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </div>

          {isMobileMenuOpen && (
            <NavbarMobileMenu
              items={NAV_ITEMS}
              isHome={isHome}
              activeSection={activeSection}
              onNavClick={handleNavClick}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          )}
        </div>
      </nav>
    </>
  );
}
