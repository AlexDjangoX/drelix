'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Hand,
  Footprints,
  Shirt,
  CloudRain,
  HardHat,
  Eye,
  Ear,
  Shield,
  Heart,
  Thermometer,
  AlertTriangle,
  CircleDot,
  Package,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimateText, TwoToneHeading } from '@/components';
import { CATEGORY_SLUGS, CATEGORY_TITLE_KEYS } from '@/data/catalogCategories';
import { getThumbnailPath } from '@/lib/thumbnails';
import type { CategorySlug } from '@/data/catalogCategories';

const CATEGORY_COLORS = [
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
  'from-teal-500/20 to-cyan-500/20',
  'from-lime-500/20 to-green-500/20',
  'from-pink-500/20 to-rose-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-purple-500/20 to-violet-500/20',
  'from-gray-500/20 to-slate-500/20',
  'from-yellow-500/20 to-amber-500/20',
  'from-red-500/20 to-orange-500/20',
  'from-blue-500/20 to-indigo-500/20',
  'from-neutral-500/20 to-gray-500/20',
];

const CATEGORY_ICONS: LucideIcon[] = [
  Hand,
  Footprints,
  Footprints,
  Footprints,
  Footprints,
  Footprints,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  HardHat,
  Eye,
  Ear,
  Shield,
  Thermometer,
  CloudRain,
  Heart,
  AlertTriangle,
  CircleDot,
  Package,
];

const ProductsSection: React.FC = () => {
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
          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <AnimateText k="products.viewFullCatalog" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {CATEGORY_SLUGS.map((slug, index) => {
            const titleKey = CATEGORY_TITLE_KEYS[slug];
            const Icon = CATEGORY_ICONS[index];
            const color = CATEGORY_COLORS[index];
            const thumbnailPath = getThumbnailPath(slug as CategorySlug);
            const cardClassName =
              'group cursor-pointer border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 h-full';
            return (
              <Link
                href={`/products/${slug}`}
                key={slug}
                className="block h-full min-h-0"
              >
                <Card className={cardClassName}>
                  <CardContent className="p-6">
                    <div
                      className={`aspect-square rounded-xl mb-4 overflow-hidden bg-linear-to-br ${color} flex items-center justify-center group-hover:scale-105 transition-transform relative`}
                    >
                      {thumbnailPath ? (
                        <Image
                          src={thumbnailPath}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      ) : (
                        <Icon
                          size={40}
                          className="text-foreground group-hover:text-primary transition-colors"
                        />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                      <AnimateText k={titleKey} />
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
