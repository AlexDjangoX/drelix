import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimateText } from "@/components";
import {
  HeroTrustBadges,
  containerVariants,
  fromLeftVariants,
  fromRightVariants,
} from "@/components/hero/hero-section";

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
      className="@container w-full max-w-6xl mx-auto text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={reducedMotion}
    >
      <motion.div
        variants={fromLeftVariants(reducedMotion)}
        className="mb-8 sm:mb-10 md:mb-12 lg:mb-16"
      >
        <h1 className="text-[clamp(1.25rem,5.8cqw,4.5rem)] font-black sx:whitespace-nowrap leading-normal sm:leading-[1.6] tracking-wide bg-clip-text text-transparent bg-[linear-gradient(to_bottom,var(--two-tone-heading-top)_50%,hsl(var(--primary))_50%)]">
          <AnimateText k="hero.title" />
        </h1>
      </motion.div>

      <motion.p
        variants={fromRightVariants(reducedMotion)}
        className="text-base sm:text-lg lg:text-xl text-muted-foreground/95 max-w-3xl mx-auto text-pretty leading-relaxed mb-10 sm:mb-12 md:mb-14 lg:mb-16"
      >
        <AnimateText k="hero.subtitle" />
      </motion.p>

      <motion.div
        variants={fromLeftVariants(reducedMotion)}
        className="mb-12 sm:mb-14 md:mb-16 lg:mb-20"
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
