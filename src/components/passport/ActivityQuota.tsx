import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, ChevronRight, Hand, MapPin, QrCode, Users } from "lucide-react";
import { PanelHead } from "@/components/passport/Checklist";
import { RewardList } from "@/components/activities/Redemption";
import { Reveal } from "@/components/site/Reveal";
import { PrototypeNote } from "@/components/activities/Badges";
import { useDemoMode } from "@/lib/demo";
import { actions, useParticipant, type CheckInId, type ParticipantState } from "@/lib/participant";
import { QUOTA_ACTIVITIES, activitiesOn, stampsOf, type QuotaActivity } from "@/lib/quota";

const EASE = [0.22, 1, 0.36, 1] as const;

type TabId = "day1" | "day2" | "day3" | "redemption";

/** Three days, then the redemption (Dulux sitemap). */
const TABS: { id: TabId; label: string; caption: string }[] = [
  { id: "day1", label: "Day 1", caption: "16 Dec · Swissôtel Jakarta PIK Avenue" },
  { id: "day2", label: "Day 2", caption: "17 Dec · Land's End PIK 2 & ballroom" },
  { id: "day3", label: "Day 3", caption: "18 Dec · Swissôtel Jakarta PIK Avenue" },
  { id: "redemption", label: "Redemption", caption: "Redemption" },
];

/**
 * Activity Quota (Infinity pattern; Dulux sitemap "Activity list & quota"):
 * a tab per day, listing that day's check-ins, and one for redemption: the
 * Sunset Social reward (both games played) and the Dulux Colour Sync prize.
 */
