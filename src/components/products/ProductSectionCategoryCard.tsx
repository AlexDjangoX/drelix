'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimateText } from '@/components';
import { getThumbnailPath } from '@/lib/thumbnails';
import type { CategorySlug } from '@/lib/types';
import { cardFromLeftVariants } from '@/components/products';

type ProductSectionCategoryCardProps = {
  slug: CategorySlug;
  titleKey: string;
  icon: LucideIcon;
  color: string;
  reducedMotion: boolean;
};

export function ProductSectionCategoryCard({
  slug,
  titleKey,
  icon: Icon,
  color,
  reducedMotion,
}: ProductSectionCategoryCardProps) {
  const thumbnailPath = getThumbnailPath(slug);
  const cardClassName =
    'group cursor-pointer border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 h-full';

  return (
    <motion.div variants={cardFromLeftVariants(reducedMotion)}>
      <Link href={`/products/${slug}`} className="block h-full min-h-0">
        <Card className={cardClassName}>
          <CardContent className="p-6">
            <div
              className={`aspect-square relative rounded-xl mb-4 overflow-hidden bg-linear-to-br ${color} flex items-center justify-center group-hover:scale-105 transition-transform`}
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
                  aria-hidden
                />
              )}
            </div>
            <h3 className="text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors">
              <AnimateText k={titleKey} />
            </h3>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
