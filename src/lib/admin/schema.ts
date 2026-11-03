/**
 * What the admin panel can edit. Each collection is one JSON file in src/content/, and its fields
 * drive both the admin forms and the validation that runs before anything is saved.
 * Shared by the browser and the server, so nothing here may touch Node APIs.
 */

export type UploadKind = "project" | "certificate" | "badge" | "portrait" | "resume" | "certificate-pdf";

interface BaseField {
  key: string;
  label: string;
  help?: string;
  placeholder?: string;
  /** Required fields can't be saved empty. Everything else is dropped from the JSON when left blank. */
  required?: boolean;
}

export type Field =
  | (BaseField & { type: "text" | "textarea" | "url" | "color" })
  | (BaseField & { type: "number"; step?: number })
  | (BaseField & { type: "boolean" })
  | (BaseField & { type: "select"; options: readonly string[] })
  | (BaseField & { type: "tags" })
  | (BaseField & { type: "paragraphs"; itemLabel?: string })
  | (BaseField & { type: "image" | "file"; upload: UploadKind })
  | (BaseField & { type: "object"; fields: Field[] })
  | (BaseField & { type: "list"; fields: Field[]; itemLabel: string; itemTitle?: (item: Item) => string });

export type Item = Record<string, unknown>;

export type Collection =
  | { name: CollectionName; label: string; description: string; kind: "object"; fields: Field[] }
  | {
      name: CollectionName;
      label: string;
      description: string;
      kind: "list";
      itemLabel: string;
      fields: Field[];
      itemTitle: (item: Item) => string;
    }
  | { name: CollectionName; label: string; description: string; kind: "skills" };

export const collectionNames = [
  "profile",
  "about",
  "experience",
  "projects",
  "archive",
  "certificates",
  "testimonials",
  "services",
  "process",
  "skills",
] as const;

export type CollectionName = (typeof collectionNames)[number];

export function isCollectionName(name: string): name is CollectionName {
  return (collectionNames as readonly string[]).includes(name);
}

const str = (value: unknown) => (typeof value === "string" ? value : "");

