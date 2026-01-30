"use client";

import React from 'react';
import { Award, Users, Package } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const AboutSection: React.FC = () => {
  const { language, t } = useLanguage();

  const stats = [
    { icon: Award, value: '15+', label: t.about.experience },
    { icon: Package, value: '500+', label: t.about.quality },
    { icon: Users, value: '1000+', label: t.about.trust },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                <span className="text-foreground">
                  {t.about.title.split(' ')[0]}{' '}
                </span>
                <span className="text-gradient">
                  {t.about.title.split(' ').slice(1).join(' ') || t.about.title}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t.about.description}
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
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image placeholder */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-secondary to-muted rounded-2xl overflow-hidden shadow-card">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Award size={64} className="text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {language === 'pl' ? 'Zdjęcie sklepu' : 'Store photo'}
                    </p>
                  </div>
                </div>
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
