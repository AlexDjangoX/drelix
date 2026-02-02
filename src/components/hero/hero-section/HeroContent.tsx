import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimateText, TwoToneHeading } from '@/components';
import {
  HeroTrustBadges,
  containerVariants,
  fromLeftVariants,
  fromRightVariants,
} from '@/components/hero/hero-section';

type HeroContentProps = {
  reducedMotion: boolean;
  onScrollToProducts: () => void;
};

export function HeroContent({
  reducedMotion,
  onScrollToProducts,
}: HeroContentProps) {
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={reducedMotion}
    >
      <motion.div variants={fromLeftVariants(reducedMotion)}>
        <TwoToneHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-5 sm:mb-6 lg:mb-8 text-balance leading-[1.35] tracking-wide"
        >
          <AnimateText k="hero.title" />
        </TwoToneHeading>
      </motion.div>

      <motion.p
        variants={fromRightVariants(reducedMotion)}
        className="text-base sm:text-lg lg:text-xl text-muted-foreground/95 max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 text-pretty leading-relaxed"
      >
        <AnimateText k="hero.subtitle" />
      </motion.p>

      <motion.div
        variants={fromLeftVariants(reducedMotion)}
        className="mb-8 sm:mb-10 lg:mb-12"
      >
        <Button
          size="lg"
          onClick={onScrollToProducts}
          className="bg-gradient-primary cursor-pointer text-primary-foreground font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-glow hover:scale-105 transition-transform"
        >
          <AnimateText k="hero.cta" />
        </Button>
      </motion.div>

      <HeroTrustBadges reducedMotion={reducedMotion} />
    </motion.div>
  );
}
