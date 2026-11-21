import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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
import heroPatternTop from "@/assets/pattern/hero-top.webp";
import heroWave from "@/assets/pattern/hero-wave.webp";
import heroWave2x from "@/assets/pattern/hero-wave@1.5x.webp";
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
      <Hero />
      {SHOW_PRE_EVENT_SECTIONS && (
        <>
          <RoadToEvent />
          <Manifesto />
        </>
      )}
      <Journey />
    </>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* The KV field: royal blue lit from the centre, deepening to navy at
          the edges and at the foot, where it hands over to the page. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(60%_42%_at_0%_0%,rgba(2,16,88,0.9)_0%,rgba(2,16,88,0)_75%),radial-gradient(65%_42%_at_55%_36%,#1a52e6_0%,rgba(26,82,230,0)_72%),radial-gradient(40%_26%_at_0%_92%,rgba(31,123,255,0.22)_0%,rgba(31,123,255,0)_70%),radial-gradient(45%_30%_at_100%_46%,rgba(31,123,255,0.3)_0%,rgba(31,123,255,0)_70%),linear-gradient(180deg,#02186e_0%,#0629a8_40%,#041f8c_62%,#021668_82%,#01145f_100%)]"
      />
      <TopSweep className="absolute -right-6 top-0 -z-10 w-[19rem] sm:w-[30rem] lg:w-[40rem]" />
      {/* The KV's top-left corner (supplied artwork), kept to KV scale: about a
          quarter of the width on a laptop, fading out early on a phone. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: -24, y: -12 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute left-0 top-0 -z-10 w-[14.5rem] [mask-image:linear-gradient(to_bottom,#000_40%,transparent_70%)] sm:w-[19rem] sm:[mask-image:linear-gradient(to_bottom,#000_55%,transparent_90%)] lg:w-[clamp(17rem,23vw,27rem)] lg:[mask-image:none]"
      >
        <img
          src={heroPatternTop}
          alt=""
          width={1280}
          height={1180}
          decoding="async"
          fetchPriority="high"
          className="block h-auto w-full select-none"
          draggable={false}
        />
      </motion.div>
      {/* The KV's wave and bottom-right corner (supplied artwork, widened to 4:1
          with the tiles left at their own proportions). On a laptop it spans the
          full width at a quarter of the width in height, never cropped, so the whole hero
          fits one screen; on a phone it keeps a short band and crops from the
          left, so the crest and the tiles stay in view. */}
      <motion.img
        src={heroWave}
        srcSet={`${heroWave} 2898w, ${heroWave2x} 4348w`}
        sizes="(min-width: 1024px) 100vw, 900px"
        alt=""
        aria-hidden
        width={2898}
        height={724}
        decoding="async"
        draggable={false}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[clamp(8.5rem,22svh,12rem)] w-full select-none object-cover object-[100%_100%] sm:h-[clamp(11rem,23svh,15rem)] lg:h-auto"
      />
      {/* Hand-over to the next section: the wave settles into one deep royal
          (#06238f) at the very foot of the hero, the colour the next section
          starts from, so there is no edge between them. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[clamp(4.5rem,9vw,8rem)] bg-[linear-gradient(to_top,#06238f_0%,rgba(6,35,143,0.75)_35%,rgba(6,35,143,0)_100%)]"
      />

      {/* Centred on the screen itself (equal padding top and bottom), so the
          block sits where the eye expects it; the wave may pass behind its
          foot. One spacing scale, four steps: tight within the identity, a
          breath before the line, close for the details, clearly apart for the
          action. Gaps follow the screen height so short screens tighten
          instead of scrolling. */}
      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-[5.5rem] text-center sm:py-24 lg:py-24">
        {/* 1 · Identity */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="-mx-2 flex w-[calc(100%+1rem)] items-center justify-center gap-2.5 text-[clamp(0.5625rem,2.75vw,0.6875rem)] font-semibold uppercase tracking-[0.22em] text-white/85 min-[400px]:tracking-[0.28em] sm:mx-0 sm:w-full sm:gap-5 sm:text-[0.8125rem] sm:tracking-[0.36em]"
        >
          {/* KV rules: a hairline that fades in from the outside edge. */}
          <span
            aria-hidden
            className="h-px min-w-5 max-w-14 flex-1 bg-gradient-to-r from-white/0 via-white/35 to-white/70 sm:max-w-24"
          />
          {/* The leading pad matches the tracking left after the last letter,
              so the text sits optically centred between the rules. */}
          <span className="shrink-0 whitespace-nowrap pl-[0.22em] min-[400px]:pl-[0.28em] sm:pl-[0.36em]">
            {EVENT.name}
          </span>
          <span
            aria-hidden
            className="h-px min-w-5 max-w-14 flex-1 bg-gradient-to-l from-white/0 via-white/35 to-white/70 sm:max-w-24"
          />
        </motion.p>

        <h1 className="wordmark mt-[clamp(1rem,2.4svh,1.25rem)] text-[clamp(3rem,min(15.5vw,12.5svh),7.25rem)] drop-shadow-[0_8px_30px_rgba(0,10,80,0.45)] sm:mt-6 lg:mt-[clamp(1.25rem,3svh,1.75rem)]">
          <span className="sr-only">Greater Together</span>
          {["Greater", "Together"].map((word, i) => (
            <motion.span
              key={word}
              aria-hidden
              className={`block pr-[0.06em] ${i === 1 ? "text-together" : "text-white"}`}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.14, ease: EASE }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-[clamp(1.25rem,2.8svh,1.5rem)] text-balance text-[clamp(0.875rem,4.4vw,1.375rem)] font-medium leading-snug tracking-[-0.01em] text-white sm:mt-7 lg:mt-[clamp(1.5rem,3.4svh,2rem)]"
        >
          {EVENT.statement}
        </motion.p>

        {/* 2 · Details: quieter than the line above, set close to it. */}
        <motion.dl
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-3 flex flex-col items-center gap-0.5 text-[0.875rem] leading-normal text-white/70 sm:mt-3.5 sm:flex-row sm:gap-0 sm:text-[0.9375rem] lg:mt-[clamp(0.75rem,1.6svh,1rem)]"
        >
          <div>
            <dt className="sr-only">When</dt>
            <dd className="font-semibold text-white/90">{EVENT.datesLabel}</dd>
          </div>
          <div className="flex items-center sm:before:mx-3.5 sm:before:size-1 sm:before:rounded-full sm:before:bg-white/40 sm:before:content-['']">
            <dt className="sr-only">Where</dt>
            <dd>{EVENT.venue}</dd>
          </div>
        </motion.dl>

        {/* 3 · Action: countdown and pass share one width. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72 }}
          className="mt-[clamp(2rem,4.8svh,2.5rem)] w-full max-w-[24rem] sm:mt-12 sm:max-w-[28rem] lg:mt-[clamp(2rem,6svh,3.5rem)] laptop-shorter:flex laptop-shorter:max-w-[42rem] laptop-shorter:items-stretch laptop-shorter:gap-5"
        >
          <HeroCountdown />
          <Link
            to="/passport"
            className="mt-5 flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[linear-gradient(100deg,#ffffff_0%,#eef2ff_50%,#cbd8ff_100%)] px-6 text-[1rem] font-bold tracking-[-0.005em] text-navy-900 shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_12px_40px_-14px_rgba(110,165,255,0.9)] transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.8),0_16px_48px_-12px_rgba(110,165,255,1)] active:scale-[0.98] sm:mt-6 sm:min-h-14 sm:text-[1.0625rem] laptop-shorter:mt-0 laptop-shorter:w-auto laptop-shorter:shrink-0 laptop-shorter:px-8"
          >
            <QrCode className="size-5 shrink-0" strokeWidth={1.9} />
            Open My Canvas Pass
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/** Road to the event, inside the hero: one quiet glass card. */
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
      className="rounded-3xl border border-white/15 laptop-shorter:flex-1 laptop-shorter:py-3 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] px-3 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_18px_50px_-24px_rgba(20,80,255,0.8)] backdrop-blur-md sm:px-5 sm:py-4"
    >
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-white/70 sm:text-[0.6875rem] laptop-short:hidden">
        Road to {EVENT.theme}
      </p>
      <div aria-hidden className="mt-2.5 flex items-stretch laptop-short:mt-0">
        {units.map(([label, value], i) => (
          <div key={label} className="flex flex-1 items-center">
            {i > 0 && <span className="h-8 w-px bg-white/20" />}
            <div className="flex-1">
              <div className="text-[clamp(1.625rem,7.8vw,2.25rem)] font-bold leading-none tabular-nums tracking-tight text-white">
                {value === null ? "--" : String(value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[0.6875rem] text-white/70 sm:text-xs">{label}</div>
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
 * Each phase is a small KV poster: a lit royal field with a corner of tiles
 * in the top right. The corner grows from phase to phase (3, 6, then 9
 * pieces) — the bigger picture coming together as the journey goes on.
 * Curved pieces face outward along the diagonal, as in the KV corners.
 */
const PHASE_CORNER: Record<PhaseId, { size: number; tiles: Tile[] }> = {
  // One piece placed: a disc on its tile, with two neighbours.
  pre: {
    size: 2,
    tiles: [
      { x: 0, y: 0, shape: "half", tone: "sky", rot: 180 },
      { x: 1, y: 0, shape: "circle", tone: "ice" },
      { x: 1, y: 1, shape: "drop", tone: "electric", rot: 90 },
    ],
  },
  // Pieces meeting: arch, leaf and disc locking together.
  on: {
    size: 3,
    tiles: [
      { x: 0, y: 0, shape: "arch", tone: "sky", rot: 180 },
      { x: 1, y: 0, shape: "square", tone: "royal" },
      { x: 2, y: 0, shape: "leaf", tone: "ice", rot: 90 },
      { x: 1, y: 1, shape: "circle", tone: "cyan" },
      { x: 2, y: 1, shape: "quarter", tone: "electric", rot: 270 },
      { x: 2, y: 2, shape: "half", tone: "sky", rot: 90 },
    ],
  },
  // The picture complete: every shape of the KV, in one corner.
  post: {
    size: 4,
    tiles: [
      { x: 0, y: 0, shape: "quarter", tone: "sky", rot: 180 },
      { x: 1, y: 0, shape: "drop", tone: "royal" },
      { x: 2, y: 0, shape: "arch", tone: "ice", rot: 180 },
      { x: 3, y: 0, shape: "square", tone: "electric" },
      { x: 2, y: 1, shape: "circle", tone: "deep" },
      { x: 3, y: 1, shape: "quarter", tone: "ice", rot: 270 },
      { x: 2, y: 2, shape: "half", tone: "electric", rot: 180 },
      { x: 3, y: 2, shape: "leaf", tone: "sky", rot: 90 },
      { x: 3, y: 3, shape: "arch", tone: "royal", rot: 180 },
    ],
  },
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
      {/* KV tint: deep navy at the top for the numeral, royal blue lower down
          so the photo hands over to the card's fill in the same colour. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,14,74,0.6)_0%,rgba(1,14,74,0.12)_38%,rgba(8,46,190,0.32)_100%)]"
      />
    </div>
  );
}

const PHASE_TITLE_LINES: Record<PhaseId, [string, string]> = {
  pre: ["Discover", "Your Piece"],
  on: ["Connect", "The Pieces"],
  post: ["Carry the", "Picture Forward"],
};

function PhaseCorner({ id }: { id: PhaseId }) {
  const { size, tiles } = PHASE_CORNER[id];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-0 top-0"
      style={{ width: `calc(${size} * var(--tile))` }}
    >
      <Mosaic tiles={tiles} cols={size} rows={size} className="block h-auto w-full" />
    </div>
  );
}

function Journey() {
  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,#06238f_0rem,#041c7c_8rem,#02186c_17rem,var(--navy-900)_26rem)] px-5 pb-20 pt-16 sm:pb-28 sm:pt-24"
      aria-labelledby="journey-title"
    >
      {/* Starts on exactly the hero's foot colour (#06238f) and eases down to
          the page navy, so hero and journey read as one surface. */}
      <div className="mx-auto max-w-6xl">
        {/* Header: the hero's voice, centred. */}
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RuledEyebrow>The Event Journey</RuledEyebrow>
          <h2
            id="journey-title"
            className="wordmark mt-5 text-[clamp(1.625rem,8.2vw,4rem)] text-white sm:mt-6"
          >
            <span className="block">Three days.</span>
            <span className="block text-together">One bigger picture</span>
            <span className="block">in the making.</span>
          </h2>
          <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-white/70 sm:mt-6 sm:text-base">
            Setiap karyawan membawa kepingannya sendiri. Setiap interaksi menciptakan koneksi.
            Setiap komitmen membuat gambaran besar ini semakin utuh.
          </p>
        </Reveal>

        {/* Three KV posters, one per phase. */}
        <ol className="mx-auto mt-12 grid max-w-[30rem] gap-4 sm:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-5">
          {PHASES.map((p, i) => {
            return (
              <Reveal as="li" key={p.id} delay={0.08 + i * 0.08} className="h-full">
                <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,#0a35c8_0%,#0628a8_45%,#031a78_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_30px_60px_-30px_rgba(0,8,60,0.9)] transition-transform duration-500 [--tile:3.25rem] hover:-translate-y-1 sm:p-7 sm:[--tile:3.5rem] lg:[--tile:clamp(3rem,3.8vw,3.5rem)] ring-1 ring-ice/50">
                  <PhasePhoto id={p.id} />
                  <PhaseCorner id={p.id} />
                  {/* A soft fade at the foot keeps the text crisp over the field. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-[#021668]/80 to-transparent"
                  />

                  {/* Same height on every card (room for the photo, and taller than
                      the largest corner), so the titles line up across the row. */}
                  <div className="flex min-h-[15rem] flex-col items-start gap-3 sm:min-h-[16.5rem]">
                    <span className="wordmark text-together pr-[0.08em] text-[2.75rem] leading-none drop-shadow-[0_2px_12px_rgba(0,10,70,0.45)] sm:text-5xl">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="@container flex flex-1 flex-col">
                    <div className="flex min-h-6 flex-wrap items-center gap-x-3 gap-y-2">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-ice/80">
                        {p.stage}
                      </p>
                    </div>
                    {/* Always two lines, set by hand. The size follows the card's
                        width so the longest line ("Picture Forward") still fits. */}
                    <h3 className="wordmark mt-3 text-[min(2.25rem,var(--title-fit))] text-white [--title-fit:10.2cqi]">
                      <span className="sr-only">{p.title}</span>
                      {PHASE_TITLE_LINES[p.id].map((line) => (
                        <span key={line} aria-hidden className="block whitespace-nowrap">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <p className="mt-3 text-sm font-semibold text-sky">{p.arc}</p>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/75">{p.text}</p>
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
