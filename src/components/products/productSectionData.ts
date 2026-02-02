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
import {
  CATEGORY_SLUGS,
  CATEGORY_TITLE_KEYS,
} from '@/components/products/catalogCategories';
import type { CategorySlug } from '@/lib/types/types';

export { CATEGORY_SLUGS, CATEGORY_TITLE_KEYS };

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

export type ProductSectionCategory = {
  slug: CategorySlug;
  titleKey: string;
  index: number;
};

export const PRODUCT_SECTION_CATEGORIES: ProductSectionCategory[] =
  CATEGORY_SLUGS.map((slug, index) => ({
    slug,
    titleKey: CATEGORY_TITLE_KEYS[slug],
    index,
  }));