export const collections: Collection[] = [
  {
    name: "profile",
    label: "Profile, contact & CV",
    description: "Your name, contact details, downloadable CV, hero headline and the stats under it.",
    kind: "object",
    fields: [
      { key: "name", label: "Full name", type: "text", required: true },
      { key: "initials", label: "Initials", type: "text", required: true, help: "Shown in the logo and share images." },
      { key: "role", label: "Role / title", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "email", label: "Email", type: "text", required: true },
      { key: "phone", label: "Phone", type: "text", required: true, placeholder: "+91 74900 78839" },
      { key: "whatsapp", label: "WhatsApp link", type: "url", required: true, placeholder: "https://wa.me/917490078839" },
      {
        key: "resumeUrl",
        label: "CV / Resume (PDF)",
        type: "file",
        upload: "resume",
        help: "Uploading replaces the current CV at the same link. Leave empty to hide the Download CV button.",
      },
      {
        key: "availability",
        label: "Availability badge",
        type: "object",
        required: true,
        fields: [
          { key: "open", label: "Open to new work", type: "boolean" },
          { key: "label", label: "Badge text", type: "text", required: true, placeholder: "Available for new projects" },
        ],
      },
      {
        key: "highlight",
        label: "Credential chip in the hero",
        type: "object",
        help: "Optional. Leave both empty to hide it.",
        fields: [
          { key: "label", label: "Text", type: "text", required: true },
          { key: "href", label: "Link", type: "url", required: true, placeholder: "/#certifications" },
        ],
      },
      {
        key: "headline",
        label: "Hero headline",
        type: "list",
        required: true,
        itemLabel: "segment",
        help: "The headline is split into segments so some words can get the gradient accent style.",
        itemTitle: (item) => str(item.text),
        fields: [
          { key: "text", label: "Words", type: "text", required: true },
          { key: "accent", label: "Accent style", type: "boolean" },
        ],
      },
      { key: "intro", label: "Hero intro", type: "textarea", required: true },
      {
        key: "description",
        label: "SEO description",
        type: "textarea",
        required: true,
        help: "Used by Google and link previews. Aim for about 160 characters.",
      },
      {
        key: "stats",
        label: "Hero stats",
        type: "list",
        required: true,
        itemLabel: "stat",
        itemTitle: (item) => `${item.value ?? ""}${str(item.suffix)} ${str(item.label)}`,
        fields: [
          { key: "value", label: "Number", type: "number", required: true, step: 0.1 },
          { key: "suffix", label: "Suffix", type: "text", placeholder: "+" },
          { key: "label", label: "Label", type: "text", required: true },
        ],
      },
      {
        key: "socials",
        label: "Social links",
        type: "list",
        required: true,
        itemLabel: "link",
        itemTitle: (item) => str(item.label),
        fields: [
          { key: "platform", label: "Platform", type: "select", required: true, options: ["github", "linkedin", "email", "whatsapp", "phone"] },
          { key: "label", label: "Label", type: "text", required: true },
          { key: "href", label: "Link", type: "url", required: true, placeholder: "https://github.com/…" },
        ],
      },
    ],
  },
  {
    name: "about",
    label: "About & education",
    description: "The About section: portrait, story, quick facts and education.",
    kind: "object",
    fields: [
      { key: "portrait", label: "Portrait", type: "image", upload: "portrait", required: true, help: "A cut-out photo on a transparent background works best." },
      { key: "statement", label: "Opening statement", type: "textarea", required: true },
      { key: "paragraphs", label: "Story paragraphs", type: "paragraphs", required: true },
      {
        key: "facts",
        label: "Quick facts",
        type: "list",
        required: true,
        itemLabel: "fact",
        itemTitle: (item) => `${str(item.label)}: ${str(item.value)}`,
        fields: [
          { key: "label", label: "Label", type: "text", required: true },
          { key: "value", label: "Value", type: "text", required: true },
        ],
      },
      {
        key: "education",
        label: "Education",
        type: "object",
        required: true,
        fields: [
          { key: "degree", label: "Degree", type: "text", required: true },
          { key: "school", label: "School", type: "text", required: true },
          { key: "period", label: "Period", type: "text", required: true, placeholder: "2017 – 2022" },
          { key: "note", label: "Note", type: "text", required: true, placeholder: "CGPA 8.2/10" },
        ],
      },
    ],
  },
  {
    name: "experience",
    label: "Experience",
    description: "Your career timeline, newest first.",
    kind: "list",
    itemLabel: "job",
    itemTitle: (item) => `${str(item.role)} · ${str(item.company)}`,
    fields: [
      { key: "role", label: "Role", type: "text", required: true },
      { key: "company", label: "Company", type: "text", required: true },
      { key: "period", label: "Period", type: "text", required: true, placeholder: "Jan 2022 – Aug 2023" },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  {
    name: "projects",
    label: "Case studies",
    description: "The featured projects. Each one gets a card on the home page and its own page at /projects/<slug>.",
    kind: "list",
    itemLabel: "case study",
    itemTitle: (item) => str(item.title),
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      {
        key: "slug",
        label: "URL slug",
        type: "text",
        required: true,
        placeholder: "my-project",
        help: "Lowercase letters, numbers and dashes. The page lives at /projects/<slug>; changing it breaks old links.",
      },
      { key: "category", label: "Category", type: "text", required: true },
      { key: "tagline", label: "Tagline", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "role", label: "Your role", type: "text", required: true },
      { key: "timeline", label: "Timeline", type: "text", placeholder: "2026 – ongoing" },
      { key: "team", label: "Team size", type: "number" },
      { key: "liveUrl", label: "Live URL", type: "url", placeholder: "https://…" },
      { key: "domain", label: "Address bar text", type: "text", required: true, help: "Shown in the browser frame around the screenshot." },
      { key: "image", label: "Screenshot", type: "image", upload: "project", required: true, help: "About 1600px wide. It's converted to WebP for you." },
      { key: "accent", label: "Glow color", type: "color", required: true },
      { key: "stack", label: "Tech stack", type: "tags", required: true },
      { key: "challenge", label: "The challenge", type: "textarea", required: true },
      { key: "solution", label: "The solution", type: "textarea", required: true },
      {
        key: "highlights",
        label: "Highlights",
        type: "list",
        required: true,
        itemLabel: "highlight",
        itemTitle: (item) => str(item.title),
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    name: "archive",
    label: "More projects",
    description: "Smaller projects listed under the case studies. Each row opens to show its summary and key points.",
    kind: "list",
    itemLabel: "project",
    itemTitle: (item) => str(item.title),
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "category", label: "Category", type: "text", required: true },
      { key: "kind", label: "Kind", type: "select", required: true, options: ["web", "ai", "automation"] },
      { key: "stack", label: "Tech stack", type: "tags", required: true },
      { key: "summary", label: "Summary", type: "textarea", required: true, help: "One or two sentences: what it is and what you built." },
      { key: "highlights", label: "Key points", type: "paragraphs", itemLabel: "key point", help: "Two or three short points, shown as a list under the summary." },
    ],
  },
  {
    name: "certificates",
    label: "Certificates",
    description: "Certificates in the About section. Ones with an issuer badge are shown as a larger highlighted card.",
    kind: "list",
    itemLabel: "certificate",
    itemTitle: (item) => str(item.title),
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "issuer", label: "Issuer", type: "text", required: true },
      { key: "year", label: "Year", type: "text", required: true },
      { key: "image", label: "Certificate image", type: "image", upload: "certificate", required: true },
      { key: "verifyUrl", label: "Verification link", type: "url" },
      { key: "badge", label: "Issuer badge", type: "image", upload: "badge", help: "Optional. Adding one makes this a highlighted card." },
      { key: "label", label: "Highlight label", type: "text", help: "Short label above a highlighted card's title." },
      { key: "credentialId", label: "Credential ID", type: "text" },
      { key: "validUntil", label: "Valid until", type: "text", placeholder: "Sep 2028" },
      { key: "pdfUrl", label: "Certificate PDF", type: "file", upload: "certificate-pdf", help: "Optional download in the certificate viewer." },
    ],
  },
  {
    name: "testimonials",
    label: "Testimonials",
    description: "Client reviews. The first one is featured large.",
    kind: "list",
    itemLabel: "testimonial",
    itemTitle: (item) => `${str(item.name)}: “${str(item.quote).slice(0, 60)}…”`,
    fields: [
      { key: "quote", label: "Quote", type: "textarea", required: true },
      { key: "name", label: "Client name", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
    ],
  },
  {
    name: "services",
    label: "Services",
    description: "What you offer, shown as the bento grid.",
    kind: "list",
    itemLabel: "service",
    itemTitle: (item) => str(item.title),
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "tags", label: "Tags", type: "tags", required: true },
      {
        key: "visual",
        label: "Card animation",
        type: "select",
        required: true,
        options: ["chat", "voice", "web", "api", "data", "integrations"],
      },
    ],
  },
  {
    name: "process",
    label: "Process",
    description: "How you work with clients, step by step.",
    kind: "list",
    itemLabel: "step",
    itemTitle: (item) => str(item.title),
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "deliverables", label: "Deliverables", type: "tags", required: true },
    ],
  },
  {
    name: "skills",
    label: "Tech stack",
    description: "Logos in the scrolling tech marquee, in display order.",
    kind: "skills",
  },
];

