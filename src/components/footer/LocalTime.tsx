"use client";

import { useNow } from "@/hooks/useNow";

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
});

/** My local time in Ahmedabad, so clients abroad know when I'm likely to reply. */
export function LocalTime() {
  const now = useNow();
  return <span className="tabular-nums">{now ? timeFormat.format(now) : "--:--"}</span>;
}

export function CurrentYear() {
  const now = useNow(60 * 60 * 1000);
  return <>{now?.getFullYear()}</>;
}
