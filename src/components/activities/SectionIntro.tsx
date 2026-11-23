import type { ReactNode } from "react";
import { Reveal } from "@/components/site/Reveal";
import { RuledEyebrow } from "@/components/site/RuledEyebrow";

/**
 * The opener every activity section shares (Infinity pattern): the title on
 * the left, and a one-line standfirst beside it on a laptop.
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
