import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "convex/_generated/api";
import { ProductPageClient } from "@/components/products/ProductPage";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const section = await fetchQuery(api.catalog.getCatalogSection, { slug });
  if (!section) notFound();
  return <ProductPageClient slug={slug} section={section} />;
}
