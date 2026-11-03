import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminFrame, AdminLoading } from "@/components/admin/AdminFrame";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { iconsBySlug } from "@/data/skills";
import { requireAdmin } from "@/lib/admin/auth";
import { collectionNames, getCollection, isCollectionName } from "@/lib/admin/schema";
import { readCollection, storageMode } from "@/lib/admin/storage";

export function generateStaticParams() {
  return collectionNames.map((collection) => ({ collection }));
}

export async function generateMetadata({ params }: PageProps<"/admin/[collection]">): Promise<Metadata> {
  const { collection } = await params;
  return { title: isCollectionName(collection) ? getCollection(collection).label : "Not found" };
}

export default function CollectionPage({ params }: PageProps<"/admin/[collection]">) {
  return (
    <AdminFrame back>
      <Suspense fallback={<AdminLoading />}>
        <Editor params={params} />
      </Suspense>
    </AdminFrame>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/[collection]">["params"] }) {
  await requireAdmin();
  const { collection: name } = await params;
  if (!isCollectionName(name)) notFound();
  const collection = getCollection(name);

  if (!storageMode()) {
    return (
      <p className="text-sm text-amber-200">
        Saving isn&apos;t set up yet. Add GITHUB_TOKEN and GITHUB_REPO to the environment variables, then redeploy.
      </p>
    );
  }

  let content: Awaited<ReturnType<typeof readCollection>>;
  try {
    content = await readCollection(name);
  } catch (error) {
    console.error("[admin read]", error);
    return <p className="text-sm text-red-300">Couldn&apos;t load {collection.label}. Check the GitHub settings.</p>;
  }

  // Only the skills editor needs the logo catalog; it's a few hundred KB, so other sections skip it.
  const icons =
    collection.kind === "skills"
      ? [...iconsBySlug.values()].map(({ slug, title, hex }) => ({ slug, title, hex }))
      : undefined;

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">{collection.label}</h1>
      <p className="mt-2 text-muted">{collection.description}</p>
      <CollectionEditor name={name} initialData={content.data} initialVersion={content.version} icons={icons} />
    </>
  );
}
