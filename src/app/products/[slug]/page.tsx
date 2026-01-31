import { notFound } from 'next/navigation';
import {
  PRODUCT_SLUGS,
  productConfig,
} from '../../../components/products/productConfig';
import ProductPageClient from '@/components/products/ProductPageClient';

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (!PRODUCT_SLUGS.includes(slug as (typeof PRODUCT_SLUGS)[number])) {
    notFound();
  }
  const config = productConfig[slug as keyof typeof productConfig];
  if (!config) notFound();

  return <ProductPageClient slug={slug as keyof typeof productConfig} />;
}
