"use client";

import React from "react";
import { useLanguage } from "@/context/language";
import { cn } from "@/lib/utils";

type SupportedHTMLTag =
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "div"
  | "label";

/** Resolve a dot-separated translation key (e.g. "productNames.gloves") to the translated string. */
export function getTextByPath(t: Record<string, unknown>, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (obj, key) =>
        obj != null && typeof obj === "object"
          ? (obj as Record<string, unknown>)[key]
          : undefined,
      t,
    );
  return typeof value === "string" ? value : String(value ?? "");
}

type AnimateTextProps = {
  k: string;
  className?: string;
  tag?: SupportedHTMLTag;
  animate?: boolean;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

export const AnimateText = ({
  k,
  className,
  tag = "span",
  animate = true,
  ...rest
}: AnimateTextProps) => {
  const { t, language } = useLanguage();
  const text = getTextByPath(t as unknown as Record<string, unknown>, k);
  const baseClass = animate
    ? cn("inline-block animate-text-pop", className)
    : className;
  const key = `${language}-${k}`;

  return React.createElement(tag, { key, className: baseClass, ...rest }, text);
};
