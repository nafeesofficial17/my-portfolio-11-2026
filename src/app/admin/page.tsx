import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, CircleAlert, GitBranch } from "lucide-react";
import { AdminFrame, AdminLoading } from "@/components/admin/AdminFrame";
import { requireAdmin } from "@/lib/admin/auth";
import { collections } from "@/lib/admin/schema";
import { storageLabel, storageMode } from "@/lib/admin/storage";

export default function AdminHome() {
  return (
    <AdminFrame>
      <Suspense fallback={<AdminLoading />}>
        <Dashboard />
      </Suspense>
    </AdminFrame>
  );
}

async function Dashboard() {
  await requireAdmin();
  const storage = storageLabel();

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">What do you want to update?</h1>
      {storage ? (
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
          <GitBranch className="size-4 shrink-0 text-subtle" /> Saves go to {storage}.
          {storageMode() === "github" && " The live site updates about a minute after each save."}
        </p>
      ) : (
        <p className="mt-4 flex gap-2 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] px-4 py-3 text-sm text-amber-200">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          Saving isn&apos;t set up yet. Add GITHUB_TOKEN and GITHUB_REPO to the environment variables, then redeploy.
        </p>
      )}

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {collections.map((collection) => (
          <li key={collection.name}>
            <Link
              href={`/admin/${collection.name}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-surface-raised"
            >
              <span className="flex items-center justify-between font-medium">
                {collection.label}
                <ArrowRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </span>
              <span className="mt-1.5 text-sm leading-relaxed text-muted">{collection.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
