import type { ProductItem } from "@/lib/types";
import { sanitizeProductDescriptionHtml } from "@/lib/sanitizeHtml";

type Props = {
  item: ProductItem;
};

const CONTENT_HEIGHT =
  "min(85vh, calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 4rem))";

const DESCRIPTION_CLASSES =
  "theme-override-rich product-description text-left text-sm leading-relaxed " +
  "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_b]:font-semibold " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 " +
  "[&_h2]:font-semibold [&_h2]:text-base [&_h2]:mt-3 [&_h2]:mb-1 " +
  "[&_h3]:font-semibold [&_h3]:text-sm [&_h3]:mt-2 [&_h3]:mb-1 " +
  "[&_sub]:align-sub [&_sub]:text-[0.75em] [&_sup]:align-super [&_sup]:text-[0.75em]";

export function LightboxContent({ item }: Props) {
  const heading = item.heading?.trim() || item.name;
  const description = item.description?.trim() || "";

  return (
    <div
      className="relative w-full max-w-4xl flex-1 min-h-0 flex items-center justify-center"
      style={{ height: CONTENT_HEIGHT }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="relative flex flex-col max-w-full h-full bg-background rounded-xl overflow-hidden shadow-xl"
        style={{ height: CONTENT_HEIGHT }}
      >
        {/* Top: image */}
        <div className="shrink-0 h-1/2 min-h-0 flex items-center justify-center bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.largeSrc}
            alt={heading}
            className="max-w-full max-h-full w-full object-contain"
            style={{ borderRadius: "0.75rem 0.75rem 0 0" }}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Middle: only the description content (no subheading/price here; price is in the orange strip). */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 px-5 bg-background text-foreground">
          {description ? (
            <div
              className={DESCRIPTION_CLASSES}
              dangerouslySetInnerHTML={{
                __html: sanitizeProductDescriptionHtml(description),
              }}
            />
          ) : null}
        </div>

        {/* Orange strip at the bottom (name + price) */}
        <div className="shrink-0 text-center py-3 px-4 bg-primary text-primary-foreground shadow-lg">
          <p
            className="font-semibold text-sm sm:text-base truncate max-w-full"
            title={item.name}
          >
            {heading}
          </p>
          {(item.price || item.unit) && (
            <p className="text-primary-foreground/90 text-xs sm:text-sm font-normal mt-0.5">
              {item.price
                ? `${item.price} zł brutto${item.unit ? ` / ${item.unit}` : ""}`
                : item.unit}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
