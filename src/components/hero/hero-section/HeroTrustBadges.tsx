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
      className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-10 sm:mt-12 md:mt-14 lg:mt-16"
    >
      {HERO_TRUST_ITEMS.map((item) => (
        <HeroTrustBadge key={item.id} icon={item.icon} textKey={item.textKey} />
      ))}
    </motion.div>
  );
}
