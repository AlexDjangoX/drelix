import { getCanonicalBaseUrl } from "@/lib/seo";

const siteUrl = getCanonicalBaseUrl();

type Props = { slug: string; name: string };

export function BreadcrumbJsonLd({ slug, name }: Props) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona główna",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Katalog produktów",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `${siteUrl}/products/${slug}`,
      },
    ],
  };
  const json = JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
