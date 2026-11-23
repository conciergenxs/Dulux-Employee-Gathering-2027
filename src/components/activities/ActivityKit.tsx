import type { ReactNode } from "react";
import { Hand, QrCode, type LucideIcon } from "lucide-react";
import { CHECK_INS } from "@/lib/event";
import { Reveal } from "@/components/site/Reveal";
import { MotionImage } from "@/components/site/MotionImage";
import { CheckInPanel } from "@/components/activities/CheckIn";
import type { CheckInId } from "@/lib/participant";

/* The pieces every day on the Activities page is built from. */

export const TEXT_LINK =
  "inline-flex min-h-9 items-center text-sm font-semibold text-white underline decoration-cyan/50 decoration-1 underline-offset-[6px] transition-colors hover:decoration-cyan";

/** Picture on one side, words on the other (Infinity's check-in card). */
export const MEDIA_CARD =
  "mt-8 grid overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_50px_-32px_rgba(0,10,30,0.9)] ring-1 ring-white/12 md:grid-cols-[1fr_1.1fr]";

/** The picture side of a media card, with the mood label where it applies. */
export function MediaSide({
  image,
  alt,
  mood = false,
  className = "md:min-h-[16rem]",
}: {
  image: string;
  alt: string;
  mood?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative aspect-[16/10] md:aspect-auto ${className}`}>
      <div className="absolute inset-0">
        <MotionImage src={image} alt={alt} className="h-full" />
      </div>
      {mood && <MoodTag />}
    </div>
  );
}

export function CheckInCard({
  id,
  image,
  alt,
  title,
  text,
  mood = false,
}: {
  id: CheckInId;
  image: string;
  alt: string;
  title: string;
  text: string;
  mood?: boolean;
}) {
  return (
    <Reveal delay={0.06}>
      <div className={MEDIA_CARD}>
        <MediaSide image={image} alt={alt} mood={mood} />
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <span className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-cyan">
            {CHECK_INS.find((c) => c.id === id)?.mode === "self" ? (
              <Hand className="size-[1.05rem]" />
            ) : (
              <QrCode className="size-[1.05rem]" />
            )}
          </span>
          <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1.5 text-[0.9375rem] text-white/65">{text}</p>
          <div className="mt-5 border-t border-white/[0.08] pt-4">
            <CheckInPanel id={id} bare />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function MoodTag() {
  return (
    <span className="absolute left-3 top-3 rounded-full bg-navy-950/60 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
      Referensi suasana
    </span>
  );
}

export function Fact({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <li className="surface flex items-start gap-3 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-cyan">
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block text-[0.9375rem] font-semibold text-white">{title}</span>
        <span className="block text-sm text-white/60">{text}</span>
      </span>
    </li>
  );
}

/** A subheading inside a section, with an optional note on the right. */
export function BlockHead({ title, note }: { title: string; note?: ReactNode }) {
  return (
    <Reveal>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {note && <p className="text-sm text-white/60">{note}</p>}
      </div>
    </Reveal>
  );
}

/** A numbered card: the chrome-free numeral, a name, one line. */
export function NumberedCard({
  n,
  title,
  text,
  children,
}: {
  n: number;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="surface flex h-full flex-col p-5">
      <span className="font-display text-2xl text-sky">{String(n).padStart(2, "0")}</span>
      <p className="mt-2 text-[0.9375rem] font-semibold text-white">{title}</p>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-white/60">{text}</p>
      {children}
    </div>
  );
}

export type PartChip<T extends string> = {
  id: T;
  label: string;
  sub: string;
  icon: LucideIcon;
  /** The moments (section ids) this part holds, for links that name one. */
  moments: readonly string[];
};

/** A day's parts, one at a time. A swipeable row on a phone. */
export function PartChips<T extends string>({
  label,
  parts,
  active,
  onChange,
}: {
  label: string;
  parts: readonly PartChip<T>[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="no-scrollbar -mx-5 mt-6 flex gap-2.5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:justify-center lg:overflow-visible lg:px-0"
    >
      {parts.map((chip, i) => {
        const on = chip.id === active;
        return (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(chip.id)}
            className={`relative flex shrink-0 items-center gap-3 rounded-2xl border py-2 pl-2 pr-4 text-left transition-colors duration-200 active:scale-[0.98] ${
              on
                ? "border-cyan/60 bg-white/[0.1] text-white"
                : "border-white/12 bg-white/[0.04] text-white/80 hover:border-cyan/40"
            }`}
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                on
                  ? "bg-[image:var(--gradient-together)] text-navy-950"
                  : "bg-white/[0.08] text-cyan"
              }`}
            >
              <chip.icon className="size-4" />
            </span>
            <span>
              <span className="block whitespace-nowrap text-sm font-semibold">
                <span className="text-white/45">0{i + 1}</span> {chip.label}
              </span>
              <span className="block whitespace-nowrap text-[0.6875rem] text-white/55">
                {chip.sub}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** A day's opener on the Activities page: the date, then its name. */
export function DayHead({ date, title }: { date: string; title: string }) {
  return (
    <Reveal className="text-center">
      <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky sm:text-[0.9375rem]">
        {date}
      </p>
      <p className="wordmark mt-2 text-[clamp(1.5rem,5.6vw,2.25rem)] text-white">{title}</p>
    </Reveal>
  );
}
