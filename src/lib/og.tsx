import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/profile";

/** Shared pieces for the generated social share images (1200×630). */

export const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "src/assets/fonts");

export async function ogFonts() {
  const [regular, semibold, mono] = await Promise.all([
    readFile(join(fontDir, "Geist-Regular.ttf")),
    readFile(join(fontDir, "Geist-SemiBold.ttf")),
    readFile(join(fontDir, "GeistMono-Medium.ttf")),
  ]);
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

/** Dark canvas with the site's glow, grid and brand bar; children fill the middle. */
export function OgFrame({ children, accent = "#8b7cff" }: { children: React.ReactNode; accent?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#050507",
        backgroundImage: `radial-gradient(circle at 15% 0%, ${accent}55, transparent 55%), radial-gradient(circle at 95% 30%, #38d7f233, transparent 45%), linear-gradient(to right, #ffffff0d 1px, transparent 1px), linear-gradient(to bottom, #ffffff0d 1px, transparent 1px)`,
        backgroundSize: "100% 100%, 100% 100%, 64px 64px, 64px 64px",
        color: "#f4f4f6",
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "linear-gradient(135deg, #8b7cff, #38d7f2)",
            color: "#050507",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          {profile.initials}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 28, fontWeight: 600 }}>{profile.name}</span>
          <span style={{ fontSize: 18, color: "#9a9ca8", fontFamily: "Geist Mono", letterSpacing: 2 }}>
            {profile.role.toUpperCase()}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
