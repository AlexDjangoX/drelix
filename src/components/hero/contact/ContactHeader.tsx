import { AnimateText, TwoToneHeading } from "@/components";

export function ContactHeader() {
  return (
    <div className="text-center mb-16">
      <TwoToneHeading as="h2" className="text-3xl md:text-5xl font-black mb-4">
        <AnimateText k="contact.title" />
      </TwoToneHeading>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        <AnimateText k="contact.subtitle" />
      </p>
    </div>
  );
}
