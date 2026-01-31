"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

// Use placeholder during build when NEXT_PUBLIC_CONVEX_URL is not set (e.g. CI).
// Set NEXT_PUBLIC_CONVEX_URL in .env.local for local dev and in Vercel for production.
const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
