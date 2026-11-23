import type { CSSProperties } from "react";

/**
 * The Employee Kick Off 2027 key visual, drawn in code.
 *
 * The KV is a framed picture: a wall of blue tiles (inset panels, stepped
 * rings, arches) and brushed-silver bars, separated by dark seams, around a
 * rounded window that glows from deep navy down to cyan, with palms in
 * silhouette and the chrome "GREATER TOGETHER" wordmark at its heart.
 *
 * Everything here is rebuilt rather than cropped from the artwork, so the
 * frame reflows to any screen and the wordmark stays live text.
 */

/* ── Tile wall ───────────────────────────────────────────────────── */

type Anchor = "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r";
type Kind = "plain" | "inset" | "rings" | "arch" | "silver" | "bars";

type WallTile = {
  kind: Kind;
  span?: "w" | "h" | undefined;
  anchor: Anchor;
  delay: number;
};

/** Sampled from the KV. */
const C = {
  seam: "#121a2a",
  base: "#0c4a80",
  baseHi: "#0f5189",
  deep: "#0a3e6e",
  ring: ["#0b4372", "#1a5888", "#2a6491", "#3b6e99"],
  inset: ["#195790", "#2b6498", "#3a6f9e"],
};

/** Small seeded PRNG, so the server and the client draw the same wall. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ANCHORS: Anchor[] = ["tl", "tr", "bl", "br", "t", "b", "l", "r"];

function buildWall(count: number): WallTile[] {
  const r = rng(2027);
  const weighted: [Kind, number][] = [
    ["plain", 0.16],
    ["inset", 0.22],
    ["rings", 0.24],
    ["arch", 0.12],
    ["silver", 0.16],
    ["bars", 0.1],
  ];
  const pick = () => {
    let x = r();
    for (const [k, w] of weighted) {
      if ((x -= w) <= 0) return k;
    }
    return "plain" as Kind;
  };
  const tiles: WallTile[] = [];
  let prev: Kind | null = null;
  for (let i = 0; i < count; i++) {
    let kind = pick();
    // Two silvers side by side read as one slab; let the blue lead.
    if ((kind === "silver" || kind === "bars") && (prev === "silver" || prev === "bars")) {
      kind = "inset";
    }
    const s = r();
    const span: WallTile["span"] =
      kind === "bars"
        ? "h"
        : kind === "inset" && s < 0.55
          ? "w"
          : s < 0.18
            ? "w"
            : s < 0.3
              ? "h"
              : undefined;
    tiles.push({
      kind,
      span,
      anchor: ANCHORS[Math.floor(r() * ANCHORS.length)] ?? "tl",
      delay: Math.round(r() * 700),
    });
    prev = kind;
  }
  return tiles;
}

const WALL = buildWall(240);

const SILVER_V =
  "linear-gradient(90deg,#74777d 0%,#a9acb1 14%,#d9dbde 34%,#f3f4f5 46%,#b9bcc0 60%,#e2e4e6 78%,#8c8f94 100%)";
const SILVER_H =
  "linear-gradient(180deg,#74777d 0%,#a9acb1 14%,#d9dbde 34%,#f3f4f5 46%,#b9bcc0 60%,#e2e4e6 78%,#8c8f94 100%)";

function Rings({ anchor, wide, tall }: { anchor: Anchor; wide: boolean; tall: boolean }) {
  const W = wide ? 200 : 100;
  const H = tall ? 200 : 100;
  const pos: Record<Anchor, [number, number]> = {
    tl: [0, 0],
    tr: [W, 0],
    bl: [0, H],
    br: [W, H],
    t: [W / 2, 0],
    b: [W / 2, H],
    l: [0, H / 2],
    r: [W, H / 2],
  };
  const [cx, cy] = pos[anchor];
  const corner = anchor.length === 2;
  const R = Math.min(W, H) * (corner ? 0.98 : 0.9);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
      aria-hidden
    >
      {[1, 0.8, 0.62, 0.44].map((k, i) => (
        <circle
          key={k}
          cx={cx}
          cy={cy}
          r={R * k}
          fill={C.ring[i]}
          stroke="rgba(4,16,34,0.55)"
          strokeWidth={i === 0 ? 1.6 : 1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

const ARCH_RADIUS: Record<Anchor, string> = {
  tl: "0 50% 50% 50%",
  tr: "50% 0 50% 50%",
  bl: "50% 50% 50% 0",
  br: "50% 50% 0 50%",
  t: "0 0 50% 50% / 0 0 100% 100%",
  b: "50% 50% 0 0 / 100% 100% 0 0",
  l: "0 50% 50% 0 / 0 100% 100% 0",
  r: "50% 0 0 50% / 100% 0 0 100%",
};

function TileBody({ tile }: { tile: WallTile }) {
  switch (tile.kind) {
    case "plain":
      return null;
    case "inset":
      return (
        <div
          className="absolute inset-[16%_12%] shadow-[0_3px_8px_rgba(2,12,30,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]"
          style={{ background: C.inset[0] }}
        >
          <div
            className="absolute inset-[18%_10%] shadow-[0_2px_6px_rgba(2,12,30,0.35)]"
            style={{ background: C.inset[1] }}
          >
            <div className="absolute inset-[22%_8%]" style={{ background: C.inset[2] }} />
          </div>
        </div>
      );
    case "rings":
      return <Rings anchor={tile.anchor} wide={tile.span === "w"} tall={tile.span === "h"} />;
    case "arch":
      return (
        <div
          className="absolute inset-0 border-[1.5px] border-[rgba(4,16,34,0.7)]"
          style={{ background: C.baseHi, borderRadius: ARCH_RADIUS[tile.anchor] }}
        />
      );
    case "silver":
      return (
        <div
          className="absolute inset-0"
          style={{ background: tile.span === "w" ? SILVER_V : SILVER_H }}
        />
      );
    case "bars":
      return (
        <div className="absolute inset-0 flex gap-[3px] bg-[#2a2f3a]">
          <div className="flex-1" style={{ background: SILVER_V }} />
          <div className="flex-1" style={{ background: SILVER_V }} />
        </div>
      );
  }
}

/** The frame: a wall of tiles that fills its parent, edge to edge. */
export function TileWall({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`overflow-hidden ${className}`} style={{ background: C.seam }}>
      <div
        className="kv-wall absolute left-1/2 top-[-1.5rem] grid -translate-x-1/2 gap-[3px] [grid-auto-flow:dense]"
        style={
          {
            width: "calc(100% + var(--kv-cell) * 2)",
            gridTemplateColumns: "repeat(auto-fill, var(--kv-cell))",
            gridAutoRows: "var(--kv-cell)",
            justifyContent: "center",
          } as CSSProperties
        }
      >
        {WALL.map((t, i) => (
          <div
            key={i}
            className={`kv-tile relative overflow-hidden ${t.span === "w" ? "col-span-2" : ""} ${
              t.span === "h" ? "row-span-2" : ""
            }`}
            style={
              {
                background:
                  t.kind === "arch" ? C.deep : `linear-gradient(180deg,${C.baseHi},${C.base})`,
                "--kv-delay": `${t.delay}ms`,
              } as CSSProperties
            }
          >
            <TileBody tile={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A small cluster of wall tiles, for a corner of a card: the same pieces as
 * the frame, each with its own dark seam, placed on a grid of `--tile` cells.
 */
export type ClusterTile = {
  x: number;
  y: number;
  kind: Kind;
  anchor?: Anchor;
  span?: "w" | "h";
};

export function TileCluster({
  tiles,
  cols,
  rows,
  className = "",
}: {
  tiles: ClusterTile[];
  cols: number;
  rows: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, var(--tile))`,
        gridTemplateRows: `repeat(${rows}, var(--tile))`,
      }}
    >
      {tiles.map((t, i) => (
        <div
          key={i}
          className="kv-tile relative overflow-hidden shadow-[0_0_0_1.5px_#121a2a]"
          style={
            {
              gridColumn: `${t.x + 1} / span ${t.span === "w" ? 2 : 1}`,
              gridRow: `${t.y + 1} / span ${t.span === "h" ? 2 : 1}`,
              background:
                t.kind === "arch" ? C.deep : `linear-gradient(180deg,${C.baseHi},${C.base})`,
              "--kv-delay": `${200 + i * 70}ms`,
            } as CSSProperties
          }
        >
          <TileBody tile={{ kind: t.kind, span: t.span, anchor: t.anchor ?? "tl", delay: 0 }} />
        </div>
      ))}
    </div>
  );
}

/**
 * A 2 × 2 piece of the KV wall, framed in silver: the participant's piece
 * from The First Stroke. Tiles may span two cells (`span`), as on the wall.
 */
export function KvPiece({
  tiles,
  className = "",
  animate = true,
}: {
  tiles: ClusterTile[];
  className?: string;
  /** Let the tiles assemble on mount, as the wall does. */
  animate?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`grid aspect-square grid-cols-2 grid-rows-2 gap-[2px] overflow-hidden rounded-[0.375rem_1rem_0.375rem_1rem] border-[1.5px] border-silver ${className}`}
      style={{ background: C.seam }}
    >
      {tiles.map((t, i) => (
        <div
          key={i}
          className={`relative overflow-hidden ${animate ? "kv-tile" : ""}`}
          style={
            {
              gridColumn: `${t.x + 1} / span ${t.span === "w" ? 2 : 1}`,
              gridRow: `${t.y + 1} / span ${t.span === "h" ? 2 : 1}`,
              background:
                t.kind === "arch" ? C.deep : `linear-gradient(180deg,${C.baseHi},${C.base})`,
              "--kv-delay": `${i * 90}ms`,
            } as CSSProperties
          }
        >
          <TileBody tile={{ kind: t.kind, span: t.span, anchor: t.anchor ?? "tl", delay: 0 }} />
        </div>
      ))}
    </div>
  );
}

/** The KV lockup's voice for small labels: condensed capitals, no rules. */
export function KvEyebrow({
  children,
  className = "",
  tone = "light",
}: {
  children: string;
  className?: string;
  /** `dark` for a white section: the KV's denim instead of white. */
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={`w-full text-center font-[family-name:var(--font-kv-condensed)] text-[0.9375rem] uppercase tracking-[0.22em] sm:text-[1.0625rem] ${
        tone === "dark" ? "text-[#1d6aa8]" : "text-white/85"
      } ${className}`}
    >
      {/* The leading pad balances the tracking after the last letter, so the
          label sits optically centred. */}
      <span className="pl-[0.22em]">{children}</span>
    </p>
  );
}

/* ── Line pattern (for white sections) ──────────────────────────── */

type LineTile = {
  x: number;
  y: number;
  kind: "square" | "inset" | "rings" | "arch" | "bars";
  corner?: "tl" | "tr" | "bl" | "br";
};

/** One corner of the KV wall, drawn as outlines only. Mirrored for the right. */
const LINE_CLUSTER: LineTile[] = [
  { x: 0, y: 0, kind: "inset" },
  { x: 1, y: 0, kind: "rings", corner: "bl" },
  { x: 2, y: 0, kind: "square" },
  { x: 3, y: 0, kind: "bars" },
  { x: 0, y: 1, kind: "arch" },
  { x: 1, y: 1, kind: "square" },
  { x: 2, y: 1, kind: "rings", corner: "tl" },
  { x: 0, y: 2, kind: "rings", corner: "tr" },
  { x: 1, y: 2, kind: "inset" },
];

function lineTile(t: LineTile) {
  const ox = t.x * 100;
  const oy = t.y * 100;
  const parts: string[] = [`M${ox} ${oy}h100v100h-100Z`];
  if (t.kind === "inset") {
    parts.push(`M${ox + 14} ${oy + 18}h72v64h-72Z`, `M${ox + 26} ${oy + 32}h48v36h-48Z`);
  } else if (t.kind === "bars") {
    parts.push(`M${ox + 34} ${oy}v100`, `M${ox + 66} ${oy}v100`);
  } else if (t.kind === "arch") {
    parts.push(`M${ox + 12} ${oy + 100}V${oy + 50}A38 38 0 0 1 ${ox + 88} ${oy + 50}V${oy + 100}`);
  } else if (t.kind === "rings") {
    const c = t.corner ?? "bl";
    const cx = ox + (c === "tr" || c === "br" ? 100 : 0);
    const cy = oy + (c === "bl" || c === "br" ? 100 : 0);
    const sx = c === "tr" || c === "br" ? -1 : 1;
    const sy = c === "bl" || c === "br" ? -1 : 1;
    for (const r of [96, 74, 52, 30]) {
      parts.push(`M${cx} ${cy + sy * r}A${r} ${r} 0 0 ${sx * sy > 0 ? 0 : 1} ${cx + sx * r} ${cy}`);
    }
  }
  return parts.join("");
}

const LINE_PATH = LINE_CLUSTER.map(lineTile).join("");

/** Phone: fewer, larger-spaced clusters, half off the edge. */
const PHONE_SPOTS: { pos: string; flip: string; origin: string }[] = [
  { pos: "-right-[22vw] top-0", flip: "-scale-x-100", origin: "0% 0%" },
  { pos: "-left-[22vw] bottom-0", flip: "-scale-y-100", origin: "0% 0%" },
];

/** Where the outline clusters sit: down both edges, alternating sides. */
const LINE_SPOTS: { pos: string; flip: string; origin: string }[] = [
  { pos: "left-0 top-0", flip: "", origin: "0% 0%" },
  { pos: "right-0 top-0", flip: "-scale-x-100", origin: "0% 0%" },
  { pos: "left-0 top-[38%] -translate-y-1/2", flip: "", origin: "0% 50%" },
  { pos: "right-0 top-[64%] -translate-y-1/2", flip: "-scale-x-100", origin: "0% 50%" },
  { pos: "left-0 bottom-0", flip: "-scale-y-100", origin: "0% 0%" },
];

/**
 * The KV's tile wall as outlines only, for a white section: clusters down
 * both edges, so the pattern stays with you as the section scrolls, each
 * fading from the screen edge inward and none reaching the middle, where the
 * content is. Lighter and smaller on a phone.
 */
export function KvLinePattern({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Laptop and tablet: the tile outlines down both edges. */}
      {LINE_SPOTS.map((spot) => (
        <svg
          key={spot.pos}
          viewBox="-1 -1 402 302"
          fill="none"
          className={`absolute hidden h-auto w-[min(40vw,30rem)] text-[#1d6aa8] sm:block ${spot.pos} ${spot.flip}`}
          style={{
            maskImage: `radial-gradient(95% 100% at ${spot.origin}, #000 35%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(95% 100% at ${spot.origin}, #000 35%, transparent 100%)`,
          }}
        >
          <path
            d={LINE_PATH}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeOpacity={0.4}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ))}
      {/* Phone: the same clusters at the laptop's tile size, so they read
          the same way, but only two of them — top right and bottom left —
          each mostly off the screen and fading softly toward the middle. */}
      {PHONE_SPOTS.map((spot) => (
        <svg
          key={spot.pos}
          viewBox="-1 -1 402 302"
          fill="none"
          className={`absolute h-auto w-[92vw] text-[#1d6aa8] sm:hidden ${spot.pos} ${spot.flip}`}
          style={{
            maskImage: `radial-gradient(100% 100% at ${spot.origin}, #000 40%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(100% 100% at ${spot.origin}, #000 40%, transparent 100%)`,
          }}
        >
          <path
            d={LINE_PATH}
            stroke="currentColor"
            strokeWidth={1.25}
            strokeOpacity={0.5}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ))}
    </div>
  );
}

/* ── Palms ───────────────────────────────────────────────────────── */

type Pt = [number, number];

const f1 = (n: number) => n.toFixed(1);

/** Point and unit tangent on a quadratic curve. */
function quad(a: Pt, b: Pt, c: Pt, t: number): [Pt, Pt] {
  const u = 1 - t;
  const p: Pt = [
    u * u * a[0] + 2 * u * t * b[0] + t * t * c[0],
    u * u * a[1] + 2 * u * t * b[1] + t * t * c[1],
  ];
  const d: Pt = [
    2 * u * (b[0] - a[0]) + 2 * t * (c[0] - b[0]),
    2 * u * (b[1] - a[1]) + 2 * t * (c[1] - b[1]),
  ];
  const l = Math.hypot(d[0], d[1]) || 1;
  return [p, [d[0] / l, d[1] / l]];
}

/**
 * A palm crown as the KV draws it: a tidy fan of thirteen fronds, rising,
 * reaching out and hanging down, each one bowed under its weight and combed
 * on both sides with long leaflets that point to the tip. The fronds keep
 * even spacing and the leaflets an even angle, so the crown reads as clean
 * shapes rather than a scribble.
 */
function crownPath(C: Pt, R: number, seed: number) {
  const r = rng(seed);
  const out: string[] = [];
  const ANGLES = [-165, -140, -116, -93, -70, -46, -22, 4, 32, 64, 116, 148, 176];
  for (const base of ANGLES) {
    const a = ((base + (r() - 0.5) * 8) * Math.PI) / 180;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const down = Math.max(0, dy); // 1 when the frond hangs straight down
    const L = R * (0.88 + r() * 0.14) * (1 - 0.4 * down);
    const sag = R * (0.2 + 0.32 * (1 - Math.abs(dy))) * (0.85 + r() * 0.3);
    const P1: Pt = [C[0] + dx * L * 0.5, C[1] + dy * L * 0.5 - sag * 0.4];
    const P2: Pt = [C[0] + dx * L, C[1] + dy * L + sag];

    // The rib, tapering to the tip.
    const left: Pt[] = [];
    const right: Pt[] = [];
    for (let k = 0; k <= 12; k++) {
      const t = k / 12;
      const [p, d] = quad(C, P1, P2, t);
      const w = R * 0.026 * (1 - t) + 0.8;
      left.push([p[0] - d[1] * w, p[1] + d[0] * w]);
      right.push([p[0] + d[1] * w, p[1] - d[0] * w]);
    }
    out.push(
      "M" + [...left, ...right.reverse()].map((q) => `${f1(q[0])} ${f1(q[1])}`).join("L") + "Z",
    );

    // Leaflets on both sides at one angle, swept toward the tip.
    for (let t = 0.12; t < 0.96; t += 0.068) {
      const [p, d] = quad(C, P1, P2, t);
      const prof = Math.pow(Math.sin(Math.PI * (0.18 + 0.82 * t)), 0.7);
      const len = L * 0.3 * prof * (0.94 + r() * 0.12) + 3;
      for (const s of [-1, 1]) {
        const sw = s * 0.6;
        let lx = d[0] * Math.cos(sw) - d[1] * Math.sin(sw);
        let ly = d[0] * Math.sin(sw) + d[1] * Math.cos(sw) + 0.3;
        const n = Math.hypot(lx, ly) || 1;
        lx /= n;
        ly /= n;
        const e: Pt = [p[0] + lx * len, p[1] + ly * len];
        const m: Pt = [
          p[0] + lx * len * 0.5 + d[0] * len * 0.1,
          p[1] + ly * len * 0.5 + d[1] * len * 0.1 - len * 0.05,
        ];
        const w = R * 0.014 + prof * R * 0.014;
        const nx = -ly;
        const ny = lx;
        out.push(
          `M${f1(p[0] + nx * w)} ${f1(p[1] + ny * w)}` +
            `Q${f1(m[0] + nx * w * 0.55)} ${f1(m[1] + ny * w * 0.55)} ${f1(e[0])} ${f1(e[1])}` +
            `Q${f1(m[0] - nx * w * 0.55)} ${f1(m[1] - ny * w * 0.55)} ${f1(p[0] - nx * w)} ${f1(p[1] - ny * w)}Z`,
        );
      }
    }
  }
  const h = R * 0.08;
  out.push(
    `M${f1(C[0] - h)} ${f1(C[1])}a${f1(h)} ${f1(h * 0.85)} 0 1 0 ${f1(h * 2)} 0a${f1(h)} ${f1(h * 0.85)} 0 1 0 ${f1(-h * 2)} 0Z`,
  );
  return out.join("");
}

/**
 * A trunk from the crown down to the ground: a gentle bend under the crown,
 * then straight down, far past any box it is drawn in. Whatever holds the
 * palm clips it at its own foot, so every palm stands on the ground of the
 * section it is in, at any height, instead of stopping in mid-air.
 */
function trunkPath(C: Pt, lean: number, w0: number, w1: number) {
  const y1 = C[1] + 900;
  const x1 = C[0] + lean;
  return (
    `M${f1(C[0] - w1)} ${f1(C[1])}` +
    `C${f1(C[0] - w1 + lean * 0.1)} ${f1(C[1] + 350)} ${f1(x1 - w0)} ${f1(y1 - 350)} ${f1(x1 - w0)} ${f1(y1)}` +
    `L${f1(x1 - w0)} 12000H${f1(x1 + w0)}L${f1(x1 + w0)} ${f1(y1)}` +
    `C${f1(x1 + w0)} ${f1(y1 - 350)} ${f1(C[0] + w1 + lean * 0.1)} ${f1(C[1] + 350)} ${f1(C[0] + w1)} ${f1(C[1])}Z`
  );
}

/**
 * A grove of three, after the KV: crowns stacked one above another, the
 * tallest at the back. Laid out on a 600 × 1100 plan, drawn with room around
 * it for the fronds that reach past the plan.
 */
function grovePath(seed: number) {
  const palms: { C: Pt; R: number; lean: number }[] = [
    { C: [370, 190], R: 240, lean: -150 },
    { C: [160, 440], R: 205, lean: -50 },
    { C: [360, 660], R: 175, lean: -10 },
  ];
  return palms
    .map((p, i) => trunkPath(p.C, p.lean, 15, 8) + crownPath(p.C, p.R, seed + i * 13))
    .join("");
}

const GROVES = [grovePath(5), grovePath(23)] as const;

/** The navy the palms are drawn in: a shade darker than the haze behind. */
const PALM_INK = "text-[#04122e]";

/** One grove in silhouette, softened. */
function Grove({ variant, className }: { variant: 0 | 1; className: string }) {
  return (
    <div className={`absolute aspect-[760/1220] ${className}`}>
      {/* The royal haze the KV's palms stand in. */}
      <div className="absolute inset-[-10%] bg-[radial-gradient(50%_40%_at_45%_38%,rgba(12,52,150,0.55)_0%,rgba(12,52,150,0)_75%)]" />
      <svg
        viewBox="-80 -120 760 1220"
        overflow="visible"
        className={`absolute inset-0 size-full ${PALM_INK} opacity-65 blur-[1px] lg:opacity-55`}
        aria-hidden
      >
        <path d={GROVES[variant]} fill="currentColor" />
      </svg>
    </div>
  );
}

/**
 * A grove on each side of the window. On a laptop each stands the full
 * height of the window at its edge. On a phone or tablet, where the window is
 * tall and narrow, each is sized to the width with its crowns around the
 * wordmark, as in the KV, and its trunks running down to the tray.
 */
export function PalmGrove() {
  return (
    // The fade lives on the window, not the trees: full strength through the
    // crowns, easing to 40% at the foot. Never to nothing, as in the KV, so
    // the palms stay rooted instead of floating.
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_45%,rgba(0,0,0,0.4)_100%)]"
    >
      <Grove
        variant={0}
        className="left-[-24%] top-[12%] w-[70%] sm:left-[-8%] sm:top-[0%] sm:w-[44%] lg:bottom-0 lg:left-[-3%] lg:top-auto lg:h-full lg:w-auto"
      />
      <Grove
        variant={1}
        className="right-[-24%] top-[5%] w-[72%] -scale-x-100 sm:right-[-8%] sm:top-[-6%] sm:w-[44%] lg:bottom-0 lg:right-[-3%] lg:top-auto lg:h-full lg:w-auto"
      />
    </div>
  );
}

