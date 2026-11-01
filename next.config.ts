import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const defaultExtensions = ["tsx", "ts", "jsx", "js"];

// The admin panel's routes are named `*.admin.tsx` / `*.admin.ts`. They only count as routes under
// `next dev`, so production builds don't contain the admin panel or its file-writing API at all.
export default function config(phase: string): NextConfig {
  return {
    ...nextConfig,
    pageExtensions:
      phase === PHASE_DEVELOPMENT_SERVER ? ["admin.tsx", "admin.ts", ...defaultExtensions] : defaultExtensions,
  };
}
