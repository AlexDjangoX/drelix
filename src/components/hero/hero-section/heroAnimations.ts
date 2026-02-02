import type { Variants } from 'framer-motion';

export const SLIDE_DISTANCE = 56;
export const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export const containerVariants: Variants = {
  visible: (reduced: boolean) => ({
    transition: reduced
      ? { staggerChildren: 0, delayChildren: 0 }
      : { staggerChildren: 0.1, delayChildren: 0.05 },
  }),
};

export const fromLeftVariants = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, x: reduced ? 0 : -SLIDE_DISTANCE },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: reduced ? 0 : 0.5, ease: EASE },
  },
});

export const fromRightVariants = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, x: reduced ? 0 : SLIDE_DISTANCE },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: reduced ? 0 : 0.5, ease: EASE },
  },
});
