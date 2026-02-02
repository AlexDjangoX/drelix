import { AnimateText, TwoToneHeading } from '@/components';

export function WhyUsHeader() {
  return (
    <div className="text-center mb-16">
      <TwoToneHeading as="h2" className="text-3xl md:text-5xl font-black mb-4">
        <AnimateText k="whyUs.title" />
      </TwoToneHeading>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        <AnimateText k="whyUs.subtitle" />
      </p>
    </div>
  );
}
