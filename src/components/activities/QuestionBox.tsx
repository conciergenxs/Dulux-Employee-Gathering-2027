import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { MessageSquarePlus, Send } from "lucide-react";
import { SuccessMark } from "@/components/site/SuccessMark";
import { InfoNote } from "@/components/activities/Badges";
import { actions, formatTime, useParticipant } from "@/lib/participant";

const MAX = 300;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Change Talk Question Box (deck p.23): an anonymous box for questions about
 * Dulux's 2027 direction, grouped by a moderator before The Change Talk.
 * In this prototype nothing is sent — questions stay in this browser.
 */
export function QuestionBox() {
  const state = useParticipant();
  const reduce = Boolean(useReducedMotion());
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const fieldId = useId();
  const trimmed = text.trim();
  const tooShort = trimmed.length < 8;

  return (
    <div className="space-y-4">
      <div className="surface overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="px-5 py-9 text-center sm:px-8"
              role="status"
            >
              <SuccessMark reduce={reduce} fresh />
              <p className="t-h2 mt-6 text-white">
                Question <span className="text-together">received</span>
              </p>
              <p className="t-body mx-auto mt-3 max-w-sm text-muted-foreground">
                Terima kasih. Pertanyaanmu akan dibawakan moderator di The Change Talk.
              </p>
              <button type="button" onClick={() => setSent(false)} className="btn btn-ghost mt-6">
                <MessageSquarePlus className="size-4" />
                Ask another question
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="p-5 sm:p-7"
              onSubmit={(e) => {
                e.preventDefault();
                if (tooShort) return;
                actions.addQuestion(trimmed);
                setText("");
                setSent(true);
              }}
            >
              <label htmlFor={fieldId} className="t-h3 block text-white">
                What would you like leadership to answer about 2027?
              </label>
              <p className="t-small mt-1.5 text-muted-foreground">
                Satu pertanyaan per kiriman. Kamu bisa mengirim lebih dari satu.
              </p>
              <div className="relative mt-4">
                <textarea
                  id={fieldId}
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, MAX))}
                  rows={5}
                  placeholder="Tulis pertanyaanmu…"
                  className="block w-full resize-none rounded-2xl border border-border bg-navy-950/60 px-4 py-3.5 text-[0.9375rem] leading-relaxed text-white placeholder:text-white/35 focus:border-cyan focus:outline-none"
                />
                <span
                  className={`pointer-events-none absolute bottom-3 right-4 text-xs tabular-nums ${
                    text.length >= MAX ? "text-ice" : "text-white/40"
                  }`}
                  aria-live="polite"
                >
                  {text.length}/{MAX}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <InfoNote>Dikirim tanpa nama. Nama dan pass kamu tidak ikut terkirim.</InfoNote>
                <button type="submit" disabled={tooShort} className="btn btn-primary shrink-0">
                  <Send className="size-4" />
                  Send anonymously
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {state.questions.length > 0 && (
        <div className="surface p-5">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-sky">
            Your questions · {state.questions.length}
          </p>
          <ul className="mt-3 space-y-3">
            {state.questions
              .slice()
              .reverse()
              .slice(0, 3)
              .map((q) => (
                <li key={q.id} className="border-l-2 border-cyan/50 pl-3">
                  <p className="text-sm text-white/90">“{q.text}”</p>
                  <p className="mt-0.5 text-[0.6875rem] text-white/50">{formatTime(q.at)}</p>
                </li>
              ))}
          </ul>
          <p className="mt-3 text-[0.6875rem] text-white/50">Hanya terlihat di perangkat ini.</p>
        </div>
      )}
    </div>
  );
}
