import Link from 'next/link';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

function NavLink({ href, children, className }: NavLinkProps) {
  if (href.startsWith('#')) {
    return (
      <a
        href={href}
        className={cn(
          'text-foreground/80 hover:text-primary transition-colors font-medium',
          className
        )}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        'text-foreground/80 hover:text-primary transition-colors font-medium',
        className
      )}
    >
      {children}
    </Link>
  );
}

export default NavLink;
