import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import { BedDouble, Check, Gift, Hand, Lock, QrCode, ScanLine, Users } from "lucide-react";
import { useOverlayLifecycle } from "@/hooks/use-overlay-lifecycle";
import { SuccessMark } from "@/components/site/SuccessMark";
import { QrFullscreen } from "@/components/passport/QrFullscreen";
import { Badge, PrototypeNote } from "@/components/activities/Badges";
import { useDemoMode } from "@/lib/demo";
import { CHECK_INS, type CheckIn } from "@/lib/event";
import {
  PARTICIPANT,
  actions,
  formatTime,
  useParticipant,
  type CheckInId,
} from "@/lib/participant";

const EASE = [0.22, 1, 0.36, 1] as const;

const BY_ID = Object.fromEntries(CHECK_INS.map((c) => [c.id, c])) as Record<CheckInId, CheckIn>;

/**
 * A self check-in opens once the participant has arrived. A crew check-in
 * never locks: showing the QR is always the right move, and the crew decides.
 */
function isLocked(id: CheckInId, checkIns: Partial<Record<CheckInId, string>>) {
  return BY_ID[id].mode === "self" && !checkIns.welcome;
}

/**
 * One check-in, wherever it is offered (the pass sheet and the Activities
 * page): its status, then the way in. A crew check-in shows the QR to the
 * crew, with — set apart and labelled — a button that stands in for the
 * crew's scanner in this prototype. A self check-in is one button the
 * participant presses once they're there.
 */
export function CheckInPanel({ id, bare = false }: { id: CheckInId; bare?: boolean }) {
  const demo = useDemoMode();
  const state = useParticipant();
  const [qr, setQr] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const item = BY_ID[id];
  const self = item.mode === "self";
  const at = state.checkIns[id];
  const locked = isLocked(id, state.checkIns);
  const closeQr = useCallback(() => setQr(false), []);
  const closeCelebrate = useCallback(() => setCelebrate(false), []);

  return (
    <div className={bare ? "" : "surface p-4 sm:p-5"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-white/8 text-cyan">
            {self ? <Hand className="size-[1.1rem]" /> : <ScanLine className="size-[1.1rem]" />}
          </span>
          <div>
            <p className="t-micro text-muted-foreground">
              {self ? "Self check-in" : "Crew check-in"}
            </p>
            <p className="text-sm font-semibold text-white">{item.where}</p>
          </div>
        </div>
        {at ? (
          <Badge tone="done">{id === "welcome" ? "Your piece has arrived" : "Checked in"}</Badge>
        ) : locked ? (
          <Badge tone="soon">After arrival check-in</Badge>
        ) : null}
      </div>

      {at ? (
        <p className="t-small mt-4 text-muted-foreground">
          Check-in pada {formatTime(at)}.{" "}
          {id === "welcome" && (
            <button
              type="button"
              onClick={() => setCelebrate(true)}
              className="font-semibold text-cyan underline-offset-4 hover:underline"
            >
              View arrival details
            </button>
          )}
        </p>
      ) : self ? (
        <button
          type="button"
          disabled={locked}
          onClick={() => {
            actions.checkIn(id);
            setCelebrate(true);
          }}
          className="btn btn-primary mt-4 w-full font-bold sm:w-auto"
        >
          {locked ? <Lock className="size-4" /> : <Check className="size-4" strokeWidth={2.5} />}
          Check in now
        </button>
      ) : (
        <>
          {/* Wherever a card asks for the QR, the QR is one tap away. */}
          <button
            type="button"
            onClick={() => setQr(true)}
            className="btn btn-primary mt-4 w-full font-bold sm:w-auto"
          >
            <QrCode className="size-4" />
            Show my QR to the crew
          </button>
          {demo && (
            <div className="proto mt-4 p-3.5">
              <PrototypeNote>
                Mode demo. Di acara, scanner milik crew yang mengonfirmasi check-in. Tombol ini
                menggantikan scan tersebut untuk menampilkan status konfirmasinya.
              </PrototypeNote>
              <button
                type="button"
                disabled={locked}
                onClick={() => {
                  actions.checkIn(id);
                  setCelebrate(true);
                }}
                className="btn btn-ghost mt-3 min-h-10 w-full text-[0.8125rem] sm:w-auto"
              >
                Simulate crew scan
              </button>
            </div>
          )}
        </>
      )}

      <QrFullscreen
        open={qr}
        value={`DEG27:${PARTICIPANT.passCode}`}
        label={PARTICIPANT.passCode}
        onClose={closeQr}
      />
      <AnimatePresence>
        {celebrate && <ArrivalDialog id={id} onClose={closeCelebrate} />}
      </AnimatePresence>
    </div>
  );
}

/**
 * A one-line check-in for a row in a list (the team-building stages): the
 * name's status on the right, and for a self check-in, the button itself.
 */
export function CompactCheckIn({ id }: { id: CheckInId }) {
  const state = useParticipant();
  const at = state.checkIns[id];
  const locked = isLocked(id, state.checkIns);
  if (at) return <Badge tone="done">Checked in</Badge>;
  if (BY_ID[id].mode === "crew") return <Badge tone="pending">Crew scan</Badge>;
  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => actions.checkIn(id)}
      className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-silver/60 px-3.5 text-[0.8125rem] font-semibold text-white transition-colors hover:border-silver hover:bg-white/[0.06] disabled:opacity-45"
    >
      {locked ? <Lock className="size-3.5" /> : <Check className="size-3.5" strokeWidth={2.5} />}
      Check in
    </button>
  );
}

