import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import { KvEyebrow, RootedPalm, TileWall } from "@/components/kv/KickOffKv";
import { RuledEyebrow } from "@/components/site/RuledEyebrow";

export type PageHeroSection = { id: string; label: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Page opener in the homepage hero's voice, at page scale: the KV's tile wall
 * fills the top of the screen, and a window cut like the KV's (silver
 * stroke, small and large corners, navy glowing down to cyan, a palm at each
 * side) carries the eyebrow, a plain white headline and the intro. The wall
 * fades into the page denim at the foot, so the hero hands over to the
 * content without an edge.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  sections,
  tight = false,
  introAction,
  inline = false,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: string;
  sections?: PageHeroSection[];
  tight?: boolean;
  introAction?: ReactNode;
  /** The title and accent run on as one line where they fit. */
  inline?: boolean;
  /** Page content that belongs in the window itself, under the heading
   *  (the pass, on My Canvas Pass). */
  children?: ReactNode;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden bg-[#0d4a80] px-[1.125rem] pt-[5.5rem] sm:px-6 sm:pt-[6.25rem] lg:px-[clamp(2.5rem,7.5vw,9rem)] lg:pt-28 ${
        tight ? "pb-10" : "pb-10 sm:pb-12"
      }`}
      style={{ "--kv-cell": "clamp(5.25rem, 9.6vw, 9.5rem)" } as CSSProperties}
    >
      <TileWall className="absolute inset-0 -z-20 [mask-image:linear-gradient(to_bottom,#000_calc(100%-9rem),transparent_100%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[0.75rem_2.75rem_0.75rem_2.75rem] border-[3px] border-silver shadow-[0_0_0_1px_rgba(8,18,36,0.7),0_0_24px_rgba(150,215,255,0.28),0_22px_36px_-26px_rgba(0,8,30,0.85)] sm:rounded-[1rem_4.5rem_1rem_4.5rem] lg:rounded-[1.25rem_6rem_1.25rem_6rem]"
      >
        {/* The window, as on the home page: deep navy glowing down to cyan,
            with a pool of light behind the headline. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[radial-gradient(55%_45%_at_50%_58%,rgba(56,160,255,0.42)_0%,rgba(56,160,255,0)_72%),linear-gradient(180deg,#081a2f_0%,#0a2340_22%,#0b3354_42%,#0e5f8f_72%,#1290c3_92%,#17a3d3_100%)]"
        />
        {/* A palm at each side, crown high, rooted at the window's foot and
            fading as it goes down (never to nothing). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_0%,#000_45%,rgba(0,0,0,0.4)_100%)]"
        >
          <RootedPalm className="left-[-7.5rem] top-[-1rem] w-[17rem] opacity-60 blur-[0.8px] sm:left-[-6rem] sm:w-[22rem] lg:left-[-4rem] lg:top-[-3rem] lg:w-[26rem] lg:opacity-55" />
          <RootedPalm className="right-[-7.5rem] top-[1.5rem] w-[17rem] -scale-x-100 opacity-60 blur-[0.8px] sm:right-[-6rem] sm:w-[22rem] lg:right-[-4rem] lg:top-[-1rem] lg:w-[26rem] lg:opacity-55" />
        </div>

        <div
          className={`relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-10 ${
            tight ? "py-9 sm:py-12" : "py-10 sm:py-14 lg:py-16"
          }`}
        >
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <KvEyebrow>{eyebrow}</KvEyebrow>
          </motion.div>
          <motion.h1
            className="wordmark mt-4 text-balance text-[clamp(2rem,9vw,4.25rem)] text-white drop-shadow-[0_6px_24px_rgba(0,10,30,0.45)] sm:mt-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
          >
            {inline ? (
              <span className="block text-[clamp(1.75rem,8vw,4.25rem)]">
                {title}
                {accent && <> {accent}</>}
              </span>
            ) : (
              <>
                <span className="block">{title}</span>
                {accent && <span className="block">{accent}</span>}
              </>
            )}
          </motion.h1>
          {intro && (
            <motion.p
              className="mt-4 max-w-xl text-balance text-[0.9375rem] font-medium leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(0,20,50,0.5)] sm:mt-5 sm:text-base"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36 }}
            >
              {intro}
            </motion.p>
          )}
          {introAction}
          {sections && sections.length > 0 && (
            <motion.nav
              aria-label="On this page"
              className="mt-7 flex flex-wrap justify-center gap-2"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.44 } } }}
            >
              {sections.map((s) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex min-h-10 items-center rounded-full border border-silver/45 bg-[#071a33]/45 px-4 text-[0.8125rem] font-medium text-white backdrop-blur-sm transition-colors hover:border-silver hover:bg-[#071a33]/65 active:scale-95"
                >
                  {s.label}
                </motion.a>
              ))}
            </motion.nav>
          )}
          {children}
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Section heading: the ruled eyebrow, then the headline in plain white. Left-aligned by default; `align="center"` for
 * sections that open on their own.
 */
export function SectionTitle({
  eyebrow,
  title,
  accent,
  className = "",
  as: Tag = "h2",
  align = "start",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  className?: string;
  as?: "h2" | "h3";
  align?: "start" | "center";
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow && <RuledEyebrow align={align}>{eyebrow}</RuledEyebrow>}
      <Tag
        className={`wordmark text-balance text-[clamp(1.875rem,5.6vw,3rem)] text-white ${eyebrow ? "mt-4" : ""}`}
      >
        {title} {accent && <span>{accent}</span>}
      </Tag>
    </div>
  );
}
