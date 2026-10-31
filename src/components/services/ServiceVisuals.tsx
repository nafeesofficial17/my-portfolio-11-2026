"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { FileText, Phone, Send, Sparkles } from "lucide-react";
import { easeOutExpo } from "@/lib/motion";
import type { ServiceVisual } from "@/types";

/* Small, self-contained illustrations for the services bento. All decorative. */

const answer = "Yes, you can move it up to 24 hours in advance. Want me to book Thursday at 3 PM instead?";

function ChatVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  // 0: empty, 1: question, 2: typing, 3: answer. Reduced motion skips straight to the answer.
  const [playedStep, setStep] = useState(0);
  const step = reduce && inView ? 3 : playedStep;

  useEffect(() => {
    if (!inView || reduce) return;
    const timers = [setTimeout(() => setStep(1), 200), setTimeout(() => setStep(2), 900), setTimeout(() => setStep(3), 2100)];
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="flex h-full flex-col rounded-2xl border border-line bg-background/60 p-4 backdrop-blur">
      <div className="flex items-center gap-2.5 border-b border-line pb-3">
        <span className="grid size-7 place-items-center rounded-full bg-linear-to-br from-accent to-accent-2">
          <Sparkles className="size-3.5 text-background" />
        </span>
        <div className="text-xs leading-tight">
          <div className="font-medium">Firm assistant</div>
          <div className="flex items-center gap-1 text-subtle">
            <span className="size-1.5 rounded-full bg-success" /> Answers from your documents
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-3 py-4 text-[13px] leading-snug">
        {step >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-background"
          >
            Can I reschedule my consultation?
          </motion.p>
        )}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-white/[0.06] px-3.5 py-3">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="size-1.5 rounded-full bg-muted"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
              />
            ))}
          </motion.div>
        )}
        {step === 3 && (
          <div className="max-w-[85%] space-y-2">
            <p className="rounded-2xl rounded-bl-md bg-white/[0.06] px-3.5 py-2 text-foreground">
              {answer.split(" ").map((word, i) => (
                <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.035 }}>
                  {word}{" "}
                </motion.span>
              ))}
            </p>
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-subtle"
            >
              <FileText className="size-3" /> booking-policy.pdf
            </motion.span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-full border border-line bg-white/[0.03] py-1.5 pr-1.5 pl-4 text-xs text-subtle">
        Ask anything…
        <span className="grid size-7 place-items-center rounded-full bg-white/10 text-foreground">
          <Send className="size-3.5" />
        </span>
      </div>
    </div>
  );
}

function VoiceVisual() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-line bg-background/60 px-3 py-1.5 text-xs">
        <span className="relative grid size-5 place-items-center rounded-full bg-success/20 text-success">
          <Phone className="size-3" />
        </span>
        Live call
        <span className="font-mono text-subtle">02:14</span>
      </div>
      <div className="flex h-16 items-center gap-[3px]">
        {Array.from({ length: 34 }, (_, i) => (
          <span
            key={i}
            className="animate-wave h-full w-[3px] rounded-full bg-linear-to-t from-accent to-accent-2"
            style={{ animationDelay: `${-((i * 137) % 1200)}ms`, opacity: 0.4 + ((i * 53) % 60) / 100 }}
          />
        ))}
      </div>
      <p className="max-w-[16rem] text-center text-xs text-subtle italic">“I&apos;d like to book a consultation for Thursday.”</p>
    </div>
  );
}

