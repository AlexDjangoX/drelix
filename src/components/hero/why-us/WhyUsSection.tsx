import { WhyUsFeatureGrid, WhyUsHeader } from '@/components/hero/why-us';

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <WhyUsHeader />
        <WhyUsFeatureGrid />
      </div>
    </section>
  );
}
