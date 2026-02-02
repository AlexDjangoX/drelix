import type { LucideIcon } from 'lucide-react';
import { Shield, HardHat, Glasses } from 'lucide-react';

export type HeroTrustItem = {
  id: string;
  icon: LucideIcon;
  textKey: 'hero.trust1' | 'hero.trust2' | 'hero.trust3';
};

export const HERO_TRUST_ITEMS: readonly HeroTrustItem[] = [
  { id: 'ce', icon: Shield, textKey: 'hero.trust1' },
  { id: 'en', icon: HardHat, textKey: 'hero.trust2' },
  { id: 'bhp', icon: Glasses, textKey: 'hero.trust3' },
] as const;
