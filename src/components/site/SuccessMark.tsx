import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Sparks thrown out from the check — angle in degrees, distance in px. */
const SPARKS = [
  { a: -90, d: 62, s: 7 },
  { a: -30, d: 58, s: 5 },
  { a: 25, d: 64, s: 6 },
  { a: 80, d: 56, s: 5 },
  { a: 140, d: 62, s: 7 },
  { a: 200, d: 58, s: 5 },
];

/**
 * The illustration: a soft halo, a gradient disc, a check that draws itself
 * and a burst of sparks — quieter (no sparks) when the stamp was already in.
 */
export function SuccessMark({ reduce, fresh }: { reduce: boolean; fresh: boolean }) {
  return (
    <div className="relative mx-auto grid size-24 place-items-center">
      {!reduce && (
        <motion.span
          aria-hidden
          initial={{ scale: 0.6, opacity: 0.55 }}
          animate={{ scale: 1.55, opacity: 0 }}
          transition={{ duration: 1.1, delay: 0.25, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border-2 border-cyan/50"
        />
      )}
      <span aria-hidden className="absolute inset-0 rounded-full bg-cyan/15" />
      {fresh &&
        !reduce &&
        SPARKS.map((spark, i) => {
          const rad = (spark.a * Math.PI) / 180;
          return (
            <motion.span
              key={i}
              aria-hidden
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{
                x: Math.cos(rad) * spark.d,
                y: Math.sin(rad) * spark.d,
                scale: [0, 1, 0.6],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 0.9, delay: 0.45 + i * 0.03, ease: EASE }}
              style={{ width: spark.s, height: spark.s }}
              className={`absolute rounded-full ${i % 2 ? "bg-ice" : "bg-cyan"}`}
            />
          );
        })}
      <motion.span
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
        className="relative grid size-[4.25rem] place-items-center rounded-full bg-[image:var(--gradient-electric)] text-white"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
          />
        </svg>
      </motion.span>
    </div>
  );
}
