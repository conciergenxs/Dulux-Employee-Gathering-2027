import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
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
    <KvWindow>
      <p className="font-[family-name:var(--font-kv-condensed)] text-[0.9375rem] uppercase tracking-[0.18em] text-sky">
        Your First Stroke
      </p>
      <h3 className="wordmark mt-2 text-[clamp(1.625rem,7vw,2.5rem)] text-white">
        What strength will you bring to our next chapter?
      </h3>
      <p className="mt-2 text-[0.9375rem] text-white/80">
        Pilih kekuatan yang paling menggambarkan dirimu.
      </p>

      <div
        role="radiogroup"
        aria-label="Your strength"
        className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
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
              className={`group relative flex flex-col items-start rounded-[0.5rem_1.5rem_0.5rem_1.5rem] border-[1.5px] p-3.5 text-left backdrop-blur-sm transition-all duration-300 active:scale-[0.98] sm:p-4 ${
                selected
                  ? "border-silver bg-[#071a33]/70 shadow-[0_0_22px_rgba(150,215,255,0.35)]"
                  : "border-silver/30 bg-[#071a33]/40 hover:border-silver/60"
              }`}
            >
              <span
                className={`absolute right-3 top-3 grid size-6 place-items-center rounded-full transition-all duration-300 ${
                  selected
                    ? "scale-100 bg-white text-navy-900"
                    : "scale-90 border-[1.5px] border-silver/50"
                }`}
              >
                {selected && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <StrengthPiece
                strength={s.id}
                assemble={false}
                className="w-16 transition-transform duration-500 group-hover:rotate-[-4deg] sm:w-20"
              />
              <span className="wordmark mt-3.5 text-[1.375rem] text-white sm:text-2xl">
                {s.name}
              </span>
              <span className="mt-1 text-[0.8125rem] leading-snug text-white/70">{s.tagline}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-white/65 sm:max-w-sm">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          {FIRST_STROKE_DISCLAIMER}
        </p>
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn min-h-12 px-4 text-white/70 hover:text-white"
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
            className="btn btn-primary min-h-[3.25rem] flex-1 font-bold text-[#0a2442] shadow-[0_0_0_1px_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(110,125,140,0.35),0_10px_28px_-12px_rgba(80,190,255,0.85)] disabled:shadow-none sm:flex-none sm:px-8"
          >
            Make my first stroke
          </motion.button>
        </div>
      </div>
    </KvWindow>
  );
}

/**
 * The KV window, at card size: navy glowing down to cyan behind a silver
 * stroke, cut with small and large corners like the hero's.
 */
function KvWindow({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[0.75rem_2.75rem_0.75rem_2.75rem] border-[2.5px] border-silver p-5 shadow-[0_0_0_1px_rgba(8,18,36,0.7),0_0_24px_rgba(150,215,255,0.22),0_30px_60px_-30px_rgba(0,8,30,0.9)] sm:p-7 lg:rounded-[1rem_4rem_1rem_4rem] lg:p-9">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_70%,rgba(56,160,255,0.32)_0%,rgba(56,160,255,0)_72%),linear-gradient(180deg,#081a2f_0%,#0a2340_30%,#0b3354_55%,#0e5f8f_85%,#1290c3_100%)]"
      />
      {children}
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
    <KvWindow>
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
        <StrengthPiece strength={strength} className="w-36 sm:w-44" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="done">First stroke made</Badge>
          </div>
          <p className="mt-4 font-[family-name:var(--font-kv-condensed)] text-[0.9375rem] uppercase tracking-[0.18em] text-sky">
            Your piece
          </p>
          <p className="wordmark mt-1 text-5xl text-white sm:text-6xl">{s.name}</p>
          <p className="t-h3 mt-2 text-sky">{s.tagline}</p>
          <p className="t-body mt-3 max-w-md text-white/85">{s.piece}</p>
          <p className="t-small mt-4 text-white/60">
            Dibuat {formatTime(at)} · tersimpan di perangkat ini
          </p>
          {onChange && (
            <button
              type="button"
              onClick={onChange}
              className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              <PencilLine className="size-4" />
              Change my answer
            </button>
          )}
        </div>
      </div>
    </KvWindow>
  );
}
