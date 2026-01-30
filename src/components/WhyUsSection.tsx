"use client";

import React from 'react';
import { Award, Package, HeadphonesIcon, Wallet, MapPin } from 'lucide-react';
import { AnimateText } from './AnimateText';

const featureKeys = [
  { icon: Award, titleKey: 'whyUs.quality.title', descKey: 'whyUs.quality.description' },
  { icon: Package, titleKey: 'whyUs.range.title', descKey: 'whyUs.range.description' },
  { icon: HeadphonesIcon, titleKey: 'whyUs.expert.title', descKey: 'whyUs.expert.description' },
  { icon: Wallet, titleKey: 'whyUs.prices.title', descKey: 'whyUs.prices.description' },
  { icon: MapPin, titleKey: 'whyUs.local.title', descKey: 'whyUs.local.description' },
] as const;

const WhyUsSection: React.FC = () => {
  const features = featureKeys;

  return (
    <section id="why-us" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <AnimateText k="whyUs.title" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <AnimateText k="whyUs.subtitle" />
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="relative group">
              <div className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 h-full shadow-card hover:shadow-glow">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={32} className="text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  <AnimateText k={feature.titleKey} />
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  <AnimateText k={feature.descKey} />
                </p>

                {/* Decorative number */}
                <div className="absolute top-4 right-4 text-6xl font-black text-primary/5 group-hover:text-primary/10 transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
