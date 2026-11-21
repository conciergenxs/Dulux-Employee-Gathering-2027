import { motion } from "motion/react";
import { useId } from "react";
import type { StrengthId } from "@/lib/event";

/**
 * The Living Canvas, drawn in code.
 *
 * The Greater Together key visual is built from square tiles, each holding one
 * shape — a quarter disc, a leaf, an arch, a circle — in a different blue, with
 * a flowing ribbon sweeping underneath. Separate pieces, one composition: the
 * concept itself. These components rebuild that language as SVG so it can
 * reflow on a phone instead of cropping a fixed image.
 */

export type Shape = "square" | "quarter" | "leaf" | "arch" | "circle" | "drop" | "half";
export type Tone = "ice" | "sky" | "electric" | "royal" | "deep" | "navy" | "cyan";

const PATHS: Record<Exclude<Shape, "circle">, string> = {
  square: "M0 0H100V100H0Z",
  quarter: "M0 0A100 100 0 0 1 100 100H0Z",
  leaf: "M0 100A100 100 0 0 1 100 0A100 100 0 0 1 0 100Z",
  arch: "M0 100V50A50 50 0 0 1 100 50V100Z",
  drop: "M0 0H50A50 50 0 0 1 100 50V100H50A50 50 0 0 1 0 50Z",
  half: "M0 0A50 50 0 0 1 0 100Z",
};

/** [top colour, bottom colour] — each tile is lit from above like the KV. */
const TONES: Record<Tone, [string, string]> = {
  ice: ["#d9f3ff", "#9cd6fd"],
  sky: ["#a9dcff", "#5aa9ff"],
  cyan: ["#7fe3ff", "#22a6ff"],
  electric: ["#4a9bff", "#1a5df0"],
  royal: ["#1f55f0", "#0a2fc4"],
  deep: ["#0b2fb8", "#04198a"],
  navy: ["#062482", "#021561"],
};

export type Tile = {
  x: number;
  y: number;
  shape: Shape;
  tone: Tone;
  rot?: 0 | 90 | 180 | 270;
  /** A cell drawn as an outline only — a piece not yet placed. */
  ghost?: boolean;
};

function TileShape({ tile, gid }: { tile: Tile; gid: string }) {
  const fill = tile.ghost ? "none" : `url(#${gid}-${tile.tone})`;
  const stroke = tile.ghost ? "rgba(156,214,253,0.35)" : undefined;
  const common = {
    fill,
    stroke,
    strokeWidth: tile.ghost ? 1.5 : undefined,
    strokeDasharray: tile.ghost ? "5 6" : undefined,
    vectorEffect: "non-scaling-stroke" as const,
  };
  return (
    <g transform={`rotate(${tile.rot ?? 0} 50 50)`}>
      {tile.shape === "circle" ? (
        <circle cx="50" cy="50" r="50" {...common} />
      ) : (
        <path d={PATHS[tile.shape]} {...common} />
      )}
    </g>
  );
}

