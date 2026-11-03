"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { inputClass, move } from "./FieldInput";

export interface IconOption {
  slug: string;
  title: string;
  hex: string;
}

/** Picks and orders the tech marquee logos from the Simple Icons catalog. */
export function SkillsEditor({ icons, value, onChange }: { icons: IconOption[]; value: string[]; onChange: (value: string[]) => void }) {
  const [query, setQuery] = useState("");
  const bySlug = new Map(icons.map((icon) => [icon.slug, icon]));
  const search = query.trim().toLowerCase();
  const results = search
    ? icons
        .filter((icon) => !value.includes(icon.slug) && (icon.title.toLowerCase().includes(search) || icon.slug.includes(search)))
        .sort((a, b) => Number(!a.title.toLowerCase().startsWith(search)) - Number(!b.title.toLowerCase().startsWith(search)))
        .slice(0, 12)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="icon-search" className="mb-2 block text-sm font-medium">
          Add a technology
        </label>
        <input
          id="icon-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search logos, e.g. Kubernetes"
          className={inputClass}
        />
        {search && (
          <div className="mt-3 flex flex-wrap gap-2">
            {results.length === 0 && <p className="text-sm text-subtle">No logo matches “{query}”.</p>}
            {results.map((icon) => (
              <button
                key={icon.slug}
                type="button"
                onClick={() => {
                  onChange([...value, icon.slug]);
                  setQuery("");
                }}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-foreground"
              >
                <span className="size-2.5 rounded-full" style={{ background: `#${icon.hex}` }} />
                {icon.title}
                <Plus className="size-3.5" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">In the marquee ({value.length}), in display order</p>
        <ol className="flex flex-wrap gap-2">
          {value.map((slug, i) => {
            const icon = bySlug.get(slug);
            return (
              <li key={slug} className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-surface py-1 pr-1 pl-3 text-sm">
                <span className="mr-1 size-2.5 rounded-full" style={{ background: icon ? `#${icon.hex}` : "transparent" }} />
                {icon?.title ?? `${slug} (unknown)`}
                <button type="button" disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} aria-label={`Move ${slug} earlier`} className="grid size-6 place-items-center rounded-full text-subtle hover:bg-white/10 hover:text-foreground disabled:opacity-30">
                  <ArrowLeft className="size-3" />
                </button>
                <button type="button" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))} aria-label={`Move ${slug} later`} className="grid size-6 place-items-center rounded-full text-subtle hover:bg-white/10 hover:text-foreground disabled:opacity-30">
                  <ArrowRight className="size-3" />
                </button>
                <button type="button" onClick={() => onChange(value.filter((entry) => entry !== slug))} aria-label={`Remove ${slug}`} className="grid size-6 place-items-center rounded-full text-subtle hover:bg-white/10 hover:text-red-300">
                  <X className="size-3" />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
