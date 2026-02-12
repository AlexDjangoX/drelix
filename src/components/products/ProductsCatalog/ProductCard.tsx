"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCardImage } from "@/components/products/ProductCardImage";
import type { CatalogRow } from "@/lib/types";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/utils";

type Props = { row: CatalogRow; index: number };

export function ProductCard({ row, index }: Props) {
  const [imgError, setImgError] = useState(false);
  const thumbnailUrl = row.thumbnailUrl ?? row.imageUrl ?? row.image ?? "";
  const src =
    thumbnailUrl && !imgError ? thumbnailUrl : PLACEHOLDER_PRODUCT_IMAGE;

  return (
    <Card
      key={`${row.Kod}-${index}`}
      className="border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow overflow-hidden"
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="shrink-0 w-24 min-h-0">
            <ProductCardImage
              src={src}
              alt={row.Nazwa || row.Kod}
              sizes="96px"
              className="relative w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden"
              imageClassName="object-contain object-center"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-mono text-muted-foreground truncate"
              title={row.Kod}
            >
              {row.Kod}
            </p>
            <p
              className="font-semibold text-foreground mt-0.5 line-clamp-2"
              title={row.Nazwa}
            >
              {row.Nazwa}
            </p>
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              {row.CenaNetto ? (
                <span className="text-sm font-medium text-primary">
                  {row.CenaNetto} zł{" "}
                  <span className="text-muted-foreground font-normal">
                    netto
                  </span>
                </span>
              ) : null}
              {row.JednostkaMiary ? (
                <span className="text-xs text-muted-foreground">
                  / {row.JednostkaMiary}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
