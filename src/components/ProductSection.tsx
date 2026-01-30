"use client";

import React from 'react';
import {
  HardHat,
  Shirt,
  Hand,
  Footprints,
  Eye,
  Ear,
  Shield,
  Heart,
  CloudRain,
  Thermometer,
  CircleDot,
  AlertTriangle,
  Briefcase,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const ProductsSection: React.FC = () => {
  const { t } = useLanguage();

  const products = [
    {
      icon: HardHat,
      name: t.productNames.helmets,
      color: 'from-orange-500/20 to-yellow-500/20',
    },
    {
      icon: Shirt,
      name: t.productNames.vests,
      color: 'from-yellow-500/20 to-lime-500/20',
    },
    {
      icon: Hand,
      name: t.productNames.gloves,
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: Footprints,
      name: t.productNames.footwear,
      color: 'from-amber-500/20 to-orange-500/20',
    },
    {
      icon: Shirt,
      name: t.productNames.clothing,
      color: 'from-indigo-500/20 to-purple-500/20',
    },
    {
      icon: Eye,
      name: t.productNames.eyewear,
      color: 'from-cyan-500/20 to-blue-500/20',
    },
    {
      icon: Ear,
      name: t.productNames.earProtection,
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: Shield,
      name: t.productNames.masks,
      color: 'from-red-500/20 to-pink-500/20',
    },
    {
      icon: Shield,
      name: t.productNames.harnesses,
      color: 'from-violet-500/20 to-purple-500/20',
    },
    {
      icon: Heart,
      name: t.productNames.firstAid,
      color: 'from-rose-500/20 to-red-500/20',
    },
    {
      icon: CloudRain,
      name: t.productNames.rainwear,
      color: 'from-sky-500/20 to-blue-500/20',
    },
    {
      icon: Thermometer,
      name: t.productNames.thermalWear,
      color: 'from-orange-500/20 to-red-500/20',
    },
    {
      icon: CircleDot,
      name: t.productNames.kneeProtection,
      color: 'from-slate-500/20 to-gray-500/20',
    },
    {
      icon: AlertTriangle,
      name: t.productNames.signage,
      color: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      icon: Briefcase,
      name: t.productNames.accessories,
      color: 'from-teal-500/20 to-cyan-500/20',
    },
  ];

  return (
    <section id="products" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="text-foreground">
              {t.products.title.split(' ')[0]}{' '}
            </span>
            <span className="text-gradient">
              {t.products.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.products.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product, index) => (
            <Card
              key={index}
              className="group cursor-pointer border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div
                  className={`aspect-square rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                >
                  <product.icon
                    size={40}
                    className="text-foreground group-hover:text-primary transition-colors"
                  />
                </div>
                <h3 className="text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