function WebVisual() {
  return (
    <div className="flex h-full overflow-hidden rounded-2xl border border-line bg-background/60">
      <div className="hidden w-14 shrink-0 flex-col gap-2.5 border-r border-line p-3 sm:flex">
        <span className="mb-2 size-6 rounded-md bg-linear-to-br from-accent to-accent-2" />
        {[0, 1, 2, 3].map((row) => (
          <span key={row} className="h-1.5 rounded-full bg-white/10" />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex items-center justify-between">
          <span className="h-2 w-20 rounded-full bg-white/15" />
          <span className="size-5 rounded-full bg-white/10" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((card) => (
            <div key={card} className="space-y-1.5 rounded-lg border border-line p-2">
              <span className="block h-1.5 w-8 rounded-full bg-white/10" />
              <span className="block h-2.5 w-12 rounded-full bg-white/25" />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-line p-2">
          {[40, 65, 45, 80, 55, 90, 70, 100, 75, 85].map((height, i) => (
            <span
              key={i}
              className="animate-shimmer flex-1 rounded-sm bg-linear-to-t from-accent/40 to-accent"
              style={{ height: `${height}%`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ApiVisual() {
  const targets = [
    { label: "PostgreSQL", y: 22 },
    { label: "LLM", y: 80 },
    { label: "Queue", y: 138 },
  ];
  return (
    <svg viewBox="0 0 300 160" className="h-full w-full text-[10px]" fill="none">
      {targets.map((target) => (
        <path
          key={target.label}
          d={`M168 80 C 200 80, 200 ${target.y}, 222 ${target.y}`}
          stroke="var(--accent)"
          strokeOpacity="0.7"
          strokeDasharray="4 8"
          className="animate-dash"
        />
      ))}
      <path d="M78 80 H 112" stroke="var(--accent-2)" strokeOpacity="0.8" strokeDasharray="4 8" className="animate-dash" />

      <rect x="8" y="62" width="70" height="36" rx="10" fill="var(--surface-raised)" stroke="var(--line-strong)" />
      <text x="43" y="84" textAnchor="middle" fill="var(--muted)">Client</text>

      <rect x="112" y="56" width="56" height="48" rx="12" fill="url(#api-fill)" stroke="var(--accent)" strokeOpacity="0.6" />
      <text x="140" y="78" textAnchor="middle" fill="var(--foreground)" fontWeight="600">API</text>
      <text x="140" y="92" textAnchor="middle" fill="var(--muted)" fontSize="8">REST · WS</text>

      {targets.map((target) => (
        <g key={target.label}>
          <rect x="222" y={target.y - 15} width="72" height="30" rx="9" fill="var(--surface-raised)" stroke="var(--line-strong)" />
          <text x="258" y={target.y + 3.5} textAnchor="middle" fill="var(--muted)">
            {target.label}
          </text>
        </g>
      ))}
      <defs>
        <linearGradient id="api-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DataVisual() {
  const history = "M0 110 L30 96 L60 102 L90 80 L120 86 L150 64 L180 70";
  const forecast = "M180 70 L210 52 L240 58 L270 36 L300 28";
  const draw = {
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true, margin: "-60px" },
  };
  return (
    <svg viewBox="0 0 300 140" className="h-full w-full" fill="none" preserveAspectRatio="none">
      {[30, 65, 100].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="var(--line)" />
      ))}
      <path d={`${history} L180 140 L0 140 Z`} fill="url(#data-fill)" />
      <motion.path d={history} stroke="var(--accent)" strokeWidth="2" {...draw} transition={{ duration: 1.4, ease: easeOutExpo }} />
      <motion.path
        d={forecast}
        stroke="var(--accent-2)"
        strokeWidth="2"
        strokeDasharray="5 5"
        {...draw}
        transition={{ duration: 1, delay: 1.2, ease: easeOutExpo }}
      />
      <circle cx="300" cy="28" r="4" fill="var(--accent-2)" className="animate-shimmer" />
      <defs>
        <linearGradient id="data-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const integrations = [
  ["Stripe", "Razorpay", "PayPal", "Twilio", "Zoom", "OpenAI", "ElevenLabs", "Firebase"],
  ["AWS S3", "Docker", "Nginx", "PostgreSQL", "MySQL", "GitHub Actions", "Celery", "Redis"],
];

function IntegrationsVisual() {
  return (
    <div className="mask-fade-x flex h-full flex-col justify-center gap-3 overflow-hidden">
      {integrations.map((row, r) => (
        <div
          key={r}
          className="animate-marquee flex w-max gap-3 [--marquee-duration:36s]"
          style={{ animationDirection: r === 1 ? "reverse" : undefined }}
        >
          {[...row, ...row].map((name, i) => (
            <span
              key={i}
              aria-hidden={i >= row.length || undefined}
              className="rounded-xl border border-line bg-background/60 px-4 py-2.5 text-sm whitespace-nowrap text-muted"
            >
              {name}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

const visuals: Record<ServiceVisual, () => React.ReactElement> = {
  chat: ChatVisual,
  voice: VoiceVisual,
  web: WebVisual,
  api: ApiVisual,
  data: DataVisual,
  integrations: IntegrationsVisual,
};

export function ServiceVisualFor({ visual }: { visual: ServiceVisual }) {
  const Visual = visuals[visual];
  return <Visual />;
}