/**
 * A trunk that arcs: it bows out to one side as it rises, the way a palm
 * leans out of a grove, then runs straight down to the ground.
 */
function curvedTrunkPath(C: Pt, lean: number, bow: number, L: number, w0: number, w1: number) {
  const fx = C[0] + lean;
  const fy = C[1] + L;
  const c1: Pt = [C[0] + bow, C[1] + L * 0.38];
  const c2: Pt = [fx + bow * 0.55, C[1] + L * 0.78];
  return (
    `M${f1(C[0] - w1)} ${f1(C[1])}` +
    `C${f1(c1[0] - w1)} ${f1(c1[1])} ${f1(c2[0] - w0)} ${f1(c2[1])} ${f1(fx - w0)} ${f1(fy)}` +
    `L${f1(fx - w0)} 12000H${f1(fx + w0)}L${f1(fx + w0)} ${f1(fy)}` +
    `C${f1(c2[0] + w0)} ${f1(c2[1])} ${f1(c1[0] + w1)} ${f1(c1[1])} ${f1(C[0] + w1)} ${f1(C[1])}Z`
  );
}

const CROWN = crownPath([300, 300], 260, 41);
/** On a phone the palm sits at the screen edge: the trunk arcs out past it
 *  and comes back in to stand in the narrow margin beside the content. */
