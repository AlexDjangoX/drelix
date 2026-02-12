import type { ProductItem } from "@/lib/types";
import { ProductGridCard } from "@/components/products/ProductGrid/ProductGridCard";

type Props = {
  items: ProductItem[];
  onItemClick: (index: number) => void;
};

export function ProductGrid({ items, onItemClick }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
      {items.map((item: ProductItem, index: number) => (
        <ProductGridCard
          key={item.id}
          item={item}
          onClick={() => onItemClick(index)}
        />
      ))}
    </div>
  );
}
