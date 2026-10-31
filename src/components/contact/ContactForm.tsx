"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { profile } from "@/data/profile";
import { budgets, parseContact, projectTypes, validateContact, type ContactErrors } from "@/lib/contact";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-[15px] text-foreground placeholder:text-subtle transition-colors duration-300 outline-none hover:border-line-strong focus:border-accent focus:bg-white/[0.04] aria-[invalid=true]:border-red-400/60";

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 flex justify-between text-sm text-muted">
        {label}
        {optional && <span className="text-subtle">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

/** A radio group styled as selectable pills. */
function Choices({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
              value === option
                ? "border-foreground bg-foreground text-background"
                : "border-line text-muted hover:border-line-strong hover:text-foreground",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [serverError, setServerError] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = parseContact(Object.fromEntries(new FormData(form)));
    const found = validateContact(input);
    setErrors(found);
    setServerError("");
    if (Object.keys(found).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setStatus("sent");
        form.reset();
        setProjectType("");
        setBudget("");
        return;
      }
      if (result.errors) setErrors(result.errors);
      setServerError(result.error ?? "");
      setStatus("error");
    } catch {
      setServerError(`Couldn't reach the server. Please email me at ${profile.email}.`);
      setStatus("error");
    }
  }

  const errorProps = (name: keyof ContactErrors) =>
    errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {};

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="flex min-h-[520px] flex-col items-center justify-center text-center"
            role="status"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.7, delay: 0.1 }}
              className="grid size-16 place-items-center rounded-full bg-success/15 text-success"
            >
              <Check className="size-8" />
            </motion.span>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight">Message sent. Thank you!</h3>
            <p className="mt-3 max-w-sm text-muted">
              I&apos;ll read it and get back to you at the email you gave. Talk soon.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-8 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Your name" name="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className={inputClass}
                  {...errorProps("name")}
                />
              </Field>
              <Field label="Email" name="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@company.com"
                  className={inputClass}
                  {...errorProps("email")}
                />
              </Field>
            </div>
            <Field label="Company" name="company" error={errors.company} optional>
              <input
                id="company"
                name="company"
                autoComplete="organization"
                placeholder="Acme Inc."
                className={inputClass}
                {...errorProps("company")}
              />
            </Field>

            <Choices
              legend="What are you building?"
              name="projectType"
              options={projectTypes}
              value={projectType}
              onChange={setProjectType}
            />
            <Choices legend="Budget" name="budget" options={budgets} value={budget} onChange={setBudget} />

            <Field label="Project details" name="message" error={errors.message}>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="What are you building, who is it for, and when do you need it?"
                className={cn(inputClass, "resize-y")}
                {...errorProps("message")}
              />
            </Field>

            {/* Honeypot: invisible to people and skipped by keyboard and screen readers. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {serverError && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/30 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200"
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="group relative inline-flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-7 font-medium text-background shadow-[0_10px_40px_-10px_rgb(139_124_255/0.7)] transition-colors duration-300 hover:bg-white disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            >
              {status === "sending" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send message
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
