import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Coffee, Sparkles, X } from "lucide-react";
import { useOverlayLifecycle } from "@/hooks/use-overlay-lifecycle";
import { MORNING_NOTIFICATION, RUNDOWN } from "@/lib/event";
import logoWhite from "@/assets/brand/dulux-logo-white.webp";

const SEEN_KEY = "deg27-morning-notif-seen";

function jakartaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

/**
 * The Day 2 morning notification (deck p.58): the first time the microsite is
 * opened on Day 2 it pops up with breakfast time, when the ballroom opens and
 * the day's agenda — the way a push notification would land. It shows once
 * per device; `?notif=day2` on any link opens it again for review. It is the
 * whole of the Morning Kick-off on the microsite: no section, no check-in.
 */
export function MorningNotification() {
  const [open, setOpen] = useState(false);
  const reduce = Boolean(useReducedMotion());
  const n = MORNING_NOTIFICATION;
  const day = RUNDOWN.day2;

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, n.date);
    } catch {
      // Storage blocked: it may show again next visit, which is harmless.
    }
  }, [n.date]);
  const panelRef = useOverlayLifecycle(open, close);

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("notif") === "day2";
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === n.date;
    } catch {
      seen = false;
    }
    const t =
      forced || (jakartaToday() === n.date && !seen)
        ? window.setTimeout(() => setOpen(true), 700)
        : undefined;
    return () => window.clearTimeout(t);
  }, [n.date]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[96] flex items-start justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:px-5 sm:pt-0">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full cursor-default bg-[#071a33]/70 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="morning-notif-title"
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -40, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-[0.75rem_2rem_0.75rem_2rem] border-2 border-silver bg-[linear-gradient(180deg,#081a2f_0%,#0a2340_45%,#0b3354_100%)] text-left shadow-[0_30px_80px_-20px_rgba(0,8,30,0.9)] outline-none"
          >
            {/* The banner itself: how it lands, like a push notification. */}
            <div className="flex items-start gap-3 border-b border-white/[0.08] px-4 pb-4 pt-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#0d4a80] p-1.5 ring-1 ring-white/15">
                <img src={logoWhite} alt="" className="w-full" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center justify-between gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                  <span className="truncate">Employee Kick Off 2027</span>
                  <span className="shrink-0 font-medium normal-case tracking-normal">sekarang</span>
                </p>
                <h2
                  id="morning-notif-title"
                  className="mt-1 text-[1rem] font-bold leading-snug text-white"
                >
                  {n.title}
                </h2>
                <p className="mt-0.5 text-[0.875rem] leading-snug text-white/75">{n.body}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Tutup notifikasi"
                className="-mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-4 pb-5 pt-4 sm:px-5">
              <dl className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: Coffee, k: "Sarapan", ...n.breakfast },
                  { icon: Sparkles, k: "Ballroom dibuka", ...n.ballroom },
                ].map((f) => (
                  <div key={f.k} className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
                    <dt className="flex items-center gap-1.5 text-[0.75rem] text-white/65">
                      <f.icon className="size-3.5 text-cyan" />
                      {f.k}
                    </dt>
                    <dd className="mt-1 text-[1.125rem] font-bold tabular-nums text-white">
                      {f.time}
                    </dd>
                    <dd className="text-[0.75rem] text-white/60">{f.where}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky">
                Agenda hari ini
              </p>
              <ol className="mt-2 divide-y divide-white/[0.08]">
                {day.sessions.map((s) => (
                  <li key={s.id} className="flex gap-3 py-2">
                    <span className="w-11 shrink-0 text-[0.8125rem] font-semibold tabular-nums text-white">
                      {s.time}
                    </span>
                    <span className="text-[0.8125rem] leading-snug text-white/80">{s.title}</span>
                  </li>
                ))}
              </ol>

              <p className="mt-4 rounded-xl border border-dashed border-silver/35 px-3.5 py-3 text-[0.8125rem] leading-relaxed text-white/80">
                <span className="font-semibold text-white">Morning prompt:</span> {n.prompt}
              </p>

              <div className="mt-5 flex gap-2">
                <Link
                  to="/activities"
                  search={{ section: "day2" }}
                  onClick={close}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#eef1f4_55%,#cfd6dd_100%)] px-4 text-[0.875rem] font-bold text-[#0a2442]"
                >
                  Lihat agenda Day 2
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 px-5 text-[0.875rem] font-semibold text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
