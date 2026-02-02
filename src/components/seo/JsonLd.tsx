import { getCanonicalBaseUrl } from '@/lib/seo/seo';

const siteUrl = getCanonicalBaseUrl();

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteUrl}/#organization`,
  name: 'Drelix - Odzież Robocza i Ochronna',
  description:
    'Profesjonalna odzież robocza i ochronna w Wadowicach. Ponad 500 produktów BHP: kaski, kamizelki odblaskowe, rękawice, obuwie ochronne.',
  url: siteUrl,
  telephone: '+48 725 695 933',
  email: 'annabadura7@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Emila Zegadłowicza 43',
    addressLocality: 'Wadowice',
    postalCode: '34-100',
    addressCountry: 'PL',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.8833,
    longitude: 19.4895,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '16:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '12:00',
    },
  ],
  priceRange: '$$',
  image: `${siteUrl}/og-image.png`,
  sameAs: [],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/#webpage`,
  url: siteUrl,
  name: 'Drelix - Odzież Robocza i Ochronna | Wadowice',
  description:
    'Profesjonalna odzież robocza i ochronna w Wadowicach. Ponad 500 produktów BHP.',
  isPartOf: { '@id': `${siteUrl}/#organization` },
  about: { '@id': `${siteUrl}/#organization` },
  inLanguage: ['pl', 'en'],
};

export function JsonLd() {
  const combined = [localBusinessSchema, webPageSchema];
  const json = JSON.stringify(combined).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
