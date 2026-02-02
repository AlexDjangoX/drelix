import { Logo } from '@/components';

export function NavbarLogo() {
  return (
    <div className="flex-1 flex justify-center min-w-0 overflow-hidden px-1 sm:px-2">
      <span className="max-[480px]:block min-[481px]:hidden shrink-0">
        <Logo size="sm" className="shrink-0" />
      </span>
      <span className="max-[480px]:hidden min-[481px]:block shrink-0">
        <Logo size="lg" className="shrink-0" />
      </span>
    </div>
  );
}
