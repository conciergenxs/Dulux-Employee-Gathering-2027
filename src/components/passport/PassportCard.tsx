import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Check, Maximize2 } from "lucide-react";
import { PassportQr } from "@/components/passport/PassportQr";
import { StrengthPiece } from "@/components/canvas/Canvas";
import { STRENGTHS } from "@/lib/event";
import { PARTICIPANT, progressOf, type ParticipantState } from "@/lib/participant";

const EASE = [0.22, 1, 0.36, 1] as const;

/** One glass recipe for everything that sits in the KV window. */
const GLASS = "border border-silver/35 bg-[#071a33]/45 backdrop-blur-sm";

/**
 * My Canvas Pass, set straight into the page hero's KV window: no card of its
 * own. The JTI pass order is kept — the code first, for when a scanner is
 * pointed at it, then whose it is and how far along they are — and the Dulux
 * layer adds the participant's piece from The First Stroke and the "Your
 * Piece Has Arrived" state after check-in.
 *
 * Phone: one column. Laptop: the code on the left, the rest beside it, so the
 * hero stays one screen tall.
 */
export function PassportCard({
  state,
  onEnlarge,
}: {
  state: ParticipantState;
  onEnlarge: () => void;
}) {
  const p = progressOf(state);
  const strength = state.firstStroke
    ? STRENGTHS.find((s) => s.id === state.firstStroke!.strength)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
      className="mt-7 w-full max-w-sm text-left sm:mt-9 lg:grid lg:max-w-3xl lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-center lg:gap-10"
    >
      <div>
        {p.arrived && (
          <p className="mb-3 flex items-center justify-center gap-1.5 font-[family-name:var(--font-kv-condensed)] text-[0.9375rem] uppercase tracking-[0.16em] text-white">
            <Check className="size-4 text-cyan" strokeWidth={2.5} />
            Your piece has arrived
          </p>
        )}
        {/* The code keeps a white tile of its own: a scanner needs dark on
            light. It is the only white in the window. */}
        <button
          type="button"
          onClick={onEnlarge}
          aria-label="Enlarge the QR code for the scanner"
          className="group relative mx-auto block w-full max-w-[15rem] rounded-[1.25rem] bg-white p-3.5 shadow-[0_18px_40px_-20px_rgba(0,10,30,0.8)] transition-transform duration-300 active:scale-[0.97]"
        >
          <PassportQr value={`DEG27:${PARTICIPANT.passCode}`} />
          <span className="absolute -bottom-2.5 -right-2.5 grid size-10 place-items-center rounded-full border-[1.5px] border-white bg-navy-900 text-white transition-transform group-hover:scale-110">
            <Maximize2 className="size-4" />
          </span>
        </button>
      </div>

      <div className="mt-7 lg:mt-0">
        <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky">
          Pass holder
        </p>
        <p className="wordmark mt-1 truncate text-[1.75rem] text-white">{PARTICIPANT.name}</p>
        <p className="mt-1 text-sm text-white/75">
          {PARTICIPANT.department} · {PARTICIPANT.passCode}
        </p>

        {/* The piece from The First Stroke, or the slot waiting for it. */}
        {strength ? (
          <div className={`mt-5 flex items-center gap-4 rounded-2xl p-3.5 ${GLASS}`}>
            <StrengthPiece strength={strength.id} className="w-14 shrink-0" />
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-kv-condensed)] text-[0.8125rem] uppercase tracking-[0.16em] text-sky">
                Your piece
              </p>
              <p className="wordmark text-2xl text-white">{strength.name}</p>
              <p className="text-xs text-white/75">{strength.tagline}</p>
            </div>
          </div>
        ) : (
          <Link
            to="/activities"
            search={{ section: "before" }}
            hash="first-stroke"
            className={`group mt-5 flex items-center gap-4 rounded-2xl p-3.5 transition-colors hover:border-silver/70 ${GLASS}`}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-dashed border-silver/50 font-display text-xl text-white">
              ?
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-white">Your piece is waiting</span>
              <span className="block text-xs text-white/70">
                Isi The First Stroke untuk melengkapi pass
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}

        <dl className="mt-3 grid grid-cols-2 gap-3">
          <Stat label="Checklist" value={p.checklistDone} total={p.checklistTotal} />
          <Stat label="Activities" value={p.activitiesDone} total={p.activitiesTotal} />
        </dl>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <div className={`rounded-xl px-4 py-3 ${GLASS}`}>
      <dt className="font-[family-name:var(--font-kv-condensed)] text-[0.8125rem] uppercase tracking-[0.16em] text-sky">
        {label}
      </dt>
      <dd className="mt-0.5 flex items-baseline gap-1">
        <span className="font-display text-2xl text-white">{value}</span>
        <span className="text-sm text-white/65">/ {total}</span>
      </dd>
    </div>
  );
}
