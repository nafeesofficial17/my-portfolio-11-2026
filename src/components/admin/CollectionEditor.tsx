"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, CircleAlert, LoaderCircle } from "lucide-react";
import { getCollection, validateCollection, type CollectionName, type Item, type UploadKind } from "@/lib/admin/schema";
import { cn } from "@/lib/utils";
import { EditorContext, FieldsInput, ListInput, withKeys, type EditorTools } from "./FieldInput";
import { SkillsEditor, type IconOption } from "./SkillsEditor";

type Status =
  | { state: "idle" }
  | { state: "saving" }
  | { state: "saved"; commitUrl: string | null; mode: "github" | "local" }
  | { state: "error"; message: string };

interface Upload {
  base64: string;
  mime: string;
  /** Already committed with an earlier save; kept only so its preview works until the site redeploys. */
  saved: boolean;
}

export function CollectionEditor({
  name,
  initialData,
  initialVersion,
  icons,
}: {
  name: CollectionName;
  initialData: unknown;
  initialVersion: string;
  icons?: IconOption[];
}) {
  const collection = getCollection(name);
  const keyed = useMemo(() => withKeys(initialData), [initialData]);
  const [data, setData] = useState<unknown>(keyed);
  const [baseline, setBaseline] = useState(() => JSON.stringify(keyed));
  const [version, setVersion] = useState(initialVersion);
  const [uploads, setUploads] = useState<Record<string, Upload>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const errorsRef = useRef<HTMLDivElement>(null);

  const serialized = JSON.stringify(data);
  // A new upload counts as a change even when its path stays the same (the CV always keeps one link).
  const dirty =
    serialized !== baseline ||
    Object.entries(uploads).some(([path, upload]) => !upload.saved && serialized.includes(`"${path.slice("public".length)}"`));

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const tools = useMemo<EditorTools>(
    () => ({
      async upload(kind: UploadKind, file: File) {
        const form = new FormData();
        form.set("kind", kind);
        form.set("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body: form });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error ?? "Upload failed.");
        const mime = result.file.path.endsWith(".pdf") ? "application/pdf" : "image/webp";
        setUploads((current) => ({ ...current, [result.file.path]: { base64: result.file.base64, mime, saved: false } }));
        return result.value;
      },
      preview(src: string) {
        const upload = uploads[`public${src}`];
        return upload ? `data:${upload.mime};base64,${upload.base64}` : src;
      },
      isPending(src: string) {
        const upload = uploads[`public${src}`];
        return Boolean(upload && !upload.saved);
      },
    }),
    [uploads],
  );

  const save = useCallback(async () => {
    // Cmd/Ctrl+S with nothing changed would otherwise make an empty commit and redeploy.
    if (status.state === "saving" || !dirty) return;
    const found = [...new Set(validateCollection(name, data).errors)];
    setErrors(found);
    if (found.length) {
      setStatus({ state: "idle" });
      requestAnimationFrame(() => errorsRef.current?.focus());
      return;
    }

    setStatus({ state: "saving" });
    const files = Object.fromEntries(
      Object.entries(uploads)
        .filter(([, upload]) => !upload.saved)
        .map(([path, upload]) => [path, upload.base64]),
    );
    try {
      const response = await fetch(`/api/admin/content/${name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, version, files }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (result.errors) setErrors([...new Set<string>(result.errors)]);
        setStatus({
          state: "error",
          message:
            response.status === 413
              ? "The new files are too large to save together. Remove one, save, then add it again."
              : (result.error ?? (result.errors ? "Fix the problems above, then save again." : "Saving failed.")),
        });
        return;
      }
      setVersion(result.version);
      setBaseline(JSON.stringify(data));
      setUploads((current) =>
        Object.fromEntries(Object.entries(current).map(([path, upload]) => [path, { ...upload, saved: true }])),
      );
      setStatus({ state: "saved", commitUrl: result.commitUrl, mode: result.mode });
    } catch {
      setStatus({ state: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }, [data, dirty, name, status.state, uploads, version]);

  // Cmd/Ctrl+S saves.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const update = (next: unknown) => {
    setData(next);
    if (status.state !== "saving") setStatus({ state: "idle" });
  };

  return (
    <EditorContext value={tools}>
      {errors.length > 0 && (
        <div
          ref={errorsRef}
          tabIndex={-1}
          role="alert"
          className="mt-8 rounded-2xl border border-red-400/30 bg-red-400/[0.06] p-4 text-sm text-red-200 outline-none"
        >
          <p className="flex items-center gap-2 font-medium">
            <CircleAlert className="size-4" /> Please fix {errors.length === 1 ? "this" : `these ${errors.length} things`} before
            saving:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        {collection.kind === "skills" ? (
          <SkillsEditor icons={icons ?? []} value={data as string[]} onChange={update} />
        ) : collection.kind === "object" ? (
          <FieldsInput fields={collection.fields} value={data as Item} onChange={update} />
        ) : (
          <ListInput
            collapsible
            fields={collection.fields}
            itemLabel={collection.itemLabel}
            itemTitle={collection.itemTitle}
            value={data as Item[]}
            onChange={update}
          />
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p aria-live="polite" className={cn("text-sm", status.state === "error" ? "text-red-300" : "text-muted")}>
            {status.state === "saving" && "Saving…"}
            {status.state === "error" && status.message}
            {status.state === "saved" && !dirty && (
              <span className="inline-flex flex-wrap items-center gap-x-2">
                <Check className="size-4 text-success" />
                {status.mode === "github"
                  ? "Saved. The live site updates in about a minute."
                  : "Saved to the files on this computer."}
                {status.commitUrl && (
                  <a href={status.commitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                    View commit <ArrowUpRight className="size-3.5" />
                  </a>
                )}
              </span>
            )}
            {(status.state === "idle" || (status.state === "saved" && dirty)) &&
              (dirty ? "You have unsaved changes." : "No changes yet.")}
          </p>
          <button
            type="button"
            onClick={() => void save()}
            disabled={!dirty || status.state === "saving"}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-white disabled:opacity-40"
          >
            {status.state === "saving" && <LoaderCircle className="size-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </EditorContext>
  );
}
