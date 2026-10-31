"use client";

import { useSyncExternalStore } from "react";

/**
 * The current time, refreshed every `intervalMs`. Returns `null` during server rendering
 * (where reading the clock would break prerendering) and on the first client render,
 * so markup always hydrates cleanly.
 */
export function useNow(intervalMs = 30_000): Date | null {
  const time = useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, intervalMs);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    () => null,
  );
  return time === null ? null : new Date(time);
}
