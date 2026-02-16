import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  direction: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
};

export function LightboxNavButton({ direction, onClick, disabled = false }: Props) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={(e) => {
        if (disabled) return;
        onClick(e);
      }}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={
        isPrev
          ? "Poprzedni produkt"
          : "Następny produkt"
      }
      title={
        disabled
          ? isPrev
            ? "Brak poprzedniego produktu"
            : "Brak następnego produktu"
          : undefined
      }
      className="absolute top-1/2 -translate-y-1/2 z-30 flex min-w-12 min-h-12 sm:min-w-14 sm:min-h-14 items-center justify-center rounded-full bg-black/85 text-white border-2 border-white/40 shadow-lg transition-all duration-200 hover:bg-primary hover:border-white hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-black/85 disabled:hover:border-white/40 disabled:hover:scale-100 disabled:active:scale-100"
      style={
        isPrev
          ? { left: "max(0.25rem, env(safe-area-inset-left))" }
          : { right: "max(0.25rem, env(safe-area-inset-right))" }
      }
    >
      {isPrev ? <ChevronLeft size={28} strokeWidth={2.5} /> : <ChevronRight size={28} strokeWidth={2.5} />}
    </button>
  );
}
