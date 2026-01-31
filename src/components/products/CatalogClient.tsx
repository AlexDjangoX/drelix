'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components';
import { Card, CardContent } from '@/components/ui/card';
import { AnimateText, TwoToneHeading } from '@/components';
import type { CatalogSection, CatalogRow } from '@/lib/catalogCategorize';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/utils';

type Props = { sections: CatalogSection[]; totalCount: number };

function ProductCard({ row, index }: { row: CatalogRow; index: number }) {
  const [imgError, setImgError] = React.useState(false);
  const imageUrl = row.imageUrl ?? row.image ?? '';
  const src = (imageUrl && !imgError) ? imageUrl : PLACEHOLDER_PRODUCT_IMAGE;
  return (
    <Card
      key={`${row.Kod}-${index}`}
      className="border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow overflow-hidden"
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="shrink-0 w-24 h-32 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            <Image
              src={src}
              alt={row.Nazwa || row.Kod}
              width={96}
              height={128}
              className="w-full h-full object-contain"
              sizes="96px"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-mono text-muted-foreground truncate" title={row.Kod}>
              {row.Kod}
            </p>
            <p className="font-semibold text-foreground mt-0.5 line-clamp-2" title={row.Nazwa}>
              {row.Nazwa}
            </p>
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              {row.CenaNetto ? (
                <span className="text-sm font-medium text-primary">
                  {row.CenaNetto} zł <span className="text-muted-foreground font-normal">netto</span>
                </span>
              ) : null}
              {row.JednostkaMiary ? (
                <span className="text-xs text-muted-foreground">/ {row.JednostkaMiary}</span>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CatalogClient({ sections, totalCount }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/#products"
              className="hover:text-primary transition-colors"
            >
              ← <AnimateText k="products.title" />
            </Link>
          </div>
          <div className="text-center mb-12">
            <TwoToneHeading as="h1" className="text-3xl md:text-5xl font-black mb-4">
              <AnimateText k="products.catalogTitle" />
            </TwoToneHeading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <AnimateText k="products.catalogSubtitle" />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {totalCount} <AnimateText k="products.catalogCount" />
            </p>
          </div>

          {sections.map((section) => (
            <section
              key={section.slug}
              id={section.slug}
              className="mb-16 scroll-mt-28"
              aria-labelledby={`section-${section.slug}`}
            >
              <TwoToneHeading
                as="h2"
                id={`section-${section.slug}`}
                className="text-2xl md:text-4xl font-bold mb-2"
              >
                <AnimateText k={section.titleKey} />
              </TwoToneHeading>
              <p className="text-sm text-muted-foreground mb-6">
                {section.items.length} <AnimateText k="products.catalogCount" />
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {section.items.map((row, index) => (
                  <ProductCard key={`${section.slug}-${row.Kod}-${index}`} row={row} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
