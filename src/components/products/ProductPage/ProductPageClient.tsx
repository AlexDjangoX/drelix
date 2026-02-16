"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Navbar, Footer } from "@/components";
import { AnimateText, TwoToneHeading } from "@/components";
import { useLanguage } from "@/context/language";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductLightbox } from "@/components/products/ProductLightbox";
import { productConfig } from "@/components/products/productConfig";
import type { ProductItem } from "@/lib/types";
import { computeBruttoPrice } from "@/lib/price";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

type Props = { slug: string };

const COD = "Kod";

function resolveTitle(
  t: Record<string, unknown>,
  titleKey: string,
  slug: string,
): string {
  const keys = titleKey.split(".");
  let current: unknown = t;
  for (const key of keys) {
    current =
      current != null && typeof current === "object"
        ? (current as Record<string, unknown>)[key]
        : undefined;
  }
  const text = typeof current === "string" ? current : "";
  return text.trim() || slug;
}

export function ProductPageClient({ slug }: Props) {
  const { t } = useLanguage();
  const sectionFromConvex = useQuery(api.catalog.getCatalogSection, { slug });
  const config = productConfig[slug as keyof typeof productConfig];
  const displayTitle = sectionFromConvex?.displayName;
  const titleKey =
    config?.titleKey ??
    sectionFromConvex?.titleKey ??
    "products.catalogCustomCategory";
  const resolvedTitle = resolveTitle(
    t as unknown as Record<string, unknown>,
    titleKey,
    slug,
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items: ProductItem[] = useMemo(() => {
    if (!sectionFromConvex) return [];
    return sectionFromConvex.items.map((row) => {
      const netto = row.CenaNetto ?? "";
      const brutto = computeBruttoPrice(netto, row.StawkaVAT ?? "");
      return {
        id: row[COD] ?? "",
        src: row.thumbnailUrl || row.imageUrl || PLACEHOLDER_PRODUCT_IMAGE,
        largeSrc: row.imageUrl || row.thumbnailUrl || PLACEHOLDER_PRODUCT_IMAGE,
        name: row.Nazwa ?? "",
        price: brutto || netto,
        unit: row.JednostkaMiary ?? "",
        heading: row.Heading?.trim() || undefined,
        subheading: row.Subheading?.trim() || undefined,
        description: row.Description?.trim() || undefined,
      };
    });
  }, [sectionFromConvex]);

  const openLightbox = useCallback(
    (index: number) => setLightboxIndex(index),
    [],
  );
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + items.length) % items.length,
    );
  }, [items.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  if (sectionFromConvex === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2
          className="w-10 h-10 animate-spin text-muted-foreground"
          aria-hidden
        />
      </div>
    );
  }

  if (sectionFromConvex === null) {
    return null;
  }

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
            <TwoToneHeading
              as="h1"
              className="text-3xl md:text-5xl font-black mb-4"
            >
              {displayTitle ?? resolvedTitle}
            </TwoToneHeading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <AnimateText k="products.subtitle" />
            </p>
          </div>

          <ProductGrid items={items} onItemClick={openLightbox} />
        </div>
      </main>
      <Footer />

      {lightboxIndex !== null && (
        <ProductLightbox
          items={items}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}
