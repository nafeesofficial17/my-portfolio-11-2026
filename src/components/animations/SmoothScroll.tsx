"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "motion/react";

/**
 * Smoothly scrolls to in-page anchors (`#work`, or `/#work` while on `/`).
 * Runs in the capture phase so it wins over next/link, which would otherwise jump instantly.
 * Lenis honors each section's `scroll-margin-top` (globals.css), which keeps headings clear of the navbar.
 */
function AnchorScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element).closest("a");
      if (!link?.hash || link.target === "_blank") return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      const id = decodeURIComponent(url.hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      if (lenis.isStopped) lenis.start();
      lenis.scrollTo(id === "home" ? 0 : target);
      // Do what a native anchor jump would: update the URL and move keyboard focus to the target,
      // so the skip link works and the next Tab continues from there.
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [lenis]);

  return null;
}

/**
 * Site-wide smooth scrolling (Lenis) and motion settings.
 * Both honor `prefers-reduced-motion`: Lenis falls back to native scrolling and
 * Motion skips transform animations.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.1 }}>
        <AnchorScroll />
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
