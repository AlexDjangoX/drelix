import { AnimateText, TwoToneHeading } from "@/components";

export function AboutContent() {
  return (
    <div>
      <TwoToneHeading as="h2" className="text-3xl md:text-5xl font-black mb-6">
        <AnimateText k="about.title" />
      </TwoToneHeading>
      <p className="text-lg text-muted-foreground leading-relaxed">
        <AnimateText k="about.description" />
      </p>
    </div>
  );
}
