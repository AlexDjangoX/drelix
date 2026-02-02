import type { WhyUsFeatureItem } from '@/components/hero/why-us';
import { AnimateText } from '@/components';

type WhyUsFeatureCardProps = WhyUsFeatureItem & { index: number };

export function WhyUsFeatureCard({
  icon: Icon,
  titleKey,
  descKey,
  index,
}: WhyUsFeatureCardProps) {
  const numberLabel = (index + 1).toString().padStart(2, '0');

  return (
    <div className="relative group">
      <div className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 h-full shadow-card hover:shadow-glow">
        <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Icon size={32} className="text-primary-foreground" aria-hidden />
        </div>

        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          <AnimateText k={titleKey} />
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          <AnimateText k={descKey} />
        </p>

        <div
          className="absolute top-4 right-4 text-6xl font-black text-primary/5 group-hover:text-primary/10 transition-colors"
          aria-hidden
        >
          {numberLabel}
        </div>
      </div>
    </div>
  );
}
