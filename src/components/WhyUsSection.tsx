"use client";

import React from 'react';
import { Award, Package, HeadphonesIcon, Wallet, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const WhyUsSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Award, ...t.whyUs.quality },
    { icon: Package, ...t.whyUs.range },
    { icon: HeadphonesIcon, ...t.whyUs.expert },
    { icon: Wallet, ...t.whyUs.prices },
    { icon: MapPin, ...t.whyUs.local },
  ];

  return (
    <section id="why-us" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="text-foreground">
              {t.whyUs.title.split(' ')[0]}{' '}
            </span>
            <span className="text-gradient">
              {t.whyUs.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.whyUs.subtitle}
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
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
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
