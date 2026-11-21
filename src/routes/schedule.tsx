import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin } from "lucide-react";
import { KvTexture, PageField } from "@/components/site/PageField";
import { PageHero } from "@/components/site/PageHero";
import { KV_BOTTOM_RIGHT, Mosaic } from "@/components/canvas/Canvas";
import { RuledEyebrow } from "@/components/site/RuledEyebrow";
import { DAY1, DAYS, EVENT } from "@/lib/event";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: `Schedule — ${EVENT.name}` },
      {
        name: "description",
        content:
          "The Day 1 flow of Dulux Employee Gathering 2027: from the Welcome Experience to the Sunset Social.",
      },
    ],
  }),
  component: SchedulePage,
});

type DayId = (typeof DAYS)[number]["id"];

function SchedulePage() {
  const [active, setActive] = useState<DayId>("day1");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = DAYS.findIndex((d) => d.id === active);

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

      <PageField>
        <KvTexture side="right" className="top-0" />
        <KvTexture side="left" className="bottom-16" />
        <section className="relative px-5 pb-20 sm:pb-28">
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
                {active === "day1" ? (
                  <Day1 />
                ) : (
                  <ComingSoon label={DAYS[index]!.label} date={DAYS[index]!.date} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </PageField>
    </>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

const SESSIONS = DAY1.filter((d) => d.hasActivity);

/**
 * Day 1 as a plain rundown: the day's header (date, name, session count, one
 * line), then one row per session with the time on the left, a dot on the
 * line, the name, one instruction if there is one, and where it happens.
 * Until clock times are confirmed (`time` in event.ts), the time column shows
 * the part of the day from the deck.
 */
function Day1() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-sky">
        Wed, 16 Dec 2026
      </p>
      <div className="mt-2 flex items-end justify-between gap-4 border-b border-white/12 pb-5">
        <h2 className="text-[clamp(1.75rem,6.4vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-white">
          Find Your Place
        </h2>
        <p className="shrink-0 pb-1 text-sm text-white/55">{SESSIONS.length} sessions</p>
      </div>
      <p className="mt-5 text-[1rem] leading-relaxed text-white/70">
        Check-in di hotel, waktu bebas di siang hari, lalu acara bersama di malam hari.
      </p>

      <ol className="relative mt-8">
        {SESSIONS.map((item, i) => {
          const last = i === SESSIONS.length - 1;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 * i, ease: EASE }}
              className="relative grid grid-cols-[5.75rem_1.25rem_minmax(0,1fr)] gap-x-2.5 sm:grid-cols-[8.5rem_1.25rem_minmax(0,1fr)] sm:gap-x-5"
            >
              {/* Time */}
              <p className="pt-[0.2rem] text-[0.9375rem] font-semibold tabular-nums text-white sm:text-base">
                {item.time ?? "TBC"}
              </p>

              {/* Dot on the line */}
              <div aria-hidden className="relative flex justify-center">
                <span className="relative z-10 mt-[0.3rem] grid size-[1.125rem] place-items-center rounded-full border-2 border-cyan bg-navy-900">
                  <span className="size-1.5 rounded-full bg-cyan" />
                </span>
                {!last && <span className="absolute bottom-0 top-[1.4rem] w-px bg-white/15" />}
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

      <p className="mt-10 border-t border-white/12 pt-5 text-[0.875rem] leading-relaxed text-white/55">
        Jam setiap sesi akan diinformasikan setelah dikonfirmasi tim acara.
      </p>
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

function ComingSoon({ label, date }: { label: string; date: string }) {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,#0628a8_0%,#041f8c_55%,#03186f_100%)] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_30px_60px_-34px_rgba(0,8,60,0.9)] ring-1 ring-white/12 sm:px-12 sm:py-16">
      <Mosaic
        tiles={KV_BOTTOM_RIGHT}
        cols={4}
        rows={4}
        className="pointer-events-none absolute -right-6 -top-6 w-36 opacity-90 sm:w-44"
      />
      <div className="relative">
        <RuledEyebrow>{date}</RuledEyebrow>
        <h2 className="wordmark mt-5 text-[clamp(1.75rem,7vw,2.75rem)] text-white">
          <span className="block">{label} rundown</span>
          <span className="block pr-[0.06em] text-together">coming soon</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-white/70">
          Rundown {label} akan ditampilkan di sini setelah final.
        </p>
      </div>
    </div>
  );
}
