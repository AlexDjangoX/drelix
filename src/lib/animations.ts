/**
 * Shared animation variants for Framer Motion.
 * Used by Hero, ProductSection, WhyUs, and other sections.
 *
 * Accessibility: All variants accept `reducedMotion` – when true, animations
 * are disabled (opacity-only, no slide, no stagger) for prefers-reduced-motion.
 *
 * SEO: Content remains in the DOM; animations are purely visual.
 */
import type { Variants } from "framer-motion";

export const SLIDE_DISTANCE = 56;
export const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/** Stagger container – children animate in sequence. Use custom={reducedMotion}. */
export const containerVariants: Variants = {
  visible: (reduced: boolean) => ({
    transition: reduced
      ? { staggerChildren: 0, delayChildren: 0 }
      : { staggerChildren: 0.1, delayChildren: 0.05 },
  }),
};

/** Stagger for grids (slightly longer delay for card-heavy layouts). */
export const gridStaggerVariants = (reduced: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: reduced
      ? { staggerChildren: 0, delayChildren: 0 }
      : { staggerChildren: 0.12, delayChildren: 0.12 },
  },
});

/** Slide in from left. */
export const fromLeftVariants = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, x: reduced ? 0 : -SLIDE_DISTANCE },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: reduced ? 0 : 0.5, ease: EASE },
  },
});

/** Slide in from right. */
export const fromRightVariants = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, x: reduced ? 0 : SLIDE_DISTANCE },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: reduced ? 0 : 0.5, ease: EASE },
  },
});

/** Card slide from left (slightly longer duration for emphasis). */
export const cardFromLeftVariants = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, x: reduced ? 0 : -SLIDE_DISTANCE },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: reduced ? 0 : 0.65, ease: EASE },
  },
});

/** Fade up (subtle – for cards that benefit from vertical motion). */
export const fadeUpVariants = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.5, ease: EASE },
  },
});
