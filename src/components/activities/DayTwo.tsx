import { Link, useRouterState } from "@tanstack/react-router";
import { Band } from "@/components/site/Band";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { PenLine, Puzzle, Sparkles, Trophy } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionIntro } from "@/components/activities/SectionIntro";
import {
  BlockHead,
  CheckInCard,
  DayHead,
  NumberedCard,
  PartChips,
  TEXT_LINK,
  type PartChip,
} from "@/components/activities/ActivityKit";
import {
  DRESS_CODE_KICKOFF,
  KICKOFF_AGENDA,
  KICKOFF_FLOW,
  KICKOFF_ONSITE,
  AOP_CHARTER,
  COLOUR_SYNC,
  RUNDOWN,
  TEAM_BUILDING,
} from "@/lib/event";
import { ACTIVITY_PHOTO } from "@/lib/quota";
import { AopStatus, AopSteps } from "@/components/aop/AopSection";
import { MotionImage } from "@/components/site/MotionImage";
import matchUp from "@/assets/games/match-up.webp";
import oneStroke from "@/assets/games/one-stroke.webp";
import signalMaze from "@/assets/games/signal-maze.webp";
import stackWithoutHands from "@/assets/games/stack-without-hands.webp";
import bridgeTheGap from "@/assets/games/bridge-the-gap.webp";
import prizeWinning from "@/assets/colour-sync/prize-winning.webp";
import prizeParticipants from "@/assets/colour-sync/prize-participants.webp";
import mosaicPhotoWall from "@/assets/activities/mosaic-photo-wall.webp";
import liveCulinary from "@/assets/activities/live-culinary-studio.webp";
import look1 from "@/assets/dresscode/look-1.webp";
import look2 from "@/assets/dresscode/look-2.webp";
import look3 from "@/assets/dresscode/look-3.webp";
import look4 from "@/assets/dresscode/look-4.webp";

const EASE = [0.22, 1, 0.36, 1] as const;

type Part = "team" | "night" | "aop";

/**
 * Day 2's activities: team building by day, Kick-off Night after dark. The
 * Morning Kick-off isn't an activity on the microsite: participants just get
 * the morning notification with the day's agenda (Glowact), so it has no
 * section here.
 */
const PARTS: PartChip<Part>[] = [
  {
    id: "team",
    label: "Team Building",
    sub: "The Missing Pieces",
    icon: Puzzle,
    moments: ["team-building", "final-connection", "solution-showcase", "complete-your-piece"],
  },
  {
    id: "night",
    label: "Kick-off Night",
    sub: "Greater Together",
    icon: Sparkles,
    moments: ["colour-sync", "kickoff-night"],
  },
  {
    id: "aop",
    label: "AOP Charter",
    sub: "Digital Signature",
    icon: PenLine,
    moments: ["aop-charter"],
  },
];

