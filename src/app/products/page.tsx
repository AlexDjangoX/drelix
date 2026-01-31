import type { Metadata } from "next";
import ProductsCatalogClient from "./ProductsCatalogClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drelix.pl";

export const dynamic = "force-dynamic";

const catalogTitle = "Katalog produktów";
const catalogDescription =
  "Pełna oferta odzieży roboczej i ochronnej. Rękawice, obuwie, spodnie, koszule i inne artykuły BHP. Drelix Wadowice.";

export const metadata: Metadata = {
  title: catalogTitle,
  description: catalogDescription,
  alternates: { canonical: `${siteUrl}/products` },
  openGraph: {
    url: `${siteUrl}/products`,
    title: `${catalogTitle} | Drelix`,
    description: catalogDescription,
  },
  twitter: { card: "summary_large_image", title: `${catalogTitle} | Drelix` },
};

export default function ProductsCatalogPage() {
  return <ProductsCatalogClient />;
}
