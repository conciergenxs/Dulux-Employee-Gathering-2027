import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll-in motion for the whole site.
 *
 * One gesture, used everywhere: content rises a little as it arrives and
 * settles on the same curve as the header and its menu, so the page reads
 * as one system rather than a collection of separate effects. It fires once —
 * content that re-animates every time it crosses the fold feels restless.
 *
 * When the visitor has asked their system for less motion, the travel is
 * dropped and a short fade is all that remains. None of this is load-bearing,
 * so there is nothing lost by holding still.
 */
const TRAVEL: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

/** The site's one easing curve, shared with the header and its menu. */
const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={TRAVEL}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/**
 * Parent for a run of `StaggerItem`s: the children arrive in sequence instead
 * of together, which reads as a list being dealt out rather than a block
 * appearing. Keep `step` small — much past 0.12s and the last card in a row
 * is visibly waiting its turn.
 */
export function Stagger({
  children,
  className = "",
  step = 0.09,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: step } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={TRAVEL} transition={{ duration: 0.6, ease: EASE }}>
      {children}
    </motion.div>
  );
}
