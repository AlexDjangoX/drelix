import { Logo } from "@/components";

export function NavbarLogo() {
  return (
    <div className="flex-1 flex justify-center min-w-0 overflow-hidden px-1 sm:px-2">
      <span className="max-[369px]:block min-[370px]:hidden shrink-0">
        <Logo size="xs" className="shrink-0" />
      </span>
      <span className="hidden min-[370px]:block min-[641px]:hidden shrink-0">
        <Logo size="md" className="shrink-0" />
      </span>
      <span className="max-[640px]:hidden min-[641px]:block shrink-0">
        <Logo size="lg" className="shrink-0" />
      </span>
    </div>
  );
}
