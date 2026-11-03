import { iconsBySlug } from "@/data/skills";
import { guardAdminRequest } from "@/lib/admin/auth";
import { collectionNames, getCollection, isCollectionName, validateCollection } from "@/lib/admin/schema";
import {
  ConflictError,
  contentPath,
  isWritablePath,
  readCollection,
  saveChanges,
  serializeJson,
  storageMode,
  versionOf,
  type FileChange,
} from "@/lib/admin/storage";

/** Uploaded files the content points at: every string that starts with one of these. */
function fileRefs(value: unknown, found = new Set<string>()): Set<string> {
  if (typeof value === "string" && (value.startsWith("/images/") || value.startsWith("/resume/"))) found.add(value);
  else if (Array.isArray(value)) value.forEach((entry) => fileRefs(entry, found));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => fileRefs(entry, found));
  return found;
}

/**
 * Saves one collection: validates it, commits the JSON together with any newly uploaded files, and
 * deletes files the collection no longer uses (when nothing else on the site uses them either).
 */
export async function PUT(request: Request, ctx: RouteContext<"/api/admin/content/[collection]">) {
  const denied = await guardAdminRequest(request);
  if (denied) return denied;

  const { collection: name } = await ctx.params;
  if (!isCollectionName(name)) return Response.json({ error: "Unknown section." }, { status: 404 });
  if (!storageMode()) {
    return Response.json({ error: "Saving isn't configured. Set GITHUB_TOKEN and GITHUB_REPO." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    data?: unknown;
    version?: unknown;
    files?: Record<string, unknown>;
  } | null;
  if (!body || typeof body.version !== "string") return Response.json({ error: "Invalid request." }, { status: 400 });

  const { data, errors } = validateCollection(name, body.data, (slug) => iconsBySlug.has(slug));
  if (errors.length) return Response.json({ errors }, { status: 422 });

  const path = contentPath(name);
  const json = serializeJson(data);
  const used = fileRefs(data);
  const changes: FileChange[] = [{ path, content: json }];

  // New uploads, accepted only when the saved content actually uses them.
  for (const [filePath, base64] of Object.entries(body.files ?? {})) {
    if (typeof base64 !== "string" || !isWritablePath(filePath) || !used.has(filePath.replace(/^public/, ""))) continue;
    changes.push({ path: filePath, content: Buffer.from(base64, "base64") });
  }

  try {
    const previous = await readCollection(name);
    const written = new Set(changes.map((change) => change.path));
    const dropped = [...fileRefs(previous.data)].filter((ref) => !used.has(ref) && !written.has(`public${ref}`));
    if (dropped.length) {
      const others = await Promise.all(collectionNames.filter((other) => other !== name).map(readCollection));
      const elsewhere = fileRefs(others.map((other) => other.data));
      for (const ref of dropped) {
        if (!elsewhere.has(ref) && isWritablePath(`public${ref}`)) changes.push({ path: `public${ref}`, content: null });
      }
    }

    // Nothing to write: skip the commit, which would otherwise trigger a pointless redeploy.
    if (changes.length === 1 && previous.version === versionOf(json)) {
      return Response.json({ ok: true, data, version: previous.version, commitUrl: null, mode: storageMode() });
    }

    const commitUrl = await saveChanges(changes, `Update ${getCollection(name).label.toLowerCase()} from the admin panel`, {
      path,
      version: body.version,
    });
    return Response.json({ ok: true, data, version: versionOf(json), commitUrl, mode: storageMode() });
  } catch (error) {
    if (error instanceof ConflictError) {
      return Response.json(
        { error: "This section was changed somewhere else since you opened it. Reload the page to get the latest version, then redo your edits." },
        { status: 409 },
      );
    }
    console.error("[admin save]", error);
    return Response.json({ error: "Saving failed. Check the GitHub settings and try again." }, { status: 502 });
  }
}
