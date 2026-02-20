"use client";

import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { Navbar, Footer } from "@/components";
import { AnimateText, TwoToneHeading } from "@/components";
import { getTextByPath } from "@/components/reusable/AnimateText";
import { ProductCard } from "@/components/products/ProductsCatalog/ProductCard";
import {
  ProductSectionNav,
  sectionId,
} from "@/components/products/ProductPage/ProductSectionNav";
import { useLanguage } from "@/context/language";
import type { CatalogSection } from "@/lib/types";

const CATALOG_PAGE_TOP_ID = "catalog-page-top";

type Props = { sections: CatalogSection[]; totalCount: number };

export function ProductsCatalogContent({ sections, totalCount }: Props) {
  const { t } = useLanguage();
  const getTitle = (s: CatalogSection) =>
    s.displayName ??
    (getTextByPath(t as unknown as Record<string, unknown>, s.titleKey) || s.slug);

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
          <div
            id={CATALOG_PAGE_TOP_ID}
            className="text-center mb-12 scroll-mt-36"
          >
            <TwoToneHeading
              as="h1"
              className="text-3xl md:text-5xl font-black mb-4"
            >
              <AnimateText k="products.catalogTitle" />
            </TwoToneHeading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <AnimateText k="products.catalogSubtitle" />
            </p>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">
              {totalCount} <AnimateText k="products.catalogCount" />
            </p>
            <ProductSectionNav
              items={sections.map((s) => ({
                key: s.slug,
                title: getTitle(s),
              }))}
              className="justify-center"
            />
          </div>

          {sections.map((section) => (
            <section
              key={section.slug}
              id={sectionId(section.slug)}
              className="mb-16 scroll-mt-36"
              aria-labelledby={`section-${section.slug}`}
            >
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById(CATALOG_PAGE_TOP_ID)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="group w-full flex items-center justify-between gap-2 border-b border-primary pb-2 mb-4 text-left cursor-pointer rounded-sm hover:bg-primary/5 active:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                aria-label={`${getTitle(section)}, Wróć do góry`}
                title="Wróć do góry"
              >
                <h2
                  id={`section-${section.slug}`}
                  className="text-xl font-semibold text-primary"
                >
                  {getTitle(section)}
                </h2>
                <ChevronUp className="size-4 shrink-0 text-primary transition-transform group-hover:scale-110" />
              </button>
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
