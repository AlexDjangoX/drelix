"use client";

import { useState, useEffect, useEffectEvent } from "react";
import { useScroll, useSpring } from "framer-motion";
import { SECTION_IDS, SCROLL_SPY_OFFSET } from "@/components/navbar/navbarData";

export function useNavbarScroll(isHome: boolean) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS[0]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const onScroll = useEffectEvent(() => {
    setIsScrolled(window.scrollY > 50);

    if (!isHome) return;

    const sections = SECTION_IDS.map((id) => ({
      id,
      el: document.querySelector(id),
    })).filter(
      (s): s is { id: (typeof SECTION_IDS)[number]; el: Element } =>
        s.el != null,
    );

    let current: string = SECTION_IDS[0];
    for (const { id, el } of sections) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= SCROLL_SPY_OFFSET && rect.bottom >= SCROLL_SPY_OFFSET) {
        current = id;
        break;
      }
      if (rect.top < SCROLL_SPY_OFFSET) current = id;
    }
    setActiveSection(current);
  });

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { isScrolled, activeSection, scaleX };
}
