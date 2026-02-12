"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/language";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [rotationCount, setRotationCount] = useState(0);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "pl" : "en");
    setRotationCount(rotationCount + 1);
  };

  return (
    <motion.div
      className="relative flex h-8 min-w-20.5 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 shadow-inner shadow-slate-500/65 transition-all duration-300 dark:bg-gray-900 dark:shadow-slate-600"
      onClick={toggleLanguage}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute left-1.25 z-10">
        <Image
          src="/images/uk.png"
          alt="EN"
          width={20}
          height={20}
          unoptimized
        />
      </div>

      <div className="absolute right-1 z-10">
        <Image
          src="/images/pl.png"
          alt="PL"
          width={20}
          height={20}
          unoptimized
        />
      </div>

      <motion.div
        className="absolute top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-b from-red-300 to-red-600 shadow-md transition-colors duration-300 dark:bg-linear-to-b dark:from-gray-500 dark:to-gray-800"
        animate={{
          x: language === "pl" ? 2 : 54,
          rotate: rotationCount * 360,
        }}
        style={{ left: "1px" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        <Languages
          strokeWidth={1.4}
          size={16}
          className="text-white dark:text-white"
        />
      </motion.div>

      {isHovered && (
        <motion.div
          className="absolute inset-0 z-30 bg-black/20 dark:bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}
