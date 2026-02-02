import { WhyUsFeatureCard, WHY_US_FEATURES } from '@/components/hero/why-us';

export function WhyUsFeatureGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {WHY_US_FEATURES.map((feature, index) => (
        <WhyUsFeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  );
}
