import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Lock, MonitorSmartphone } from "lucide-react";
import { z } from "zod";
import { PageHero } from "@/components/site/PageHero";
import { SignatureCard } from "@/components/aop/Signature";
import { AOP_CHARTER, EVENT } from "@/lib/event";
import { actions, useParticipant } from "@/lib/participant";

export const Route = createFileRoute("/sign")({
  validateSearch: z.object({ k: z.string().optional().catch(undefined) }),
  head: () => ({
    meta: [
      { title: `AOP Charter Sign-Off — ${EVENT.name}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SignPage,
});

/**
 * AOP Charter Sign-Off, step 2–3: the LED's QR opens this page with the
 * charter key, which unlocks the participant's signature on this device. Any
 * other visit (a shared link without the key, an early peek) sees how to open
 * it instead, so the signing stays tied to the moment in the ballroom.
 */
function SignPage() {
  const { k } = Route.useSearch();
  const state = useParticipant();
  const keyOk = k === AOP_CHARTER.key;
  useEffect(() => {
    if (keyOk) actions.unlockAop();
  }, [keyOk]);
  const open = keyOk || Boolean(state.aop);

  return (
    <PageHero
      tight
      eyebrow="AOP Charter Sign-Off"
      title="One Vision."
      accent="One Shared Commitment."
      {...(open ? { intro: AOP_CHARTER.tagline } : {})}
    >
      <div className="mt-7 w-full sm:mt-9">
        {open ? (
          <SignatureCard />
        ) : (
          <div className="mx-auto max-w-sm rounded-[0.75rem_1.75rem_0.75rem_1.75rem] border border-silver/35 bg-[#071a33]/55 p-5 text-left backdrop-blur-sm">
            <span className="grid size-11 place-items-center rounded-xl bg-white/[0.08] text-cyan">
              <Lock className="size-5" />
            </span>
            <p className="mt-4 text-[1rem] font-semibold text-white">Halaman ini belum terbuka</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              Tanda tangan digitalmu terbuka saat AOP Charter Sign-Off di Greater Together Kick-off
              Night (Day 2, malam). Scan QR yang tampil di layar LED ballroom dengan kamera HP-mu.
            </p>
            <p className="mt-4 flex items-center gap-2 text-[0.8125rem] text-white/60">
              <MonitorSmartphone className="size-4 text-cyan" />
              QR hanya tampil di layar LED saat sesi berlangsung.
            </p>
            <Link
              to="/activities"
              search={{ section: "day2" }}
              hash="aop-charter"
              className="mt-5 inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white"
            >
              Lihat AOP Charter
            </Link>
          </div>
        )}
      </div>
    </PageHero>
  );
}
