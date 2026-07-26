"use client";

import { MotionConfig } from "motion/react";

/**
 * Makes every Motion animation honour the user's "reduce motion" OS setting.
 * CSS `prefers-reduced-motion` alone does not affect Motion's JS-driven values.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
