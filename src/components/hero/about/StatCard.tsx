import type { LucideIcon } from "lucide-react";
import { AnimateText } from "@/components";

type StatCardProps = {
  icon: LucideIcon;
  value: string;
  labelKey: "about.experience" | "about.quality" | "about.trust";
};

export function StatCard({ icon: Icon, value, labelKey }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
        <Icon className="text-primary" size={24} aria-hidden />
      </div>
      <div className="text-2xl md:text-3xl font-black text-primary">
        {value}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground">
        <AnimateText k={labelKey} />
      </div>
    </div>
  );
}
