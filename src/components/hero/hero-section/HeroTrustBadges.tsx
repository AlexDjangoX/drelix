import { motion } from 'framer-motion';
import {
  HeroTrustBadge,
  fromRightVariants,
  HERO_TRUST_ITEMS,
} from '@/components/hero/hero-section';

type HeroTrustBadgesProps = {
  reducedMotion: boolean;
};

export function HeroTrustBadges({ reducedMotion }: HeroTrustBadgesProps) {
  return (
    <motion.div
      variants={fromRightVariants(reducedMotion)}
      className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8"
    >
      {HERO_TRUST_ITEMS.map((item) => (
        <HeroTrustBadge key={item.id} icon={item.icon} textKey={item.textKey} />
      ))}
    </motion.div>
  );
}
