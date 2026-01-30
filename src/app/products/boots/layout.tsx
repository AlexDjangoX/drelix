import type { Metadata } from 'next';

/** Static until redeploy; no revalidation. */
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Obuwie ochronne i robocze',
  description:
    'Katalog obuwia ochronnego i roboczego. Różne modele i zastosowania. Drelix Wadowice.',
};

export default function BootsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
