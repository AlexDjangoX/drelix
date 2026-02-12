export const SECTION_IDS = [
  "#about",
  "#products",
  "#why-us",
  "#contact",
] as const;
export const SCROLL_SPY_OFFSET = 120;

export type NavItem = {
  id: string;
  key: "nav.about" | "nav.products" | "nav.whyUs" | "nav.contact";
  href: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { id: "about", key: "nav.about", href: "#about" },
  { id: "products", key: "nav.products", href: "#products" },
  { id: "whyUs", key: "nav.whyUs", href: "#why-us" },
  { id: "contact", key: "nav.contact", href: "#contact" },
] as const;