function ToneDefs({ gid }: { gid: string }) {
  return (
    <defs>
      {(Object.keys(TONES) as Tone[]).map((t) => (
        <linearGradient key={t} id={`${gid}-${t}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={TONES[t][0]} />
          <stop offset="100%" stopColor={TONES[t][1]} />
        </linearGradient>
      ))}
    </defs>
  );
}

/**
 * A cluster of tiles. With `assemble`, the pieces arrive one by one and settle
 * into place — the canvas coming together.
 */
export function Mosaic({
  tiles,
  cols,
  rows,
  gap = 0,
  className = "",
  assemble = true,
  delay = 0,
  title,
}: {
  tiles: Tile[];
  cols: number;
  rows: number;
  gap?: number;
  className?: string;
  assemble?: boolean;
  delay?: number;
  title?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const cell = 100 + gap;
  const w = cols * cell - gap;
  const h = rows * cell - gap;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <ToneDefs gid={gid} />
      {tiles.map((t, i) => (
        <motion.g
          key={`${t.x}-${t.y}-${i}`}
          initial={assemble ? { opacity: 0, scale: 0.6 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: delay + i * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <g transform={`translate(${t.x * cell} ${t.y * cell})`}>
            <TileShape tile={t} gid={gid} />
          </g>
        </motion.g>
      ))}
    </svg>
  );
}

/* ── Compositions echoing the KV corners ───────────────────────────── */

export const KV_TOP_LEFT: Tile[] = [
  { x: 0, y: 0, shape: "square", tone: "electric" },
  { x: 1, y: 0, shape: "quarter", tone: "royal", rot: 90 },
  { x: 2, y: 0, shape: "quarter", tone: "ice", rot: 0 },
  { x: 3, y: 0, shape: "leaf", tone: "sky" },
  { x: 0, y: 1, shape: "drop", tone: "sky" },
  { x: 1, y: 1, shape: "square", tone: "deep" },
  { x: 2, y: 1, shape: "quarter", tone: "electric", rot: 180 },
  { x: 0, y: 2, shape: "quarter", tone: "royal", rot: 270 },
  { x: 1, y: 2, shape: "leaf", tone: "electric", rot: 90 },
  { x: 0, y: 3, shape: "arch", tone: "cyan" },
];

export const KV_BOTTOM_RIGHT: Tile[] = [
  { x: 3, y: 0, shape: "arch", tone: "sky", rot: 180 },
  { x: 2, y: 1, shape: "leaf", tone: "royal" },
  { x: 3, y: 1, shape: "square", tone: "deep" },
  { x: 1, y: 2, shape: "quarter", tone: "sky", rot: 270 },
  { x: 2, y: 2, shape: "quarter", tone: "ice", rot: 0 },
  { x: 3, y: 2, shape: "drop", tone: "electric" },
  { x: 0, y: 3, shape: "quarter", tone: "electric", rot: 90 },
  { x: 1, y: 3, shape: "square", tone: "royal" },
  { x: 2, y: 3, shape: "leaf", tone: "cyan", rot: 90 },
  { x: 3, y: 3, shape: "quarter", tone: "deep", rot: 180 },
];

/* ── One piece per First Stroke strength ───────────────────────────── */

export const STRENGTH_TILES: Record<StrengthId, Tile[]> = {
  // Two arcs reaching for each other: a bridge.
  connect: [
    { x: 0, y: 0, shape: "quarter", tone: "sky", rot: 90 },
    { x: 1, y: 0, shape: "quarter", tone: "electric", rot: 0 },
    { x: 0, y: 1, shape: "square", tone: "royal" },
    { x: 1, y: 1, shape: "square", tone: "deep" },
  ],
  // A new form opening up: circle and leaves.
  create: [
    { x: 0, y: 0, shape: "circle", tone: "cyan" },
    { x: 1, y: 0, shape: "leaf", tone: "electric", rot: 90 },
    { x: 0, y: 1, shape: "leaf", tone: "royal" },
    { x: 1, y: 1, shape: "arch", tone: "ice" },
  ],
  // Shapes that fit into each other.
  solve: [
    { x: 0, y: 0, shape: "square", tone: "electric" },
    { x: 1, y: 0, shape: "quarter", tone: "ice", rot: 180 },
    { x: 0, y: 1, shape: "quarter", tone: "sky", rot: 0 },
    { x: 1, y: 1, shape: "square", tone: "deep" },
  ],
  // Momentum: arches stepping forward.
  deliver: [
    { x: 0, y: 0, shape: "drop", tone: "royal" },
    { x: 1, y: 0, shape: "arch", tone: "electric", rot: 90 },
    { x: 0, y: 1, shape: "arch", tone: "sky", rot: 90 },
    { x: 1, y: 1, shape: "half", tone: "cyan", rot: 0 },
  ],
};

export function StrengthPiece({
  strength,
  className = "",
  assemble = true,
}: {
  strength: StrengthId;
  className?: string;
  assemble?: boolean;
}) {
  return (
    <Mosaic
      tiles={STRENGTH_TILES[strength]}
      cols={2}
      rows={2}
      gap={6}
      className={className}
      assemble={assemble}
    />
  );
}

/** The empty slot shown before The First Stroke is made. */
export function EmptyPiece({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 206 206" className={className} aria-hidden>
      <rect
        x="2"
        y="2"
        width="202"
        height="202"
        rx="18"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeDasharray="8 8"
      />
      <path
        d="M103 78v50M78 103h50"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The picture filling in across the journey: 3×3 cells, `lit` of them placed.
 * Pre-event places one piece, the event connects them, post-event completes it.
 */
const PICTURE: Omit<Tile, "ghost">[] = [
  { x: 1, y: 1, shape: "circle", tone: "cyan" },
  { x: 0, y: 1, shape: "quarter", tone: "electric", rot: 90 },
  { x: 2, y: 1, shape: "quarter", tone: "royal", rot: 0 },
  { x: 1, y: 0, shape: "arch", tone: "sky" },
  { x: 1, y: 2, shape: "leaf", tone: "electric" },
  { x: 0, y: 0, shape: "square", tone: "deep" },
  { x: 2, y: 0, shape: "leaf", tone: "ice", rot: 90 },
  { x: 0, y: 2, shape: "drop", tone: "sky" },
  { x: 2, y: 2, shape: "quarter", tone: "deep", rot: 180 },
];

export function JourneyPicture({ lit, className = "" }: { lit: number; className?: string }) {
  return (
    <Mosaic
      tiles={PICTURE.map((t, i) => ({ ...t, ghost: i >= lit }))}
      cols={3}
      rows={3}
      gap={8}
      className={className}
    />
  );
}

/* ── Hero-only, luminous versions ──────────────────────────────────── */

/** A sliver of light sweeping in from the top-right corner. */
export function TopSweep({ className = "" }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 240" className={`pointer-events-none ${className}`} aria-hidden>
      <defs>
        <linearGradient id={`${gid}-fill`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ccaff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#1f7bff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0a37db" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gid}-edge`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b5fcfd" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3ccaff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${gid}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <path
        d="M400 0H300C268 92 196 140 96 150C220 168 330 118 400 22Z"
        fill={`url(#${gid}-fill)`}
      />
      <path
        d="M300 0C268 92 196 140 96 150"
        fill="none"
        stroke={`url(#${gid}-edge)`}
        strokeWidth="6"
        filter={`url(#${gid}-blur)`}
      />
      <path
        d="M300 0C268 92 196 140 96 150"
        fill="none"
        stroke={`url(#${gid}-edge)`}
        strokeWidth="1.5"
      />
    </svg>
  );
}
