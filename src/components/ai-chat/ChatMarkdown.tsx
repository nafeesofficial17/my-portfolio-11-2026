import Link from "next/link";

/**
 * Renders the small subset of markdown the assistant is told to use: paragraphs, "- " bullet
 * lists, **bold** and [links](url). Builds React elements (never raw HTML), and only links to
 * on-site paths, https and mailto.
 */

const inline = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function renderInline(text: string, onNavigate?: () => void) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(inline)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [whole, bold, label, href] = match;
    if (bold) {
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {bold}
        </strong>,
      );
    } else if (/^\/(?![/\\])/.test(href)) {
      parts.push(
        <Link
          key={match.index}
          href={href}
          onClick={onNavigate}
          className="text-accent underline underline-offset-4 hover:text-foreground"
        >
          {label}
        </Link>,
      );
    } else if (/^(https:|mailto:)/.test(href)) {
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 hover:text-foreground"
        >
          {label}
        </a>,
      );
    } else {
      parts.push(whole);
    }
    last = match.index + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function ChatMarkdown({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc space-y-1 pl-5 marker:text-subtle">
        {bullets.map((item, i) => (
          <li key={i}>{renderInline(item, onNavigate)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  for (const line of text.split("\n")) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flushBullets();
    if (line.trim()) blocks.push(<p key={`p-${blocks.length}`}>{renderInline(line, onNavigate)}</p>);
  }
  flushBullets();

  return <div className="space-y-2.5">{blocks}</div>;
}
