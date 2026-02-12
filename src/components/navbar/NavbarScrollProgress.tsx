"use client";

import { motion, type MotionValue } from "framer-motion";

type NavbarScrollProgressProps = {
  scaleX: MotionValue<number>;
};

export function NavbarScrollProgress({ scaleX }: NavbarScrollProgressProps) {
  return (
    <motion.div
      className="fixed inset-x-0 top-14 sm:top-16 lg:top-20 z-50 h-0.5 origin-left bg-primary"
      style={{ scaleX }}
    />
  );
}
