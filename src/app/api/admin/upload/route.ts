import { guardAdminRequest } from "@/lib/admin/auth";
import type { UploadKind } from "@/lib/admin/schema";
import { processUpload, UploadError } from "@/lib/admin/uploads";

const kinds: UploadKind[] = ["project", "certificate", "badge", "portrait", "resume", "certificate-pdf"];

/** Converts an uploaded image or PDF and hands it back; the editor commits it with the next save. */
export async function POST(request: Request) {
  const denied = await guardAdminRequest(request);
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const kind = form?.get("kind");
  const file = form?.get("file");
  if (typeof kind !== "string" || !kinds.includes(kind as UploadKind) || !(file instanceof File)) {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }

  try {
    return Response.json(await processUpload(kind as UploadKind, file));
  } catch (error) {
    if (error instanceof UploadError) return Response.json({ error: error.message }, { status: 422 });
    console.error("[admin upload]", error);
    return Response.json({ error: "Couldn't process that file." }, { status: 500 });
  }
}
