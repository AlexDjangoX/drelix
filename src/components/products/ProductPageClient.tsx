"use client";

import {
  useState,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
} from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { Navbar, Footer } from "@/components";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateText, TwoToneHeading } from "@/components";
import { useLanguage } from "@/context/language";
import { ProductCardImage } from "@/components/products/ProductCardImage";
import { productConfig } from "@/components/products/productConfig";
import type { ProductItem } from "@/lib/types";
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

export default function ProductPageClient({ slug }: Props) {
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
    return sectionFromConvex.items.map((row) => ({
      id: row[COD] ?? "",
      src: row.thumbnailUrl || row.imageUrl || PLACEHOLDER_PRODUCT_IMAGE,
      largeSrc: row.imageUrl || row.thumbnailUrl || PLACEHOLDER_PRODUCT_IMAGE,
      name: row.Nazwa ?? "",
      price: row.CenaNetto ?? "",
      unit: row.JednostkaMiary ?? "",
    }));
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

  const onKeydown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  });

  useEffect(() => {
    if (lightboxIndex === null) return;
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {items.map((item: ProductItem, index: number) => (
              <Card
                key={item.id}
                className="group cursor-pointer border-border bg-card hover:border-primary/50 active:scale-[0.98] transition-all duration-300 hover:shadow-glow hover:-translate-y-1 overflow-hidden touch-manipulation"
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => e.key === "Enter" && openLightbox(index)}
                role="button"
                tabIndex={0}
              >
                <CardContent className="p-0">
                  <ProductCardImage src={item.src} alt={item.name} />
                  <p className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors truncate">
                    {item.name}
                  </p>
                  {(item.price || item.unit) && (
                    <p className="px-2 pb-2 sm:px-3 sm:pb-3 text-center">
                      {item.price ? (
                        <span className="text-sm font-medium text-primary">
                          {item.price} zł{" "}
                          <span className="text-muted-foreground font-normal">
                            netto
                          </span>
                          {item.unit ? ` / ${item.unit}` : null}
                        </span>
                      ) : item.unit ? (
                        <span className="text-xs text-muted-foreground">
                          {item.unit}
                        </span>
                      ) : null}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 touch-manipulation"
          style={{
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
            paddingTop: "max(1rem, env(safe-area-inset-top))",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Podgląd zdjęcia"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute z-10 flex min-w-11 min-h-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors cursor-pointer"
            style={{
              top: "max(1rem, env(safe-area-inset-top))",
              right: "max(1rem, env(safe-area-inset-right))",
            }}
            aria-label="Zamknij"
          >
            <X size={28} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex min-w-11 min-h-11 items-center justify-center rounded-full bg-black hover:bg-black/90 active:bg-black/80 text-primary border border-transparent hover:border-primary cursor-pointer hover:scale-110 active:scale-100 transition-all duration-200"
            style={{ left: "max(0.25rem, env(safe-area-inset-left))" }}
            aria-label="Poprzednie"
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative w-full max-w-4xl flex-1 min-h-0 flex items-center justify-center"
            style={{
              height:
                "min(85vh, calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 4rem))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex flex-col max-w-full max-h-full">
              {/* Plain img so border-radius applies to the image element (Next/Image applies to wrapper span). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={items[lightboxIndex].largeSrc}
                alt={items[lightboxIndex].name}
                className="max-w-full max-h-full rounded-t-xl block"
                style={{ borderRadius: "0.75rem 0.75rem 0 0" }}
                loading="eager"
                decoding="async"
              />
              <div className="text-center py-3 px-4 bg-primary text-primary-foreground shadow-lg">
                <p
                  className="font-semibold text-sm sm:text-base truncate max-w-full"
                  title={items[lightboxIndex].name}
                >
                  {items[lightboxIndex].name}
                </p>
                {(items[lightboxIndex].price || items[lightboxIndex].unit) && (
                  <p className="text-primary-foreground/90 text-xs sm:text-sm font-normal mt-0.5">
                    {items[lightboxIndex].price
                      ? `${items[lightboxIndex].price} zł netto${items[lightboxIndex].unit ? ` / ${items[lightboxIndex].unit}` : ""}`
                      : items[lightboxIndex].unit}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex min-w-11 min-h-11 items-center justify-center rounded-full bg-black hover:bg-black/90 active:bg-black/80 text-primary border border-transparent hover:border-primary cursor-pointer hover:scale-110 active:scale-100 transition-all duration-200"
            style={{ right: "max(0.25rem, env(safe-area-inset-right))" }}
            aria-label="Następne"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
