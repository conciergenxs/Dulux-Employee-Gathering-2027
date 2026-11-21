import { Link, createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { z } from "zod";
import {
  BedDouble,
  Bus,
  CalendarDays,
  Coffee,
  Fan,
  IdCard,
  MapPin,
  MessageCircleQuestion,
  MessagesSquare,
  Mic,
  Moon,
  Music,
  QrCode,
  Shirt,
  Sparkles,
  Sunset,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { KvTexture, PageField } from "@/components/site/PageField";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { MotionImage } from "@/components/site/MotionImage";
import { QrFullscreen } from "@/components/passport/QrFullscreen";
import { FirstStroke } from "@/components/activities/FirstStroke";
import { QuestionBox } from "@/components/activities/QuestionBox";
import { CheckInPanel } from "@/components/activities/CheckIn";
import { ConversationCardButton } from "@/components/activities/ConversationCard";
import { OneWordPulse } from "@/components/activities/OneWordPulse";
import { Badge } from "@/components/activities/Badges";
import { FactPill, SectionIntro } from "@/components/activities/SectionIntro";
import { StatusDot } from "@/components/passport/Checklist";
import {
  CHANGE_TALK_GUESTS,
  CHANGE_TALK_PARTS,
  EVENT,
  SPECIAL_WISHLIST,
  SUNSET_LINEUP,
  WELCOME_KIT,
} from "@/lib/event";
import { PARTICIPANT, progressOf, useParticipant, type CheckInId } from "@/lib/participant";
import lobby from "@/assets/venue/lobby.webp";
import roomView from "@/assets/venue/room-view.webp";
import sunsetWelcome from "@/assets/mood/sunset-welcome.webp";
import openTable from "@/assets/mood/open-table.webp";
import prazTeguh from "@/assets/people/praz-teguh.webp";
import ricoLubis from "@/assets/people/rico-lubis.webp";
import ernestPrakasa from "@/assets/people/ernest-prakasa.webp";
import nycBand from "@/assets/lineup/nyc-band.webp";
import overdoze from "@/assets/lineup/overdoze.webp";
import nayaNyxx from "@/assets/lineup/naya-nyxx.webp";
import nikitaRamli from "@/assets/lineup/nikita-ramli.webp";
import grindBoys from "@/assets/lineup/grind-boys.webp";

/**
 * One tab per phase, so it's always clear when something happens: before the
 * event, then each day. Day 1 lists its moments in rundown order; Day 2 and
 * Day 3 aren't finalised yet.
 */
const SECTIONS = ["before", "day1", "day2", "day3"] as const;
type Section = (typeof SECTIONS)[number];

/** Day 1 in the parts of the day the deck describes, one at a time. */
const PARTS = ["arrival", "sunset", "evening", "night"] as const;
type Part = (typeof PARTS)[number];

/** Older links named a part of Day 1 as a tab; they land on that part. */
const LEGACY: Record<string, Part> = {
  welcome: "arrival",
  sunset: "sunset",
  "change-talk": "evening",
  social: "night",
};

const searchSchema = z.object({
  section: z
    .enum([...SECTIONS, "welcome", "sunset", "change-talk", "social"])
    .optional()
    .catch(undefined),
  /** Which part of Day 1 is showing. */
  part: z.enum(PARTS).optional().catch(undefined),
  /** The pass QR, full screen over this page — closing it stays here. */
  qr: z.boolean().optional(),
});

export const Route = createFileRoute("/activities")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: `Activities — ${EVENT.name}` },
      {
        name: "description",
        content:
          "The First Stroke dan Change Talk Question Box sebelum acara, lalu semua aktivitas Day 1 Greater Together 2027.",
      },
    ],
  }),
  component: ActivitiesPage,
});

const TABS: { id: Section; label: string; sub: string }[] = [
  { id: "before", label: "Before Event", sub: "Pre-event" },
  { id: "day1", label: "Day 1", sub: "Wed, 16 Dec" },
  { id: "day2", label: "Day 2", sub: "Thu, 17 Dec" },
  { id: "day3", label: "Day 3", sub: "Fri, 18 Dec" },
];

