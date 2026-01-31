import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drelix.pl';
const path = '/products/spodnie';
const canonical = `${siteUrl}${path}`;

/** Static until redeploy; no revalidation. */
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Spodnie robocze i ochronne',
  description:
    'Katalog spodni roboczych i ochronnych. Różne modele i zastosowania. Drelix Wadowice.',
  alternates: { canonical },
  openGraph: {
    url: canonical,
    title: 'Spodnie robocze i ochronne | Drelix',
    description:
      'Katalog spodni roboczych i ochronnych. Drelix Wadowice.',
  },
  twitter: { card: 'summary_large_image', title: 'Spodnie robocze i ochronne | Drelix' },
};

export default function SpodnieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
