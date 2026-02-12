import type { LucideIcon } from "lucide-react";
import { Facebook } from "lucide-react";

export type SocialLinkItem = {
  id: string;
  icon: LucideIcon;
  href: string;
  label: string;
  className?: string;
};

export type QuickLinkItem = {
  id: string;
  key: "nav.about" | "nav.products" | "nav.whyUs" | "nav.contact";
  href: string;
};

export const SOCIAL_LINKS: readonly SocialLinkItem[] = [
  {
    id: "facebook",
    icon: Facebook,
    href: "https://www.facebook.com/p/Drelix-Odzie%C5%BC-Robocza-100082156284599/",
    label: "Facebook",
    className: "text-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
  },
] as const;

export const QUICK_LINK_ITEMS: readonly QuickLinkItem[] = [
  { id: "about", key: "nav.about", href: "/#about" },
  { id: "products", key: "nav.products", href: "/#products" },
  { id: "whyUs", key: "nav.whyUs", href: "/#why-us" },
  { id: "contact", key: "nav.contact", href: "/#contact" },
] as const;

export const FOOTER_ADDRESS = [
  "Odzież Robocza Drelix",
  "Emila Zegadłowicza 43",
  "34-100 Wadowice",
] as const;
