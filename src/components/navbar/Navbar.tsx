'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimateText } from '@/components/reusable/AnimateText';
import { Logo } from '@/components';
import LanguageSelector from '@/components/reusable/LanguageSelector';
import DarkToggle from '@/components/reusable/DarkToggle';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'nav.about', href: '#about' },
    { key: 'nav.products', href: '#products' },
    { key: 'nav.whyUs', href: '#why-us' },
    { key: 'nav.contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 min-w-[320px] transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-transparent'
      }`}
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
                  className="cursor-pointer text-foreground/80 hover:text-primary transition-colors font-medium"
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
                className="block w-full cursor-pointer text-left py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-colors font-medium"
              >
                <AnimateText k={item.key} />
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
