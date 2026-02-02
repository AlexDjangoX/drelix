'use client';

import { AnimateText } from '@/components';
import { SOCIAL_LINKS } from '@/components/hero/footer/footerData';

export function FooterSocialLinks() {
  return (
    <div className="text-center sm:text-left">
      <h4 className="font-bold text-foreground mb-4">
        <AnimateText k="footer.followUs" />
      </h4>
      <div className="flex gap-4 justify-center sm:justify-start">
        {SOCIAL_LINKS.map((social) => {
          const Icon = social.icon;
          const className =
            social.className ??
            'text-muted-foreground hover:text-primary hover:bg-primary/10';
          return (
            <a
              key={social.id}
              href={social.href}
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center transition-colors cursor-pointer ${className}`}
            >
              <Icon size={20} aria-hidden />
            </a>
          );
        })}
      </div>
    </div>
  );
}
