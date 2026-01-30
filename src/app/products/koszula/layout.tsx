import type { Metadata } from 'next';

/** Static until redeploy; no revalidation. */
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Koszule robocze',
  description:
    'Katalog koszul roboczych. Różne modele i zastosowania. Drelix Wadowice.',
};

export default function KoszulaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
