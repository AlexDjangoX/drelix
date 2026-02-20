"use client";

import Link from "next/link";
import { Navbar, Footer } from "@/components";
import { AnimateText, TwoToneHeading } from "@/components";
import { ProductCard } from "@/components/products/ProductsCatalog/ProductCard";
import type { CatalogSection } from "@/lib/types";

type Props = { sections: CatalogSection[]; totalCount: number };

export function ProductsCatalogContent({ sections, totalCount }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        id="main-content"
        className="pt-36 pb-16 md:pt-40 md:pb-24"
        role="main"
        aria-label="Katalog produktów"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/#products"
              className="hover:text-primary transition-colors"
            >
              ← <AnimateText k="products.title" />
            </Link>
          </div>
          <div className="text-center mb-12">
            <TwoToneHeading
              as="h1"
              className="text-3xl md:text-5xl font-black mb-4"
            >
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
                {section.displayName ? (
                  section.displayName
                ) : (
                  <AnimateText k={section.titleKey} />
                )}
              </TwoToneHeading>
              <p className="text-sm text-muted-foreground mb-6">
                {section.items.length} <AnimateText k="products.catalogCount" />
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {section.items.map((row, index) => (
                  <ProductCard
                    key={`${section.slug}-${row.Kod}-${index}`}
                    row={row}
                    index={index}
                  />
                ))}
              </div>
            </section>
          ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
