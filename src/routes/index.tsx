import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, Check, MessageCircleQuestion, QrCode } from "lucide-react";
import { useCountdown } from "@/components/site/Countdown";
import { Reveal } from "@/components/site/Reveal";
import { KV_BOTTOM_RIGHT, Mosaic, TopSweep, type Tile } from "@/components/canvas/Canvas";
import { Badge } from "@/components/activities/Badges";
import { RuledEyebrow } from "@/components/site/RuledEyebrow";
import {
  EVENT,
  MANIFESTO,
  PHASES,
  countdownMessage,
  currentPhase,
  type PhaseId,
} from "@/lib/event";
import { progressOf, useParticipant } from "@/lib/participant";
import {
  ChromeDefs,
  ChromeLine,
  KvEyebrow,
  PalmGrove,
  RootedPalm,
  Sparkle,
  TileCluster,
  TileWall,
  type ClusterTile,
} from "@/components/kv/KickOffKv";
import logoWhite from "@/assets/brand/dulux-logo-white.webp";
import journey1 from "@/assets/the-journey/journey-1.webp";
import journey1Lg from "@/assets/the-journey/journey-1@1.5x.webp";
import journey2 from "@/assets/the-journey/journey-2.webp";
import journey2Lg from "@/assets/the-journey/journey-2@1.5x.webp";
import journey3 from "@/assets/the-journey/journey-3.webp";
import journey3Lg from "@/assets/the-journey/journey-3@1.5x.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: `${EVENT.theme} — ${EVENT.name}` }],
  }),
  component: HomePage,
});

const EASE = [0.22, 1, 0.36, 1] as const;

/** Decided after mount so the server and the first client render agree. */
function usePhase(): PhaseId {
  const [phase, setPhase] = useState<PhaseId>("pre");
  useEffect(() => setPhase(currentPhase()), []);
  return phase;
}

/** Hidden for now at the client's request; flip to bring them back. */
const SHOW_PRE_EVENT_SECTIONS = false;

