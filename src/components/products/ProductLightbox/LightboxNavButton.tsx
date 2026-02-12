import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  direction: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
};

export function LightboxNavButton({ direction, onClick }: Props) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-30 flex min-w-11 min-h-11 items-center justify-center rounded-full bg-black hover:bg-black/90 active:bg-black/80 text-primary border border-transparent hover:border-primary cursor-pointer hover:scale-110 active:scale-100 transition-all duration-200"
      style={
        isPrev
          ? { left: "max(0.25rem, env(safe-area-inset-left))" }
          : { right: "max(0.25rem, env(safe-area-inset-right))" }
      }
      aria-label={isPrev ? "Poprzednie" : "Następne"}
    >
      {isPrev ? <ChevronLeft size={32} /> : <ChevronRight size={32} />}
    </button>
  );
}
