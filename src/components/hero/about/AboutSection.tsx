import { AboutContent, AboutImage, AboutStats } from "@/components/hero/about";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-12">
          <AboutContent />
          <AboutImage />
          <AboutStats />
        </div>
      </div>
    </section>
  );
}