/** Day 1's parts (Infinity's chips): what's in each, and when. */
const PART_CHIPS: { id: Part; label: string; sub: string; icon: LucideIcon; moments: string[] }[] =
  [
    {
      id: "arrival",
      label: "Arrival",
      sub: "Welcome · Journey to Sunset",
      icon: Sparkles,
      moments: ["welcome", "journey-to-sunset"],
    },
    {
      id: "sunset",
      label: "Sunset",
      sub: "Sunset Welcome · Open Table",
      icon: Sunset,
      moments: ["sunset-welcome", "open-table"],
    },
    {
      id: "evening",
      label: "Evening",
      sub: "The Change Talk",
      icon: Mic,
      moments: ["change-talk"],
    },
    { id: "night", label: "Night", sub: "Sunset Social", icon: Music, moments: ["sunset-social"] },
  ];

const PHOTOS: Record<string, string> = {
  "praz-teguh": prazTeguh,
  "rico-lubis": ricoLubis,
  "ernest-prakasa": ernestPrakasa,
  "nyc-band": nycBand,
  overdoze,
  "naya-nyxx": nayaNyxx,
  "nikita-ramli": nikitaRamli,
  "grind-boys": grindBoys,
};

const EASE = [0.22, 1, 0.36, 1] as const;

function ActivitiesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const legacyPart = search.section ? LEGACY[search.section] : undefined;
  const section: Section = legacyPart
    ? "day1"
    : ((search.section as Section | undefined) ?? "before");
  const hash = useRouterState({ select: (s) => s.location.hash });
  // A link to a moment opens the part it belongs to.
  const hashPart = PART_CHIPS.find((p) => p.moments.includes(hash))?.id;
  const part: Part = search.part ?? legacyPart ?? hashPart ?? "arrival";
  const contentRef = useRef<HTMLDivElement>(null);

  const choose = (next: Section) => {
    if (next === section) return;
    void navigate({
      search: (prev) => ({ ...prev, section: next, part: undefined }),
      hash: "",
      replace: true,
      resetScroll: false,
    });
    const top = contentRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Links from the pass land on a part of a tab; wait for the panel to animate in.
  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 480);
    return () => window.clearTimeout(t);
  }, [hash, section]);

  // The QR opens over this page as URL state, so the phone's back button closes it.
  const qrPushed = useRef(false);
  const openQr = () => {
    qrPushed.current = true;
    void navigate({ search: (prev) => ({ ...prev, qr: true }), resetScroll: false });
  };
  const closeQr = useCallback(() => {
    if (qrPushed.current) {
      qrPushed.current = false;
      router.history.back();
      return;
    }
    void navigate({
      search: (prev) => ({ ...prev, qr: undefined }),
      replace: true,
      resetScroll: false,
    });
  }, [navigate, router]);
  useEffect(() => {
    if (!search.qr) qrPushed.current = false;
  }, [search.qr]);

  return (
    <>
      <PageHero
        tight
        eyebrow="Activities"
        title="Everyone has"
        accent="something to bring"
        intro="Dari The First Stroke sebelum acara sampai Sunset Social di malam Day 1, semuanya ada di sini."
        introAction={
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-6"
          >
            <button
              type="button"
              onClick={openQr}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[linear-gradient(100deg,#ffffff_0%,#eef2ff_50%,#cbd8ff_100%)] px-5 text-sm font-bold text-navy-900 shadow-[0_12px_40px_-14px_rgba(110,165,255,0.9)] active:scale-95"
            >
              <QrCode className="size-4" />
              Show Your QR to Check In
            </button>
          </motion.div>
        }
      />

      <PageField>
        <KvTexture side="right" className="top-0" />
        <KvTexture side="left" className="bottom-16" />
        <section className="relative px-5 pb-20 sm:pb-28">
          <div ref={contentRef} className="relative mx-auto max-w-6xl scroll-mt-24">
            {/* One tab per phase: before the event, then each day. */}
            <div
              role="tablist"
              aria-label="Activities"
              className="mx-auto grid max-w-2xl grid-cols-[1.35fr_1fr_1fr_1fr] gap-1 rounded-full border border-white/12 bg-white/[0.05] p-1"
            >
              {TABS.map((t) => {
                const active = t.id === section;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => choose(t.id)}
                    className="relative min-h-12 rounded-full px-1 transition-colors active:scale-95"
                  >
                    {active && (
                      <motion.span
                        layoutId="activities-tab"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 340, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative block whitespace-nowrap text-[0.8125rem] font-semibold sm:text-sm ${active ? "text-navy-900" : "text-white"}`}
                    >
                      {t.label}
                    </span>
                    <span
                      className={`relative block whitespace-nowrap text-[0.625rem] sm:text-[0.6875rem] ${active ? "text-navy-900/65" : "text-white/55"}`}
                    >
                      {t.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                role="tabpanel"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-10 sm:mt-12"
              >
                {section === "before" ? (
                  <BeforeEvent />
                ) : section === "day1" ? (
                  <DayOne
                    part={part}
                    onPart={(next) => {
                      void navigate({
                        search: (prev) => ({ ...prev, section: "day1", part: next }),
                        hash: "",
                        replace: true,
                        resetScroll: false,
                      });
                      const top = contentRef.current?.getBoundingClientRect().top ?? 0;
                      if (top < 0)
                        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  />
                ) : (
                  <DayComingSoon day={section === "day2" ? "Day 2" : "Day 3"} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </PageField>

      <QrFullscreen
        open={Boolean(search.qr)}
        value={`DEG27:${PARTICIPANT.passCode}`}
        label={PARTICIPANT.passCode}
        onClose={closeQr}
      />
    </>
  );
}

/* ── Before event (Infinity's Games tab: the interactions, then a recap) ── */

function BeforeEvent() {
  const state = useParticipant();
  const p = progressOf(state);
  const rows = [
    {
      id: "first-stroke",
      name: "The First Stroke",
      tag: "Mandatory",
      done: Boolean(state.firstStroke),
    },
    {
      id: "question-box",
      name: "Change Talk Question Box",
      tag: "Optional",
      done: state.questions.length > 0,
    },
  ];

  return (
    <div>
      <SectionIntro
        id="first-stroke"
        eyebrow="Mandatory · On the microsite"
        title="The First"
        accent="Stroke"
        text="Pilih satu kekuatan yang paling menggambarkan dirimu. Cukup satu menit, dan jawabannya bisa diubah kapan saja."
      />
      <div className="mt-8">
        <FirstStroke />
      </div>

      <div className="mt-16 sm:mt-20">
        <SectionIntro
          id="question-box"
          eyebrow="Optional · On the microsite"
          title="Change Talk"
          accent="Question Box"
          text="Punya pertanyaan soal arah Dulux di 2027? Kirim di sini tanpa nama. Moderator akan membawakannya di The Change Talk, Day 1."
        />
        <div className="mt-8">
          <QuestionBox />
        </div>
      </div>

      {/* Recap: where the participant stands, mandatory and optional apart. */}
      <div id="recap" className="mt-16 scroll-mt-28 sm:mt-20">
        <SectionIntro eyebrow="Before the event" title="Your" accent="Recap" />
        <Reveal delay={0.06}>
          <div className="surface mt-8 p-5 sm:p-6">
            <p className="wordmark text-4xl text-white">
              {p.checklistDone}
              <span className="text-lg text-white/50"> / {p.checklistTotal} completed</span>
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[image:var(--gradient-together)]"
                initial={{ width: 0 }}
                animate={{ width: `${(p.checklistDone / p.checklistTotal) * 100}%` }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </div>
            <ul className="mt-5 divide-y divide-white/[0.08]">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center gap-3.5 py-3.5">
                  <StatusDot done={r.done} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] font-semibold text-white">
                      {r.name}
                    </span>
                    <span className="block text-[0.75rem] text-white/55">{r.tag}</span>
                  </span>
                  <Badge tone={r.done ? "done" : "pending"}>{r.done ? "Done" : "Not yet"}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ── Day 1: every moment, in rundown order ────────────────────────── */

function DayOne({ part, onPart }: { part: Part; onPart: (p: Part) => void }) {
  return (
    <div>
      <Reveal className="text-center">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-sky">
          Day 1 · Wed, 16 Dec 2026
        </p>
        <p className="wordmark mt-2 pr-[0.06em] text-[clamp(1.5rem,5.6vw,2.25rem)] text-white">
          Find Your <span className="text-together">Place</span>
        </p>
      </Reveal>

      {/* The day's parts, one at a time. A swipeable row on a phone. */}
      <div
        role="tablist"
        aria-label="Day 1"
        className="no-scrollbar -mx-5 mt-6 flex gap-2.5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:justify-center lg:overflow-visible lg:px-0"
      >
        {PART_CHIPS.map((chip, i) => {
          const active = chip.id === part;
          return (
            <button
              key={chip.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onPart(chip.id)}
              className={`relative flex shrink-0 items-center gap-3 rounded-2xl border py-2 pl-2 pr-4 text-left transition-colors duration-200 active:scale-[0.98] ${
                active
                  ? "border-cyan/60 bg-white/[0.1] text-white"
                  : "border-white/12 bg-white/[0.04] text-white/80 hover:border-cyan/40"
              }`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                  active
                    ? "bg-[image:var(--gradient-together)] text-navy-950"
                    : "bg-white/[0.08] text-cyan"
                }`}
              >
                <chip.icon className="size-4" />
              </span>
              <span>
                <span className="block whitespace-nowrap text-sm font-semibold">
                  <span className="text-white/45">0{i + 1}</span> {chip.label}
                </span>
                <span className="block whitespace-nowrap text-[0.6875rem] text-white/55">
                  {chip.sub}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={part}
          role="tabpanel"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-10 sm:mt-12"
        >
          {part === "arrival" ? (
            <WelcomeSection />
          ) : part === "sunset" ? (
            <SunsetSection />
          ) : part === "evening" ? (
            <ChangeTalkSection />
          ) : (
            <SocialSection />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DayComingSoon({ day }: { day: string }) {
  return (
    <div className="surface mx-auto flex max-w-xl items-center gap-4 px-5 py-6">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-sky">
        <CalendarDays className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-white">Aktivitas {day}</span>
          <Badge tone="soon">Coming soon</Badge>
        </span>
        <span className="mt-1 block text-sm text-white/60">
          Aktivitasnya akan muncul di sini setelah rundown {day} final.
        </span>
      </span>
    </div>
  );
}

/* ── Day 1 · Arrival ──────────────────────────────────────────────── */

const KIT_ICON: Record<(typeof WELCOME_KIT)[number]["id"], LucideIcon> = {
  badge: IdCard,
  hat: Sparkles,
  tee: Shirt,
  fan: Fan,
};

function WelcomeSection() {
  return (
    <div id="welcome" className="scroll-mt-28">
      <SectionIntro
        eyebrow="Day 1 · Arrival"
        title="The Welcome"
        accent="Experience"
        text="Tunjukkan QR My Canvas Pass di meja registrasi. Setelah dipindai, kamu menerima info kamar, identitas tim, dan welcome kit."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <FactPill icon={MapPin}>Lobi Swissôtel</FactPill>
          <FactPill icon={QrCode}>Check-in</FactPill>
        </div>
      </SectionIntro>

      <CheckInCard
        id="welcome"
        image={lobby}
        alt="The Swissôtel lobby"
        title="Check In At Registration"
        text="Tunjukkan QR My Canvas Pass-mu ke crew di meja registrasi, lobi hotel. Begitu dipindai, pass-mu menampilkan “Your Piece Has Arrived”."
      />

      {/* What arrival hands over (deck p.32–33). Kit visuals are placeholders. */}
      <div className="mt-10">
        <Reveal>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-lg font-semibold text-white">What You'll Receive</h3>
            <p className="text-sm text-white/60">Diberikan saat check-in.</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {WELCOME_KIT.map((k, i) => {
            const Icon = KIT_ICON[k.id];
            return (
              <Reveal key={k.id} delay={i * 0.05}>
                <figure className="surface flex h-full flex-col overflow-hidden">
                  <div className="grid aspect-square place-items-center bg-[linear-gradient(160deg,#1f6bff_0%,#0a35c8_55%,#06238f_100%)]">
                    <Icon className="size-10 text-ice" strokeWidth={1.5} />
                  </div>
                  <figcaption className="flex-1 px-4 py-3.5">
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-sky">
                      Welcome kit
                    </span>
                    <span className="mt-1 block text-[0.9375rem] font-semibold text-white">
                      {k.name}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.1}>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            <Fact icon={BedDouble} title="Info kamar" text="Nomor kamarmu di Swissôtel." />
            <Fact icon={Users} title="Identitas tim" text="Tim barumu selama acara." />
            <Fact
              icon={Sparkles}
              title="Clue pack"
              text="Tersegel, untuk aktivitas hari berikutnya."
            />
          </ul>
        </Reveal>
      </div>

      {/* Journey to Sunset: personal time, then the bus. */}
      <div className="mt-16 sm:mt-20">
        <SectionIntro
          id="journey-to-sunset"
          eyebrow="Day 1 · Early afternoon"
          title="Journey to"
          accent="Sunset"
          text="Tidak ada kegiatan wajib. Istirahat di kamar, lalu berangkat ke venue malam dengan bus sesuai jadwal tim."
        >
          <div className="mt-5 flex flex-wrap gap-2">
            <FactPill icon={Coffee}>Personal time</FactPill>
            <FactPill icon={Bus}>Bus per tim</FactPill>
          </div>
        </SectionIntro>
        <Reveal delay={0.06}>
          <div className={MEDIA_CARD}>
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[15rem]">
              <div className="absolute inset-0">
                <MotionImage src={roomView} alt="A Swissôtel guest room" className="h-full" />
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">Selagi beristirahat</h3>
              <p className="mt-1.5 text-[0.9375rem] text-white/65">
                Rundown, info venue, dan transportasi bisa dibuka kapan saja.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <Link to="/schedule" className={TEXT_LINK}>
                  Rundown Day 1
                </Link>
                <Link to="/guide" hash="venue" className={TEXT_LINK}>
                  Venue
                </Link>
                <Link to="/guide" hash="transport" className={TEXT_LINK}>
                  Transportasi
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ── Day 1 · Sunset ───────────────────────────────────────────────── */

function SunsetSection() {
  return (
    <div id="sunset-welcome" className="scroll-mt-28">
      <SectionIntro
        eyebrow="Day 1 · Sunset"
        title="Sunset"
        accent="Welcome"
        text="Kamu disambut musik akustik, hidangan ringan saat senja, dan suasana yang membuat obrolan mengalir dengan sendirinya."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <FactPill icon={Music}>Acoustic music</FactPill>
          <FactPill icon={Sunset}>Sunset refreshments</FactPill>
          <FactPill icon={QrCode}>Check-in</FactPill>
        </div>
      </SectionIntro>

      <CheckInCard
        id="sunset-welcome"
        image={sunsetWelcome}
        alt="Acoustic music at sunset by the sea"
        title="Check In On Arrival"
        text="Scan QR My Canvas Pass yang sama saat tiba di venue malam."
        mood
      />

      <div className="mt-16 sm:mt-20">
        <SectionIntro
          id="open-table"
          eyebrow="Day 1 · Sunset dinner"
          title="The Open"
          accent="Table"
          text="Makan malam bersama. Para pimpinan duduk di meja yang berbeda, bersama rekan dari berbagai divisi."
        >
          <div className="mt-5 flex flex-wrap gap-2">
            <FactPill icon={UtensilsCrossed}>Sunset dinner</FactPill>
            <FactPill icon={MessagesSquare}>Conversation card</FactPill>
          </div>
        </SectionIntro>
        <Reveal delay={0.06}>
          <div className={MEDIA_CARD}>
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[15rem]">
              <div className="absolute inset-0">
                <MotionImage
                  src={openTable}
                  alt="A long dinner table set for sunset"
                  className="h-full"
                />
              </div>
              <MoodTag />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-cyan">
                <MessagesSquare className="size-[1.05rem]" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">One Card Per Table</h3>
              <p className="mt-1.5 text-[0.9375rem] text-white/65">
                Satu pertanyaan sederhana untuk membuka obrolan di setiap meja.
              </p>
              <div className="mt-5">
                <ConversationCardButton />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ── Day 1 · The Change Talk ──────────────────────────────────────── */

function ChangeTalkSection() {
  const state = useParticipant();
  const sent = state.questions.length;
  return (
    <div id="change-talk" className="scroll-mt-28">
      <SectionIntro
        eyebrow="Day 1 · Evening"
        title="The Change"
        accent="Talk"
        text="Pimpinan menjelaskan arah Dulux menuju 2027, lalu moderator membawakan pertanyaan peserta, termasuk dari Question Box."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <FactPill icon={Mic}>Leadership sharing</FactPill>
          <FactPill icon={MessageCircleQuestion}>Moderated Q&A</FactPill>
        </div>
      </SectionIntro>

      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CHANGE_TALK_PARTS.map((part, i) => (
          <Reveal as="li" key={part.title} delay={i * 0.05}>
            <div className="surface h-full p-5">
              <span className="wordmark text-2xl text-together">0{i + 1}</span>
              <p className="mt-2 text-[0.9375rem] font-semibold text-white">{part.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{part.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.06}>
        <div className="surface mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-cyan" />
            <div>
              <p className="text-[0.9375rem] font-semibold text-white">
                {sent > 0
                  ? `Kamu sudah mengirim ${sent} pertanyaan`
                  : "Punya pertanyaan untuk pimpinan?"}
              </p>
              <p className="text-sm text-white/60">
                Kirim lewat Question Box sebelum acara, tanpa nama.
              </p>
            </div>
          </div>
          <Link
            to="/activities"
            search={{ section: "before" }}
            hash="question-box"
            className="btn btn-primary shrink-0"
          >
            {sent > 0 ? "Ask Another" : "Ask A Question"}
          </Link>
        </div>
      </Reveal>

      <div className="mt-12">
        <Reveal>
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-lg font-semibold text-white">Inspiration Speakers</h3>
            <Badge tone="soon">Proposed</Badge>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {CHANGE_TALK_GUESTS.map((g, i) => (
            <PersonCard
              key={g.id}
              image={PHOTOS[g.id]!}
              name={g.name}
              tag="Guest star"
              line={`“${g.topic}”`}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Day 1 · Night ────────────────────────────────────────────────── */

function SocialSection() {
  return (
    <div id="sunset-social" className="scroll-mt-28">
      <SectionIntro
        eyebrow="Day 1 · Night"
        title="Sunset"
        accent="Social"
        text="Malam ditutup lebih santai dengan musik akustik live, DJ, dan networking."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <FactPill icon={Music}>Live music & DJ</FactPill>
          <FactPill icon={Moon}>Day 2 teaser</FactPill>
        </div>
      </SectionIntro>

      <div className="mt-8">
        <Reveal>
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-lg font-semibold text-white">Band & DJs</h3>
            <Badge tone="soon">Proposed</Badge>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[...SUNSET_LINEUP, SPECIAL_WISHLIST].map((a, i) => (
            <PersonCard
              key={a.id}
              image={PHOTOS[a.id]!}
              name={a.name}
              tag={a.id === SPECIAL_WISHLIST.id ? "Wishlist" : a.role}
              line={a.id === SPECIAL_WISHLIST.id ? a.role : undefined}
              index={i}
              compact
            />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <OneWordPulse />
      </div>
    </div>
  );
}

/* ── Shared pieces ────────────────────────────────────────────────── */

const TEXT_LINK =
  "inline-flex min-h-9 items-center text-sm font-semibold text-white underline decoration-cyan/50 decoration-1 underline-offset-[6px] transition-colors hover:decoration-cyan";

/** Picture on one side, words on the other (Infinity's check-in card). */
const MEDIA_CARD =
  "mt-8 grid overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_50px_-32px_rgba(0,8,60,0.9)] ring-1 ring-white/12 md:grid-cols-[1fr_1.1fr]";

function CheckInCard({
  id,
  image,
  alt,
  title,
  text,
  mood = false,
}: {
  id: CheckInId;
  image: string;
  alt: string;
  title: string;
  text: string;
  mood?: boolean;
}) {
  return (
    <Reveal delay={0.06}>
      <div className={MEDIA_CARD}>
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[16rem]">
          <div className="absolute inset-0">
            <MotionImage src={image} alt={alt} className="h-full" />
          </div>
          {mood && <MoodTag />}
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <span className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-cyan">
            <QrCode className="size-[1.05rem]" />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1.5 text-[0.9375rem] text-white/65">{text}</p>
          <div className="mt-5 border-t border-white/[0.08] pt-4">
            <CheckInPanel id={id} bare />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function MoodTag() {
  return (
    <span className="absolute left-3 top-3 rounded-full bg-navy-950/60 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
      Referensi suasana
    </span>
  );
}

function Fact({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <li className="surface flex items-start gap-3 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-cyan">
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block text-[0.9375rem] font-semibold text-white">{title}</span>
        <span className="block text-sm text-white/60">{text}</span>
      </span>
    </li>
  );
}

/** A person on the bill (Infinity's activity card): photo with a tag, name, one line. */
function PersonCard({
  image,
  name,
  tag,
  line,
  index,
  compact = false,
}: {
  image: string;
  name: string;
  tag: string;
  line?: string | undefined;
  index: number;
  compact?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.07, ease: EASE }}
      className="surface-interactive group flex h-full flex-col overflow-hidden"
    >
      <div className="relative">
        <MotionImage
          src={image}
          alt={name}
          className={compact ? "aspect-square" : "aspect-[4/3]"}
          imgClassName="object-top"
        />
        <span className="absolute left-3 top-3 rounded-full bg-navy-950/70 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          {tag}
        </span>
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-3.5" : "p-5"}`}>
        <h3 className={`font-semibold text-white ${compact ? "text-[0.9375rem]" : "text-lg"}`}>
          {name}
        </h3>
        {line && <p className="mt-1 text-sm leading-snug text-white/60">{line}</p>}
      </div>
    </motion.article>
  );
}
