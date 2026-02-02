import Link from 'next/link';
import { AnimateText } from '@/components';
import { QUICK_LINK_ITEMS } from '@/components/hero/footer';

export function FooterQuickLinks() {
  return (
    <div className="text-center sm:text-left">
      <h4 className="font-bold text-foreground mb-4">
        <AnimateText k="footer.quickLinksTitle" />
      </h4>
      <ul className="space-y-2">
        {QUICK_LINK_ITEMS.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              className="cursor-pointer text-muted-foreground hover:text-primary transition-colors text-sm uppercase"
            >
              <AnimateText k={link.key} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
