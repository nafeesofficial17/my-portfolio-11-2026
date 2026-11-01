import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const title = `${profile.name} — Full-Stack & AI/ML Engineer`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${profile.name}` },
  description: profile.description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: [
    profile.name,
    "full stack developer",
    "AI engineer",
    "RAG chatbot developer",
    "Django developer",
    "FastAPI developer",
    "Next.js developer",
    "freelance software engineer India",
    "freelance AI engineer",
    "Databricks certified Generative AI engineer",
    "LLM developer",
    "Python developer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    locale: "en_US",
    title,
    description: profile.description,
  },
  twitter: { card: "summary_large_image", title, description: profile.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
