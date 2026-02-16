import { Card, CardContent } from "@/components/ui/card";
import { ProductCardImage } from "@/components/products/ProductCardImage";
import type { ProductItem } from "@/lib/types";

type Props = {
  item: ProductItem;
  onClick: () => void;
};

export function ProductGridCard({ item, onClick }: Props) {
  return (
    <Card
      className="group cursor-pointer border-border bg-card hover:border-primary/50 active:scale-[0.98] transition-all duration-300 hover:shadow-glow hover:-translate-y-1 overflow-hidden touch-manipulation"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
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
                <span className="text-muted-foreground font-normal">brutto</span>
                {item.unit ? ` / ${item.unit}` : null}
              </span>
            ) : item.unit ? (
              <span className="text-xs text-muted-foreground">{item.unit}</span>
            ) : null}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