const SINGLE_NARROW = CROWN + curvedTrunkPath([300, 300], 70, -230, 1700, 16, 9);
/** On a laptop there is a wide margin: the trunk arcs out into it in full
 *  view and stands well clear of the content. */
const SINGLE_WIDE = CROWN + curvedTrunkPath([300, 300], -90, -130, 1500, 16, 9);

/**
 * One palm, placed by its crown (the centre of its square box). Its trunk
 * runs down to the foot of whatever clips it.
 */
export function RootedPalm({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      overflow="visible"
      className={`absolute aspect-square ${PALM_INK} ${className}`}
      aria-hidden
    >
      <path d={SINGLE_NARROW} fill="currentColor" className="lg:hidden" />
      <path d={SINGLE_WIDE} fill="currentColor" className="hidden lg:inline" />
    </svg>
  );
}

/* ── Chrome wordmark ─────────────────────────────────────────────── */

/** The lens flare that catches the top of the letters. */
export function Sparkle({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={`kv-sparkle ${className}`} style={style} aria-hidden>
      <defs>
        <radialGradient id="kv-flare-glow">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="18%" stopColor="#bfe6ff" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#5fb8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#kv-flare-glow)" />
      <path
        d="M50 4C51.6 38 62 48.4 96 50 62 51.6 51.6 62 50 96 48.4 62 38 51.6 4 50 38 48.4 48.4 38 50 4Z"
        fill="#ffffff"
      />
    </svg>
  );
}

