import type { ProductItem } from "@/lib/types";

type Props = {
  item: ProductItem;
};

export function LightboxContent({ item }: Props) {
  return (
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
          src={item.largeSrc}
          alt={item.name}
          className="max-w-full max-h-full rounded-t-xl block"
          style={{ borderRadius: "0.75rem 0.75rem 0 0" }}
          loading="eager"
          decoding="async"
        />
        <div className="text-center py-3 px-4 bg-primary text-primary-foreground shadow-lg">
          <p
            className="font-semibold text-sm sm:text-base truncate max-w-full"
            title={item.name}
          >
            {item.name}
          </p>
          {(item.price || item.unit) && (
            <p className="text-primary-foreground/90 text-xs sm:text-sm font-normal mt-0.5">
              {item.price
                ? `${item.price} zł netto${item.unit ? ` / ${item.unit}` : ""}`
                : item.unit}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
