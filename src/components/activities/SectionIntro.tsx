import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { RuledEyebrow } from "@/components/site/RuledEyebrow";

/**
 * The opener every activity section shares (Infinity pattern): the title on
 * the left, a one-line standfirst beside it on a laptop, and quick facts
 * under that.
 */
export function SectionIntro({
  id,
  eyebrow,
  title,
  accent,
  text,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  accent: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div
      id={id}
      className="grid scroll-mt-28 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end lg:gap-12"
    >
      <Reveal>
        <RuledEyebrow align="start">{eyebrow}</RuledEyebrow>
        <h2 className="wordmark mt-3 pr-[0.06em] text-[clamp(1.875rem,6.8vw,2.75rem)] text-white">
          {title} <span className="text-together">{accent}</span>
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        {text && (
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-white/70 sm:text-base">
            {text}
          </p>
        )}
        {children}
      </Reveal>
    </div>
  );
}

/** A quick fact under an intro: "Wed, 16 Dec", "Arrival". */
export function FactPill({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[0.8125rem] font-medium text-white/85">
      <Icon className="size-3.5 text-cyan" />
      {children}
    </span>
  );
}
