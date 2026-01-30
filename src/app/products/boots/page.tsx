'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Navbar, Footer } from '@/components';
import { Card, CardContent } from '@/components/ui/card';
import { AnimateText, TwoToneHeading } from '@/components';
import { BOOTS } from '@/data/boots';

export default function BootsPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + BOOTS.length) % BOOTS.length
    );
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % BOOTS.length
    );
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

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
              <AnimateText k="productNames.footwear" />
            </TwoToneHeading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <AnimateText k="products.subtitle" />
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {BOOTS.map((boot, index) => (
              <Card
                key={boot.id}
                className="group cursor-pointer border-border bg-card hover:border-primary/50 active:scale-[0.98] transition-all duration-300 hover:shadow-glow hover:-translate-y-1 overflow-hidden touch-manipulation"
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                role="button"
                tabIndex={0}
              >
                <CardContent className="p-0">
                  <div className="aspect-2/3 relative bg-muted flex items-center justify-center">
                    <Image
                      src={boot.src}
                      alt={boot.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-contain object-center group-hover:scale-[1.02] group-active:scale-100 transition-transform duration-300"
                    />
                  </div>
                  <p className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors truncate">
                    {boot.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {/* Lightbox - safe area and 44px touch targets for mobile */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 touch-manipulation"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
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
            className="absolute z-10 flex min-w-11 min-h-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
            style={{
              top: 'max(1rem, env(safe-area-inset-top))',
              right: 'max(1rem, env(safe-area-inset-right))',
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
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex min-w-11 min-h-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
            style={{ left: 'max(0.25rem, env(safe-area-inset-left))' }}
            aria-label="Poprzednie"
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative w-full max-w-4xl flex-1 min-h-0"
            style={{ height: 'min(85vh, calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 4rem))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={BOOTS[lightboxIndex].src}
              alt={BOOTS[lightboxIndex].name}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
            <p className="absolute bottom-0 left-0 right-0 text-center text-white/90 font-semibold py-2 text-sm sm:text-base">
              {BOOTS[lightboxIndex].name}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex min-w-11 min-h-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
            style={{ right: 'max(0.25rem, env(safe-area-inset-right))' }}
            aria-label="Następne"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
