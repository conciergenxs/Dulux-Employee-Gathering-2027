import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  ArrowRight,
  AudioLines,
  Bell,
  Box,
  Camera,
  ChartColumn,
  ChefHat,
  Coffee,
  LayoutGrid,
  Lock,
  MapPin,
  Puzzle,
  QrCode,
  Shirt,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionIntro } from "@/components/activities/SectionIntro";
import { CompactCheckIn } from "@/components/activities/CheckIn";
import {
  BlockHead,
  CheckInCard,
  DayHead,
  Fact,
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
  MORNING_NOTIFICATION,
  RUNDOWN,
  TEAM_BUILDING,
} from "@/lib/event";
import type { CheckInId } from "@/lib/participant";
import { ACTIVITY_PHOTO } from "@/lib/quota";

const EASE = [0.22, 1, 0.36, 1] as const;

type Part = "morning" | "team" | "night";

/** Day 2 in its three chapters (deck p.56): collaborate, then align and celebrate. */
const PARTS: PartChip<Part>[] = [
  {
    id: "morning",
    label: "Morning",
    sub: "Kick-off · Team Reveal",
    icon: Coffee,
    moments: ["morning-kickoff"],
  },
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
    moments: ["kickoff-night"],
  },
];

export function DayTwo() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const [part, setPart] = useState<Part>(
    () => PARTS.find((p) => p.moments.includes(hash))?.id ?? "morning",
  );
  const day = RUNDOWN.day2;

  return (
    <div>
      <DayHead date={`Day 2 · ${day.date}`} title={day.title} />
      <PartChips label="Day 2" parts={PARTS} active={part} onChange={setPart} />

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
          {part === "morning" ? (
            <MorningSection />
          ) : part === "team" ? (
            <TeamBuildingSection />
          ) : (
            <KickoffSection />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Morning ──────────────────────────────────────────────────────── */

function MorningSection() {
  return (
    <div id="morning-kickoff" className="scroll-mt-28">
      <SectionIntro
        eyebrow="Day 2 · Morning"
        title="Morning Kick-off"
        accent="& Team Reveal"
        text="Pagi ini microsite mengirim notifikasi: perjalanannya masuk babak berikutnya. Sarapan bersama di restoran hotel, lalu The Bigger Picture Challenge diperkenalkan."
      />

      {/* The morning notification, as it will land on the phone (deck p.58). */}
      <Reveal delay={0.06}>
        <div className="surface mx-auto mt-8 max-w-md p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-cyan">
              <Bell className="size-[1.05rem]" />
            </span>
            <span className="min-w-0">
              <span className="block font-[family-name:var(--font-kv-condensed)] text-[0.8125rem] uppercase tracking-[0.16em] text-sky">
                Agenda notification
              </span>
              <span className="block text-[0.9375rem] font-semibold text-white">
                {MORNING_NOTIFICATION.title}
              </span>
            </span>
          </div>
          <ul className="mt-4 space-y-2 border-t border-white/[0.08] pt-4">
            {MORNING_NOTIFICATION.items.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/75">
                <span className="size-1.5 shrink-0 rounded-full bg-cyan" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <CheckInCard
        id="morning-kickoff"
        image={ACTIVITY_PHOTO["morning-kickoff"]}
        alt="Colleagues at breakfast in the hotel restaurant"
        mood
        title="Check In At Breakfast"
        text="Tunjukkan QR My Canvas Pass ke crew di restoran hotel."
      />
    </div>
  );
}

/* ── The Missing Pieces ───────────────────────────────────────────── */

const DISCOVER_ICON: Record<string, LucideIcon> = {
  "Clue Wall": LayoutGrid,
  "Audio Clue": AudioLines,
  "Locked Case": Lock,
  "Object Clue": Box,
  "QR Clue": QrCode,
  "Data Clue": ChartColumn,
};

/** The agenda stages that stamp the pass, by their agenda id. */
const STAGE_CHECK_IN: Partial<Record<string, CheckInId>> = {
  "final-connection": "final-connection",
  "solution-showcase": "solution-showcase",
  "complete-your-piece": "complete-your-piece",
};

function TeamBuildingSection() {
  const tb = TEAM_BUILDING;
  return (
    <div id="team-building" className="scroll-mt-28">
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

      <div className="mt-12">
        <BlockHead title="The Agenda" note="Check in di setiap tahap." />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tb.agenda.map((a, i) => {
            const checkIn = STAGE_CHECK_IN[a.id];
            return (
              <Reveal as="li" key={a.id} delay={i * 0.05} className="h-full">
                <NumberedCard n={i + 1} title={a.title} text={a.text}>
                  {checkIn && (
                    <div className="mt-4 border-t border-white/[0.08] pt-3.5">
                      <CompactCheckIn id={checkIn} />
                    </div>
                  )}
                </NumberedCard>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <div className="mt-12">
        <BlockHead title="What You'll Discover" note="Lima clue, lalu satu Change Alert." />
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {tb.clues.map((c, i) => {
            const alert = c.key === "Change Alert";
            return (
              <Reveal as="li" key={c.key} delay={i * 0.04} className="h-full">
                <div
                  className={`h-full rounded-[0.5rem_1.5rem_0.5rem_1.5rem] p-4 sm:p-5 ${
                    alert
                      ? "border-[1.5px] border-silver bg-[#071a33]/60"
                      : "border border-silver/25 bg-[#071a33]/35"
                  }`}
                >
                  <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky">
                    {alert ? c.key : `Clue 0${i + 1} · ${c.key}`}
                  </p>
                  <p className="mt-2 text-[0.9375rem] font-semibold leading-snug text-white">
                    {c.q}
                  </p>
                  {alert && (
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      Muncul tiba-tiba lewat microsite. Tim harus memikirkan ulang solusinya.
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>

      <div className="mt-12">
        <BlockHead
          title="How To Discover"
          note="Tidak perlu lari dari pos ke pos: timmu yang mengatur strateginya."
        />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tb.howToDiscover.map((d) => (
            <Fact
              key={d.name}
              icon={DISCOVER_ICON[d.name] ?? Puzzle}
              title={d.name}
              text={d.text}
            />
          ))}
        </ul>
        <Reveal delay={0.06}>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/65">
            <QrCode className="mt-0.5 size-4 shrink-0 text-cyan" />
            Lima QR Clue Board tersebar di area team building. Setiap scan membuka satu clue lewat
            microsite ini.
          </p>
        </Reveal>
      </div>

      <div className="mt-12">
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
      <div className="mt-12 grid gap-3 lg:grid-cols-2">
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
    </div>
  );
}

/* ── Kick-off Night ───────────────────────────────────────────────── */

const ONSITE_ICON: Record<string, LucideIcon> = {
  "Mosaic Photo Wall": Camera,
  "The Live Culinary Studio": ChefHat,
};

function KickoffSection() {
  return (
    <div id="kickoff-night" className="scroll-mt-28">
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

      <div className="mt-12">
        <BlockHead title="The Evening, In Three Chapters" />
        <ol className="grid gap-3 md:grid-cols-3">
          {KICKOFF_FLOW.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 0.05} className="h-full">
              <NumberedCard n={i + 1} title={f.title} text={f.text} />
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="mt-12">
        <BlockHead title="Agenda Kick-off" note={`${KICKOFF_AGENDA.length} momen`} />
        <Reveal delay={0.04}>
          <ol className="surface divide-y divide-white/[0.08] px-5 sm:px-6">
            {KICKOFF_AGENDA.map((a, i) => (
              <li key={a.title} className="flex gap-4 py-3.5">
                <span className="w-7 shrink-0 pt-0.5 font-display text-[0.9375rem] tabular-nums text-sky">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-semibold text-white">{a.title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-white/60">
                    {a.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
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
            <div className="mt-auto pt-4">
              <Link to="/guide" hash="dress-code" className={TEXT_LINK}>
                Lihat inspirasi dress code
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <ul className="grid h-full gap-3">
            {KICKOFF_ONSITE.map((o) => (
              <Fact
                key={o.title}
                icon={ONSITE_ICON[o.title] ?? Sparkles}
                title={o.title}
                text={o.text}
              />
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