export function getCollection(name: CollectionName) {
  return collections.find((collection) => collection.name === name)!;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const colorPattern = /^#[0-9a-f]{6}$/i;

function isBlank(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.values(value).every(isBlank);
  return false;
}

function isLink(value: string) {
  return /^(https?:\/\/|mailto:|tel:)\S+$/.test(value) || /^\/\S*$/.test(value);
}

/**
 * Cleans a value for saving (trims text, drops blank optional fields) and collects every problem
 * as a readable message. Returns the cleaned value, which is what gets written to disk.
 */
function cleanFields(fields: Field[], value: unknown, path: string, errors: string[]): Item {
  const source = (value && typeof value === "object" ? value : {}) as Item;
  const result: Item = {};
  for (const field of fields) {
    const cleaned = cleanField(field, source[field.key], path ? `${path} → ${field.label}` : field.label, errors);
    if (cleaned !== undefined) result[field.key] = cleaned;
  }
  return result;
}

function cleanField(field: Field, raw: unknown, path: string, errors: string[]): unknown {
  if (field.type === "boolean") return Boolean(raw);

  let value = raw;
  if (typeof value === "string") value = value.trim();
  if (field.type === "tags" || field.type === "paragraphs") {
    value = Array.isArray(value) ? value.map((entry) => String(entry).trim()).filter(Boolean) : [];
  }
  if (field.type === "object" && !isBlank(value)) value = cleanFields(field.fields, value, path, errors);

  if (isBlank(value)) {
    if (field.required) errors.push(`${path} is required.`);
    return undefined;
  }

  switch (field.type) {
    case "number": {
      const number = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(number)) {
        errors.push(`${path} must be a number.`);
        return undefined;
      }
      return number;
    }
    case "url":
      if (!isLink(String(value))) errors.push(`${path} must be a full link (https://…), mailto:, tel: or a path starting with /.`);
      return value;
    case "color":
      if (!colorPattern.test(String(value))) errors.push(`${path} must be a hex color like #8b7cff.`);
      return value;
    case "select":
      if (!field.options.includes(String(value))) errors.push(`${path} must be one of: ${field.options.join(", ")}.`);
      return value;
    case "image": {
      const image = value as Item;
      if (typeof image.src !== "string" || typeof image.width !== "number" || typeof image.height !== "number") {
        errors.push(`${path} needs an uploaded image.`);
      }
      return value;
    }
    case "file":
      if (!String(value).startsWith("/")) errors.push(`${path} needs an uploaded file.`);
      return value;
    case "list": {
      if (!Array.isArray(value)) {
        errors.push(`${path} must be a list.`);
        return undefined;
      }
      return value.map((entry, i) => cleanFields(field.fields, entry, `${path} #${i + 1}`, errors));
    }
    default:
      return value;
  }
}

