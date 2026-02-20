'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ChevronUp } from 'lucide-react';
import { Navbar, Footer, AnimateText, TwoToneHeading } from '@/components';
import { useLanguage } from '@/context/language';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductLightbox } from '@/components/products/ProductLightbox';
import {
  ProductSectionNav,
  sectionId,
} from '@/components/products/ProductPage/ProductSectionNav';
import { productConfig } from '@/components/products/productConfig';
import type { CatalogSection, ProductItem, ProductImageUrl } from '@/lib/types';
import { computeBruttoPrice } from '@/lib/price';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/utils';

type Props = { slug: string; section: CatalogSection };

const COD = 'Kod';

function resolveTitle(
  t: Record<string, unknown>,
  titleKey: string,
  slug: string,
): string {
  return (titleKey.split('.').reduce<unknown>((acc, k) => {
    return acc && typeof acc === 'object'
      ? (acc as Record<string, unknown>)[k]
      : undefined;
  }, t) ?? slug) as string;
}

export function ProductPageClient({ slug, section }: Props) {
  const { t } = useLanguage();
  const config = productConfig[slug as keyof typeof productConfig];

  const resolvedTitle = useMemo(
    () =>
      resolveTitle(
        t as unknown as Record<string, unknown>,
        config?.titleKey ??
          section.titleKey ??
          'products.catalogCustomCategory',
        slug,
      ),
    [t, config?.titleKey, section.titleKey, slug],
  );

  const displayTitle = section.displayName;

  const items: ProductItem[] = useMemo(() => {
    return section.items.map((row) => {
      let parsedImages: ProductImageUrl[] | undefined;

      if (row.imagesJson) {
        try {
          parsedImages = JSON.parse(row.imagesJson);
        } catch {}
      }

      const src =
        parsedImages?.[0]?.thumbnailUrl ||
        parsedImages?.[0]?.imageUrl ||
        row.thumbnailUrl ||
        row.imageUrl ||
        PLACEHOLDER_PRODUCT_IMAGE;

      const largeSrc =
        parsedImages?.[0]?.imageUrl ||
        parsedImages?.[0]?.thumbnailUrl ||
        row.imageUrl ||
        row.thumbnailUrl ||
        PLACEHOLDER_PRODUCT_IMAGE;

      const netto = row.CenaNetto ?? '';
      const brutto = computeBruttoPrice(netto, row.StawkaVAT ?? '');

      return {
        id: row[COD] ?? '',
        src,
        largeSrc,
        images: parsedImages,
        name: row.Nazwa ?? '',
        price: brutto || netto,
        unit: row.JednostkaMiary ?? '',
        heading: row.Heading?.trim() || undefined,
        subheading: row.Subheading?.trim() || undefined,
        description: (row.Description ?? row.Opis)?.trim() || undefined,
        subcategorySlug: row.subcategorySlug?.trim() || undefined,
      };
    });
  }, [section]);

  const subcategoryNames = useMemo(() => {
    const m = new Map<string, string>();
    section.subcategories?.forEach((s) => {
      m.set(s.slug, s.displayName);
    });
    return m;
  }, [section.subcategories]);

  // Server returns items in catalog order: subcategory → image height (tallest first) → Nazwa. Group preserving that order.
  const { groups, flat } = useMemo(() => {
    const subSlugs = section.subcategories?.map((s) => s.slug) ?? [];
    const orderedKeys = [
      ...subSlugs.filter((slug) =>
        items.some((i) => (i.subcategorySlug ?? '') === slug),
      ),
      ...(items.some((i) => !(i.subcategorySlug?.trim())) ? [''] : []),
    ];
    const map = new Map<string, ProductItem[]>(
      orderedKeys.map((k) => [k, []]),
    );
    for (const item of items) {
      const key = item.subcategorySlug ?? '';
      if (map.has(key)) map.get(key)!.push(item);
    }

    let offset = 0;
    const groups = orderedKeys.map((key) => {
      const groupItems = map.get(key) ?? [];
      const startIndex = offset;
      offset += groupItems.length;
      return {
        key,
        title: key ? (subcategoryNames.get(key) ?? key) : '',
        items: groupItems,
        startIndex,
      };
    });

    return { groups, flat: groups.flatMap((g) => g.items) };
  }, [items, section.subcategories, subcategoryNames]);

  const [lightbox, setLightbox] = useState<{
    product: number;
    image: number;
  } | null>(null);

  const open = useCallback(
    (p: number, i = 0) => setLightbox({ product: p, image: i }),
    [],
  );

  const close = useCallback(() => setLightbox(null), []);

  const prevProduct = useCallback(() => {
    setLightbox((s) =>
      s && s.product > 0 ? { product: s.product - 1, image: 0 } : s,
    );
  }, []);

  const nextProduct = useCallback(() => {
    setLightbox((s) =>
      s && s.product < flat.length - 1
        ? { product: s.product + 1, image: 0 }
        : s,
    );
  }, [flat.length]);

  const prevImage = useCallback(() => {
    setLightbox((s) => (s ? { ...s, image: Math.max(0, s.image - 1) } : s));
  }, []);

  const nextImage = useCallback(() => {
    setLightbox((s) => {
      if (!s) return s;
      const count = flat[s.product]?.images?.length ?? 1;
      return {
        ...s,
        image: Math.min(count - 1, s.image + 1),
      };
    });
  }, [flat]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main
        id="main-content"
        className="pt-36 pb-16 md:pt-40 md:pb-24"
        role="main"
        aria-label={displayTitle ?? resolvedTitle}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
          <Link
            href="/#products"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← <AnimateText k="products.title" />
          </Link>

          <div
            id="product-page-top"
            className="text-center space-y-6 scroll-mt-24"
          >
            <TwoToneHeading as="h1" className="text-5xl font-black">
              {displayTitle ?? resolvedTitle}
            </TwoToneHeading>

            <p className="text-lg text-muted-foreground">
              <AnimateText k="products.subtitle" />
            </p>
            <ProductSectionNav
              items={groups
                .filter((g) => g.title)
                .map((g) => ({ key: g.key, title: g.title }))}
            />
          </div>

          {groups.map((g) => (
            <section
              key={g.key || '_'}
              id={sectionId(g.key)}
              className="scroll-mt-36"
            >
              {g.title && (
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById('product-page-top')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="group w-full flex items-center justify-between gap-2 border-b border-primary pb-2 mb-4 text-left cursor-pointer rounded-sm hover:bg-primary/5 active:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                  aria-label={`${g.title}, Wróć do góry`}
                  title="Wróć do góry"
                >
                  <h2 className="text-xl font-semibold text-primary">{g.title}</h2>
                  <ChevronUp className="size-4 shrink-0 text-primary transition-transform group-hover:scale-110" />
                </button>
              )}
              <ProductGrid
                items={g.items}
                onItemClick={(i) => open(g.startIndex + i)}
              />
            </section>
          ))}
          </div>
        </div>
      </main>

      <Footer />

      {lightbox && (
        <ProductLightbox
          items={flat}
          currentProductIndex={lightbox.product}
          currentImageIndex={lightbox.image}
          onClose={close}
          onPrevProduct={prevProduct}
          onNextProduct={nextProduct}
          onPrevImage={prevImage}
          onNextImage={nextImage}
          onGoToImage={(i) => setLightbox((s) => (s ? { ...s, image: i } : s))}
        />
      )}
    </div>
  );
}
