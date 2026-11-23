import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin } from "lucide-react";
import { Band } from "@/components/site/Band";
import { Emphasis } from "@/components/site/Emphasis";
import { PageHero } from "@/components/site/PageHero";
import { DAYS, EVENT, RUNDOWN, type DayId } from "@/lib/event";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: `Schedule — ${EVENT.name}` },
      {
        name: "description",
        content:
          "The three-day rundown of Dulux Employee Gathering 2027: Day 1 arrival and Sunset Social, Day 2 team building and Kick-off Night, Day 3 direction recap and functional huddles.",
      },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const [active, setActive] = useState<DayId>("day1");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = DAYS.length - 1;
    const next =
      e.key === "ArrowRight"
        ? i === last
          ? 0
          : i + 1
        : e.key === "ArrowLeft"
          ? i === 0
            ? last
            : i - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(DAYS[next]!.id);
    tabRefs.current[next]?.focus();
  }

  return (
    <>
      <PageHero
        tight
        eyebrow="Schedule"
        title="The"
        accent="Rundown"
        intro="Jadwal acara per hari, lengkap dengan hal yang perlu kamu siapkan."
      />

      {/* The rundown on white: the page goes blue (hero), white, blue (footer). */}
      <Band tone="light">
        <section className="relative px-5 pb-20 pt-12 sm:pb-28 sm:pt-16">
          <div className="relative mx-auto max-w-6xl">
            <div
              role="tablist"
              aria-label="Event day"
              className="mx-auto flex max-w-xl gap-1 rounded-full border border-white/12 bg-white/[0.05] p-1 backdrop-blur-sm"
            >
              {DAYS.map((d, i) => {
                const selected = d.id === active;
                return (
                  <button
                    key={d.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`day-tab-${d.id}`}
                    aria-selected={selected}
                    aria-controls={`day-panel-${d.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(d.id)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className={`relative flex-1 rounded-full px-2 py-2.5 text-center transition-colors sm:px-4 ${
                      selected ? "text-navy-900" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="day-pill"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 340, damping: 30 }}
                      />
                    )}
                    <span className="relative block text-sm font-semibold">{d.label}</span>
                    <span
                      className={`relative mt-0.5 block text-[0.6875rem] ${selected ? "text-navy-900/70" : "text-muted-foreground"}`}
                    >
                      {d.date}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                role="tabpanel"
                id={`day-panel-${active}`}
                aria-labelledby={`day-tab-${active}`}
                tabIndex={0}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 focus-visible:outline-none sm:mt-12"
              >
                <Rundown day={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </Band>
    </>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One day as a plain rundown: the day's header (date, name, session count, one
 * line), then one row per session with the time on the left, a dot on the
 * line, the name, one instruction if there is one, and where it happens.
 * The time column reads the session's clock time from event.ts.
 */
function Rundown({ day }: { day: DayId }) {
  const { date, title, intro, sessions } = RUNDOWN[day];
  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky sm:text-[0.9375rem]">
        {date}
      </p>
      <div className="mt-2 flex items-end justify-between gap-4 border-b border-white/12 pb-5">
        <h2 className="wordmark text-[clamp(1.625rem,6.4vw,2.25rem)] text-white">
          <Emphasis text={title} />
        </h2>
        <p className="shrink-0 pb-1 text-sm text-white/55">{sessions.length} sesi</p>
      </div>
      <p className="mt-5 text-[1rem] leading-relaxed text-white/70">{intro}</p>

      <ol className="relative mt-8">
        {sessions.map((item, i) => {
          const last = i === sessions.length - 1;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 * i, ease: EASE }}
              className="relative grid grid-cols-[5.75rem_1rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[8.5rem_1.25rem_minmax(0,1fr)] sm:gap-x-5"
            >
              {/* Time */}
              <p className="whitespace-nowrap pt-[0.3rem] text-[0.875rem] font-semibold tabular-nums tracking-[-0.01em] text-white sm:pt-[0.2rem] sm:text-base">
                {item.time}
                {item.end && `–${item.end}`}
              </p>

              {/* A plain dot, and the line that joins it to the next. */}
              <div aria-hidden className="relative flex justify-center">
                <span className="relative z-10 mt-[0.45rem] size-2.5 rounded-full bg-[#1d6aa8] ring-4 ring-white" />
                {!last && (
                  <span className="absolute bottom-[-0.45rem] top-[0.45rem] w-px bg-[#0a2c52]/15" />
                )}
              </div>

              {/* Session */}
              <div className={last ? "pb-1" : "pb-9"}>
                <h3 className="text-[1.125rem] font-semibold leading-snug text-white sm:text-xl">
                  {item.title}
                </h3>
                {item.note && (
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-white/65">
                    {item.note}
                  </p>
                )}
                {item.where && (
                  <div className="mt-3">
                    <Chip icon={MapPin}>{item.where}</Chip>
                  </div>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

function Chip({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[0.8125rem] font-medium text-white/85">
      <Icon className="size-3.5 shrink-0 text-cyan" />
      {children}
    </span>
  );
}
