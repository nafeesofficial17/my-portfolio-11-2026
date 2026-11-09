"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { navItems } from "@/data/navigation";
import { profile } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

const sectionIds = navItems.map((item) => item.href.slice(2));
const MotionLink = motion.create(Link);
// The hero shows WhatsApp next to the other profiles, so the menu does too.
const socials = [...profile.socials, { platform: "whatsapp" as const, label: "WhatsApp", href: profile.whatsapp }];

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Keyboard users tabbing into the header must be able to see it, even after scrolling down.
  const [focusWithin, setFocusWithin] = useState(false);
  const active = useActiveSection(sectionIds);
  const lenis = useLenis();
  const { scrollY } = useScroll();

  // Glass background once the page moves; hide while scrolling down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > previous && y > 160);
  });

  // While the mobile menu is open: freeze the page and close on Escape or on resize to desktop.
  useEffect(() => {
    if (!menuOpen) return;
    lenis?.stop();
    // Everything behind the full-screen menu is out of reach for Tab and screen readers until it closes.
    const background = [...document.querySelectorAll<HTMLElement>("body > :not(header, #mobile-menu, [inert])")];
    for (const el of background) el.inert = true;
    const desktop = window.matchMedia("(min-width: 768px)");
    const close = () => setMenuOpen(false);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", close);
    return () => {
      for (const el of background) el.inert = false;
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", close);
    };
  }, [menuOpen, lenis]);

  return (
    <>
      <motion.header
        initial={{ y: "-130%" }}
        animate={{ y: hidden && !menuOpen && !focusWithin ? "-130%" : "0%" }}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
        }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4"
      >
        <nav
          aria-label="Main"
          className={cn(
            "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border pr-2 pl-3 transition-[background-color,border-color,box-shadow] duration-500 sm:pl-4",
            scrolled || menuOpen
              ? "border-line bg-background/70 shadow-[0_8px_32px_-12px_rgb(0_0_0/0.7)] backdrop-blur-xl"
              : "border-transparent",
          )}
        >
          <Link href="/#home" className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-accent to-accent-2 text-xs font-semibold text-background">
              {profile.initials}
            </span>
            <span className="text-sm font-medium tracking-tight">{profile.name}</span>
          </Link>

          <ul className="hidden items-center md:flex">
            {navItems.map((item) => {
              const isActive = active === item.href.slice(2);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-sm transition-colors duration-300",
                      isActive ? "text-foreground" : "text-muted hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.08]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ButtonLink href="/#contact" size="sm" className="hidden md:inline-flex">
              Let&apos;s talk
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full border border-line text-foreground md:hidden"
            >
              {menuOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.15 } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" data-lenis-prevent className="flex h-full flex-col justify-between gap-8 overflow-y-auto px-6 pt-28 pb-10 [@media(max-height:700px)]:pt-24 [@media(max-height:700px)]:pb-6">
              <ul className="border-t border-line">
                {navItems.map((item, i) => {
                  const isActive = active === item.href.slice(2);
                  return (
                    <li key={item.href} className="overflow-hidden border-b border-line">
                      <MotionLink
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "location" : undefined}
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%", transition: { duration: 0.3, ease: easeOutExpo } }}
                        transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.08 + i * 0.05 }}
                        className="flex items-center gap-4 py-4 text-[clamp(1.5rem,7vw,2rem)] font-medium tracking-tight [@media(max-height:700px)]:py-2.5"
                      >
                        <span className={cn("w-5 font-mono text-xs", isActive ? "text-accent" : "text-subtle")}>0{i + 1}</span>
                        <span className={cn("flex-1", !isActive && "text-foreground/85")}>{item.label}</span>
                        <ArrowUpRight className="size-5 text-subtle" aria-hidden />
                      </MotionLink>
                    </li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.35 }}
                className="space-y-5"
              >
                <ButtonLink href="/#contact" onClick={() => setMenuOpen(false)} className="w-full">
                  Start a project
                  <ArrowUpRight className="size-4" aria-hidden />
                </ButtonLink>
                <a href={`mailto:${profile.email}`} className="block text-muted">
                  {profile.email}
                </a>
                <ul className="flex gap-3">
                  {socials.map((social) => (
                    <li key={social.platform}>
                      <a
                        href={social.href}
                        target={social.platform === "email" ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="grid size-11 place-items-center rounded-full border border-line text-muted"
                      >
                        <SocialIcon platform={social.platform} className="size-[18px]" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