export function ActivityQuota({
  state,
  onOpen,
}: {
  state: ParticipantState;
  onOpen: (id: CheckInId) => void;
}) {
  const [tab, setTab] = useState<TabId>("day1");
  const current = TABS.find((t) => t.id === tab)!;

  return (
    <section id="activities" className="scroll-mt-28 px-5 pt-14 sm:pt-16 lg:px-0">
      <div className="mx-auto max-w-md lg:max-w-none">
        <Reveal>
          <PanelHead
            eyebrow="At the venue"
            title="Activity"
            accent="Quota"
            count={`${stampsOf(state)}/${QUOTA_ACTIVITIES.length}`}
          />
          <p className="mt-3 text-[0.9375rem] text-white/65">
            Stamp dari setiap aktivitas di lokasi otomatis tercatat di sini.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div
            role="tablist"
            aria-label="Activity quota"
            className="mt-6 grid grid-cols-[1fr_1fr_1fr_1.45fr] gap-1 rounded-full border border-white/12 bg-white/[0.05] p-1"
          >
            {TABS.map((t) => {
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className="relative min-h-10 rounded-full px-1 transition-colors active:scale-95"
                >
                  {active && (
                    <motion.span
                      layoutId="quota-tab"
                      transition={{ type: "spring", stiffness: 340, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-white"
                    />
                  )}
                  <span
                    className={`relative block whitespace-nowrap text-[0.8125rem] font-semibold sm:text-sm ${
                      active ? "text-navy-900" : "text-white/70"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <p className="mt-3 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/55">
          {current.caption}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="mt-4"
          >
            {tab === "redemption" ? (
              <RewardList />
            ) : (
              <ul className="space-y-2.5">
                {activitiesOn(tab).map((a) => (
                  <li key={a.id}>
                    <ActivityRow
                      activity={a}
                      claimed={state.checkIns[a.id] ? 1 : 0}
                      onOpen={() => onOpen(a.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ActivityRow({
  activity,
  claimed,
  onOpen,
}: {
  activity: QuotaActivity;
  claimed: number;
  onOpen: () => void;
}) {
  const complete = claimed >= activity.quota;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="surface-interactive group flex w-full items-center gap-3.5 p-3 text-left"
    >
      {/* A finished activity gets a badge, not a lid: the photo is the point. */}
      <span className="relative size-14 shrink-0">
        <img src={activity.image} alt="" className="size-full rounded-xl object-cover" />
        {complete && (
          <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-[image:var(--gradient-together)] text-navy-950 ring-2 ring-navy-900">
            <Check className="size-3" strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="line-clamp-2 min-w-0 flex-1 text-base font-semibold text-white">
            {activity.name}
          </span>
          <span className="shrink-0 text-[0.75rem] font-semibold tabular-nums text-white/55">
            {claimed}/{activity.quota}
          </span>
        </span>
        <span className="mt-2 flex items-center gap-2.5">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/[0.08] px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/70">
            {activity.mode === "crew" ? (
              <>
                <Users className="size-3 text-cyan" />
                Crew scan
              </>
            ) : (
              <>
                <Hand className="size-3 text-cyan" />
                Self check-in
              </>
            )}
          </span>
          <span className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: claimed / activity.quota }}
              transition={{ duration: 0.8, ease: EASE }}
              className="block h-full origin-left rounded-full bg-[image:var(--gradient-together)]"
            />
          </span>
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/** The activity sheet (Infinity pattern): the place, the stamp, how it's stamped, the QR. */
export function ActivityDetail({
  activity,
  claimed,
  onShowQr,
}: {
  activity: QuotaActivity;
  claimed: number;
  onShowQr: () => void;
}) {
  const demo = useDemoMode();
  const arrived = Boolean(useParticipant().checkIns.welcome);
  const complete = claimed >= activity.quota;
  const self = activity.mode === "self";
  const locked = self && !arrived;
  return (
    <div className="pb-4">
      <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky sm:text-[0.9375rem]">
        {activity.dayLabel}
      </p>
      <h2 className="wordmark mt-2 pr-[0.06em] text-[clamp(1.75rem,7vw,2.25rem)] text-white">
        {activity.name}
      </h2>

      <div className="mt-5 overflow-hidden rounded-[var(--radius-card)]">
        <motion.img
          src={activity.image}
          alt={activity.name}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="aspect-[16/10] w-full object-cover"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
          <MapPin className="size-3.5 text-cyan" />
          {activity.where}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] ${
            complete ? "bg-cyan/15 text-cyan" : "bg-white/[0.08] text-white/65"
          }`}
        >
          {complete ? "Stamped" : "Not stamped yet"}
        </span>
      </div>

      <div className="surface mt-5 flex gap-3 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.08] text-cyan">
          {self ? <Hand className="size-[1.1rem]" /> : <Users className="size-[1.1rem]" />}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-white">
            {self ? "Self Check-In" : "Crew Check-In"}
          </span>
          <span className="mt-0.5 block text-sm text-white/65">
            {self
              ? "Begitu kamu sudah di lokasi, tekan Check in now di bawah. Stamp-nya langsung tercatat di sini."
              : "Tunjukkan QR My Canvas Pass-mu ke crew di lokasi. Begitu dipindai, stamp-nya langsung tercatat di sini."}
          </span>
        </span>
      </div>

      <h3 className="mt-7 text-base font-semibold text-white">How It Works</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/70">{activity.how}</p>

      {self ? (
        <button
          type="button"
          disabled={complete || locked}
          onClick={() => actions.checkIn(activity.id)}
          className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#eef1f4_55%,#cfd6dd_100%)] px-6 text-sm font-bold text-navy-900 active:scale-[0.98] disabled:opacity-50"
        >
          <Check className="size-4" strokeWidth={2.5} />
          {complete ? "Checked in" : locked ? "After arrival check-in" : "Check in now"}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onShowQr}
            className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#eef1f4_55%,#cfd6dd_100%)] px-6 text-sm font-bold text-navy-900 active:scale-[0.98]"
          >
            <QrCode className="size-4" />
            Show My QR
          </button>

          {demo && !complete && (
            <div className="proto mt-4 p-3.5">
              <PrototypeNote>
                Mode demo. Di acara, scanner milik crew yang mencatat stamp ini.
              </PrototypeNote>
              <button
                type="button"
                onClick={() => actions.checkIn(activity.id)}
                className="btn btn-ghost mt-3 min-h-10 w-full text-[0.8125rem]"
              >
                Simulate crew scan
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
