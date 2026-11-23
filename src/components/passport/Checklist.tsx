import { Link } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/activities/Badges";
import { STRENGTHS } from "@/lib/event";
import { progressOf, type ParticipantState } from "@/lib/participant";

/**
 * Your Checklist (Infinity pattern; Dulux sitemap "Checklist participation"):
 * what the participant has taken part in — ticked, not scored. Each card
 * opens the place where it's done.
 */
export function Checklist({ state }: { state: ParticipantState }) {
  const p = progressOf(state);
  const strength = state.firstStroke
    ? STRENGTHS.find((s) => s.id === state.firstStroke!.strength)
    : null;
  const asked = state.questions.length;

  const items = [
    {
      id: "first-stroke",
      caption: "Answer one question",
      label: "The First Stroke",
      done: Boolean(strength),
      detail: strength
        ? `Kepinganmu: ${strength.name}, ${strength.tagline.toLowerCase()}.`
        : "Pilih satu kekuatan yang kamu bawa ke babak baru kita.",
    },
    {
      id: "question-box",
      caption: "Send one question",
      label: "Change Talk Question Box",
      done: asked > 0,
      detail:
        asked > 0
          ? `${asked} pertanyaan terkirim tanpa nama.`
          : "Kirim pertanyaan soal arah Dulux di 2027, tanpa nama.",
    },
  ];

  return (
    <section id="checklist" className="scroll-mt-28 px-5 pt-14 sm:pt-16 lg:px-0">
      <div className="mx-auto max-w-md lg:max-w-none">
        <Reveal>
          <PanelHead eyebrow="Participation" title="Your" accent="Checklist" />
          <p className="mt-3 text-[0.9375rem] text-white/65">
            Tercentang otomatis begitu kamu ikut serta.
          </p>
          <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/55">
            {p.checklistDone} of {p.checklistTotal} checked
          </p>
        </Reveal>

        <ul className="mt-3 space-y-3">
          {items.map((item, i) => (
            <Reveal as="li" key={item.id} delay={0.06 + i * 0.05}>
              <Link
                to="/activities"
                search={{ section: "day1", part: "pre-event" }}
                hash={item.id}
                className="surface-interactive group flex w-full items-center gap-4 px-4 py-5 sm:px-5"
              >
                <StatusDot done={item.done} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-sky">
                    {item.caption}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <span className="text-base font-semibold text-white">{item.label}</span>
                    {item.done ? (
                      <Badge tone="done">Done</Badge>
                    ) : (
                      <Badge tone="pending">Not yet</Badge>
                    )}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/60">
                    {item.detail}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Heading shared by the pass's sections: eyebrow, title (accent in the KV gradient), a count. */
export function PanelHead({
  eyebrow,
  title,
  accent,
  count,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  count?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky sm:text-[0.9375rem]">
          {eyebrow}
        </p>
        <h2 className="wordmark mt-3 pr-[0.06em] text-[clamp(1.75rem,6.4vw,2.25rem)] text-white">
          {title} {accent && <span className="text-together">{accent}</span>}
        </h2>
      </div>
      {count && (
        <p className="shrink-0 pb-1 text-[0.8125rem] font-semibold tabular-nums text-white/60">
          {count}
        </p>
      )}
    </div>
  );
}

/**
 * Status marker, as on a rundown: a ring with a dot while it's to do, a
 * filled disc with a tick once it's done.
 */
export function StatusDot({ done }: { done: boolean }) {
  return done ? (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[image:var(--gradient-together)] text-navy-950">
      <Check className="size-3.5" strokeWidth={3} />
    </span>
  ) : (
    <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-cyan">
      <span className="size-2 rounded-full bg-cyan" />
    </span>
  );
}
