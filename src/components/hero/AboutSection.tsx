'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Users, Package } from 'lucide-react';
import { AnimateText, TwoToneHeading } from '@/components';

const AboutSection: React.FC = () => {
  const stats = [
    { icon: Award, value: '15+', labelKey: 'about.experience' as const },
    { icon: Package, value: '500+', labelKey: 'about.quality' as const },
    { icon: Users, value: '1000+', labelKey: 'about.trust' as const },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <TwoToneHeading
                as="h2"
                className="text-3xl md:text-5xl font-black mb-6"
              >
                <AnimateText k="about.title" />
              </TwoToneHeading>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                <AnimateText k="about.description" />
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                      <stat.icon className="text-primary" size={24} />
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      <AnimateText k={stat.labelKey} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-card">
                <Image
                  src="/images/drelix.jpg"
                  alt="Drelix - odzież robocza i ochronna Wadowice"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
