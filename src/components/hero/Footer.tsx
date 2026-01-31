'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook } from 'lucide-react';
import { Logo } from '@/components';
import { AnimateText } from '@/components/reusable/AnimateText';

const socialLinks = [
  {
    icon: Facebook,
    href: 'https://www.facebook.com/p/Drelix-Odzie%C5%BC-Robocza-100082156284599/',
    label: 'Facebook',
  },
];

const quickLinkItems = [
  { key: 'nav.about' as const, href: '/#about' },
  { key: 'nav.products' as const, href: '/#products' },
  { key: 'nav.whyUs' as const, href: '/#why-us' },
  { key: 'nav.contact' as const, href: '/#contact' },
];

const Footer: React.FC = () => {
  return (
    <footer
      aria-label="Stopka"
      className="bg-secondary/50 border-t border-border"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="inline-block mb-4 cursor-pointer" aria-label="Drelix - strona główna">
              <Logo size="md" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Odzież Robocza Drelix
              <br />
              ul. Emila Zegadłowicza 43
              <br />
              34-100 Wadowice
            </p>
          </div>

          {/* Quick Links - proper links for SEO, work from any page */}
          <div>
            <h4 className="font-bold text-foreground mb-4">
              <AnimateText k="footer.quickLinksTitle" />
            </h4>
            <ul className="space-y-2">
              {quickLinkItems.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    <AnimateText k={link.key} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">
              <AnimateText k="footer.followUs" />
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
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
            © {new Date().getFullYear()} Drelix.{' '}
            <AnimateText k="footer.rights" />.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors"
            >
              <AnimateText k="footer.privacy" />
            </Link>
            <Link
              href="/terms"
              className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors"
            >
              <AnimateText k="footer.terms" />
            </Link>
            <Link
              href="/admin/login"
              className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
