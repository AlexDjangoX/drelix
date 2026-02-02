'use client';

import { AboutContent } from '@/components/hero/about/AboutContent';
import { AboutImage } from '@/components/hero/about/AboutImage';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AboutContent />
            <AboutImage />
          </div>
        </div>
      </div>
    </section>
  );
}
