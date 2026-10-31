"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Returns the id of whichever section currently crosses the middle of the viewport, or null when
 * that section isn't one of `ids` (so the nav doesn't keep highlighting a section you've left).
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<{ pathname: string; id: string } | null>(null);
  // The navbar outlives page changes, so re-observe when the page (and its sections) change.
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive({ pathname, id: entry.target.id });
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const section of document.querySelectorAll("main section[id]")) observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  // A section seen on another page doesn't count here.
  if (active?.pathname !== pathname) return null;
  return ids.includes(active.id) ? active.id : null;
}
