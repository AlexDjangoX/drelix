import { ChevronDown } from 'lucide-react';
import { AnimateText } from '@/components';

type HeroScrollIndicatorProps = {
  onScrollToMap: () => void;
};

export function HeroScrollIndicator({
  onScrollToMap,
}: HeroScrollIndicatorProps) {
  return (
    <button
      type="button"
      onClick={onScrollToMap}
      className="relative z-10 shrink-0 flex flex-col items-center gap-0.5 text-foreground/70 hover:text-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded pt-2 pb-2 sm:pt-3 sm:pb-3"
      aria-label="Scroll to location map"
    >
      <ChevronDown className="size-6 sm:size-7 animate-bounce" aria-hidden />
      <span className="text-[10px] sm:text-xs font-medium">
        <AnimateText k="hero.scrollToMap" animate={false} />
      </span>
    </button>
  );
}
