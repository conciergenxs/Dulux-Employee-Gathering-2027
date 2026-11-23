import type { ReactNode } from "react";

/**
 * The KV's eyebrow: the lockup's condensed capitals, on their own (no
 * hairlines). `align="start"` sets it flush left, for headings that sit on
 * the left.
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
        className={`font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.2em] text-sky sm:text-[0.9375rem] ${className}`}
      >
        {children}
      </p>
    );
  return (
    <p
      className={`w-full text-center font-[family-name:var(--font-kv-condensed)] text-[0.9375rem] uppercase tracking-[0.22em] text-white/85 sm:text-[1.0625rem] ${className}`}
    >
      {/* The leading pad balances the tracking after the last letter. */}
      <span className="pl-[0.22em]">{children}</span>
    </p>
  );
}
