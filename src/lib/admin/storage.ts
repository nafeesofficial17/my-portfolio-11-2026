import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, posix } from "node:path";
import type { CollectionName } from "./schema";

/**
 * Where the admin panel reads and saves content. In production that's the GitHub repo: a save is a
 * commit, and the host redeploys the site from it. Under `next dev` without GitHub settings, it's
 * the files on this computer, so the panel also works offline. Server-only.
 */

export interface FileChange {
  /** Repo-relative path, e.g. "src/content/projects.json" or "public/images/projects/x.webp". */
  path: string;
  /** New contents, or null to delete the file. */
  content: Buffer | null;
}

export class ConflictError extends Error {}

const github = {
  token: process.env.GITHUB_TOKEN,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH || "main",
};

export type StorageMode = "github" | "local";

export function storageMode(): StorageMode | null {
  if (github.token && github.repo) return "github";
  return process.env.NODE_ENV === "development" ? "local" : null;
}

export function storageLabel() {
  const mode = storageMode();
  if (mode === "github") return `GitHub · ${github.repo} (${github.branch})`;
  if (mode === "local") return "Local files (development)";
  return null;
}

/** Only content JSON and uploaded media may be written, so a bad path can't touch code. */
const writable = [/^src\/content\/[a-z]+\.json$/, /^public\/images\/[a-z-]+\/[a-z0-9-]+\.(webp|pdf)$/, /^public\/resume\/[a-z0-9-]+\.pdf$/];

export function isWritablePath(path: string) {
  return posix.normalize(path) === path && writable.some((pattern) => pattern.test(path));
}

export function contentPath(name: CollectionName) {
  return `src/content/${name}.json`;
}

/** Same id git gives the file, so local and GitHub modes detect concurrent edits the same way. */
function blobSha(content: Buffer) {
  return createHash("sha1").update(`blob ${content.length}\0`).update(content).digest("hex");
}

export function serializeJson(data: unknown) {
  return Buffer.from(JSON.stringify(data, null, 2) + "\n");
}

// ---- GitHub ---------------------------------------------------------------------------------------

async function gh<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const response = await fetch(`https://api.github.com/repos/${github.repo}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${github.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw Object.assign(new Error(`GitHub ${response.status} on ${path}: ${detail.slice(0, 300)}`), {
      status: response.status,
    });
  }
  return response.json() as Promise<T>;
}

async function githubRead(path: string, ref = github.branch): Promise<Buffer | null> {
  try {
    const file = await gh<{ content: string; encoding: string }>(
      `/contents/${path}?ref=${encodeURIComponent(ref)}`,
    );
    return Buffer.from(file.content, "base64");
  } catch (error) {
    if ((error as { status?: number }).status === 404) return null;
    throw error;
  }
}

async function githubCommit(changes: FileChange[], message: string, guard?: { path: string; version: string }) {
  // Retry once if someone else committed between reading the branch and moving it.
  for (let attempt = 0; ; attempt++) {
    const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${github.branch}`);
    const head = ref.object.sha;
    const commit = await gh<{ tree: { sha: string } }>(`/git/commits/${head}`);

    if (guard) {
      const current = await githubRead(guard.path, head);
      if (current && blobSha(current) !== guard.version) throw new ConflictError();
    }

    // Deleting a path the branch doesn't have would fail the whole commit, so skip files already gone.
    const present = await Promise.all(
      changes.map(async (change) => change.content !== null || (await githubRead(change.path, head)) !== null),
    );
    const tree = await Promise.all(
      changes.filter((_, i) => present[i]).map(async (change) => ({
        path: change.path,
        mode: "100644",
        type: "blob",
        sha: change.content
          ? (
              await gh<{ sha: string }>("/git/blobs", {
                method: "POST",
                body: { content: change.content.toString("base64"), encoding: "base64" },
              })
            ).sha
          : null,
      })),
    );
    const newTree = await gh<{ sha: string }>("/git/trees", { method: "POST", body: { base_tree: commit.tree.sha, tree } });
    const newCommit = await gh<{ sha: string; html_url: string }>("/git/commits", {
      method: "POST",
      body: { message, tree: newTree.sha, parents: [head] },
    });

    try {
      await gh(`/git/refs/heads/${github.branch}`, { method: "PATCH", body: { sha: newCommit.sha, force: false } });
      return newCommit.html_url;
    } catch (error) {
      if ((error as { status?: number }).status === 422 && attempt === 0) continue;
      throw error;
    }
  }
}

// ---- Public API -----------------------------------------------------------------------------------

// Local mode only runs under `next dev`, so production bundles shouldn't trace the project files it can reach.
const localPath = (path: string) => join(/*turbopackIgnore: true*/ process.cwd(), path);

function requireMode() {
  const mode = storageMode();
  if (!mode) throw new Error("Saving isn't configured. Set GITHUB_TOKEN and GITHUB_REPO.");
  return mode;
}

async function readRaw(path: string) {
  if (requireMode() === "github") return githubRead(path);
  return readFile(localPath(path)).catch(() => null);
}

/** Reads a collection as it is right now in storage, with a version used to detect concurrent edits. */
export async function readCollection(name: CollectionName) {
  const raw = await readRaw(contentPath(name));
  if (!raw) throw new Error(`${contentPath(name)} is missing.`);
  return { data: JSON.parse(raw.toString("utf8")) as unknown, version: blobSha(raw) };
}

/**
 * Writes every change in one commit (GitHub) or straight to disk (local). If `guard` is given, the save
 * is refused with a ConflictError when that file changed since it was read. Returns the commit URL on GitHub.
 */
export async function saveChanges(changes: FileChange[], message: string, guard?: { path: string; version: string }) {
  for (const change of changes) {
    if (!isWritablePath(change.path)) throw new Error(`Refusing to write ${change.path}.`);
  }

  if (requireMode() === "github") return githubCommit(changes, message, guard);

  if (guard) {
    const current = await readRaw(guard.path);
    if (current && blobSha(current) !== guard.version) throw new ConflictError();
  }
  for (const change of changes) {
    const target = localPath(change.path);
    if (change.content) {
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, change.content);
    } else {
      await rm(target, { force: true });
    }
  }
  return null;
}

export function versionOf(content: Buffer) {
  return blobSha(content);
}
