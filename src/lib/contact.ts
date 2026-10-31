/** Contact form schema, shared by the form (instant feedback) and the API route (the real check). */

export const projectTypes = ["AI / chatbot", "Web app", "API / backend", "Data & ML", "Other"] as const;
export const budgets = ["Under $2k", "$2k – $5k", "$5k – $15k", "$15k+", "Not sure yet"] as const;

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  /** Honeypot: hidden from people, so anything typed here came from a bot. */
  website: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const fields: (keyof ContactInput)[] = ["name", "email", "company", "projectType", "budget", "message", "website"];

export function parseContact(data: unknown): ContactInput {
  const source = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;
  return Object.fromEntries(
    fields.map((field) => [field, typeof source[field] === "string" ? (source[field] as string).trim() : ""]),
  ) as unknown as ContactInput;
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (input.name.length < 2) errors.name = "Please tell me your name.";
  else if (input.name.length > 100) errors.name = "That name is a little long.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.email)) errors.email = "Please enter a valid email address.";
  if (input.company.length > 120) errors.company = "That's a little long.";
  if (input.projectType && !(projectTypes as readonly string[]).includes(input.projectType)) {
    errors.projectType = "Please pick one of the options.";
  }
  if (input.budget && !(budgets as readonly string[]).includes(input.budget)) errors.budget = "Please pick one of the options.";
  if (input.message.length < 20) errors.message = "A sentence or two about your project helps (20+ characters).";
  else if (input.message.length > 5000) errors.message = "Please keep it under 5,000 characters.";
  return errors;
}
