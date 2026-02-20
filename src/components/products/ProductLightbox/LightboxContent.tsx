import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductItem } from "@/lib/types";
import { sanitizeProductDescriptionHtml } from "@/lib/sanitizeHtml";

type Props = {
  item: ProductItem;
  imageIndex: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onGoToImage?: (index: number) => void;
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

/** Build image list from item: use item.images when present, else single image from src/largeSrc. */
function getImagesForItem(item: ProductItem): { imageUrl: string; thumbnailUrl: string }[] {
  if (item.images?.length) return item.images;
  return [{ imageUrl: item.largeSrc, thumbnailUrl: item.src }];
}

export function LightboxContent({
  item,
  imageIndex,
  onPrevImage,
  onNextImage,
  onGoToImage,
}: Props) {
  const heading = item.heading?.trim() || item.name;
  const description = item.description?.trim() || "";
  const images = getImagesForItem(item);
  const imageCount = images.length;
  const safeIndex =
    imageCount <= 0 ? 0 : Math.min(Math.max(0, imageIndex), imageCount - 1);
  const current = images[safeIndex];
  const largeSrc = current?.imageUrl ?? item.largeSrc ?? "";
  const hasMultiple = imageCount > 1;
  const isFirstImage = safeIndex <= 0;
  const isLastImage = safeIndex >= imageCount - 1;

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
        {/* Top: image — same img element, update src only (no key) to avoid remount/refetch on every change */}
        <div className="shrink-0 h-1/2 min-h-0 flex items-center justify-center bg-muted/30 relative">
          {largeSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={largeSrc}
                alt={
                  hasMultiple
                    ? `${heading} — zdjęcie ${safeIndex + 1} z ${imageCount}`
                    : heading
                }
                className="max-w-full max-h-full w-full object-contain"
                style={{ borderRadius: "0.75rem 0.75rem 0 0" }}
                loading="eager"
                decoding="async"
              />
              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isFirstImage) return;
                      onPrevImage();
                    }}
                    disabled={isFirstImage}
                    aria-disabled={isFirstImage}
                    title={isFirstImage ? "Brak poprzedniego zdjęcia" : "Poprzednie zdjęcie"}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/75 text-white flex items-center justify-center border-2 border-white/40 shadow-lg transition-all duration-200 hover:bg-primary hover:border-white hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-black/75 disabled:hover:border-white/40 disabled:hover:scale-100 disabled:active:scale-100"
                    aria-label="Poprzednie zdjęcie"
                  >
                    <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isLastImage) return;
                      onNextImage();
                    }}
                    disabled={isLastImage}
                    aria-disabled={isLastImage}
                    title={isLastImage ? "Brak następnego zdjęcia" : "Następne zdjęcie"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/75 text-white flex items-center justify-center border-2 border-white/40 shadow-lg transition-all duration-200 hover:bg-primary hover:border-white hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-black/75 disabled:hover:border-white/40 disabled:hover:scale-100 disabled:active:scale-100"
                    aria-label="Następne zdjęcie"
                  >
                    <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
                  </button>
                  <div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5"
                    role="tablist"
                    aria-label="Zdjęcia produktu"
                  >
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={i === safeIndex}
                        aria-label={`Zdjęcie ${i + 1} z ${imageCount}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onGoToImage?.(i);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-colors shrink-0 ${
                          i === safeIndex ? "bg-primary" : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className="sr-only"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    Zdjęcie {safeIndex + 1} z {imageCount}
                  </p>
                </>
              )}
            </>
          ) : (
            <div
              className="w-full h-full min-h-[200px] flex items-center justify-center text-muted-foreground text-sm"
              aria-label="Brak zdjęcia"
            >
              Brak zdjęcia
            </div>
          )}
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
