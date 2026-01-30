"use client";

import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.products, href: '#products' },
    { label: t.nav.whyUs, href: '#why-us' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      aria-label="Stopka"
      className="bg-secondary/50 border-t border-border"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <Logo size="md" className="mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Odzież Robocza Drelix
              <br />
              ul. Emila Zegadłowicza 43
              <br />
              34-100 Wadowice
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">
              {language === 'pl' ? 'Szybkie linki' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">
              {language === 'pl' ? 'Śledź nas' : 'Follow Us'}
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Drelix. {t.footer.rights}.
          </p>
          <div className="flex gap-6">
            <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.footer.privacy}
            </button>
            <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.footer.terms}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