function ArrivalDialog({ id, onClose }: { id: CheckInId; onClose: () => void }) {
  const reduce = Boolean(useReducedMotion());
  const panelRef = useOverlayLifecycle(true, onClose);
  const welcome = id === "welcome";
  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay: d, ease: EASE },
  });

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center px-5">
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 w-full cursor-default bg-navy-950/80"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="arrival-title"
        tabIndex={-1}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-h-[90dvh] w-full max-w-sm overflow-y-auto rounded-[1.75rem] border border-border bg-navy-900 px-6 pb-6 pt-9 text-center outline-none"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[image:var(--glow-field)]"
        />
        <SuccessMark reduce={reduce} fresh />
        <motion.p {...rise(0.35)} className="eyebrow relative mt-6">
          {BY_ID[id].name} · Check-in
        </motion.p>
        <motion.h2 {...rise(0.42)} id="arrival-title" className="t-h2 relative mt-2 text-white">
          {welcome
            ? "Your Piece Has Arrived."
            : id === "sunset-welcome"
              ? "Welcome to the Sunset."
              : "You're Checked In."}
        </motion.h2>
        <motion.p
          {...rise(0.5)}
          className="t-small relative mx-auto mt-3 max-w-[18rem] text-muted-foreground"
        >
          {welcome
            ? "Dari undangan digital, menjadi rasa memiliki yang nyata."
            : id === "sunset-welcome"
              ? "Satu senja, banyak cerita. Nikmati musiknya, hidangannya, dan orang-orang di sekitarmu."
              : `${BY_ID[id].name} sudah tercatat di My Canvas Pass-mu.`}
        </motion.p>

        {welcome && (
          <motion.ul {...rise(0.6)} className="relative mt-6 space-y-2 text-left">
            {[
              { icon: Users, k: "Your team", v: `${PARTICIPANT.team}` },
              { icon: BedDouble, k: "Your room", v: `${PARTICIPANT.room}` },
              {
                icon: Gift,
                k: "Collect",
                v: "Welcome kit + clue pack tersegel untuk besok",
              },
            ].map((row) => (
              <li key={row.k} className="flex items-center gap-3 rounded-xl bg-white/6 px-3.5 py-3">
                <row.icon className="size-4 shrink-0 text-cyan" />
                <span className="min-w-0 flex-1">
                  <span className="t-micro block text-muted-foreground">{row.k}</span>
                  <span className="block text-sm font-semibold text-white">{row.v}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        )}

        <motion.div {...rise(0.7)} className="relative mt-6">
          <button type="button" onClick={onClose} className="btn btn-primary w-full">
            {welcome ? "Settle in" : "Close"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
