import { createHash } from "node:crypto";
import sharp, { type OutputInfo } from "sharp";
import { profile } from "@/data/profile";
import type { UploadKind } from "./schema";

/**
 * Turns an uploaded file into what the site stores: images become WebP with their size and a tiny blur
 * placeholder (the same shape as a static image import), PDFs are checked and named. Nothing is saved
 * here; the result travels with the next save so the file and the content that uses it land together.
 */

/**
 * Hosts like Vercel cap request and response bodies at 4.5 MB. Images shrink to a small WebP, so only the
 * upload itself counts. A PDF travels back to the editor and then out again with the save as base64,
 * a third bigger than the file, so it has to stay under about 3 MB.
 */
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_PDF_BYTES = 3 * 1024 * 1024;

const imageRules: Partial<Record<UploadKind, { dir: string; width: number; height: number }>> = {
  project: { dir: "images/projects", width: 1600, height: 2400 },
  certificate: { dir: "images/certificates", width: 1400, height: 1400 },
  badge: { dir: "images/certificates", width: 600, height: 600 },
  portrait: { dir: "images/profile", width: 1000, height: 1000 },
};

export interface ProcessedUpload {
  /** The value to store in the content field. */
  value: string | { src: string; width: number; height: number; blurDataURL: string };
  /** The file to commit with the next save. */
  file: { path: string; base64: string };
}

function slugify(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "file"
  );
}

const shortHash = (data: Buffer) => createHash("sha256").update(data).digest("hex").slice(0, 8);

export class UploadError extends Error {}

export async function processUpload(kind: UploadKind, file: File): Promise<ProcessedUpload> {
  const rule = imageRules[kind];
  const limit = rule ? MAX_IMAGE_BYTES : MAX_PDF_BYTES;
  if (file.size > limit) {
    throw new UploadError(`That file is over ${limit / 1024 / 1024} MB. Please use a smaller one.`);
  }
  const input = Buffer.from(await file.arrayBuffer());

  if (rule) {
    let output: Buffer;
    let info: OutputInfo;
    try {
      ({ data: output, info } = await sharp(input)
        .rotate()
        .resize({ width: rule.width, height: rule.height, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true }));
    } catch {
      throw new UploadError("That doesn't look like an image. Use a PNG, JPG or WebP.");
    }
    const blur = await sharp(output).resize(8, 8, { fit: "inside" }).webp({ quality: 50 }).toBuffer();
    // A fresh name per upload, so browsers and image caches never show the old picture.
    const src = `/${rule.dir}/${slugify(file.name)}-${shortHash(output)}.webp`;
    return {
      value: { src, width: info.width, height: info.height, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` },
      file: { path: `public${src}`, base64: output.toString("base64") },
    };
  }

  if (!input.subarray(0, 5).equals(Buffer.from("%PDF-"))) throw new UploadError("That doesn't look like a PDF.");
  // The CV keeps one stable link (it may be shared or printed); other PDFs get a fresh name per upload.
  const src =
    kind === "resume"
      ? `/resume/${slugify(profile.name)}-cv.pdf`
      : `/images/certificates/${slugify(file.name)}-${shortHash(input)}.pdf`;
  return { value: src, file: { path: `public${src}`, base64: input.toString("base64") } };
}
