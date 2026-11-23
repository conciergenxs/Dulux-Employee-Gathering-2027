import { Link, createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { z } from "zod";
import {
  BedDouble,
  Blocks,
  Bus,
  Camera,
  Gift,
  Puzzle,
  Target,
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
import { SectionIntro } from "@/components/activities/SectionIntro";
import {
  BlockHead,
  CheckInCard,
  DayHead,
  Fact,
  MEDIA_CARD,
  MediaSide,
  MoodTag,
  NumberedCard,
  PartChips,
  TEXT_LINK,
  type PartChip,
} from "@/components/activities/ActivityKit";
import { DayTwo } from "@/components/activities/DayTwo";
import { ACTIVITY_PHOTO } from "@/lib/quota";
import { DayThree } from "@/components/activities/DayThree";
import { StatusDot } from "@/components/passport/Checklist";
import {
  CHANGE_TALK_GUESTS,
  CHANGE_TALK_PARTS,
  CLUE_PACK,
  EVENT,
  RUNDOWN,
  SPECIAL_WISHLIST,
  SUNSET_GAMES,
  SUNSET_LINEUP,
  SUNSET_PHOTOBOOTH,
  TEAM_REVEAL,
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
 * event, then each day, each listing its moments in rundown order.
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
          "The First Stroke dan Change Talk Question Box sebelum acara, lalu semua aktivitas Day 1 sampai Day 3 Greater Together 2027.",
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
const PART_CHIPS: PartChip<Part>[] = [
  {
    id: "arrival",
    label: "Arrival",
    sub: "Welcome · Totem · Journey",
    icon: Sparkles,
    moments: ["welcome", "missing-piece-totem", "journey-to-sunset"],
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
        intro="Dari The First Stroke sebelum acara sampai Functional Huddle di Day 3, semuanya ada di sini."
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
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[linear-gradient(100deg,#ffffff_0%,#eef1f4_50%,#cfd6dd_100%)] px-5 text-sm font-bold text-navy-900 shadow-[0_12px_40px_-14px_rgba(80,190,255,0.9)] active:scale-95"
            >
              <QrCode className="size-4" />
              Show Your QR to Check In
            </button>
          </motion.div>
        }
      />

      <PageField>
        <KvTexture side="right" className="top-[-3rem]" />
        <KvTexture side="left" className="top-[38%]" />
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
                ) : section === "day2" ? (
                  <DayTwo />
                ) : (
                  <DayThree />
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
      <DayHead date={`Day 1 · ${RUNDOWN.day1.date}`} title={RUNDOWN.day1.title} />
      <PartChips label="Day 1" parts={PART_CHIPS} active={part} onChange={onPart} />

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
      />

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
                  <div className="grid aspect-square place-items-center bg-[linear-gradient(160deg,#1d6aa8_0%,#0d4a80_55%,#0b3c6b_100%)]">
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

      {/* The Missing Piece Totem and the clue pack (deck p.38–39). */}
      <div className="mt-16 sm:mt-20">
        <SectionIntro
          id="missing-piece-totem"
          eyebrow="Day 1 · Arrival"
          title="The Missing Piece"
          accent="Totem"
          text="Find your piece. Find your people. Kamu mungkin datang bersama circle-mu sendiri, tapi cerita berikutnya dimulai dengan orang yang belum kamu kenal."
        />
        <Reveal delay={0.06}>
          <div className={MEDIA_CARD}>
            <MediaSide
              image={ACTIVITY_PHOTO["missing-piece-totem"]}
              alt="Colleagues with their puzzle pieces around a geometric totem in the lobby"
              mood
              className="md:min-h-[15rem]"
            />
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-cyan">
                <Puzzle className="size-[1.05rem]" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">The Mystery Begins Here</h3>
              <p className="mt-1.5 text-[0.9375rem] text-white/65">{CLUE_PACK.text}</p>
              <div className="mt-5 border-t border-white/[0.08] pt-4">
                <CheckInPanel id="missing-piece-totem" bare />
              </div>
            </div>
          </div>
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
        />
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
      />

      <CheckInCard
        id="sunset-welcome"
        image={sunsetWelcome}
        alt="Acoustic music at sunset by the sea"
        title="Check In On Arrival"
        text="Scan QR My Canvas Pass yang sama saat tiba di venue malam."
        mood
      />

      {/* The first connection of the team-building groups (deck p.49). */}
      <div className="mt-12">
        <BlockHead
          title="Find Your Pieces. Find Your People."
          note={`${TEAM_REVEAL.teams} tim, bertemu untuk pertama kali.`}
        />
        <ol className="grid gap-3 md:grid-cols-3">
          {TEAM_REVEAL.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.05} className="h-full">
              <NumberedCard n={i + 1} title={step.title} text={step.text} />
            </Reveal>
          ))}
        </ol>
        <ul className="mt-3">
          <Fact icon={Camera} title={SUNSET_PHOTOBOOTH.title} text={SUNSET_PHOTOBOOTH.text} />
        </ul>
      </div>

      <div className="mt-16 sm:mt-20">
        <SectionIntro
          id="open-table"
          eyebrow="Day 1 · Sunset dinner"
          title="The Open"
          accent="Table"
          text="Makan malam bersama. Para pimpinan duduk di meja yang berbeda, bersama rekan dari berbagai divisi."
        />
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
              <div className="mt-5 border-t border-white/[0.08] pt-4">
                <CheckInPanel id="open-table" bare />
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
      />

      <Reveal delay={0.06} className="mt-8 block">
        <CheckInPanel id="change-talk" />
      </Reveal>

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
      />

      <Reveal delay={0.06} className="mt-8 block">
        <CheckInPanel id="sunset-social" />
      </Reveal>

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

      {/* Sunset Social games (deck p.47). */}
      <div className="mt-12">
        <BlockHead title="Play Together. Win Together." note="Setiap partisipasi dapat hadiah." />
        <ul className="grid gap-3 md:grid-cols-2">
          {SUNSET_GAMES.games.map((g) => (
            <Fact
              key={g.name}
              icon={g.name === "Build It Together" ? Blocks : Target}
              title={g.name}
              text={g.text}
            />
          ))}
        </ul>
        <Reveal delay={0.06}>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/65">
            <Gift className="mt-0.5 size-4 shrink-0 text-cyan" />
            Hadiah untuk setiap partisipasi: {SUNSET_GAMES.rewards.join(", ")}.
          </p>
        </Reveal>
      </div>

      <div className="mt-12">
        <OneWordPulse />
      </div>
    </div>
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
