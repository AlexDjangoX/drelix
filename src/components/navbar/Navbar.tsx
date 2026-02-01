'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { AnimateText } from '@/components/reusable/AnimateText';
import { Logo } from '@/components';
import LanguageSelector from '@/components/reusable/LanguageSelector';
import DarkToggle from '@/components/reusable/DarkToggle';
import { cn } from '@/lib/utils';

const SECTION_IDS = ['#about', '#products', '#why-us', '#contact'];
const SCROLL_SPY_OFFSET = 120; // px from top of viewport to consider section "active"

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#about');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = SECTION_IDS.map((id) => ({
        id,
        el: document.querySelector(id),
      })).filter((s): s is { id: string; el: Element } => s.el != null);

      let current: string = SECTION_IDS[0];
      for (const { id, el } of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= SCROLL_SPY_OFFSET && rect.bottom >= SCROLL_SPY_OFFSET) {
          current = id;
          break;
        }
        if (rect.top < SCROLL_SPY_OFFSET) current = id;
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'nav.about', href: '#about' },
    { key: 'nav.products', href: '#products' },
    { key: 'nav.whyUs', href: '#why-us' },
    { key: 'nav.contact', href: '#contact' },
  ];

  const handleNavClick = useCallback((href: string) => {
    setIsMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-14 sm:top-16 lg:top-20 z-50 h-0.5 origin-left bg-primary"
        style={{ scaleX }}
      />
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

          <div className="flex-1 flex justify-center min-w-0 overflow-hidden px-1 sm:px-2">
            <span className="max-[480px]:block min-[481px]:hidden shrink-0">
              <Logo size="sm" className="shrink-0" />
            </span>
            <span className="max-[480px]:hidden min-[481px]:block shrink-0">
              <Logo size="lg" className="shrink-0" />
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0 min-w-0">
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    'cursor-pointer transition-colors font-medium uppercase border-b-2 border-transparent pb-0.5',
                    activeSection === item.href
                      ? 'text-primary border-primary'
                      : 'text-foreground/80 hover:text-primary'
                  )}
                >
                  <AnimateText k={item.key} />
                </button>
              ))}
            </div>
            <DarkToggle />
            <button
              className="lg:hidden cursor-pointer p-1.5 sm:p-2 shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (hamburger visible below lg / 1024px) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'block w-full cursor-pointer text-left py-3 px-4 transition-colors font-medium uppercase border-b-2 border-transparent',
                  activeSection === item.href
                    ? 'text-primary bg-primary/10 border-primary'
                    : 'text-foreground/80 hover:text-primary hover:bg-secondary/50'
                )}
              >
                <AnimateText k={item.key} />
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
    </>
  );
}

export default Navbar;
