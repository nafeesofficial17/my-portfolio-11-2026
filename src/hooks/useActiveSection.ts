"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Returns the id of whichever section currently crosses the middle of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<{ pathname: string; id: string } | null>(null);
  const key = ids.join(",");
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
    for (const id of key.split(",")) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key, pathname]);

  // A section seen on another page doesn't count here.
  return active?.pathname === pathname ? active.id : null;
}
