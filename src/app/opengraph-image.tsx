import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { OgFrame, ogFonts, ogSize } from "@/lib/og";

export const alt = `${profile.name}, ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 76,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -3,
          }}
        >
          {profile.headline.map((segment, i) => (
            <span
              key={i}
              style={{
                marginRight: 20,
                ...(segment.accent
                  ? {
                      backgroundImage: "linear-gradient(100deg, #f4f4f6, #8b7cff 50%, #38d7f2)",
                      backgroundClip: "text",
                      color: "transparent",
                    }
                  : {}),
              }}
            >
              {segment.text}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#9a9ca8" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#34d399" }} />
          {profile.availability.label} · {profile.location}
        </div>
      </div>
    </OgFrame>,
    { ...size, fonts: await ogFonts() },
  );
}
