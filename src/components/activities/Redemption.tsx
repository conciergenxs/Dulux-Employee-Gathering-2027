import { Check, Gift, Lock } from "lucide-react";
import { SUNSET_GAMES } from "@/lib/event";
import { gamesOf } from "@/lib/quota";
import { useParticipant } from "@/lib/participant";

/**
 * Sunset Social's reward: both games scanned, then the reward is picked up at
 * the redemption area (Glowact). Shows progress until then.
 */
export function RedemptionStatus() {
  const state = useParticipant();
  const g = gamesOf(state);
  return (
    <div className="surface p-5 sm:p-6">
      <div className="flex items-start gap-3.5">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-xl ${
            g.unlocked
              ? "bg-[image:var(--gradient-together)] text-navy-950"
              : "bg-white/[0.08] text-cyan"
          }`}
        >
          {g.unlocked ? <Gift className="size-5" /> : <Lock className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[1rem] font-semibold text-white">
            {g.unlocked ? "Reward siap ditukar" : "Selesaikan 2 games untuk membuka reward"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-white/65">
            {g.unlocked
              ? `Tunjukkan QR My Canvas Pass-mu di ${SUNSET_GAMES.where}.`
              : `Main dan scan di setiap game. Setelah dua-duanya selesai, tukarkan reward di ${SUNSET_GAMES.where}.`}
          </p>
        </div>
        <span className="shrink-0 font-display text-xl tabular-nums text-white">
          {g.done}/{g.total}
        </span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[image:var(--gradient-together)] transition-[width] duration-700"
          style={{ width: `${(g.done / g.total) * 100}%` }}
        />
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-white/70">
        {SUNSET_GAMES.games.map((game, i) => {
          const done = Boolean(state.checkIns[SUNSET_GAMES.ids[i]!]);
          return (
            <li key={game.name} className="inline-flex items-center gap-1.5">
              <Check
                className={`size-3.5 ${done ? "text-cyan" : "text-white/25"}`}
                strokeWidth={3}
              />
              {game.name}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 border-t border-white/[0.08] pt-3 text-[0.8125rem] text-white/60">
        Reward: {SUNSET_GAMES.rewards.join(", ")}.
      </p>
    </div>
  );
}
