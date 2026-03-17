import type { LucideIcon } from 'lucide-react';
import {
  Hand,
  Footprints,
  Shirt,
  CloudRain,
  HardHat,
  Eye,
  Ear,
  Shield,
  Heart,
  Thermometer,
  AlertTriangle,
  CircleDot,
  Package,
} from 'lucide-react';
export const CATEGORY_COLORS = [
  'from-orange-500/20 to-yellow-500/20',
  'from-yellow-500/20 to-lime-500/20',
  'from-blue-500/20 to-cyan-500/20',
  'from-amber-500/20 to-orange-500/20',
  'from-indigo-500/20 to-purple-500/20',
  'from-cyan-500/20 to-blue-500/20',
  'from-green-500/20 to-emerald-500/20',
  'from-red-500/20 to-pink-500/20',
  'from-violet-500/20 to-purple-500/20',
  'from-rose-500/20 to-red-500/20',
  'from-sky-500/20 to-blue-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-slate-500/20 to-gray-500/20',
  'from-teal-500/20 to-cyan-500/20',
  'from-lime-500/20 to-green-500/20',
  'from-pink-500/20 to-rose-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-purple-500/20 to-violet-500/20',
  'from-gray-500/20 to-slate-500/20',
  'from-yellow-500/20 to-amber-500/20',
  'from-red-500/20 to-orange-500/20',
  'from-blue-500/20 to-indigo-500/20',
  'from-neutral-500/20 to-gray-500/20',
] as const;

export const CATEGORY_ICONS: LucideIcon[] = [
  Hand,
  Footprints,
  Footprints,
  Footprints,
  Footprints,
  Footprints,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  Shirt,
  HardHat,
  Eye,
  Ear,
  Shield,
  Thermometer,
  CloudRain,
  Heart,
  AlertTriangle,
  CircleDot,
  Package,
];

/** Single source of truth for homepage category cards. Thumbnail empty string = show icon. */
export const CATEGORY_CARDS: {
  slug: string;
  titleKey: string;
  thumbnail: string;
}[] = [
  {
    slug: 'firstaid',
    titleKey: 'productNames.firstAid',
    thumbnail: '/homepage/APT1-apteczka-wieszak-thumb.webp',
  },
  {
    slug: 'sweatshirts',
    titleKey: 'productNames.sweatshirts',
    thumbnail: '/homepage/BLPROF-bluza-profesjonal-thumb.webp',
  },
  {
    slug: 'caps',
    titleKey: 'productNames.caps',
    thumbnail: '/homepage/CZAPCLASSIC-czapka-classic-thumb.webp',
  },
  {
    slug: 'aprons',
    titleKey: 'productNames.aprons',
    thumbnail: '/homepage/FARTUCH M023-fartuch-damski-m-023a-0-thumb.webp',
  },
  {
    slug: 'other',
    titleKey: 'products.catalogOther',
    thumbnail: '/homepage/SKARPETY-skarpety-thumb.webp',
  },
  {
    slug: 'kalosze',
    titleKey: 'productNames.kalosze',
    thumbnail: '/homepage/BGPREDIATOR-kalosz-meski-predator-thumb.webp',
  },
  {
    slug: 'kamizelki-ocieplane',
    titleKey: 'productNames.kamizelkiOcieplane',
    thumbnail: '/homepage/KAMCLASSTOP-bezrekawnik-class-top-thumb.webp',
  },
  { slug: 'vests', titleKey: 'productNames.vests', thumbnail: '' },
  {
    slug: 'helmets',
    titleKey: 'productNames.helmets',
    thumbnail:
      '/homepage/KASK3-univer-kask-helm-ochronny-sh-001-i-walter-kaspe-1-thumb.webp',
  },
  {
    slug: 'klapki',
    titleKey: 'productNames.klapki',
    thumbnail:
      '/homepage/BKLAPK I-buty-zawodowe-klapki-bmkladzpadam-thumb.webp',
  },
  { slug: 'koszula', titleKey: 'productNames.koszula', thumbnail: '' },
  {
    slug: 'jackets',
    titleKey: 'productNames.jackets',
    thumbnail: '/homepage/KURY8365-kurtka-ocieplana-yellow-thumb.webp',
  },
  {
    slug: 'kurtki-softshell',
    titleKey: 'productNames.kurtkiSoftshell',
    thumbnail:
      '/homepage/KURSOFT-kurtka-professional-classic-one-softshell-thumb.webp',
  },
  { slug: 'masks', titleKey: 'productNames.masks', thumbnail: '' },
  {
    slug: 'kneeprotection',
    titleKey: 'productNames.kneeProtection',
    thumbnail: '',
  },
  {
    slug: 'earprotection',
    titleKey: 'productNames.earProtection',
    thumbnail: '',
  },
  {
    slug: 'odziez-gastronomiczna',
    titleKey: 'productNames.odziezGastronomiczna',
    thumbnail: '',
  },
  {
    slug: 'rainwear',
    titleKey: 'productNames.rainwear',
    thumbnail: '/homepage/PŁASZCZ-plaszcz-ppr-pu-poliuretan-thumb.webp',
  },
  {
    slug: 'ogrodniczki',
    titleKey: 'productNames.ogrodniczki',
    thumbnail:
      '/homepage/OGRPROF4DYN-ogrodniczki-professional-4-dynamic-thumb.webp',
  },
  { slug: 'eyewear', titleKey: 'productNames.eyewear', thumbnail: '' },
  {
    slug: 'polar',
    titleKey: 'productNames.polar',
    thumbnail: '/homepage/polarodbl-polar-odblaskowy-zolty-0-thumb.webp',
  },
  {
    slug: 'polbuty',
    titleKey: 'productNames.polbuty',
    thumbnail: '/homepage/BPÓŁMAXPOP-max-popular-polbut-red-s1-thumb.webp',
  },
  { slug: 'reczniki', titleKey: 'productNames.reczniki', thumbnail: '' },
  {
    slug: 'gloves',
    titleKey: 'productNames.gloves',
    thumbnail: '/homepage/R-RECODRAG-recodrag-rekawice-ochronne-thumb.webp',
  },
  { slug: 'sandaly', titleKey: 'productNames.sandaly', thumbnail: '' },
  {
    slug: 'spodnie',
    titleKey: 'productNames.clothing',
    thumbnail: '/homepage/SPBRIXTON-spodnie-brixton-practical-thumb.webp',
  },
  {
    slug: 'spodnie-krotkie',
    titleKey: 'productNames.spodnieKrotkie',
    thumbnail: '/homepage/SPKRÓTKIE-spodnie-krotkie-classic-thumb.webp',
  },
  {
    slug: 'spodnie-ocieplane',
    titleKey: 'productNames.spodnieOcieplane',
    thumbnail: '',
  },
  {
    slug: 't-shirt',
    titleKey: 'productNames.tShirt',
    thumbnail:
      '/homepage/T-SHIRTODBLASK-koszulka-t-shirt-z-odblaskiem-urg-hv-thumb.webp',
  },
  {
    slug: 'trzewiki',
    titleKey: 'productNames.trzewiki',
    thumbnail: '/homepage/TRZ109-trzewiki-109s1-thumb.webp',
  },
  { slug: 'wkladki', titleKey: 'productNames.wkladki', thumbnail: '' },
];
