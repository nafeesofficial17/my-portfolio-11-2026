import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center px-4">
      <div className="w-full max-w-sm">
        <span className="grid size-11 place-items-center rounded-xl bg-linear-to-br from-accent to-accent-2 text-sm font-semibold text-background">
          {profile.initials}
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Portfolio admin</h1>
        <p className="mt-2 text-sm text-muted">Sign in to update your projects, experience, CV and contact details.</p>
        <LoginForm />
      </div>
    </main>
  );
}
