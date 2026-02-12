import type { LucideIcon } from "lucide-react";
import { Award, Package, HeadphonesIcon, Wallet, MapPin } from "lucide-react";

export type WhyUsFeatureItem = {
  id: string;
  icon: LucideIcon;
  titleKey:
    | "whyUs.quality.title"
    | "whyUs.range.title"
    | "whyUs.expert.title"
    | "whyUs.prices.title"
    | "whyUs.local.title";
  descKey:
    | "whyUs.quality.description"
    | "whyUs.range.description"
    | "whyUs.expert.description"
    | "whyUs.prices.description"
    | "whyUs.local.description";
};

export const WHY_US_FEATURES: readonly WhyUsFeatureItem[] = [
  {
    id: "quality",
    icon: Award,
    titleKey: "whyUs.quality.title",
    descKey: "whyUs.quality.description",
  },
  {
    id: "range",
    icon: Package,
    titleKey: "whyUs.range.title",
    descKey: "whyUs.range.description",
  },
  {
    id: "expert",
    icon: HeadphonesIcon,
    titleKey: "whyUs.expert.title",
    descKey: "whyUs.expert.description",
  },
  {
    id: "prices",
    icon: Wallet,
    titleKey: "whyUs.prices.title",
    descKey: "whyUs.prices.description",
  },
  {
    id: "local",
    icon: MapPin,
    titleKey: "whyUs.local.title",
    descKey: "whyUs.local.description",
  },
] as const;
