import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { LogoutButton } from "./LogoutButton";

/** Header and page width shared by every signed-in admin page. */
export function AdminFrame({ back, children }: { back?: boolean; children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {back ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" /> All sections
              </Link>
            ) : (
              <Link href="/admin" className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-accent to-accent-2 text-xs font-semibold text-background">
                  {profile.initials}
                </span>
                <span className="text-sm font-medium">Admin</span>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-muted transition-colors hover:text-foreground"
            >
              View site <ArrowUpRight className="size-3.5" />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 pt-10 pb-40 sm:px-6">{children}</main>
    </>
  );
}

export function AdminLoading() {
  return <p className="animate-pulse text-sm text-subtle">Loading…</p>;
}
