import type { LucideIcon } from "lucide-react";
import { Award, Package, Users } from "lucide-react";

export type AboutStatItem = {
  id: string;
  icon: LucideIcon;
  value: string;
  labelKey: "about.experience" | "about.quality" | "about.trust";
};

export const ABOUT_STATS: readonly AboutStatItem[] = [
  { id: "experience", icon: Award, value: "15+", labelKey: "about.experience" },
  { id: "quality", icon: Package, value: "500+", labelKey: "about.quality" },
  { id: "trust", icon: Users, value: "1000+", labelKey: "about.trust" },
] as const;
