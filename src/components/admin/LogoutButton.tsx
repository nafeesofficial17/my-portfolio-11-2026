"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/session", { method: "DELETE" });
        router.replace("/admin/login");
      }}
      aria-label="Sign out"
      className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:text-foreground"
    >
      <LogOut className="size-4" />
    </button>
  );
}
