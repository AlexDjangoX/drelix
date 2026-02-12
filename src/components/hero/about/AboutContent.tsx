import { AnimateText, TwoToneHeading } from "@/components";
import { AboutStats } from "@/components/hero/about";

export function AboutContent() {
  return (
    <div>
      <TwoToneHeading as="h2" className="text-3xl md:text-5xl font-black mb-6">
        <AnimateText k="about.title" />
      </TwoToneHeading>
      <p className="text-lg text-muted-foreground leading-relaxed mb-8">
        <AnimateText k="about.description" />
      </p>
      <AboutStats />
    </div>
  );
}
