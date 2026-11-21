import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { z } from "zod";
import { PassportCard } from "@/components/passport/PassportCard";
import { PageHero } from "@/components/site/PageHero";
import { KvTexture, PageField } from "@/components/site/PageField";
import { Checklist } from "@/components/passport/Checklist";
import { ActivityDetail, ActivityQuota } from "@/components/passport/ActivityQuota";
import { QUOTA_ACTIVITIES } from "@/lib/quota";
import { FaqSection } from "@/components/passport/PassportFaq";
import { QrFullscreen } from "@/components/passport/QrFullscreen";
import { Sheet } from "@/components/passport/Sheet";
import { CheckInPanel } from "@/components/activities/CheckIn";
import { ARRIVAL_STEPS, DAY1, EVENT, PASSPORT_FAQ } from "@/lib/event";
import { PARTICIPANT, useParticipant, type CheckInId } from "@/lib/participant";

const searchSchema = z.object({
  /** Open an activity sheet. */
  a: z.enum(["welcome", "sunset-welcome"]).optional().catch(undefined),
  /** Open the full-screen QR. */
  qr: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/passport")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: `My Canvas Pass — ${EVENT.name}` },
      {
        name: "description",
        content:
          "Your personal pass for Greater Together 2027: QR check-in, pre-event checklist, Day 1 activity status and FAQ.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PassportPage,
});

function PassportPage() {
  const state = useParticipant();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();

  // Sheets are URL state (as on the JTI pass) so the phone's back button
  // closes them. Only pop history for sheets we pushed ourselves.
  const pushedRef = useRef(false);
  const open = (patch: z.infer<typeof searchSchema>) => {
    pushedRef.current = true;
    void navigate({ search: (prev) => ({ ...prev, ...patch }), resetScroll: false });
  };
  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      router.history.back();
      return;
    }
    void navigate({ search: {}, replace: true, resetScroll: false });
  }, [navigate, router]);

  const activity = QUOTA_ACTIVITIES.find((a) => a.id === search.a);
  const anyOpen = Boolean(activity || search.qr);
  useEffect(() => {
    if (!anyOpen) pushedRef.current = false;
  }, [anyOpen]);

  return (
    <>
      <PageHero tight inline eyebrow={EVENT.name} title="My Canvas" accent="Pass" />
      <SeeDetailsCue />

      {/* The planner sitemap's Passport, in its order: the pass (QR, name,
          checklist and activity), your checklist, activity quota (with the
          redemption tab), FAQ. The same order as the Infinity passport.
          Phone: one column, the pass first. Laptop: the pass stays in view on
          the left while the rest scrolls beside it. */}
      <PageField>
        <KvTexture side="right" className="top-0" />
        <KvTexture side="left" className="bottom-16" />
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-16 lg:px-5 lg:pb-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <PassportCard state={state} onEnlarge={() => open({ qr: true })} />
          </div>
          <div className="relative">
            <Checklist state={state} />
            <ActivityQuota state={state} onOpen={(id) => open({ a: id })} />
            <FaqSection
              items={PASSPORT_FAQ}
              narrow
              className="pb-20 pt-14 sm:pt-16 lg:px-0 lg:pb-0"
            />
          </div>
        </div>
      </PageField>

      <Sheet open={Boolean(activity)} onClose={close} title={activity?.name ?? "Activity"}>
        {activity && (
          <ActivityDetail
            activity={activity}
            claimed={state.checkIns[activity.id] ? 1 : 0}
            onShowQr={() => {
              pushedRef.current = true;
              void navigate({
                search: (prev) => ({ ...prev, a: undefined, qr: true }),
                resetScroll: false,
              });
            }}
          />
        )}
      </Sheet>

      <QrFullscreen
        open={Boolean(search.qr)}
        value={`DEG27:${PARTICIPANT.passCode}`}
        label={PARTICIPANT.passCode}
        onClose={close}
      />
    </>
  );
}

/** From the JTI pass: a chip at the foot of the first screen saying there's more below. */
function SeeDetailsCue() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.scrollY > 24) return;
    const appear = window.setTimeout(() => setShown(true), 900);
    const onScroll = () => {
      if (window.scrollY > 24) {
        window.clearTimeout(appear);
        setShown(false);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(appear);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {shown && (
        <motion.button
          key="see-details"
          type="button"
          onClick={() =>
            document
              .getElementById("checklist")
              ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
          }
          initial={{ opacity: 0, y: 16 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: [1, 0.6, 1], y: [0, 6, 0] }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.25 } }}
          transition={
            reduce ? { duration: 0.3 } : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] lg:hidden left-1/2 z-30 -ml-[4.75rem] inline-flex w-[9.5rem] items-center justify-center gap-1.5 rounded-full bg-white py-2.5 text-sm font-semibold text-navy-900 shadow-[var(--shadow-lift)] active:scale-95"
        >
          See details
          <ChevronDown className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
