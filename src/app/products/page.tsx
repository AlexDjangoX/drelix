import type { Metadata } from "next";
import { ProductsCatalogClient } from "@/components/products/ProductsCatalog";
import { ProductsCatalogJsonLd } from "@/components/products/ProductsCatalog/ProductsCatalogJsonLd";
import { getCanonicalBaseUrl } from "@/lib/seo";

const siteUrl = getCanonicalBaseUrl();

export const dynamic = "force-dynamic";

const catalogTitle = "Katalog produktów";
const catalogDescription =
  "Pełna oferta odzieży roboczej i ochronnej. Rękawice, obuwie, spodnie, koszule i inne artykuły BHP. Drelix Wadowice.";

export const metadata: Metadata = {
  title: catalogTitle,
  description: catalogDescription,
  alternates: { canonical: `${siteUrl}/products` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/products`,
    siteName: "Drelix - Odzież Robocza i Ochronna",
    title: `${catalogTitle} | Drelix`,
    description: catalogDescription,
    locale: "pl_PL",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: catalogTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${catalogTitle} | Drelix`,
    description: catalogDescription,
  },
};

export default function ProductsCatalogPage() {
  return (
    <>
      <ProductsCatalogJsonLd />
      <ProductsCatalogClient />
    </>
  );
}
