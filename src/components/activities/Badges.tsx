import { motion, useReducedMotion } from "motion/react";
import { Check, FlaskConical, Info } from "lucide-react";
import type { ReactNode } from "react";

type Tone = "mandatory" | "optional" | "done" | "pending" | "soon" | "info";

const TONE: Record<Tone, string> = {
  mandatory: "bg-white text-navy-900",
  optional: "border border-sky/40 text-sky",
  done: "bg-cyan/15 text-cyan",
  pending: "bg-white/8 text-muted-foreground",
  soon: "border border-white/20 text-white/65",
  info: "bg-white/8 text-sky",
};

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] ${TONE[tone]}`}
    >
      {tone === "done" && <Check className="size-3" strokeWidth={3} />}
      {children}
    </span>
  );
}

/** The round tick used by every checklist row. */
export function Tick({ done, size = "md" }: { done: boolean; size?: "sm" | "md" }) {
  const reduce = useReducedMotion();
  const dim = size === "sm" ? "size-8" : "size-11";
  return (
    <span
      className={`relative grid ${dim} shrink-0 place-items-center rounded-full transition-colors duration-500 ${
        done ? "bg-[image:var(--gradient-together)] text-navy-950" : "border-2 border-white/20"
      }`}
    >
      {done && (
        <motion.span
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 17 }}
        >
          <Check className={size === "sm" ? "size-4" : "size-5"} strokeWidth={3} />
        </motion.span>
      )}
    </span>
  );
}

/** A quiet line of guidance under a control. */
export function InfoNote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`flex items-start gap-2 text-xs leading-relaxed text-white/60 ${className}`}>
      <Info className="mt-0.5 size-3.5 shrink-0 text-sky" />
      <span>{children}</span>
    </p>
  );
}

/** Wraps a control that exists only in demo mode (`?demo=1`). */
export function PrototypeNote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`flex items-start gap-2 text-xs leading-relaxed text-ice/75 ${className}`}>
      <FlaskConical className="mt-0.5 size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
