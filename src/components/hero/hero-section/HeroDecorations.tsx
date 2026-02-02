import { HardHat, Shield } from 'lucide-react';

export function HeroDecorations() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 sm:left-10 opacity-[0.08] sm:opacity-[0.12]">
          <HardHat
            className="text-primary-muted size-28 sm:size-40 lg:size-48"
            aria-hidden
          />
        </div>
        <div className="absolute bottom-24 right-4 sm:right-10 opacity-[0.08] sm:opacity-[0.12]">
          <Shield
            className="text-primary-muted size-32 sm:size-48 lg:size-56"
            aria-hidden
          />
        </div>
      </div>

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--grid-pattern)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--grid-pattern)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
        aria-hidden
      />
    </>
  );
}
