'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const PAW_POSITIONS = [
  { x: '2%', y: '8%' },
  { x: '15%', y: '5%' },
  { x: '50%', y: '2%' },
  { x: '85%', y: '8%' },
  { x: '95%', y: '12%' },
  { x: '5%', y: '35%' },
  { x: '92%', y: '38%' },
  { x: '8%', y: '72%' },
  { x: '25%', y: '85%' },
  { x: '75%', y: '78%' },
  { x: '90%', y: '68%' },
  { x: '50%', y: '92%' },
  { x: '30%', y: '15%' },
  { x: '70%', y: '18%' },
];

const CONFETTI_COLORS = [
  '#f97316',
  '#fbbf24',
  '#facc15',
  '#fde047',
  '#fef08a',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#ffffff',
  '#fafafa',
];

function PawPrintIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
    </svg>
  );
}

function fireConfettiFromElement(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  confetti({
    particleCount: 180,
    spread: 100,
    origin: { x, y },
    startVelocity: 45,
    colors: CONFETTI_COLORS,
  });
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { x, y },
    startVelocity: 35,
    scalar: 1.2,
    colors: CONFETTI_COLORS,
  });
}

const HOVER_SOUND_PATH = '/luna.mp3';
const SOUND_PREFERENCE_KEY = 'luna-sound-on';

function getStoredSoundPreference(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(SOUND_PREFERENCE_KEY);
    if (stored === null) return true;
    return stored === 'true';
  } catch {
    return true;
  }
}

export function LunaMascot() {
  const lunaRef = useRef<HTMLElement>(null);
  const confettiFired = useRef(false);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const soundPlayedOnce = useRef(false);
  const [soundOn, setSoundOn] = useState(() => getStoredSoundPreference());

  const getHoverSound = useCallback(() => {
    if (hoverSoundRef.current) return hoverSoundRef.current;
    const audio = new Audio(HOVER_SOUND_PATH);
    hoverSoundRef.current = audio;
    return audio;
  }, []);

  const playHoverSound = useCallback(() => {
    try {
      const sound = getHoverSound();
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } catch {
      // ignore
    }
  }, [getHoverSound]);

  const stopPurr = useCallback(() => {
    const sound = hoverSoundRef.current;
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }, []);

  const fireConfetti = useCallback(() => {
    if (!lunaRef.current) return;
    fireConfettiFromElement(lunaRef.current);
  }, []);

  useEffect(() => {
    if (confettiFired.current || !lunaRef.current) return;
    const t = setTimeout(() => {
      if (!lunaRef.current) return;
      fireConfettiFromElement(lunaRef.current);
      if (soundOn) {
        soundPlayedOnce.current = true;
        playHoverSound();
      }
      confettiFired.current = true;
    }, 400);
    return () => clearTimeout(t);
  }, [soundOn, playHoverSound]);

  const handleMouseEnter = useCallback(() => {
    fireConfetti();
    // Play purr once on first hover (user gesture = allowed by browser)
    if (soundOn && !soundPlayedOnce.current) {
      soundPlayedOnce.current = true;
      playHoverSound();
    }
  }, [fireConfetti, playHoverSound, soundOn]);

  return (
    <div className="mb-8 flex justify-center relative min-h-80 pt-8">
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-3xl bg-linear-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10"
        aria-hidden
      />
      {[
        { x: '38%', y: '42%' },
        { x: '58%', y: '48%' },
        { x: '52%', y: '62%' },
      ].map((pos, i) => (
        <motion.span
          key={`sparkle-${i}`}
          className="pointer-events-none absolute z-20 text-primary/60 dark:text-primary/50"
          style={{ left: pos.x, top: pos.y, fontSize: '0.6rem' }}
          animate={{
            opacity: [0, 0.8, 0.2, 0.8, 0],
            scale: [0.8, 1.2, 1, 1.2, 0.8],
          }}
          transition={{
            duration: 2.5 + i * 0.5,
            delay: i * 0.8,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        >
          ✦
        </motion.span>
      ))}
      {PAW_POSITIONS.map((pos, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute z-20 select-none text-pink-500 dark:text-pink-200"
          style={{ left: pos.x, top: pos.y }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.35, 0.35, 0],
            y: [0, -24, -48, -72],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 7 + i * 2,
            delay: i * 2,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        >
          <PawPrintIcon className="text-pink-500 dark:text-pink-600" />
        </motion.span>
      ))}
      <motion.figure
        ref={lunaRef}
        className="group relative inline-block text-center z-10"
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-primary/5 p-2 shadow-lg shadow-primary/10 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/15 group-hover:border-primary/30 dark:shadow-primary/5 dark:group-hover:shadow-primary/10 cursor-default"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          onMouseEnter={handleMouseEnter}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSoundOn((on) => {
                const next = !on;
                try {
                  localStorage.setItem(SOUND_PREFERENCE_KEY, String(next));
                } catch {
                  // ignore
                }
                if (on) stopPurr();
                return next;
              });
            }}
            className="absolute top-2 right-2 z-20 rounded-full p-1.5 bg-background/80 dark:bg-background/90 border border-primary/20 text-primary shadow-sm hover:bg-background hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={soundOn ? 'Mute Luna sound' : 'Unmute Luna sound'}
          >
            {soundOn ? (
              <Volume2 className="h-4 w-4" aria-hidden />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden />
            )}
          </button>
          <div className="relative">
            <Image
              src="/images/luna.jpg"
              alt="Luna"
              width={280}
              height={210}
              className="rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              priority
            />
            <figcaption className="mt-2 space-y-0.5 overflow-visible">
              <motion.p
                className="text-sm font-semibold text-foreground"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.5,
                }}
              >
                Luna
              </motion.p>
              <motion.p
                className="text-xs text-muted-foreground italic"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.85,
                }}
              >
                Chief Napping Officer · Quality control by stare
              </motion.p>
              <motion.p
                className="text-xs text-primary/90 dark:text-primary/80 font-medium"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 1.2,
                }}
              >
                Mruczek na dyżurze ♡
              </motion.p>
              <motion.p
                className="mt-1.5 text-[10px] text-muted-foreground/80"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 1.55,
                }}
              >
                Witaj z powrotem, kocie serduszko ♡
              </motion.p>
            </figcaption>
          </div>
        </motion.div>
      </motion.figure>
    </div>
  );
}
