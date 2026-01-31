import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drelix.pl';
const path = '/products/koszula';
const canonical = `${siteUrl}${path}`;

/** Static until redeploy; no revalidation. */
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Koszule robocze',
  description:
    'Katalog koszul roboczych. Różne modele i zastosowania. Drelix Wadowice.',
  alternates: { canonical },
  openGraph: {
    url: canonical,
    title: 'Koszule robocze | Drelix',
    description:
      'Katalog koszul roboczych. Drelix Wadowice.',
  },
  twitter: { card: 'summary_large_image', title: 'Koszule robocze | Drelix' },
};

export default function KoszulaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
