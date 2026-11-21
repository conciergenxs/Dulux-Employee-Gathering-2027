import type { ReactNode } from "react";
import { motion } from "motion/react";
import { TopSweep } from "@/components/canvas/Canvas";
import { RuledEyebrow } from "@/components/site/RuledEyebrow";
import heroPatternTop from "@/assets/pattern/hero-top.webp";

export type PageHeroSection = { id: string; label: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Page opener in the homepage hero's voice: centred, the ruled eyebrow, the
 * wordmark headline over two lines (the accent in the KV gradient), on the
 * lit royal field with the KV corner and the light sweep. The field eases
 * down to the page navy, so the hero hands over to the content without an
 * edge.
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
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: string;
  sections?: PageHeroSection[];
  tight?: boolean;
  introAction?: ReactNode;
  /** One line, with the gradient on the title instead of the accent. */
  inline?: boolean;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden px-5 pt-32 sm:pt-40 ${tight ? "pb-10 sm:pb-14" : "pb-14 sm:pb-20"}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(75%_65%_at_50%_0%,rgba(26,82,230,0.95)_0%,rgba(26,82,230,0)_72%),radial-gradient(40%_50%_at_100%_10%,rgba(31,123,255,0.3)_0%,rgba(31,123,255,0)_70%),linear-gradient(180deg,#0629a8_0%,#041f8c_40%,#02186c_75%,var(--navy-900)_100%)]"
      />
      <TopSweep className="absolute -right-6 top-0 -z-10 w-[15rem] opacity-80 sm:w-[24rem] lg:w-[32rem]" />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: -20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
        className="absolute left-0 top-0 -z-10 w-[9.5rem] [mask-image:linear-gradient(to_bottom,#000_45%,transparent_92%)] sm:w-[14rem] lg:w-[18rem]"
      >
        <img
          src={heroPatternTop}
          alt=""
          width={1280}
          height={1180}
          decoding="async"
          className="block h-auto w-full select-none"
          draggable={false}
        />
      </motion.div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RuledEyebrow>{eyebrow}</RuledEyebrow>
        </motion.div>
        <motion.h1
          className="wordmark mt-5 text-[clamp(2.25rem,9.6vw,4.5rem)] text-white sm:mt-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
        >
          {inline ? (
            <span className="block whitespace-nowrap text-[clamp(1.75rem,8.2vw,4.5rem)]">
              <span className="text-together">{title}</span>
              {accent && <> {accent}</>}
            </span>
          ) : (
            <>
              <span className="block">{title}</span>
              {accent && <span className="block pr-[0.06em] text-together">{accent}</span>}
            </>
          )}
        </motion.h1>
        {intro && (
          <motion.p
            className="mt-5 max-w-xl text-balance text-[0.9375rem] leading-relaxed text-white/70 sm:mt-6 sm:text-base"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
          >
            {intro}
          </motion.p>
        )}
        {introAction}
        {sections && sections.length > 0 && (
          <motion.nav
            aria-label="On this page"
            className="mt-8 flex flex-wrap justify-center gap-2"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.24 } } }}
          >
            {sections.map((s) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                transition={{ duration: 0.4 }}
                className="inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/[0.06] px-4 text-[0.8125rem] font-medium text-white backdrop-blur-sm transition-colors hover:border-cyan/60 hover:bg-white/10 active:scale-95"
              >
                {s.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </div>
    </section>
  );
}

/**
 * Section heading: the ruled eyebrow, then the wordmark headline with the
 * accent in the KV gradient. Left-aligned by default; `align="center"` for
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
        {title} {accent && <span className="pr-[0.06em] text-together">{accent}</span>}
      </Tag>
    </div>
  );
}
