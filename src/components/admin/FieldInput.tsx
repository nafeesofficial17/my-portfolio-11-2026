"use client";

import { createContext, useContext, useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronRight, FileText, ImageUp, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { emptyItem, type Field, type Item, type UploadKind } from "@/lib/admin/schema";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-line bg-white/[0.02] px-3.5 py-2.5 text-[15px] text-foreground placeholder:text-subtle outline-none transition-colors hover:border-line-strong focus:border-accent focus:bg-white/[0.04] aria-[invalid=true]:border-red-400/60";

const smallButton =
  "inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-line-strong hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

const iconButton =
  "grid size-8 place-items-center rounded-full text-subtle transition-colors hover:bg-white/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-30";

// ---- Stable keys for list items -----------------------------------------------------------------
// Objects inside lists get a throwaway `_key` so React can track them while they're reordered.
// The schema's cleaning step only keeps known fields, so `_key` never reaches the saved JSON.

let keyCounter = 0;
const newKey = () => `k${++keyCounter}`;

export function withKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => {
      const keyed = withKeys(entry);
      return keyed && typeof keyed === "object" && !Array.isArray(keyed) ? { _key: newKey(), ...keyed } : keyed;
    });
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, withKeys(entry)]));
  }
  return value;
}

export const newItem = (fields: Field[]): Item => ({ _key: newKey(), ...emptyItem(fields) });

// ---- Uploads ------------------------------------------------------------------------------------

export interface EditorTools {
  /** Processes a file on the server and returns the value to store; the file itself is saved with the section. */
  upload: (kind: UploadKind, file: File) => Promise<unknown>;
  /** A URL that shows a file, including uploads that aren't live on the site yet. */
  preview: (src: string) => string;
  /** True for an upload that hasn't been saved yet. */
  isPending: (src: string) => boolean;
}

export const EditorContext = createContext<EditorTools | null>(null);

function useEditorTools() {
  const tools = useContext(EditorContext);
  if (!tools) throw new Error("Field inputs must be rendered inside a CollectionEditor");
  return tools;
}

// ---- Fields -------------------------------------------------------------------------------------

export function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
}

function Label({ field, htmlFor, as = "label" }: { field: Field; htmlFor?: string; as?: "label" | "legend" }) {
  const Tag = as;
  return (
    <Tag htmlFor={as === "label" ? htmlFor : undefined} className="mb-2 flex items-baseline justify-between gap-3 text-sm">
      <span className="font-medium">{field.label}</span>
      {!field.required && field.type !== "boolean" && <span className="text-xs text-subtle">Optional</span>}
    </Tag>
  );
}

function Help({ text }: { text?: string }) {
  return text ? <p className="mt-1.5 text-xs leading-relaxed text-subtle">{text}</p> : null;
}

export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (value: unknown) => void }) {
  const id = useId();

  switch (field.type) {
    case "text":
    case "url":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <input
            id={id}
            type={field.type === "url" ? "url" : "text"}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
          <Help text={field.help} />
        </div>
      );
    case "textarea":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <textarea
            id={id}
            rows={4}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={cn(inputClass, "resize-y leading-relaxed")}
          />
          <Help text={field.help} />
        </div>
      );
    case "number":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <input
            id={id}
            type="number"
            step={field.step ?? 1}
            // Kept as typed (a string) so half-typed numbers like "4." survive; saving converts it.
            value={value === undefined || value === null ? "" : String(value)}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
          <Help text={field.help} />
        </div>
      );
    case "color":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <div className="flex gap-2">
            <input
              type="color"
              aria-label={`${field.label} picker`}
              value={/^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : "#8b7cff"}
              onChange={(event) => onChange(event.target.value)}
              className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-line bg-transparent p-1"
            />
            <input id={id} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={inputClass} />
          </div>
          <Help text={field.help} />
        </div>
      );
    case "boolean":
      return (
        <div>
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(event) => onChange(event.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            {field.label}
          </label>
          <Help text={field.help} />
        </div>
      );
    case "select":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <select id={id} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={inputClass}>
            {field.options.map((option) => (
              <option key={option} value={option} className="bg-surface">
                {option}
              </option>
            ))}
          </select>
          <Help text={field.help} />
        </div>
      );
    case "tags":
      return <TagsInput id={id} field={field} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />;
    case "paragraphs":
      return <ParagraphsInput field={field} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />;
    case "image":
    case "file":
      return <UploadInput field={field} value={value} onChange={onChange} />;
    case "object": {
      const object = (value && typeof value === "object" ? value : {}) as Item;
      return (
        <fieldset className="rounded-2xl border border-line p-4 sm:p-5">
          <Label field={field} as="legend" />
          <Help text={field.help} />
          <div className="mt-3 space-y-5">
            {field.fields.map((child) => (
              <FieldInput
                key={child.key}
                field={child}
                value={object[child.key]}
                onChange={(next) => onChange({ ...object, [child.key]: next })}
              />
            ))}
          </div>
        </fieldset>
      );
    }
    case "list":
      return (
        <fieldset>
          <Label field={field} as="legend" />
          <Help text={field.help} />
          <div className="mt-3">
            <ListInput
              fields={field.fields}
              itemLabel={field.itemLabel}
              itemTitle={field.itemTitle}
              value={Array.isArray(value) ? (value as Item[]) : []}
              onChange={onChange}
            />
          </div>
        </fieldset>
      );
  }
}

