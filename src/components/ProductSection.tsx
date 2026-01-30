'use client';

import React from 'react';
import Link from 'next/link';
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
import { Card, CardContent } from '@/components/ui/card';
import { AnimateText, TwoToneHeading } from '@/components';

const productKeys = [
  'productNames.helmets',
  'productNames.vests',
  'productNames.gloves',
  'productNames.footwear',
  'productNames.clothing',
  'productNames.koszula',
  'productNames.eyewear',
  'productNames.earProtection',
  'productNames.masks',
  'productNames.harnesses',
  'productNames.firstAid',
  'productNames.rainwear',
  'productNames.thermalWear',
  'productNames.kneeProtection',
  'productNames.signage',
  'productNames.accessories',
] as const;

const productColors = [
  'from-orange-500/20 to-yellow-500/20',
  'from-yellow-500/20 to-lime-500/20',
  'from-blue-500/20 to-cyan-500/20',
  'from-amber-500/20 to-orange-500/20',
  'from-indigo-500/20 to-purple-500/20',
  'from-cyan-500/20 to-blue-500/20',
  'from-green-500/20 to-emerald-500/20',
  'from-red-500/20 to-pink-500/20',
  'from-violet-500/20 to-purple-500/20',
  'from-rose-500/20 to-red-500/20',
  'from-sky-500/20 to-blue-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-slate-500/20 to-gray-500/20',
  'from-yellow-500/20 to-orange-500/20',
  'from-teal-500/20 to-cyan-500/20',
];

const productIcons = [
  HardHat,
  Shirt,
  Hand,
  Footprints,
  Shirt,
  Shirt,
  Eye,
  Ear,
  Shield,
  Shield,
  Heart,
  CloudRain,
  Thermometer,
  CircleDot,
  AlertTriangle,
  Briefcase,
];

const ProductsSection: React.FC = () => {
  const products = productKeys.map((key, index) => ({
    icon: productIcons[index],
    key,
    color: productColors[index],
  }));

  return (
    <section id="products" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <TwoToneHeading as="h2" className="text-3xl md:text-5xl font-black mb-4">
            <AnimateText k="products.title" />
          </TwoToneHeading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <AnimateText k="products.subtitle" />
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product, index) => {
            const isGloves = product.key === 'productNames.gloves';
            const isFootwear = product.key === 'productNames.footwear';
            const isClothing = product.key === 'productNames.clothing';
            const isKoszula = product.key === 'productNames.koszula';
            const hasBgImage = isGloves || isFootwear || isClothing || isKoszula;
            const bgImageUrl = isGloves
              ? '/thumbnails/rekawice.png'
              : isFootwear
              ? '/boots/received_191904903614251.jpeg'
              : isClothing
              ? '/spodnie/received_1272507146683849.jpeg'
              : isKoszula
              ? '/koszula/received_1187296065304596.jpeg'
              : null;
            const cardContent = (
              <>
                <div
                  className={`aspect-square rounded-xl mb-4 overflow-hidden bg-cover bg-center group-hover:scale-105 transition-transform ${
                    hasBgImage && bgImageUrl
                      ? ''
                      : `bg-gradient-to-br ${product.color} flex items-center justify-center`
                  }`}
                  style={
                    hasBgImage && bgImageUrl
                      ? { backgroundImage: `url(${bgImageUrl})` }
                      : undefined
                  }
                >
                  {!hasBgImage && (
                    <product.icon
                      size={40}
                      className="text-foreground group-hover:text-primary transition-colors"
                    />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                  <AnimateText k={product.key} />
                </h3>
                {hasBgImage && (
                  <div className="flex justify-center mt-1">
                    <product.icon
                      size={40}
                      className="text-foreground group-hover:text-primary transition-colors"
                    />
                  </div>
                )}
              </>
            );
            const cardClassName =
              'group cursor-pointer border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 h-full';
            if (isGloves) {
              return (
                <Link
                  href="/products/gloves"
                  key={index}
                  className="block h-full min-h-0"
                >
                  <Card className={cardClassName}>
                    <CardContent className="p-6">{cardContent}</CardContent>
                  </Card>
                </Link>
              );
            }
            if (isFootwear) {
              return (
                <Link
                  href="/products/boots"
                  key={index}
                  className="block h-full min-h-0"
                >
                  <Card className={cardClassName}>
                    <CardContent className="p-6">{cardContent}</CardContent>
                  </Card>
                </Link>
              );
            }
            if (isClothing) {
              return (
                <Link
                  href="/products/spodnie"
                  key={index}
                  className="block h-full min-h-0"
                >
                  <Card className={cardClassName}>
                    <CardContent className="p-6">{cardContent}</CardContent>
                  </Card>
                </Link>
              );
            }
            if (isKoszula) {
              return (
                <Link
                  href="/products/koszula"
                  key={index}
                  className="block h-full min-h-0"
                >
                  <Card className={cardClassName}>
                    <CardContent className="p-6">{cardContent}</CardContent>
                  </Card>
                </Link>
              );
            }
            return (
              <Card key={index} className={cardClassName}>
                <CardContent className="p-6">{cardContent}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