function HomePage() {
  return (
    <>
      {/* The hero and the journey share one surface: the KV wall belongs to
          the hero but runs on past its foot and dissolves into the journey's
          denim, so there is no line where one section ends. */}
      <div className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#0d4a80_0%,#0d4a80_40%,#0b3c6b_100%)]">
        <Hero />
        <Journey />
      </div>
      {SHOW_PRE_EVENT_SECTIONS && (
        <>
          <RoadToEvent />
          <Manifesto />
        </>
      )}
    </>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────── */

/**
 * The Employee Kick Off 2027 KV, live: the tile-and-silver frame fills the
 * screen, and the rounded window inside it carries the lockup and the chrome
 * wordmark. The KV's translucent foot band becomes the action tray, so the
 * countdown and the pass sit where the artwork already leaves room.
 */
function Hero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col px-[1.125rem] pb-5 pt-[5.5rem] sm:px-6 sm:pb-7 sm:pt-[6.25rem] lg:px-[clamp(2.5rem,7.5vw,9rem)] lg:pb-[clamp(1.75rem,5svh,3.25rem)] lg:pt-[clamp(5.75rem,12svh,7.25rem)]"
      style={{ "--kv-cell": "clamp(5.25rem, 9.6vw, 9.5rem)" } as CSSProperties}
    >
      <ChromeDefs />
      {/* The wall runs 9rem past the hero's foot and fades out over its last
          13rem, into the journey's denim. */}
      <TileWall className="absolute inset-x-0 -bottom-36 top-0 -z-20 [mask-image:linear-gradient(to_bottom,#000_calc(100%-13rem),transparent_100%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="relative flex flex-1 flex-col overflow-hidden rounded-[0.75rem_3rem_0.75rem_3rem] border-[3px] border-[#dfe6ec] shadow-[0_0_0_1px_rgba(8,18,36,0.7),0_0_30px_rgba(150,215,255,0.35),0_30px_80px_-30px_rgba(0,8,30,0.9)] sm:rounded-[1rem_5rem_1rem_5rem] lg:rounded-[1.25rem_7.5rem_1.25rem_7.5rem]"
      >
        {/* The window: deep navy at the top, glowing down to cyan, with a
            pool of light behind the wordmark and palms in silhouette. */}
        <div className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-5 pb-7 pt-7 text-center shadow-[inset_0_0_22px_rgba(160,220,255,0.3)] sm:px-8 sm:pb-10 sm:pt-12 lg:pb-[clamp(1.5rem,4svh,3rem)] lg:pt-[clamp(1.75rem,5svh,3.5rem)]">
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-[radial-gradient(46%_30%_at_50%_56%,rgba(56,160,255,0.5)_0%,rgba(56,160,255,0)_72%),linear-gradient(180deg,#081a2f_0%,#0a2340_26%,#0b3354_46%,#0e5f8f_68%,#1290c3_88%,#17a3d3_100%)]"
          />
          <div aria-hidden className="absolute inset-0 -z-10">
            <PalmGrove />
          </div>

          {/* Below a laptop the window is tall and its height varies a lot
              from phone to phone, so the gaps are spacers that share out the
              room (within limits) instead of fixed margins: no dead band
              above the lockup or under the countdown on a tall phone, and
              still one screen on a small one. */}
          <div aria-hidden className="grow lg:hidden" />
          {/* 1 · Lockup */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3 sm:gap-5"
          >
            <img
              src={logoWhite}
              alt="Dulux"
              width={300}
              height={144}
              className="h-[clamp(2.6rem,6svh,3.25rem)] w-auto sm:h-[3.4rem] lg:h-[clamp(2.75rem,7svh,4.25rem)]"
            />
            <p className="text-left font-[family-name:var(--font-kv-condensed)] text-[clamp(1.125rem,2.7svh,1.375rem)] uppercase leading-[1.04] tracking-[0.01em] text-white sm:text-[1.45rem] lg:text-[clamp(1.25rem,3.3svh,1.95rem)]">
              {EVENT.kvLockup.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </motion.div>

          {/* 2 · The wordmark */}
          <div aria-hidden className="max-h-[4.25rem] min-h-[1.5rem] grow basis-6 lg:hidden" />
          <h1 className="text-[clamp(2.5rem,min(13.4vw,13svh),9.5rem)] leading-none lg:mt-[clamp(1.25rem,4.5svh,2.75rem)]">
            <span className="sr-only">Greater Together</span>
            {["Greater", "Together"].map((word, i) => (
              <motion.span
                key={word}
                aria-hidden
                className={`block ${i === 1 ? "mt-[0.04em]" : ""}`}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.14, ease: EASE }}
              >
                <span className="relative inline-block">
                  <ChromeLine text={word} />
                  {i === 0 ? (
                    <Sparkle className="pointer-events-none absolute left-[58%] top-[-0.24em] size-[0.55em]" />
                  ) : (
                    <Sparkle
                      className="pointer-events-none absolute bottom-[0.02em] left-[83%] size-[0.32em]"
                      style={{ animationDelay: "1.4s" }}
                    />
                  )}
                </span>
              </motion.span>
            ))}
          </h1>

          <div aria-hidden className="max-h-[3.25rem] min-h-[1.5rem] grow basis-6 lg:hidden" />
          <motion.dl
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-col items-center gap-1 text-[clamp(1.0625rem,5vw,1.25rem)] font-semibold leading-snug tracking-[-0.005em] text-white drop-shadow-[0_2px_10px_rgba(0,20,50,0.5)] sm:flex-row sm:gap-0 sm:text-[1.25rem] lg:mt-[clamp(1.25rem,3.4svh,2rem)] lg:text-[clamp(1.125rem,2.6svh,1.375rem)]"
          >
            <div>
              <dt className="sr-only">When</dt>
              <dd>{EVENT.datesLabel}</dd>
            </div>
            <div className="flex items-center sm:before:mx-4 sm:before:size-1.5 sm:before:rounded-full sm:before:bg-white/70 sm:before:content-['']">
              <dt className="sr-only">Where</dt>
              <dd>{EVENT.venue}</dd>
            </div>
          </motion.dl>

          <div aria-hidden className="max-h-[4.75rem] min-h-[1.75rem] grow basis-7 lg:hidden" />
          {/* On a phone or tablet there is no tray: the countdown and the
              pass follow the details inside the window. On a laptop they move
              down into the tray, side by side. */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="w-full max-w-[24rem] sm:max-w-[28rem] lg:hidden"
          >
            <HeroCountdown />
            {/* The pass sits right under the countdown, the same width as
                it: one action group, set apart from the details above by the
                larger gap. */}
            <PassButton className="mt-4 flex w-full sm:mt-5" />
          </motion.div>
          <div aria-hidden className="grow lg:hidden" />
        </div>

        {/* 3 · The tray (laptop only): the KV's glass band, with the frame
            showing through, holding the countdown and the pass side by side. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="relative hidden border-t-2 border-[#06182c]/70 bg-[rgba(10,72,122,0.74)] px-6 backdrop-blur-[6px] lg:block lg:py-[clamp(1rem,2.6svh,1.5rem)]"
        >
          <div className="mx-auto flex w-full max-w-[42rem] flex-row items-center gap-5">
            <div className="flex-1">
              <HeroCountdown />
            </div>
            <PassButton />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/** The one action in the hero. Sized as a button, not a banner. */
function PassButton({ className = "inline-flex" }: { className?: string }) {
  return (
    <Link
      to="/passport"
      className={`${className} h-[3.25rem] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#eef1f4_55%,#cfd6dd_100%)] px-6 text-[0.9375rem] font-bold tracking-[-0.005em] text-[#0a2442] shadow-[0_0_0_1px_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(110,125,140,0.35),0_10px_28px_-12px_rgba(80,190,255,0.85)] transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.9),inset_0_-2px_0_rgba(110,125,140,0.35),0_14px_34px_-10px_rgba(80,190,255,1)] active:scale-[0.98] lg:h-11`}
    >
      <QrCode className="size-[1.125rem] shrink-0" strokeWidth={2} />
      Open My Canvas Pass
    </Link>
  );
}

/** Road to the event: one dark glass card. */
function HeroCountdown() {
  const t = useCountdown();
  const units: [string, number | null][] = [
    ["Days", t?.days ?? null],
    ["Hours", t?.hours ?? null],
    ["Minutes", t?.minutes ?? null],
    ["Seconds", t?.seconds ?? null],
  ];
  return (
    <div
      role="timer"
      aria-label={t ? `${t.days} days, ${t.hours} hours, ${t.minutes} minutes to go` : "Countdown"}
      className="w-full rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(5,24,48,0.82),rgba(5,24,48,0.66))] px-3 py-[clamp(1rem,2.6svh,1.375rem)] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_14px_40px_-22px_rgba(0,10,30,0.9)] sm:px-5 lg:py-2.5"
    >
      <div aria-hidden className="flex items-stretch">
        {units.map(([label, value], i) => (
          <div key={label} className="flex flex-1 items-center">
            {i > 0 && <span className="h-8 w-px bg-white/20" />}
            <div className="flex-1">
              <div className="text-[clamp(1.75rem,8.8vw,2.375rem)] font-bold leading-none tabular-nums lg:text-[2.125rem] tracking-tight text-white">
                {value === null ? "--" : String(value).padStart(2, "0")}
              </div>
              <div className="mt-1.5 text-[0.75rem] text-white/75 sm:text-xs lg:mt-1">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Before you arrive ────────────────────────────────────────────── */

function RoadToEvent() {
  const t = useCountdown();
  const phase = usePhase();
  const msg = t ? countdownMessage(t.days, phase) : null;
  const state = useParticipant();
  const progress = progressOf(state);

  return (
    <section className="relative px-5 py-16 sm:py-24" aria-labelledby="road-title">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="eyebrow" id="road-title">
              Before you arrive · Day 1 is Wed, 16 December 2026
            </p>
            <p className="t-display mt-4 min-h-[1em] max-w-[14ch] text-white">
              {msg?.title ?? " "}
            </p>
            {msg?.sub && <p className="t-lead mt-4 max-w-md text-muted-foreground">{msg.sub}</p>}
          </Reveal>

          {/* What to do before then: the pre-event checklist, at a glance. */}
          <Reveal delay={0.1}>
            <div className="surface p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="t-micro text-sky">Your pre-event checklist</p>
                <span className="t-micro tabular-nums text-muted-foreground">
                  {progress.checklistDone}/{progress.checklistTotal} done
                </span>
              </div>
              <ul className="mt-4 divide-y divide-border">
                <ChecklistLink
                  done={Boolean(state.firstStroke)}
                  title="The First Stroke"
                  note="Pilih kekuatan yang kamu bawa"
                  badge="Mandatory"
                  hash="first-stroke"
                />
                <ChecklistLink
                  done={state.questions.length > 0}
                  title="Change Talk Question Box"
                  note="Tanyakan arah kita di 2027, tanpa menyebut nama"
                  badge="Optional"
                  hash="question-box"
                  icon
                />
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ChecklistLink({
  done,
  title,
  note,
  badge,
  hash,
  icon = false,
}: {
  done: boolean;
  title: string;
  note: string;
  badge: "Mandatory" | "Optional";
  hash: string;
  icon?: boolean;
}) {
  return (
    <li>
      <Link
        to="/activities"
        search={{ section: "before" }}
        hash={hash}
        className="group flex items-center gap-3.5 py-3.5"
      >
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full ${
            done
              ? "bg-[image:var(--gradient-together)] text-navy-950"
              : "border-2 border-dashed border-white/25 text-white/50"
          }`}
        >
          {done ? (
            <Check className="size-4" strokeWidth={3} />
          ) : icon ? (
            <MessageCircleQuestion className="size-4" />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-white">{title}</span>
            <Badge tone={done ? "done" : badge === "Mandatory" ? "mandatory" : "optional"}>
              {done ? "Done" : badge}
            </Badge>
          </span>
          <span className="t-small block text-muted-foreground">{note}</span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-cyan" />
      </Link>
    </li>
  );
}

/* ── Manifesto ────────────────────────────────────────────────────── */

function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-[image:var(--gradient-royal)] px-5 py-16 sm:py-24">
      <Mosaic
        tiles={KV_BOTTOM_RIGHT}
        cols={4}
        rows={4}
        className="pointer-events-none absolute -right-16 top-1/2 w-64 -translate-y-1/2 opacity-30 sm:w-96 lg:opacity-60"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow text-ice">{EVENT.concept} · The creative manifesto</p>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="t-display mt-5 max-w-[16ch] text-white">
            {MANIFESTO.lines[0]} {MANIFESTO.lines[1]}{" "}
            <span className="text-together">{MANIFESTO.lines[2]}</span>
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="t-lead mt-6 max-w-xl text-white/85">{MANIFESTO.body}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Journey phases ───────────────────────────────────────────────── */

/**
 * Each phase is a small KV panel: the window's navy-to-denim glow behind a
 * silver stroke, with the same corner of the KV's tiles in the top right of
 * every card, so the three read as one set.
 */
const PHASE_CORNER: { cols: number; rows: number; tiles: ClusterTile[] } = {
  cols: 3,
  rows: 3,
  tiles: [
    { x: 0, y: 0, kind: "rings", anchor: "br" },
    { x: 1, y: 0, kind: "inset" },
    { x: 2, y: 0, kind: "silver" },
    { x: 1, y: 1, kind: "arch", anchor: "r" },
    { x: 2, y: 1, kind: "rings", anchor: "bl" },
    { x: 2, y: 2, kind: "inset" },
  ],
};

/** One photo per phase: painting your piece, fitting the pieces, sharing what's next. */
const PHASE_PHOTO: Record<
  PhaseId,
  { src: string; lg: string; alt: string; pos: string; zoom?: string }
> = {
  pre: {
    src: journey1,
    lg: journey1Lg,
    alt: "Employees painting blue strokes on a shared canvas",
    pos: "45% 30%",
  },
  on: {
    src: journey2,
    lg: journey2Lg,
    alt: "Four hands fitting blue puzzle pieces together",
    pos: "50% 45%",
  },
  post: {
    src: journey3,
    lg: journey3Lg,
    alt: "Colleagues laughing together in front of a painted canvas",
    pos: "50% 35%",
    // Zoomed in and nudged right so the man in the centre leads and the tile
    // corner sits on the painted canvas, not on a face.
    zoom: "scale(1.3) translateX(9%)",
  },
};

function PhasePhoto({ id }: { id: PhaseId }) {
  const photo = PHASE_PHOTO[id];
  return (
    // The photo fills the top of the card and fades into the card's blue
    // (masked, not overlaid), so there is no edge where image meets fill.
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[22rem] [mask-image:linear-gradient(to_bottom,#000_0%,#000_42%,transparent_90%)] sm:h-[24rem]">
      <div className="h-full w-full" style={photo.zoom ? { transform: photo.zoom } : undefined}>
        <img
          src={photo.src}
          srcSet={`${photo.src} 640w, ${photo.lg} 1000w`}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 480px, 92vw"
          alt={photo.alt}
          width={640}
          height={640}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{ objectPosition: photo.pos }}
        />
      </div>
      {/* KV tint: the window's deep navy at the top for the numeral, denim
          lower down so the photo hands over to the card's fill. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,26,47,0.62)_0%,rgba(8,26,47,0.14)_38%,rgba(12,58,100,0.4)_100%)]"
      />
    </div>
  );
}

const PHASE_TITLE_LINES: Record<PhaseId, [string, string]> = {
  pre: ["Discover", "Your Piece"],
  on: ["Connect", "The Pieces"],
  post: ["Carry the", "Picture Forward"],
};

function PhaseCorner() {
  const { cols, rows, tiles } = PHASE_CORNER;
  return (
    <div aria-hidden className="pointer-events-none absolute right-0 top-0">
      <TileCluster tiles={tiles} cols={cols} rows={rows} />
    </div>
  );
}

function Journey() {
  return (
    <section
      className="relative isolate px-5 pb-20 pt-20 sm:pb-28 sm:pt-28"
      aria-labelledby="journey-title"
    >
      {/* No background of its own: it sits on the surface it shares with the
          hero, with a soft light behind the heading and one palm on each
          side, rooted at the foot of the section and fading as it goes down
          (never to nothing, so it stands rather than floats). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0rem,#000_9rem,#000_45%,rgba(0,0,0,0.45)_100%)]"
      >
        <div className="absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(45%_50%_at_50%_30%,rgba(56,160,255,0.22)_0%,rgba(56,160,255,0)_75%)]" />
        <RootedPalm className="left-[-12.5rem] top-[3rem] w-[24rem] opacity-30 sm:left-[-15rem] sm:w-[30rem] lg:left-[calc(50%-54rem)] lg:top-[4rem] lg:w-[30rem] lg:opacity-25" />
        <RootedPalm className="right-[-12.5rem] top-[12rem] w-[24rem] -scale-x-100 opacity-30 sm:right-[-15rem] sm:top-[9rem] sm:w-[30rem] lg:right-[calc(50%-54rem)] lg:top-[10rem] lg:w-[30rem] lg:opacity-25" />
      </div>
      <div className="mx-auto max-w-6xl">
        {/* Header: the hero's voice, centred. */}
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <KvEyebrow>The Event Journey</KvEyebrow>
          <h2
            id="journey-title"
            className="kv-heading mt-5 text-[clamp(1.5rem,7.4vw,3.5rem)] leading-[1.02] text-white sm:mt-6"
          >
            <span className="block">Three days.</span>
            <span className="block">One bigger picture</span>
            <span className="block">in the making.</span>
          </h2>
          <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-white/75 sm:mt-6 sm:text-base">
            Setiap karyawan membawa kepingannya sendiri. Setiap interaksi menciptakan koneksi.
            Setiap komitmen membuat gambaran besar ini semakin utuh.
          </p>
        </Reveal>

        {/* Three KV panels, one per phase. */}
        <ol className="mx-auto mt-12 grid max-w-[30rem] gap-5 sm:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-6">
          {PHASES.map((p, i) => {
            return (
              <Reveal as="li" key={p.id} delay={0.08 + i * 0.08} className="h-full">
                <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-[0.75rem_2.75rem_0.75rem_2.75rem] border-[2.5px] border-[#dfe6ec] bg-[linear-gradient(180deg,#0a1d36_0%,#0b2b4f_50%,#0d4a7c_100%)] p-6 shadow-[0_0_0_1px_rgba(8,18,36,0.7),0_0_24px_rgba(150,215,255,0.22),0_30px_60px_-30px_rgba(0,8,30,0.9)] transition-transform duration-500 [--tile:3.25rem] hover:-translate-y-1 sm:p-7 sm:[--tile:3.5rem] lg:[--tile:clamp(3rem,3.8vw,3.5rem)]">
                  <PhasePhoto id={p.id} />
                  <PhaseCorner />
                  {/* A soft fade at the foot keeps the text crisp over the field. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-[#0a2a4a]/80 to-transparent"
                  />

                  {/* Same height on every card (room for the photo, and taller than
                      the largest corner), so the titles line up across the row. */}
                  <div className="flex min-h-[15rem] flex-col items-start gap-3 sm:min-h-[16.5rem]">
                    <span className="text-[2.75rem] sm:text-[3.25rem]" aria-hidden>
                      <ChromeLine text={`0${i + 1}`} rim={false} />
                    </span>
                  </div>

                  <div className="@container flex flex-1 flex-col">
                    <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.2em] text-[#9fd8f5]">
                      {p.stage}
                    </p>
                    {/* Always two lines, set by hand. The size follows the card's
                        width so the longest line ("Picture Forward") still fits. */}
                    <h3 className="kv-heading mt-2.5 text-[min(1.875rem,var(--title-fit))] leading-[1.04] text-white [--title-fit:8.6cqi]">
                      <span className="sr-only">{p.title}</span>
                      {PHASE_TITLE_LINES[p.id].map((line) => (
                        <span key={line} aria-hidden className="block whitespace-nowrap">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <p className="mt-3 text-sm font-semibold text-[#9fd8f5]">{p.arc}</p>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/80">{p.text}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
