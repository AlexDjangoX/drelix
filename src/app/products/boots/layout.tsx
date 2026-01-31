import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drelix.pl';
const path = '/products/boots';
const canonical = `${siteUrl}${path}`;

/** Static until redeploy; no revalidation. */
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Obuwie ochronne i robocze',
  description:
    'Katalog obuwia ochronnego i roboczego. Różne modele i zastosowania. Drelix Wadowice.',
  alternates: { canonical },
  openGraph: {
    url: canonical,
    title: 'Obuwie ochronne i robocze | Drelix',
    description:
      'Katalog obuwia ochronnego i roboczego. Drelix Wadowice.',
  },
  twitter: { card: 'summary_large_image', title: 'Obuwie ochronne i robocze | Drelix' },
};

export default function BootsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
