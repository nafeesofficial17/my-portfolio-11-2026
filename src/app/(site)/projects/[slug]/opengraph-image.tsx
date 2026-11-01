import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getProject, projects } from "@/data/projects";
import { OgFrame, ogFonts, ogSize } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Satori can't decode WebP, so the screenshot is converted to PNG when the image is generated.
async function screenshot(src: string) {
  const data = await sharp(join(process.cwd(), "public", src)).resize({ width: 1040 }).png().toBuffer();
  return `data:image/png;base64,${data.toString("base64")}`;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug) ?? projects[0];

  return new ImageResponse(
    <OgFrame accent={project.accent}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 520 }}>
          <span style={{ fontFamily: "Geist Mono", fontSize: 20, color: "#9a9ca8", letterSpacing: 2 }}>CASE STUDY</span>
          <span style={{ fontSize: 72, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>{project.title}</span>
          <span style={{ fontSize: 26, color: "#c9cad1", lineHeight: 1.35 }}>{project.tagline}</span>
        </div>
        <img
          src={await screenshot(project.image.src)}
          alt=""
          width={520}
          height={325}
          style={{
            borderRadius: 16,
            border: "1px solid #ffffff22",
            objectFit: "cover",
            objectPosition: "left top",
            boxShadow: `0 30px 80px -10px ${project.accent}66`,
          }}
        />
      </div>
    </OgFrame>,
    { ...size, fonts: await ogFonts() },
  );
}
