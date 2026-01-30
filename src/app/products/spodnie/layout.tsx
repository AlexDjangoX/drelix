import type { Metadata } from 'next';

/** Static until redeploy; no revalidation. */
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Spodnie robocze i ochronne',
  description:
    'Katalog spodni roboczych i ochronnych. Różne modele i zastosowania. Drelix Wadowice.',
};

export default function SpodnieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
