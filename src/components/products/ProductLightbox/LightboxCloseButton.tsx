import { X } from "lucide-react";

type Props = {
  onClick: (e: React.MouseEvent) => void;
};

export function LightboxCloseButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute z-10 flex min-w-11 min-h-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors cursor-pointer"
      style={{
        top: "max(1rem, env(safe-area-inset-top))",
        right: "max(1rem, env(safe-area-inset-right))",
      }}
      aria-label="Zamknij"
    >
      <X size={28} />
    </button>
  );
}
