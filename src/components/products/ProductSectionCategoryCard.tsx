"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language";
import { getThumbnailPath } from "@/lib/thumbnails";
import { ProductCardImage } from "@/components/products/ProductCardImage";

function getLabel(
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

type ProductSectionCategoryCardProps = {
  slug: string;
  titleKey: string;
  displayName?: string;
  icon: LucideIcon;
  color: string;
};

export function ProductSectionCategoryCard({
  slug,
  titleKey,
  displayName,
  icon: Icon,
  color,
}: ProductSectionCategoryCardProps) {
  const { t } = useLanguage();
  const thumbnailPath = getThumbnailPath(slug);
  const label =
    displayName ??
    getLabel(t as unknown as Record<string, unknown>, titleKey, slug);
  const cardClassName =
    "group cursor-pointer border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 h-full";

  return (
    <Link href={`/products/${slug}`} className="block h-full min-h-0">
      <Card className={cardClassName}>
        <CardContent className="p-6">
          {thumbnailPath ? (
            <ProductCardImage
              src={thumbnailPath}
              alt=""
              className={`relative w-full rounded-xl mb-4 overflow-hidden flex items-center justify-center bg-linear-to-br ${color}`}
              imageClassName="object-contain object-center group-hover:scale-105 transition-transform"
            />
          ) : (
            <div
              className={`aspect-square relative rounded-xl mb-4 overflow-hidden bg-linear-to-br ${color} flex items-center justify-center`}
            >
              <Icon
                size={40}
                className="text-foreground group-hover:text-primary transition-colors"
                aria-hidden
              />
            </div>
          )}
          <h3 className="text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors">
            {label}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}
