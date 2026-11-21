import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Check, Info, PencilLine } from "lucide-react";
import { StrengthPiece } from "@/components/canvas/Canvas";
import { Badge } from "@/components/activities/Badges";
import { FIRST_STROKE_DISCLAIMER, STRENGTHS, type StrengthId } from "@/lib/event";
import { actions, formatTime, useParticipant } from "@/lib/participant";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * YOUR FIRST STROKE (deck p.22). One question, four strengths, then the
 * participant sees the piece they bring to the bigger picture.
 */
export function FirstStroke() {
  const state = useParticipant();
  const answered = state.firstStroke;
  const [editing, setEditing] = useState(false);
  const showPicker = !answered || editing;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showPicker ? (
        <motion.div
          key="picker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <Picker
            initial={answered?.strength ?? null}
            onDone={() => setEditing(false)}
            onCancel={answered ? () => setEditing(false) : undefined}
          />
        </motion.div>
      ) : (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <PieceReveal
            strength={answered.strength}
            at={answered.at}
            onChange={() => setEditing(true)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Picker({
  initial,
  onDone,
  onCancel,
}: {
  initial: StrengthId | null;
  onDone: () => void;
  onCancel?: (() => void) | undefined;
}) {
  const [choice, setChoice] = useState<StrengthId | null>(initial);
  const reduce = useReducedMotion();

  return (
    <div>
      <div className="paper p-5 sm:p-7">
        <p className="t-micro text-royal">Your First Stroke</p>
        <h3 className="t-h2 mt-2 text-navy-900">
          What strength will you bring to our next chapter?
        </h3>
        <p className="t-small mt-2 text-paper-muted">
          Pilih kekuatan yang paling menggambarkan dirimu.
        </p>

        <div
          role="radiogroup"
          aria-label="Your strength"
          className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {STRENGTHS.map((s) => {
            const selected = choice === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setChoice(s.id)}
                className={`group relative flex flex-col items-start rounded-2xl border-2 p-3.5 text-left transition-all duration-300 active:scale-[0.98] sm:p-4 ${
                  selected
                    ? "border-royal bg-[#eef4ff]"
                    : "border-paper-border bg-white hover:border-[#9db8ef]"
                }`}
              >
                <span
                  className={`absolute right-3 top-3 grid size-6 place-items-center rounded-full transition-all duration-300 ${
                    selected
                      ? "scale-100 bg-royal text-white"
                      : "scale-90 border-2 border-paper-border"
                  }`}
                >
                  {selected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span className="block w-16 rounded-xl bg-navy-900 p-2 transition-transform duration-500 group-hover:rotate-[-4deg] sm:w-20">
                  <StrengthPiece strength={s.id} assemble={false} className="w-full" />
                </span>
                <span className="mt-3 font-display text-2xl uppercase leading-none text-navy-900">
                  {s.name}
                </span>
                <span className="mt-1 text-[0.8125rem] leading-snug text-paper-muted">
                  {s.tagline}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-paper-muted sm:max-w-sm">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            {FIRST_STROKE_DISCLAIMER}
          </p>
          <div className="flex gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn min-h-12 px-4 text-paper-muted hover:text-navy-900"
              >
                Cancel
              </button>
            )}
            <motion.button
              type="button"
              disabled={!choice}
              onClick={() => {
                if (!choice) return;
                actions.setFirstStroke(choice);
                onDone();
              }}
              whileTap={reduce ? {} : { scale: 0.97 }}
              className="btn btn-navy group flex-1 sm:flex-none"
            >
              Make my first stroke
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PieceReveal({
  strength,
  at,
  onChange,
}: {
  strength: StrengthId;
  at: string;
  onChange?: () => void;
}) {
  const s = STRENGTHS.find((x) => x.id === strength)!;
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-cyan/30 bg-[image:var(--gradient-royal)] p-5 sm:p-8">
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
        <div className="w-36 sm:w-44">
          <StrengthPiece strength={strength} className="w-full" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="done">First stroke made</Badge>
          </div>
          <p className="eyebrow mt-4">Your piece</p>
          <p className="wordmark mt-1 text-5xl text-white sm:text-6xl">{s.name}</p>
          <p className="t-h3 mt-2 text-sky">{s.tagline}</p>
          <p className="t-body mt-3 max-w-md text-white/85">{s.piece}</p>
          <p className="t-small mt-4 text-muted-foreground">
            Dibuat {formatTime(at)} · tersimpan di perangkat ini
          </p>
          {onChange && (
            <button
              type="button"
              onClick={onChange}
              className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-cyan underline-offset-4 hover:underline"
            >
              <PencilLine className="size-4" />
              Change my answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
