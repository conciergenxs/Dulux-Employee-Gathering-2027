import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowUp,
  CalendarDays,
  Compass,
  House,
  MapPin,
  QrCode,
  RotateCcw,
  Shapes,
} from "lucide-react";
import { EVENT } from "@/lib/event";
import { useDemoMode } from "@/lib/demo";
import { PARTICIPANT, actions, initials, progressOf, useParticipant } from "@/lib/participant";
import logoColor from "@/assets/brand/dulux-logo-color.webp";
import logoWhite from "@/assets/brand/dulux-logo-white.webp";
import { RootedPalm, TileWall } from "@/components/kv/KickOffKv";

type NavTo = "/" | "/schedule" | "/activities" | "/guide";
const NAV: { to: NavTo; label: string; icon: typeof House }[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/activities", label: "Activities", icon: Shapes },
  { to: "/guide", label: "Practical Guide", icon: Compass },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteChrome() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onPassport = pathname.startsWith("/passport");
  return (
    <>
      <SiteHeader open={open} setOpen={setOpen} pathname={pathname} />
      <NavMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
      {onPassport && !open && <BackToTop />}
    </>
  );
}

function BackToTop() {
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setPast(v > 420));
  return (
    <AnimatePresence>
      {past && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 grid size-12 place-items-center rounded-full bg-white text-navy-900 shadow-[var(--shadow-lift)] active:scale-90"
        >
          <ArrowUp className="size-[1.15rem]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function SiteHeader({
  open,
  setOpen,
  pathname,
}: {
  open: boolean;
  setOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  pathname: string;
}) {
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  // A floating bar, inset from the screen edges, cut like the KV's window:
  // small radius top-left and bottom-right, large on the other two. Flat
  // glass, the same at every scroll position: #091C31 at 30% over the
  // design's background blur of 50 (Figma's blur value is twice CSS's, so
  // 25px here), a 1.5px white stroke, and no shadow. The stroke is drawn as
  // an inset ring: browsers round a 1.5px border down to 1px.

  return (
    // Sticky: always in reach, floating over whatever scrolls beneath it.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="pointer-events-auto mx-auto flex h-[3.75rem] w-full max-w-6xl items-center justify-between rounded-[0.5rem_1.5rem_0.5rem_1.5rem] bg-[#091C31]/30 pl-4 pr-1.5 ring-[1.5px] ring-inset ring-white backdrop-blur-[25px] sm:h-16 sm:rounded-[0.625rem_1.75rem_0.625rem_1.75rem] sm:pl-5 sm:pr-2">
        <Link
          to="/"
          className="flex items-center"
          aria-label="Dulux Employee Gathering 2027 — Home"
        >
          <img src={logoColor} alt="Dulux" className="h-[1.85rem] w-auto shrink-0 sm:h-9" />
        </Link>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-xl text-white transition-colors hover:bg-white/[0.08] active:scale-95"
          >
            <span className="relative block h-[15px] w-[22px]">
              <motion.span
                animate={open ? { rotate: 45, y: 6.25 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute left-0 top-0 block h-[2.5px] w-full rounded-full bg-current"
              />
              <motion.span
                animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-[6.25px] block h-[2.5px] w-full rounded-full bg-current"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -6.25 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute bottom-0 left-0 block h-[2.5px] w-full rounded-full bg-current"
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function NavMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="nav-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden overscroll-contain bg-navy-900"
        >
          {/* The menu opens onto the KV: the window's navy glowing down to
              cyan, a palm at each side, and the tile wall along the foot. */}
          <div
            className="relative isolate min-h-dvh"
            style={{ "--kv-cell": "clamp(4.5rem, 8vw, 7rem)" } as CSSProperties}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(60%_40%_at_30%_30%,rgba(56,160,255,0.28)_0%,rgba(56,160,255,0)_72%),linear-gradient(180deg,#081a2f_0%,#0a2340_25%,#0b3354_50%,#0e5f8f_78%,#1290c3_100%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-20 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_45%,rgba(0,0,0,0.4)_100%)]"
            >
              <RootedPalm className="right-[-9rem] top-[12%] w-[22rem] -scale-x-100 opacity-45 blur-[0.8px] lg:right-[-3rem] lg:w-[30rem]" />
            </div>
            <motion.div
              aria-hidden
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[clamp(7rem,17svh,10rem)] border-t-[3px] border-silver shadow-[0_-12px_30px_-10px_rgba(0,10,30,0.6)] lg:h-[min(20svh,10rem)]"
            >
              <TileWall className="absolute inset-0" />
            </motion.div>

            <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-[clamp(8.5rem,19svh,11rem)] pt-[6.5rem] sm:px-8 sm:pt-32 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 lg:pb-[min(34svh,25vw)] lg:pt-36 laptop-short:pt-28">
              <nav aria-label="Main">
                <ul className="space-y-1 sm:space-y-2">
                  {NAV.map((item, i) => {
                    const active = pathname === item.to;
                    return (
                      <motion.li
                        key={item.to}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: EASE }}
                      >
                        <Link
                          to={item.to}
                          onClick={onClose}
                          aria-current={active ? "page" : undefined}
                          className="group flex items-center gap-4 py-2.5 sm:gap-5 sm:py-3.5 laptop-short:py-2"
                        >
                          <span
                            className={`grid size-11 shrink-0 place-items-center rounded-2xl transition-colors duration-300 sm:size-14 laptop-short:size-12 ${
                              active
                                ? "bg-[image:var(--gradient-together)] text-navy-950"
                                : "border border-white/15 bg-white/[0.06] text-sky group-hover:border-cyan/50 group-hover:text-white"
                            }`}
                          >
                            <item.icon className="size-5 sm:size-6" strokeWidth={1.8} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`wordmark block pr-[0.06em] text-[clamp(1.625rem,7.4vw,3.5rem)] laptop-short:text-[2.5rem] transition-transform duration-500 ease-out group-hover:translate-x-1.5 ${
                                active ? "text-together" : "text-white"
                              }`}
                            >
                              {item.label}
                            </span>
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.55, ease: EASE }}
                className="lg:pt-2"
              >
                <MenuPass onClose={onClose} active={pathname.startsWith("/passport")} />
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8125rem] text-white/60 lg:block lg:space-y-1.5">
                  <p className="font-semibold text-white/85">{EVENT.datesLabel}</p>
                  <a
                    href={EVENT.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                  >
                    <MapPin className="size-3.5 text-cyan" />
                    {EVENT.venue}
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * The pass, as the menu's one card: whose it is, how far along the checklist
 * they are, and the way in. In demo mode (`?demo=1`) it also offers a way to
 * start over, since every interaction is saved on this device.
 */
function MenuPass({ onClose, active }: { onClose: () => void; active: boolean }) {
  const state = useParticipant();
  const progress = progressOf(state);
  const demo = useDemoMode();
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!confirming) return;
    const t = window.setTimeout(() => setConfirming(false), 3500);
    return () => window.clearTimeout(t);
  }, [confirming]);
  const pct = (progress.checklistDone / progress.checklistTotal) * 100;

  return (
    <div
      className={`rounded-[0.75rem_2.25rem_0.75rem_2.25rem] border-2 bg-[linear-gradient(180deg,rgba(7,26,51,0.72),rgba(7,26,51,0.5))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_60px_-30px_rgba(0,10,30,0.9)] backdrop-blur-md sm:p-6 ${
        active ? "border-silver" : "border-silver/60"
      }`}
    >
      <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky sm:text-[0.9375rem]">
        My Canvas Pass
      </p>
      <div className="mt-3.5 flex items-center gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[image:var(--gradient-together)] text-sm font-bold text-navy-950">
          {initials(PARTICIPANT.name)}
        </span>
        <span className="min-w-0">
          <span className="wordmark block truncate text-xl text-white">{PARTICIPANT.name}</span>
          <span className="mt-1 block truncate text-[0.8125rem] text-white/60">
            {PARTICIPANT.department} · {PARTICIPANT.passCode}
          </span>
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[0.75rem]">
          <span className="font-medium text-white/70">Pre-event checklist</span>
          <span className="font-semibold tabular-nums text-white">
            {progress.checklistDone}/{progress.checklistTotal}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[image:var(--gradient-together)] transition-[width] duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <Link
        to="/passport"
        onClick={onClose}
        aria-current={active ? "page" : undefined}
        className="mt-5 flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#eef1f4_55%,#cfd6dd_100%)] px-6 text-[0.9375rem] font-bold text-navy-900 shadow-[0_0_0_1px_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(110,125,140,0.35),0_10px_28px_-12px_rgba(80,190,255,0.85)] transition-transform duration-300 active:scale-[0.98]"
      >
        <QrCode className="size-5 shrink-0" strokeWidth={1.9} />
        Open My Canvas Pass
      </Link>

      {demo && (
        <button
          type="button"
          onClick={() => {
            if (confirming) {
              actions.reset();
              setConfirming(false);
            } else setConfirming(true);
          }}
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-full border border-dashed border-ice/40 text-xs font-semibold text-ice transition-colors hover:border-ice"
        >
          <RotateCcw className="size-3.5" />
          {confirming ? "Tap again to reset" : "Reset demo"}
        </button>
      )}
    </div>
  );
}

const FOOTER_LINKS: { to: NavTo | "/passport" | "/guide"; label: string }[] = [
  { to: "/schedule", label: "Schedule" },
  { to: "/activities", label: "Activities" },
  { to: "/guide", label: "Practical Guide" },
  { to: "/passport", label: "My Canvas Pass" },
];

export function SiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <footer
      className={`relative overflow-hidden border-t border-silver/20 bg-[linear-gradient(180deg,#0a3560_0%,#082b4f_80%)] px-5 pb-10 pt-14 sm:pt-16 ${
        pathname.startsWith("/passport") ? "pb-28" : ""
      }`}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3.5" aria-label="Greater Together home">
            <img src={logoWhite} alt="Dulux" width={300} height={144} className="h-10 w-auto" />
            <span className="font-[family-name:var(--font-kv-condensed)] text-[1rem] uppercase leading-[1.05] text-white">
              {EVENT.kvLockup.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
            <span className="h-9 w-px bg-white/20" aria-hidden />
            <span className="kv-heading kv-silver text-[1rem] leading-[1.05]">
              <span className="block">Greater</span>
              <span className="block">Together</span>
            </span>
          </Link>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:justify-end">
              {FOOTER_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          aria-hidden
          className="mt-10 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.18)_20%,rgba(255,255,255,0.18)_80%,rgba(255,255,255,0)_100%)]"
        />

        <div className="mt-6 flex flex-col gap-2 text-[0.8125rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {EVENT.datesLabel} · {EVENT.venue}
          </p>
          <p className="font-medium text-white/60">{EVENT.statement}</p>
        </div>
      </div>
    </footer>
  );
}
