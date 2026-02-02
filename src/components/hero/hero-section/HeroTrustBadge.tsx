import type { LucideIcon } from 'lucide-react';
import { AnimateText } from '@/components';

type HeroTrustBadgeProps = {
  icon: LucideIcon;
  textKey: 'hero.trust1' | 'hero.trust2' | 'hero.trust3';
};

export function HeroTrustBadge({ icon: Icon, textKey }: HeroTrustBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 sm:px-5 sm:py-2 border border-primary/20">
      <Icon
        className="shrink-0 text-primary size-4 sm:size-5"
        strokeWidth={2}
        aria-hidden
      />
      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
        <AnimateText k={textKey} />
      </span>
    </div>
  );
}
