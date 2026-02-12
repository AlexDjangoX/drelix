"use client";

import { useEffect, useEffectEvent } from "react";
import type { ProductItem } from "@/lib/types";
import { LightboxCloseButton } from "@/components/products/ProductLightbox/LightboxCloseButton";
import { LightboxNavButton } from "@/components/products/ProductLightbox/LightboxNavButton";
import { LightboxContent } from "@/components/products/ProductLightbox/LightboxContent";

type Props = {
  items: ProductItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function ProductLightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const currentItem = items[currentIndex];

  const onKeydown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 touch-manipulation"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Podgląd zdjęcia"
    >
      <LightboxCloseButton
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <LightboxNavButton
        direction="prev"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
      />

      <LightboxContent item={currentItem} />

      <LightboxNavButton
        direction="next"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      />
    </div>
  );
}