export function DayTwo() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const [part, setPart] = useState<Part>(
    () => PARTS.find((p) => p.moments.includes(hash))?.id ?? "team",
  );
  const day = RUNDOWN.day2;

  return (
    <div>
      <Band tone="light" pattern={false} className="pb-10 sm:pb-12">
        <DayHead date={`Day 2 · ${day.date}`} title={day.title} />
        <PartChips label="Day 2" parts={PARTS} active={part} onChange={setPart} />
      </Band>

      <AnimatePresence mode="wait">
        <motion.div
          key={part}
          role="tabpanel"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {part === "team" ? (
            <TeamBuildingSection />
          ) : part === "night" ? (
            <>
              <ColourSyncSection />
              <KickoffSection />
            </>
          ) : (
            <AopCharterSection />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── The Missing Pieces ───────────────────────────────────────────── */

const GAME_PHOTO: Record<string, string> = {
  "match-up": matchUp,
  "one-stroke": oneStroke,
  "signal-maze": signalMaze,
  "stack-without-hands": stackWithoutHands,
  "bridge-the-gap": bridgeTheGap,
};

function TeamBuildingSection() {
  const tb = TEAM_BUILDING;
  return (
    <div id="team-building" className="scroll-mt-28">
      <Band tone="light" pattern={false} className="pb-14 sm:pb-20">
        <SectionIntro
          eyebrow="Day 2 · Team building"
          title="The Missing"
          accent="Pieces"
          text={`${tb.tagline} Setiap tim menerima kasus yang belum lengkap. Informasinya tersebar di berbagai titik dan format, dan tidak ada satu orang pun yang memegang seluruh jawabannya.`}
        />

        <CheckInCard
          id="team-building"
          image={ACTIVITY_PHOTO["team-building"]}
          alt="Teams gathered around a clue board by the sea"
          mood
          title="Check In At The Venue"
          text={`Scan QR My Canvas Pass saat tiba di ${tb.where}, lalu bergabung dengan timmu.`}
        />

        {/* The task, in five verbs (deck p.60). */}
        <Reveal delay={0.04}>
          <p className="mx-auto mt-10 flex max-w-[20rem] flex-wrap justify-center gap-x-2 gap-y-1 font-[family-name:var(--font-kv-condensed)] text-[0.9375rem] uppercase tracking-[0.14em] text-white/85 sm:max-w-none sm:text-[1.125rem] sm:tracking-[0.18em]">
            {tb.task.map((step, i) => (
              <span key={step} className="whitespace-nowrap">
                {step}
                {i < tb.task.length - 1 && <span className="pl-2 text-white/40">→</span>}
              </span>
            ))}
          </p>
        </Reveal>
      </Band>

      <Band tone="dark" palm="right" className="py-14 sm:py-20">
        <div>
          <BlockHead title="The Agenda" />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tb.agenda.map((a, i) => (
              <Reveal as="li" key={a.id} delay={i * 0.05} className="h-full">
                <NumberedCard n={i + 1} title={a.title} text={a.text} />
              </Reveal>
            ))}
          </ol>
        </div>
      </Band>

      {/* Games mechanism: one mini challenge per clue, from the client deck. */}
      <Band tone="light" className="py-14 sm:py-20">
        <Reveal>
          <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky sm:text-[0.9375rem]">
            Games Mechanism
          </p>
          <h3 className="wordmark mt-2 text-[clamp(1.5rem,6vw,2.25rem)] text-white">
            One Mission. Five Clues. <span className="text-together">One Change Alert.</span>
          </h3>
        </Reveal>
        {/* A swipeable row on a phone, five across on a laptop. */}
        <ol className="no-scrollbar -mx-5 mt-7 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {tb.games.map((g, i) => (
            <Reveal
              as="li"
              key={g.id}
              delay={i * 0.05}
              className="w-[72%] max-w-[17rem] shrink-0 snap-start sm:w-[42%] lg:w-auto lg:max-w-none"
            >
              <article className="surface flex h-full flex-col overflow-hidden">
                <div className="relative">
                  <MotionImage
                    src={GAME_PHOTO[g.id] ?? matchUp}
                    alt={g.name}
                    className="aspect-[4/3]"
                  />
                  <span
                    data-tone="dark"
                    className="absolute left-3 top-3 rounded-full bg-navy-950/70 px-2.5 py-1 font-display text-[0.75rem] text-white backdrop-blur-sm"
                  >
                    Clue 0{i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="font-[family-name:var(--font-kv-condensed)] text-[0.8125rem] uppercase tracking-[0.14em] text-sky">
                    {g.clue}
                  </p>
                  <p className="mt-1.5 text-[1rem] font-semibold text-white">{g.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{g.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.06}>
          <p className="mt-6 flex max-w-3xl items-start gap-2.5 text-[0.9375rem] leading-relaxed text-white/70">
            <Trophy className="mt-0.5 size-4 shrink-0 text-cyan" />
            {tb.scoring}
          </p>
        </Reveal>
      </Band>

      <Band tone="light" className="py-14 sm:py-20">
        <div>
          <BlockHead title="The Final Mission" note="Susun The Bigger Picture, lalu jawab:" />
          <ol className="grid gap-3 md:grid-cols-3">
            {tb.finalQuestions.map((f, i) => (
              <Reveal as="li" key={f.q} delay={i * 0.05} className="h-full">
                <NumberedCard n={i + 1} title={f.q} text={f.text} />
              </Reveal>
            ))}
          </ol>
        </div>

        {/* The pitch, then what every team leaves behind (deck p.67–69). */}
      </Band>
      <Band tone="dark" palm="right" className="py-14 sm:py-20">
        <div className="grid gap-3 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="surface h-full p-5 sm:p-6">
              <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky">
                The Final Pitch
              </p>
              <p className="wordmark mt-2 text-[1.375rem] text-white">
                5 Minutes. One Team. One Solution.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Boleh pakai {tb.pitchFormats.map((f) => f.toLowerCase()).join(", ")}.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                Top 3 tim dengan solusi terbaik tampil di panggung Greater Together Kick-off Night.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06} className="h-full">
            <div className="surface h-full p-5 sm:p-6">
              <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky">
                The Living Canvas
              </p>
              <p className="wordmark mt-2 text-[1.375rem] text-white">
                Every Team Contributes A Piece
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  ["22", "individual pieces"],
                  ["22", "team contributions"],
                  ["1", "collective canvas"],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-xl bg-white/[0.05] px-2 py-3">
                    <dt className="font-display text-2xl text-white">{n}</dt>
                    <dd className="mt-0.5 text-[0.75rem] leading-tight text-white/60">{l}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                Setelah pitch, setiap tim menerima satu Living Canvas Tile yang menjadi bagian dari
                kanvas bersama.
              </p>
            </div>
          </Reveal>
        </div>
      </Band>
    </div>
  );
}

/* ── Dulux Colour Sync ─────────────────────────────────────────────── */

const PRIZE_PHOTO: Record<(typeof COLOUR_SYNC.rewards.tiers)[number]["id"], string> = {
  winning: prizeWinning,
  participants: prizeParticipants,
};

/** The games booth before Kick-off Night, and the prize it opens (client deck). */
function ColourSyncSection() {
  const cs = COLOUR_SYNC;
  return (
    <div id="colour-sync" className="scroll-mt-28">
      <Band tone="light" pattern={false} className="pb-14 sm:pb-20">
        <SectionIntro
          eyebrow="Day 2 · Before Kick-off"
          title="Dulux Colour"
          accent="Sync"
          text={`${cs.tagline} ${cs.text}`}
        />
        <CheckInCard
          id="colour-sync"
          image={ACTIVITY_PHOTO["colour-sync"]}
          alt="Three colleagues lifting shade cards in the Colour Sync booth"
          mood
          title="Play At The Colour Sync Booth"
          text="Main bersama timmu di foyer ballroom sebelum Kick-off Night, lalu tunjukkan QR My Canvas Pass ke crew di booth."
        />
      </Band>

      <Band tone="dark" palm="right" className="py-14 sm:py-20">
        <div>
          <BlockHead title="How To Play" note={`${cs.steps.length} langkah`} />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cs.steps.map((st, i) => (
              <Reveal as="li" key={st.title} delay={i * 0.05} className="h-full">
                <NumberedCard n={i + 1} title={st.title} text={st.text} />
              </Reveal>
            ))}
          </ol>

          <div className="mt-12">
            <BlockHead title="Games Reward" note={cs.rewards.intro} />
            <div className="grid gap-3 md:grid-cols-2">
              {cs.rewards.tiers.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.05} className="h-full">
                  <div className="surface flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[16/9] bg-[radial-gradient(120%_90%_at_50%_30%,#ffffff_0%,#eef5fb_55%,#cfe2f3_100%)]">
                      <img
                        src={PRIZE_PHOTO[t.id]}
                        alt={t.prize}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 size-full object-contain p-[7%] drop-shadow-[0_10px_14px_rgba(7,26,51,0.22)]"
                      />
                    </div>
                    <div className="flex-1 p-5 sm:p-6">
                      <p className="font-[family-name:var(--font-kv-condensed)] text-[0.8125rem] uppercase tracking-[0.18em] text-sky">
                        {t.title}
                      </p>
                      <p className="mt-1.5 text-[1.0625rem] font-semibold text-white">{t.prize}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{t.who}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Band>
    </div>
  );
}

/* ── Kick-off Night ───────────────────────────────────────────────── */

const ONSITE_PHOTO: Record<string, { src: string; alt: string }> = {
  "Mosaic Photo Wall": {
    src: mosaicPhotoWall,
    alt: "A guest posing at the blue and silver Greater Together photo wall",
  },
  "The Live Culinary Studio": {
    src: liveCulinary,
    alt: "A chef plating canapés live at the ballroom foyer",
  },
};

const LOOKS = [look1, look2, look3, look4];

function KickoffSection() {
  return (
    <div id="kickoff-night" className="scroll-mt-28">
      <Band tone="light" className="py-14 sm:py-20">
        <SectionIntro
          eyebrow="Day 2 · Night"
          title="Greater Together"
          accent="Kick-off Night"
          text="From shared discoveries to a shared vision for 2027. Malam untuk menyelaraskan arah, merayakan orang-orangnya, dan berkomitmen pada masa depan bersama."
        />

        <CheckInCard
          id="kickoff-night"
          image={ACTIVITY_PHOTO["kickoff-night"]}
          alt="The ballroom"
          title="Check In At The Ballroom"
          text="Scan QR My Canvas Pass di pintu masuk. Kehadiranmu terkonfirmasi, dan akses ballroom terbuka."
        />
      </Band>

      <Band tone="dark" palm="right" className="py-14 sm:py-20">
        <div>
          <BlockHead title="The Evening, In Three Chapters" />
          <ol className="grid gap-3 md:grid-cols-3">
            {KICKOFF_FLOW.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 0.05} className="h-full">
                <NumberedCard n={i + 1} title={f.title} text={f.text} />
              </Reveal>
            ))}
          </ol>
        </div>
      </Band>

      <Band tone="light" className="py-14 sm:py-20">
        <div>
          <BlockHead title="Agenda Kick-off" note={`${KICKOFF_AGENDA.length} momen`} />
          <Reveal delay={0.04}>
            <ol className="surface divide-y divide-white/[0.08] px-5 sm:px-6">
              {KICKOFF_AGENDA.map((a, i) => (
                <li key={a.title} className="flex gap-4 py-3.5">
                  <span className="w-7 shrink-0 pt-0.5 font-display text-[0.9375rem] tabular-nums text-sky">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-semibold text-white">
                      {a.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-white/60">
                      {a.text}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Band>

      <Band tone="dark" palm="left" className="py-14 sm:py-20">
        <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="h-full">
            <div className="surface flex h-full flex-col p-5 sm:p-6">
              <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky">
                Dress code
              </p>
              <p className="wordmark mt-2 text-[1.375rem] text-white">{DRESS_CODE_KICKOFF.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {DRESS_CODE_KICKOFF.palette}: {DRESS_CODE_KICKOFF.words.join(" · ")}. Datang dengan
                outfit terbaikmu yang mencerminkan semangat Greater Together.
              </p>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {LOOKS.map((src, i) => (
                  <div
                    key={src}
                    className="aspect-[3/4] overflow-hidden rounded-xl bg-white/[0.06]"
                  >
                    <img
                      src={src}
                      alt={`Greater Together Look inspiration ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover object-top"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-5">
                <Link to="/guide" hash="dress-code" className={TEXT_LINK}>
                  Lihat inspirasi dress code
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="grid h-full gap-3 sm:grid-cols-2">
              {KICKOFF_ONSITE.map((o) => {
                const photo = ONSITE_PHOTO[o.title];
                return (
                  <li key={o.title} className="surface flex flex-col overflow-hidden">
                    {photo && (
                      <div className="relative aspect-[4/3]">
                        <div className="absolute inset-0">
                          <MotionImage src={photo.src} alt={photo.alt} className="h-full" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 p-5">
                      <h3 className="text-[0.9375rem] font-semibold text-white">{o.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{o.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Band>
    </div>
  );
}

/* ── AOP Charter Sign-Off ─────────────────────────────────────────── */

/**
 * Its own part of Day 2: signed on the microsite during Kick-off Night, but
 * only once the LED's QR has been scanned (client deck).
 */
function AopCharterSection() {
  return (
    <div id="aop-charter" className="scroll-mt-28">
      <Band tone="light" pattern={false} className="pb-14 sm:pb-20">
        <SectionIntro
          eyebrow="Kick-off Night · AOP Charter Sign-Off"
          title="One Vision."
          accent="One Shared Commitment."
          text={`${AOP_CHARTER.tagline} ${AOP_CHARTER.text}`}
        />
        <Reveal delay={0.06} className="mt-8 block">
          <AopStatus />
        </Reveal>
      </Band>

      <Band tone="dark" palm="right" className="py-14 sm:py-20">
        <BlockHead title="The Signing Experience" />
        <AopSteps />
      </Band>
    </div>
  );
}
