"use client";

import React from "react";
import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface TwoToneHeadingProps {
  /** HTML heading level */
  as?: HeadingTag;
  /** Additional class names */
  className?: string;
  /** Optional override: 'white' or 'foreground'. By default follows theme (foreground in light, white in dark). */
  topColor?: "white" | "foreground";
  /** Inline styles (e.g. for animationDelay) */
  style?: React.CSSProperties;
  /** ID for anchor linking / aria-labelledby */
  id?: string;
  children: React.ReactNode;
}

const twoToneBase =
  "bg-clip-text text-transparent bg-[linear-gradient(to_bottom,var(--two-tone-heading-top)_50%,hsl(var(--primary))_50%)]";

/**
 * Heading with two-tone lettering: top half follows theme (dark in light mode, white in dark mode), bottom half primary (orange).
 * Uses --two-tone-heading-top from globals.css. Pass topColor to override.
 */
export function TwoToneHeading({
  as: Tag = "h2",
  className,
  topColor,
  style,
  id,
  children,
}: TwoToneHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        twoToneBase,
        topColor === "foreground" &&
          "[--two-tone-heading-top:hsl(var(--foreground))]",
        topColor === "white" && "[--two-tone-heading-top:hsl(0_0%_100%)]",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
