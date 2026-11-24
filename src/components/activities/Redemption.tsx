import { motion } from "motion/react";
import { Check, Gift, Lock } from "lucide-react";
import { COLOUR_SYNC, SUNSET_GAMES } from "@/lib/event";
import { gamesOf } from "@/lib/quota";
import { useParticipant } from "@/lib/participant";
import connectionPin from "@/assets/rewards/connection-pin.webp";
import puzzleKeychain from "@/assets/rewards/puzzle-keychain.webp";
import canvasMagnet from "@/assets/rewards/canvas-magnet.webp";
import toteBag from "@/assets/colour-sync/tote-bag.webp";
import cardHolder from "@/assets/colour-sync/card-holder.webp";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Sunset Social rewards (client deck). The pin photo is a generated reference. */
const SUNSET_REWARD_PHOTO: Record<string, string> = {
  "Connection Pin": connectionPin,
  "Puzzle Keychain": puzzleKeychain,
  "Canvas Magnet": canvasMagnet,
};

const COLOUR_SYNC_PHOTO: Record<(typeof COLOUR_SYNC.rewards.tiers)[number]["id"], string> = {
  winning: toteBag,
  participants: cardHolder,
};

type Reward = {
  id: string;
  name: string;
  image: string | undefined;
  /** The game the reward comes from. */
  source: string;
  done: number;
  total: number;
  ready: boolean;
  note: string;
};

/**
 * Everything a participant can redeem, one row per prize: the Sunset Social
 * rewards (both games played) and the Dulux Colour Sync prizes (played; the
 * team's result decides which one is handed over).
 */
export function RewardList() {
  const state = useParticipant();
  const sunset = gamesOf(state);
  const played = Boolean(state.checkIns["colour-sync"]);

  const rewards: Reward[] = [
    ...SUNSET_GAMES.rewards.map((name) => ({
      id: name,
      name,
      image: SUNSET_REWARD_PHOTO[name],
      source: "Sunset Social",
      done: sunset.done,
      total: sunset.total,
      ready: sunset.unlocked,
      note: sunset.unlocked
        ? `Siap ditukar di ${SUNSET_GAMES.where}.`
        : `Untuk yang menyelesaikan ${sunset.total} games Sunset Social: ${SUNSET_GAMES.games
            .map((g) => g.name)
            .join(" dan ")}.`,
    })),
    ...COLOUR_SYNC.rewards.tiers.map((t) => ({
      id: t.id,
      name: t.prize,
      image: COLOUR_SYNC_PHOTO[t.id],
      source: "Colour Sync",
      done: played ? 1 : 0,
      total: 1,
      ready: played,
      note: played
        ? `${t.id === "winning" ? "Kalau timmu match" : "Kalau timmu belum match"}, tukarkan di ${COLOUR_SYNC.redeemAt}.`
        : t.id === "winning"
          ? "Untuk tim yang berhasil mengangkat shade yang sama di Dulux Colour Sync."
          : "Untuk tim yang ikut Dulux Colour Sync tapi belum berhasil match.",
    })),
  ];

  return (
    <ul className="space-y-2.5">
      {rewards.map((r) => (
        <li key={r.id}>
          <RewardRow reward={r} />
        </li>
      ))}
    </ul>
  );
}

function RewardRow({ reward: r }: { reward: Reward }) {
  return (
    <div className="surface flex items-start gap-3.5 p-3">
      <span className="relative size-14 shrink-0">
        <span className="block size-full overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_50%_30%,#ffffff_0%,#eef5fb_60%,#d6e7f5_100%)]">
          {r.image && (
            <img
              src={r.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-contain p-1.5 mix-blend-multiply"
            />
          )}
        </span>
        {r.ready && (
          <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-[image:var(--gradient-together)] text-navy-950 ring-2 ring-navy-900">
            <Check className="size-3" strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="min-w-0 flex-1 text-base font-semibold text-white">{r.name}</span>
          <span className="shrink-0 text-[0.75rem] font-semibold tabular-nums text-white/55">
            {r.done}/{r.total}
          </span>
        </span>
        <span className="mt-2 flex items-center gap-2.5">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/[0.08] px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/70">
            <Gift className="size-3 text-cyan" />
            {r.source}
          </span>
          <span className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: r.done / r.total }}
              transition={{ duration: 0.8, ease: EASE }}
              className="block h-full origin-left rounded-full bg-[image:var(--gradient-together)]"
            />
          </span>
        </span>
        <span
          className={`mt-2 flex gap-1.5 text-[0.8125rem] leading-relaxed ${
            r.ready ? "text-cyan" : "text-white/60"
          }`}
        >
          {r.ready ? (
            <Gift className="mt-[0.2rem] size-3.5 shrink-0" />
          ) : (
            <Lock className="mt-[0.2rem] size-3.5 shrink-0 text-cyan" />
          )}
          {r.note}
        </span>
      </span>
    </div>
  );
}
