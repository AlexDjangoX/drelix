import { Card, CardContent } from "@/components/ui/card";
import { ProductCardImage } from "@/components/products/ProductCardImage";
import type { ProductItem } from "@/lib/types";
import {
  obuwieWariantPillContent,
  shouldShowObuwiePillOnPhoto,
} from "@/lib/obuwieWariant";

type Props = {
  categorySlug: string;
  item: ProductItem;
  onClick: () => void;
};

export function ProductGridCard({ categorySlug, item, onClick }: Props) {
  const obuwiePill =
    shouldShowObuwiePillOnPhoto(categorySlug) && item.obuwieWariant
      ? obuwieWariantPillContent(item.obuwieWariant)
      : null;

  return (
    <Card
      className="group cursor-pointer border-border bg-card hover:border-primary/50 active:scale-[0.98] transition-all duration-300 hover:shadow-glow hover:-translate-y-1 overflow-hidden touch-manipulation"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      role="button"
      tabIndex={0}
    >
      <CardContent className="p-0">
        <ProductCardImage src={item.src} alt={item.name} kod={item.id} />
        <p className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors truncate">
          {item.name}
        </p>
        {(item.price || item.unit) && (
          <p className="px-2 pb-2 sm:px-3 sm:pb-3 text-center">
            {item.price ? (
              <span className="text-sm font-medium text-primary">
                {item.price} zł{" "}
                <span className="text-muted-foreground font-normal">brutto</span>
                {item.unit ? ` / ${item.unit}` : null}
              </span>
            ) : item.unit ? (
              <span className="text-xs text-muted-foreground">{item.unit}</span>
            ) : null}
          </p>
        )}
        {obuwiePill ? (
          <div className="flex justify-center px-2 pb-2 sm:px-3 sm:pb-3 pt-0.5">
            <span
              className="inline-block max-w-full rounded-full bg-primary px-1.5 py-0.5 text-center text-[9px] sm:text-[10px] font-medium leading-tight text-primary-foreground shadow-sm ring-1 ring-primary-foreground/15"
            >
              {obuwiePill.fullLabel}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
