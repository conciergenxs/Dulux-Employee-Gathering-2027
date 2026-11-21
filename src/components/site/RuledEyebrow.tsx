import type { ReactNode } from "react";

/**
 * The KV's eyebrow: tracked capitals between hairlines that fade outward.
 * `align="start"` keeps a single rule leading into the text, for headings
 * that sit on the left.
 */
export function RuledEyebrow({
  children,
  align = "center",
  className = "",
}: {
  children: ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  if (align === "start")
    return (
      <p
        className={`flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-sky sm:text-xs ${className}`}
      >
        <span
          aria-hidden
          className="h-px w-8 shrink-0 bg-gradient-to-r from-white/0 to-sky/80 sm:w-10"
        />
        <span>{children}</span>
      </p>
    );
  return (
    <p
      className={`flex w-full items-center justify-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-white/85 sm:gap-5 sm:text-[0.8125rem] sm:tracking-[0.36em] ${className}`}
    >
      <span
        aria-hidden
        className="h-px max-w-16 flex-1 bg-gradient-to-r from-white/0 via-white/35 to-white/70 sm:max-w-24"
      />
      <span className="shrink-0 whitespace-nowrap pl-[0.3em] sm:pl-[0.36em]">{children}</span>
      <span
        aria-hidden
        className="h-px max-w-16 flex-1 bg-gradient-to-l from-white/0 via-white/35 to-white/70 sm:max-w-24"
      />
    </p>
  );
}
