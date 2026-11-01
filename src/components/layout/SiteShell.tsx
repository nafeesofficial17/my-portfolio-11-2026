import { ChatWidget } from "@/components/ai-chat/ChatWidget";
import { Cursor } from "@/components/animations/Cursor";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";

/** Everything around a public page: skip link, smooth scrolling, navbar, footer, chat and cursor. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <SmoothScroll>
        <ScrollProgress />
        <Navbar />
        {children}
        <Footer />
        <ChatWidget />
        <Cursor />
      </SmoothScroll>
    </>
  );
}
