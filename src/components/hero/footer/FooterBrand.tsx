'use client';

import Link from 'next/link';
import { Logo } from '@/components';
import { FOOTER_ADDRESS } from '@/components/hero/footer/footerData';

export function FooterBrand() {
  return (
    <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
      <Link
        href="/"
        className="inline-block mb-4 cursor-pointer"
        aria-label="Drelix - strona główna"
      >
        <Logo size="md" />
      </Link>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {FOOTER_ADDRESS.map((line, i) => (
          <span key={i}>
            {line}
            {i < FOOTER_ADDRESS.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}
