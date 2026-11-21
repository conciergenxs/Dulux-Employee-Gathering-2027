import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Maximize2 } from "lucide-react";
import { PassportQr } from "@/components/passport/PassportQr";
import { StrengthPiece } from "@/components/canvas/Canvas";
import { Badge } from "@/components/activities/Badges";
import { STRENGTHS } from "@/lib/event";
import { PARTICIPANT, progressOf, type ParticipantState } from "@/lib/participant";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * My Canvas Pass. The JTI pass order is kept — the code first, for when a
 * scanner is pointed at it, then whose it is and how far along they are — and
 * the Dulux layer adds the participant's piece from The First Stroke and the
 * "Your Piece Has Arrived" state after check-in.
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
    <section className="relative">
      <div className="relative mx-auto max-w-md px-4 sm:px-6 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="paper overflow-hidden"
        >
          {/* Arrival state: the deck's "Your Piece Has Arrived" banner. */}
          {p.arrived ? (
            <div className="flex items-center justify-between gap-3 bg-[image:var(--gradient-together)] px-5 py-3 text-navy-950">
              <span className="font-display text-lg uppercase tracking-wide">
                Your Piece Has Arrived
              </span>
              <span className="text-xs font-semibold">Checked in</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 bg-[linear-gradient(100deg,#0a35c8_0%,#1f6bff_100%)] px-5 py-3 text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">Registered</span>
              <span className="text-xs text-white/70">Tunjukkan QR ini saat check-in</span>
            </div>
          )}

          <div className="px-5 pb-5 pt-6 sm:px-7">
            <button
              type="button"
              onClick={onEnlarge}
              aria-label="Enlarge the QR code for the scanner"
              className="group relative mx-auto block w-full max-w-[16.5rem] transition-transform duration-300 active:scale-[0.97]"
            >
              <PassportQr value={`DEG27:${PARTICIPANT.passCode}`} />
              <span className="absolute -bottom-2 -right-2 grid size-9 place-items-center rounded-full bg-navy-900 text-white shadow-lg transition-transform group-hover:scale-110">
                <Maximize2 className="size-4" />
              </span>
            </button>

            <div className="mt-6 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="t-micro text-paper-muted">Pass holder</p>
                <p className="truncate bg-[linear-gradient(100deg,#01145f_0%,#0a37db_55%,#1f7bff_100%)] bg-clip-text pr-[0.06em] font-display text-[1.75rem] uppercase leading-tight text-transparent">
                  {PARTICIPANT.name}
                </p>
                <p className="t-small text-paper-muted">
                  {PARTICIPANT.department} · {PARTICIPANT.passCode}
                </p>
              </div>
            </div>

            {/* The piece from The First Stroke, or the slot waiting for it. */}
            {strength ? (
              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-navy-900 p-3.5 text-white">
                <StrengthPiece strength={strength.id} className="w-14 shrink-0" />
                <div className="min-w-0">
                  <p className="t-micro text-sky">Your piece</p>
                  <p className="wordmark text-2xl">{strength.name}</p>
                  <p className="text-xs text-white/75">{strength.tagline}</p>
                </div>
              </div>
            ) : (
              <Link
                to="/activities"
                search={{ section: "before" }}
                hash="first-stroke"
                className="group mt-5 flex items-center gap-4 rounded-2xl border border-[#c9d8f5] bg-[#f5f8ff] p-3.5 transition-colors hover:border-royal"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#eef4ff] font-display text-2xl text-royal">
                  ?
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-navy-900">
                      Your piece is waiting
                    </span>
                  </span>
                  <span className="block text-xs text-paper-muted">
                    Isi The First Stroke untuk melengkapi pass
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-royal transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-paper-border bg-paper-border">
              <Stat label="Checklist" value={p.checklistDone} total={p.checklistTotal} />
              <Stat label="Activities" value={p.activitiesDone} total={p.activitiesTotal} />
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <div className="bg-white px-4 py-3">
      <dt className="t-micro text-paper-muted">{label}</dt>
      <dd className="mt-0.5 flex items-baseline gap-1">
        <span className="font-display text-2xl text-navy-900">{value}</span>
        <span className="t-small text-paper-muted">/ {total}</span>
      </dd>
    </div>
  );
}
