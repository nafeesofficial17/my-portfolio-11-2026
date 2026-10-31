import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { ogFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #8b7cff, #38d7f2)",
          color: "#050507",
          fontFamily: "Geist",
          fontSize: 76,
          fontWeight: 600,
          letterSpacing: -3,
        }}
      >
        {profile.initials}
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
