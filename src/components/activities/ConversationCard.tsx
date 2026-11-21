import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import { MessagesSquare, RotateCw, X } from "lucide-react";
import { useOverlayLifecycle } from "@/hooks/use-overlay-lifecycle";
import { CONVERSATION_CARD, EVENT } from "@/lib/event";
import { KV_TOP_LEFT, Mosaic } from "@/components/canvas/Canvas";

/**
 * The Open Table's conversation card (deck p.39): one simple question per
 * table. Opens as a card that turns over to show the question.
 */
export function ConversationCardButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-primary">
        <MessagesSquare className="size-4" />
        Open the conversation card
      </button>
      <AnimatePresence>{open && <CardDialog onClose={close} />}</AnimatePresence>
    </>
  );
}

function CardDialog({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const panelRef = useOverlayLifecycle(true, onClose);
  const [flipped, setFlipped] = useState(Boolean(reduce));

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center px-5">
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 w-full cursor-default bg-navy-950/85"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Conversation card"
        tabIndex={-1}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full max-w-[22rem] outline-none [perspective:1400px]"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[3/4] w-full [transform-style:preserve-3d]"
        >
          {/* Front: the card face, in the KV's language. */}
          <button
            type="button"
            onClick={() => setFlipped(true)}
            aria-hidden={flipped}
            tabIndex={flipped ? -1 : 0}
            className="absolute inset-0 overflow-hidden rounded-[1.6rem] bg-[image:var(--gradient-royal)] p-6 text-left [backface-visibility:hidden]"
          >
            <Mosaic
              tiles={KV_TOP_LEFT}
              cols={4}
              rows={4}
              className="absolute -left-6 -top-6 w-48 opacity-90"
            />
            <div className="absolute inset-x-6 bottom-6">
              <p className="eyebrow">The Open Table</p>
              <p className="wordmark mt-2 text-4xl text-white">
                Greater
                <br />
                <span className="text-together">Together</span>
              </p>
              <p className="t-small mt-4 inline-flex items-center gap-1.5 font-semibold text-white">
                <RotateCw className="size-4" /> Ketuk untuk membalik kartu
              </p>
            </div>
          </button>

          {/* Back: the question. */}
          <div
            aria-hidden={!flipped}
            className="paper absolute inset-0 flex flex-col justify-between p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <p className="t-micro text-royal">Conversation card · one per table</p>
            <p className="font-display text-[2.1rem] uppercase leading-[1.02] text-navy-900">
              {CONVERSATION_CARD}
            </p>
            <p className="t-small text-paper-muted">
              Jawab bergantian di meja. Tidak ada jawaban yang salah.
              <span className="mt-1 block text-[0.6875rem] uppercase tracking-[0.14em]">
                {EVENT.name}
              </span>
            </p>
          </div>
        </motion.div>

        <button type="button" onClick={onClose} className="btn btn-ghost mx-auto mt-5 flex">
          <X className="size-4" />
          Close
        </button>
      </motion.div>
    </div>
  );
}
