import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check } from "lucide-react";
import { Badge, InfoNote } from "@/components/activities/Badges";
import { PULSE_WORDS, type PulseWord } from "@/lib/event";
import { actions, formatTime, useParticipant } from "@/lib/participant";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The One-Word Pulse (deck p.43): before the evening ends, one word for your
 * hopes for 2027. The results become a visual for the opening of Day 2.
 */
export function OneWordPulse() {
  const state = useParticipant();
  const [choice, setChoice] = useState<PulseWord | null>(null);
  const [changing, setChanging] = useState(false);
  const saved = state.pulse;
  const picking = !saved || changing;

  return (
    <div className="surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">The One-Word Pulse</p>
        {saved && !changing && <Badge tone="done">Word submitted</Badge>}
      </div>
      <h4 className="t-h2 mt-3 text-white">
        One word for your <span className="text-together">hopes for 2027</span>
      </h4>

      <AnimatePresence mode="wait" initial={false}>
        {picking ? (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div
              role="radiogroup"
              aria-label="Your word for 2027"
              className="mt-5 grid grid-cols-2 gap-2.5"
            >
              {PULSE_WORDS.map((w) => {
                const on = (choice ?? (changing ? saved?.word : null)) === w;
                return (
                  <button
                    key={w}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setChoice(w)}
                    className={`relative flex min-h-16 items-center justify-center rounded-2xl border-2 px-2 font-display text-[clamp(0.75rem,3.5vw,1.125rem)] uppercase tracking-[-0.01em] transition-all duration-300 active:scale-[0.98] ${
                      on
                        ? "border-transparent bg-white text-navy-900"
                        : "border-border text-white hover:border-cyan/60"
                    }`}
                  >
                    {on && (
                      <Check className="absolute right-3 top-3 size-4 text-royal" strokeWidth={3} />
                    )}
                    {w}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <InfoNote>
                Dibuka pada malam Day 1. Kata dari semua peserta akan disatukan untuk pembukaan Day
                2.
              </InfoNote>
              <button
                type="button"
                disabled={!choice}
                onClick={() => {
                  if (!choice) return;
                  actions.setPulse(choice);
                  setChanging(false);
                  setChoice(null);
                }}
                className="btn btn-primary shrink-0"
              >
                Submit my word
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-5"
            role="status"
          >
            <div className="rounded-2xl bg-[image:var(--gradient-royal)] px-5 py-6 text-center">
              <p className="t-micro text-sky">Your word</p>
              <p className="wordmark mt-2 text-5xl text-together sm:text-6xl">{saved!.word}</p>
            </div>
            <p className="t-small mt-4 text-muted-foreground">
              Terkirim {formatTime(saved!.at)}. Kata dari semua peserta akan disatukan menjadi
              visual untuk pembukaan Day 2.{" "}
              <button
                type="button"
                onClick={() => setChanging(true)}
                className="font-semibold text-cyan underline-offset-4 hover:underline"
              >
                Change word
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