/**
 * The filters behind the chrome bevel: each one pulls the letter face in from
 * the outline, leaving the bright rim of the KV letters around it. One per
 * size step, since the rim is measured in pixels.
 */
export function ChromeDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute size-0 overflow-hidden">
      <defs>
        {[
          ["kv-bevel-sm", 1.4],
          ["kv-bevel-md", 2.4],
          ["kv-bevel-lg", 3.4],
          ["kv-bevel-xl", 4.4],
        ].map(([id, r]) => (
          <filter key={id} id={String(id)} x="-5%" y="-5%" width="110%" height="110%">
            <feMorphology operator="erode" radius={r} />
          </filter>
        ))}
      </defs>
    </svg>
  );
}

/**
 * One line of the wordmark, in stacked layers that share one grid cell, so
 * they line up at any size:
 *   body  — the extrusion. Each letter is pushed back toward the middle of the
 *           line, as in the KV, where the sides of the outer letters show.
 *   rim   — the bright bevel around every letter.
 *   face  — the polished metal inside the rim.
 *   glint — a light that sweeps across now and then.
 */
export function ChromeLine({
  text,
  rim = true,
  className = "",
}: {
  text: string;
  /** The bright bevelled outline. Off for small sizes (the card numerals),
   *  where it reads as a white stroke rather than a polished edge. */
  rim?: boolean;
  className?: string;
}) {
  const letters = [...text];
  const mid = (letters.length - 1) / 2;
  return (
    <span className={`kv-chrome relative inline-grid ${rim ? "" : "kv-chrome-plain"} ${className}`}>
      <span className="kv-chrome-body">
        {letters.map((ch, i) => (
          <span key={i} style={{ "--dx": ((mid - i) / (mid || 1)).toFixed(3) } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
      {rim && <span className="kv-chrome-rim">{text}</span>}
      <span className="kv-chrome-face">{text}</span>
      <span className="kv-chrome-glint">{text}</span>
    </span>
  );
}