/** Edits every field of one object (a whole section, or one list item). */
export function FieldsInput({ fields, value, onChange }: { fields: Field[]; value: Item; onChange: (value: Item) => void }) {
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <FieldInput key={field.key} field={field} value={value[field.key]} onChange={(next) => onChange({ ...value, [field.key]: next })} />
      ))}
    </div>
  );
}

/**
 * A reorderable list of items. Top-level lists (projects, jobs…) collapse each item to its title;
 * nested lists (stats, links…) are short, so their items stay open.
 */
export function ListInput({
  fields,
  itemLabel,
  itemTitle,
  value,
  onChange,
  collapsible = false,
}: {
  fields: Field[];
  itemLabel: string;
  itemTitle?: (item: Item) => string;
  value: Item[];
  onChange: (value: Item[]) => void;
  collapsible?: boolean;
}) {
  // Newly added items open straight away so you can fill them in.
  const [opened, setOpened] = useState<Set<unknown>>(new Set());

  const add = () => {
    const item = newItem(fields);
    setOpened((current) => new Set(current).add(item._key));
    onChange([...value, item]);
  };

  return (
    <div className="space-y-3">
      {value.map((item, i) => {
        const title = itemTitle?.(item).trim() || `New ${itemLabel}`;
        const controls = (
          <div className="flex shrink-0 items-center">
            <button type="button" className={iconButton} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} aria-label={`Move ${title} up`}>
              <ArrowUp className="size-4" />
            </button>
            <button
              type="button"
              className={iconButton}
              disabled={i === value.length - 1}
              onClick={() => onChange(move(value, i, i + 1))}
              aria-label={`Move ${title} down`}
            >
              <ArrowDown className="size-4" />
            </button>
            <button
              type="button"
              className={cn(iconButton, "hover:text-red-300")}
              onClick={() => {
                if (!collapsible || confirm(`Delete “${title}”? You can still leave without saving to undo.`)) {
                  onChange(value.filter((_, index) => index !== i));
                }
              }}
              aria-label={`Delete ${title}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        );
        const body = <FieldsInput fields={fields} value={item} onChange={(next) => onChange(value.map((entry, index) => (index === i ? next : entry)))} />;

        return collapsible ? (
          <details
            key={String(item._key ?? i)}
            open={opened.has(item._key)}
            onToggle={(event) => {
              const isOpen = event.currentTarget.open;
              setOpened((current) => {
                const next = new Set(current);
                if (isOpen) next.add(item._key);
                else next.delete(item._key);
                return next;
              });
            }}
            className="group rounded-2xl border border-line bg-surface open:border-line-strong"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <ChevronRight className="size-4 shrink-0 text-subtle transition-transform group-open:rotate-90" />
              <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
              {/* Buttons inside <summary> would toggle it, so stop their clicks from bubbling. */}
              <span onClick={(event) => event.preventDefault()}>{controls}</span>
            </summary>
            <div className="border-t border-line p-4 sm:p-5">{body}</div>
          </details>
        ) : (
          <div key={String(item._key ?? i)} className="rounded-2xl border border-line bg-surface p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="truncate text-sm text-muted">{title}</span>
              {controls}
            </div>
            {body}
          </div>
        );
      })}
      <button type="button" onClick={add} className={smallButton}>
        <Plus className="size-3.5" /> Add {itemLabel}
      </button>
    </div>
  );
}

function TagsInput({ id, field, value, onChange }: { id: string; field: Field; value: string[]; onChange: (value: unknown) => void }) {
  const [draft, setDraft] = useState("");
  const commit = () => {
    const tags = draft
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag && !value.includes(tag));
    if (tags.length) onChange([...value, ...tags]);
    setDraft("");
  };

  return (
    <div>
      <Label field={field} htmlFor={id} />
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white/[0.02] p-2 transition-colors focus-within:border-accent">
        {value.map((tag, i) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-line-strong py-1 pr-1 pl-3 text-sm">
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, index) => index !== i))}
              aria-label={`Remove ${tag}`}
              className="grid size-5 place-items-center rounded-full text-subtle hover:bg-white/10 hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commit();
            } else if (event.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
          placeholder={value.length ? "Add more…" : "Type and press Enter"}
          className="min-w-32 flex-1 bg-transparent px-1.5 py-1 text-[15px] outline-none placeholder:text-subtle"
        />
      </div>
      <Help text={field.help ?? "Press Enter or comma to add. Backspace removes the last one."} />
    </div>
  );
}

function ParagraphsInput({ field, value, onChange }: { field: Field; value: string[]; onChange: (value: unknown) => void }) {
  return (
    <fieldset>
      <Label field={field} as="legend" />
      <div className="space-y-3">
        {value.map((paragraph, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              rows={4}
              aria-label={`${field.label} ${i + 1}`}
              value={paragraph}
              onChange={(event) => onChange(value.map((entry, index) => (index === i ? event.target.value : entry)))}
              className={cn(inputClass, "resize-y leading-relaxed")}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, index) => index !== i))}
              aria-label={`Delete paragraph ${i + 1}`}
              className={cn(iconButton, "mt-1 hover:text-red-300")}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, ""])} className={smallButton}>
          <Plus className="size-3.5" /> Add paragraph
        </button>
      </div>
      <Help text={field.help} />
    </fieldset>
  );
}

function UploadInput({ field, value, onChange }: { field: Field & { type: "image" | "file" }; value: unknown; onChange: (value: unknown) => void }) {
  const tools = useEditorTools();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isImage = field.type === "image";
  const src = isImage ? (value as { src?: string } | undefined)?.src : typeof value === "string" ? value : undefined;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await tools.upload(field.upload, file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <Label field={field} />
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-line-strong p-3">
        {src &&
          (isImage ? (
            // Previews may be data URLs for uploads that aren't live yet, which next/image can't optimize.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tools.preview(src)} alt="" className="h-20 max-w-40 rounded-lg border border-line bg-white/5 object-contain" />
          ) : !tools.isPending(src) ? (
            <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
              <FileText className="size-4" /> {src.split("/").pop()}
            </a>
          ) : (
            // Browsers won't open data: URLs in a new tab, so a fresh upload can't be previewed until it's saved.
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <FileText className="size-4" /> {src.split("/").pop()} · new, not saved yet
            </span>
          ))}
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className={smallButton}>
            {busy ? <LoaderCircle className="size-3.5 animate-spin" /> : <ImageUp className="size-3.5" />}
            {busy ? "Processing…" : src ? "Replace" : "Upload"}
          </button>
          {src && !field.required && (
            <button type="button" onClick={() => onChange(undefined)} className={cn(smallButton, "hover:text-red-300")}>
              <Trash2 className="size-3.5" /> Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={isImage ? "image/png,image/jpeg,image/webp" : "application/pdf"}
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      <Help text={field.help} />
    </div>
  );
}
