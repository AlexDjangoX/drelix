"use client";

/**
 * Full-width banner shown under the navbar on all pages.
 * Day-glow / safety-vest green background for high visibility.
 */
const BANNER_TEXT =
  "Strona w trakcie uzupełniania, przepraszam za wszelkie niedogodności.";

/** ANSI/safety day-glow green (high-visibility vest green), translucent so content behind shows through. */
const DAY_GLOW_GREEN_TRANSLUCENT = "rgba(124, 252, 0, 0.82)";

export function MaintenanceBanner() {
  return (
    <div
      className="fixed left-0 right-0 top-14 z-30 flex min-h-12 items-center justify-center px-4 py-2.5 text-center text-sm font-semibold tracking-wide backdrop-blur-[2px] sm:top-16 sm:text-base lg:top-20"
      style={{
        backgroundColor: DAY_GLOW_GREEN_TRANSLUCENT,
        color: "#0a0a0a",
      }}
      role="status"
      aria-live="polite"
    >
      <p className="max-w-4xl">{BANNER_TEXT}</p>
    </div>
  );
}
