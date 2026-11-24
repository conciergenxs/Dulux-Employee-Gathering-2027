import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { PARTICIPANT, actions, formatTime, useParticipant } from "@/lib/participant";

/**
 * The participant's pre-generated handwritten signature, on a white card, with
 * the one button that activates it (client deck: "This Is My Commitment").
 * Once activated it would appear live on the LED wall.
 */
export function SignatureCard() {
  const state = useParticipant();
  const reduce = useReducedMotion();
  const signed = state.aop?.signedAt;

  return (
    <div className="paper mx-auto w-full max-w-sm overflow-hidden text-left">
      <div className="px-5 pb-4 pt-5">
        <p className="font-[family-name:var(--font-kv-condensed)] text-[0.8125rem] uppercase tracking-[0.18em] text-paper-muted">
          AOP Charter 2027 · Signed by
        </p>
        <div className="relative mt-3 grid h-28 place-items-center">
          <motion.p
            initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
            className="font-['Great_Vibes',cursive] text-[2.75rem] leading-none text-[#0a2c52]"
          >
            {PARTICIPANT.name}
          </motion.p>
          <span aria-hidden className="absolute inset-x-2 bottom-3 h-px bg-[#0a2c52]/20" />
        </div>
        <p className="text-[0.8125rem] text-paper-muted">
          {PARTICIPANT.name} · {PARTICIPANT.department}
        </p>
      </div>

      <div className="border-t border-paper-border bg-[#f4f8fc] px-5 py-4">
        {signed ? (
          <p className="flex items-center gap-2.5 text-[0.9375rem] font-semibold text-[#0a2c52]">
            <span className="grid size-7 place-items-center rounded-full bg-[image:var(--gradient-kv-blue)] text-white">
              <Check className="size-4" strokeWidth={3} />
            </span>
            Komitmenmu sudah aktif
            <span className="ml-auto text-[0.75rem] font-normal text-paper-muted">
              {formatTime(signed)}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => actions.signAop()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-kv-blue)] text-[0.9375rem] font-bold text-white shadow-[0_10px_24px_-12px_rgba(13,74,128,0.75)] active:scale-[0.98]"
          >
            This Is My Commitment
          </button>
        )}
      </div>
    </div>
  );
}