export interface ValidationResult {
  data: unknown;
  errors: string[];
}

/** Validates and cleans a whole collection. `knownIcons` checks tech-stack slugs when given. */
export function validateCollection(
  name: CollectionName,
  data: unknown,
  knownIcons?: (slug: string) => boolean,
): ValidationResult {
  const collection = getCollection(name);
  const errors: string[] = [];

  if (collection.kind === "skills") {
    const slugs = Array.isArray(data) ? data.map((slug) => String(slug).trim()).filter(Boolean) : [];
    if (slugs.length === 0) errors.push("Add at least one technology.");
    const unknown = knownIcons ? slugs.filter((slug) => !knownIcons(slug)) : [];
    if (unknown.length) errors.push(`Unknown logos: ${unknown.join(", ")}.`);
    return { data: [...new Set(slugs)], errors };
  }

  if (collection.kind === "object") {
    return { data: cleanFields(collection.fields, data, "", errors), errors };
  }

  if (!Array.isArray(data)) return { data, errors: [`${collection.label} must be a list.`] };
  const items = data.map((item, i) =>
    cleanFields(collection.fields, item, `${collection.itemLabel[0].toUpperCase()}${collection.itemLabel.slice(1)} #${i + 1}`, errors),
  );

  if (name === "projects") {
    const seen = new Set<string>();
    for (const item of items) {
      const slug = str(item.slug);
      if (slug && !slugPattern.test(slug)) errors.push(`Slug "${slug}" can only use lowercase letters, numbers and dashes.`);
      if (seen.has(slug)) errors.push(`Two case studies use the slug "${slug}".`);
      seen.add(slug);
    }
  }

  // The site tells these rows apart by title (to open and close them), so titles must be unique.
  if (name === "archive") {
    const seen = new Set<string>();
    for (const item of items) {
      const title = str(item.title);
      if (title && seen.has(title)) errors.push(`Two projects are called "${title}".`);
      seen.add(title);
    }
  }

  return { data: items, errors };
}

/** A blank value for a field, used when adding new items. */
export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "boolean":
      return false;
    case "tags":
    case "paragraphs":
    case "list":
      return [];
    case "object":
      return Object.fromEntries(field.fields.map((child) => [child.key, emptyValue(child)]));
    case "select":
      return field.options[0];
    case "color":
      return "#8b7cff";
    case "image":
      return undefined;
    default:
      return "";
  }
}

export function emptyItem(fields: Field[]): Item {
  return Object.fromEntries(fields.map((field) => [field.key, emptyValue(field)]));
}
