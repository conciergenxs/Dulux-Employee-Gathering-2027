import { Link, createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bus,
  QrCode,
  Shapes,
  Sofa,
  CalendarDays,
  CircleHelp,
  Luggage,
  Compass,
  MapPin,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Band } from "@/components/site/Band";
import { Emphasis } from "@/components/site/Emphasis";
import { Reveal } from "@/components/site/Reveal";
import { MotionImage } from "@/components/site/MotionImage";
import { Lightbox } from "@/components/site/Lightbox";
import { FaqList } from "@/components/passport/PassportFaq";
import { ARRIVAL_STEPS, DRESS_CODE_KICKOFF, EVENT, GUIDE_FAQ } from "@/lib/event";
import exterior from "@/assets/venue/exterior.webp";
import ballroom from "@/assets/venue/ballroom.webp";
import lobby from "@/assets/venue/lobby.webp";
import room from "@/assets/venue/room.webp";
import bus from "@/assets/transport/bus.webp";
import busInterior from "@/assets/transport/bus-interior.webp";
import look1 from "@/assets/dresscode/look-1.webp";
import look2 from "@/assets/dresscode/look-2.webp";
import look3 from "@/assets/dresscode/look-3.webp";
import look4 from "@/assets/dresscode/look-4.webp";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: `Practical Guide — ${EVENT.name}` },
      {
        name: "description",
        content: `Venue, kedatangan, transportasi, dress code, dan FAQ ${EVENT.name} di ${EVENT.venue}.`,
      },
    ],
  }),
  component: GuidePage,
});

/** The planner sitemap's five sections, in its order. */
const SECTIONS: { id: string; label: string; short: string; tiny?: string; icon: LucideIcon }[] = [
  { id: "dress-code", label: "Dress Code", short: "Dress Code", tiny: "Dress", icon: Shirt },
  { id: "venue", label: "Venue", short: "Venue", icon: MapPin },
  { id: "travel", label: "Travel Tips", short: "Travel", icon: Luggage },
  { id: "transport", label: "Transport", short: "Transport", icon: Bus },
  { id: "faq", label: "FAQ", short: "FAQ", icon: CircleHelp },
];

const VENUE_SHOTS = [
  { src: exterior, alt: "Swissôtel Jakarta PIK Avenue at night", cap: "The hotel" },
  { src: ballroom, alt: "The ballroom set with round tables", cap: "Ballroom" },
  { src: lobby, alt: "Lobby lounge with colourful artwork", cap: "Lobby" },
  { src: room, alt: "A guest room with a city view", cap: "Guest room" },
];

const LOOKS = [
  { src: look1, alt: "Navy double-breasted suit" },
  { src: look2, alt: "Blue blazer with silver trousers" },
  { src: look3, alt: "Blue and silver satin dress" },
  { src: look4, alt: "Navy suit with open collar" },
];

function GuidePage() {
  const [shot, setShot] = useState<number | null>(null);
  const close = useCallback(() => setShot(null), []);

  return (
    <>
      <PageHero
        tight
        eyebrow="Practical guide"
        title="Everything you"
        accent="need to know"
        intro="Semua info praktis untuk tiga hari acara, dalam satu halaman."
      />

      {/* The page field, as on the other pages: the KV wall's mid denim
          the hero fades into, with a palm rooted at each side. The cards keep
          their own solid surface, so text never sits on it unbacked except
          the section headings, which stay high-contrast. */}
      <div className="relative isolate overflow-clip">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(50rem_26rem_at_50%_22rem,rgba(56,160,255,0.13)_0%,rgba(56,160,255,0)_70%),linear-gradient(180deg,#0d4a80_0rem,#0d4a80_6rem,#0c4274_45%,#0b3c6b_100%)]"
        />

        {/* On white straight under the hero, as on Schedule; Dress Code
            continues the same white band below. */}
        <Band tone="light" fade className="pt-10 sm:pt-12">
          <AtAGlance />
        </Band>
        <SectionNav />

        <div id="guide-sections" className="px-5">
          <div className="mx-auto max-w-5xl">
            {/* ── Dress code ────────────────────────────────────── */}
            <GuideSection
              id="dress-code"
              tone="light"
              pattern={false}
              eyebrow="Dress Code"
              title="What to wear"
              text="Dress code untuk Kick-off Night di Day 2."
            >
              {/* Same build as the venue card: pictures on top, the details beneath. */}
              <div className="overflow-hidden rounded-[1.75rem] ring-1 ring-white/12">
                {/* Big portraits: two by two on a phone, four across from a tablet up. */}
                <ul className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                  {LOOKS.map((l) => (
                    <li key={l.src}>
                      <MotionImage
                        src={l.src}
                        alt={l.alt}
                        className="aspect-[2/3]"
                        imgClassName="object-top"
                      />
                    </li>
                  ))}
                </ul>
                <div className="grid gap-4 bg-white/[0.05] p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-8">
                  <div>
                    <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky sm:text-[0.9375rem]">
                      Day 2 · Kick-off Night
                    </p>
                    <p className="wordmark mt-2.5 pr-[0.06em] text-[clamp(1.5rem,5.6vw,2rem)] text-white">
                      {DRESS_CODE_KICKOFF.title}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[DRESS_CODE_KICKOFF.palette, ...DRESS_CODE_KICKOFF.words].map((w) => (
                        <span
                          key={w}
                          className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[0.8125rem] font-medium text-white/85"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[0.9375rem] leading-relaxed text-white/70">
                    Pakai outfit terbaikmu dengan nuansa biru dan silver: modern, rapi, dan sesuai
                    tema acara.
                  </p>
                </div>
              </div>
            </GuideSection>

            {/* ── Venue ─────────────────────────────────────────── */}
            <GuideSection
              id="venue"
              tone="dark"
              palm="left"
              eyebrow="Venue Photos & Location"
              title="Swissôtel Jakarta PIK Avenue"
              text="Tempat kita check-in, menginap, dan berkumpul selama tiga hari acara."
            >
              <div className="overflow-hidden rounded-[1.75rem] ring-1 ring-white/12">
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                  <div className="col-span-2 sm:row-span-2">
                    <MotionImage
                      src={VENUE_SHOTS[0]!.src}
                      alt={VENUE_SHOTS[0]!.alt}
                      className="aspect-[16/10] sm:h-full"
                      onClick={() => setShot(0)}
                    />
                  </div>
                  {VENUE_SHOTS.slice(1).map((s, i) => (
                    <div key={s.cap} className={i === 2 ? "col-span-2" : ""}>
                      <MotionImage
                        src={s.src}
                        alt={s.alt}
                        caption={s.cap}
                        className={i === 2 ? "aspect-[16/8]" : "aspect-[4/3]"}
                        onClick={() => setShot(i + 1)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 bg-white/[0.05] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-base font-semibold text-white">{EVENT.venue}</p>
                    <p className="mt-0.5 text-sm text-white/60">{EVENT.area}</p>
                  </div>
                  <a
                    href={EVENT.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary shrink-0"
                  >
                    <Compass className="size-4" />
                    Get directions
                  </a>
                </div>
              </div>
            </GuideSection>

            {/* ── Travel tips ───────────────────────────────────── */}
            <GuideSection
              id="travel"
              tone="light"
              eyebrow="Travel Tips"
              title="Before you arrive"
              text="Siapkan tiga hal ini sebelum berangkat, lalu ikuti alur check-in saat tiba di hotel."
            >
              {/* 1 · Before you go: three tips, side by side from a tablet up. */}
              <ul className="grid gap-3 md:grid-cols-3">
                <Tip
                  icon={Shapes}
                  title="Isi The First Stroke"
                  text="Satu-satunya langkah wajib sebelum acara. Cukup satu menit."
                  action={
                    <Link
                      to="/activities"
                      search={{ section: "day1", part: "pre-event" }}
                      hash="first-stroke"
                      className={INLINE_LINK}
                    >
                      Isi sekarang
                    </Link>
                  }
                />
                <Tip
                  icon={QrCode}
                  title="Siapkan My Canvas Pass"
                  text="QR-nya dipakai untuk check-in di hotel dan di Sunset Welcome."
                  action={
                    <Link to="/passport" className={INLINE_LINK}>
                      Buka pass
                    </Link>
                  }
                />
                <Tip
                  icon={Sofa}
                  title="Siang Day 1 bebas"
                  text="Tidak ada kegiatan wajib setelah check-in. Pakai untuk istirahat."
                />
              </ul>

              {/* 2 · Arrival: one flow, across on a laptop, down on a phone. */}
              <div className="surface mt-5 p-5 sm:p-7">
                <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky sm:text-[0.9375rem]">
                  Arrival & check-in
                </p>
                <ol className="relative mt-5 grid gap-5 lg:grid-cols-5 lg:gap-4">
                  <span
                    aria-hidden
                    className="absolute left-[1.0625rem] top-2 bottom-2 w-px bg-[linear-gradient(180deg,#3ccaff,rgba(255,255,255,0.12))] lg:bottom-auto lg:left-4 lg:right-4 lg:top-[1.0625rem] lg:h-px lg:w-auto lg:bg-[linear-gradient(90deg,#3ccaff,rgba(255,255,255,0.12))]"
                  />
                  {ARRIVAL_STEPS.map((s, i) => (
                    <li key={s.title} className="relative flex gap-4 lg:block">
                      <span className="relative z-10 grid size-[2.125rem] shrink-0 place-items-center rounded-full border border-cyan/60 bg-navy-900 text-[0.8125rem] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="block pt-1.5 lg:mt-4 lg:pt-0">
                        <span className="block text-[0.9375rem] font-semibold text-white">
                          {s.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-white/60">
                          {s.text}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </GuideSection>

            {/* ── Transport ─────────────────────────────────────── */}
            <GuideSection
              id="transport"
              tone="dark"
              palm="right"
              eyebrow="Transportation Information"
              title="Getting around"
              text="Selama acara, perjalanan antarlokasi diatur oleh tim acara."
            >
              {/* One card: the bus. Every transfer during the event is by coach. */}
              <div className="surface overflow-hidden lg:grid lg:grid-cols-[1.1fr_1fr]">
                <div className="grid grid-cols-2 gap-1">
                  <MotionImage src={bus} alt="An event coach bus" className="aspect-[4/3]" />
                  <MotionImage src={busInterior} alt="Coach bus seating" className="aspect-[4/3]" />
                </div>
                <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-8">
                  <InfoTitle icon={Bus}>Bus antarlokasi</InfoTitle>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/70">
                    Kamu berangkat dengan bus sesuai jadwal tim. Tempat duduk diatur per tim, dan
                    timmu diumumkan saat check-in.
                  </p>
                  <div className="mt-5 border-t border-white/[0.08] pt-4">
                    <Link to="/schedule" className={INLINE_LINK}>
                      Lihat rundown
                    </Link>
                  </div>
                </div>
              </div>
            </GuideSection>

            {/* ── FAQ ───────────────────────────────────────────── */}
            <GuideSection id="faq" tone="light" eyebrow="FAQ" title="Good to know" last>
              <FaqList items={GUIDE_FAQ} />
            </GuideSection>
          </div>
        </div>
      </div>

      <Lightbox
        items={VENUE_SHOTS.map((s) => ({ src: s.src, alt: s.alt, caption: s.alt }))}
        index={shot}
        onClose={close}
        onIndexChange={setShot}
      />
    </>
  );
}

const INLINE_LINK =
  "font-semibold text-white underline decoration-cyan/50 decoration-1 underline-offset-[5px] transition-colors hover:decoration-cyan";

/** The four answers most people come for, each a shortcut to its section. */
function AtAGlance() {
  const facts: { icon: LucideIcon; label: string; value: string; note: string; href: string }[] = [
    {
      icon: Shirt,
      label: "Dress code",
      value: DRESS_CODE_KICKOFF.palette,
      note: "Day 2 · Kick-off Night",
      href: "#dress-code",
    },
    {
      icon: MapPin,
      label: "Where",
      value: "Swissôtel Jakarta",
      note: "PIK Avenue",
      href: "#venue",
    },
    {
      icon: CalendarDays,
      label: "When",
      value: EVENT.datesLabel,
      note: "3 hari",
      href: "#travel",
    },
    {
      icon: Bus,
      label: "Getting around",
      value: "Bus per tim",
      note: "Diatur tim acara",
      href: "#transport",
    },
  ];
  return (
    <section className="px-5">
      <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {facts.map((f) => (
          <li key={f.label}>
            <a href={f.href} className="surface-interactive flex h-full flex-col p-4 sm:p-5">
              <f.icon className="size-5 text-cyan" strokeWidth={1.8} />
              <span className="mt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-sky">
                {f.label}
              </span>
              <span className="mt-1 text-[0.9375rem] font-semibold leading-snug text-white sm:text-base">
                {f.value}
              </span>
              <span className="mt-0.5 text-[0.8125rem] text-white/55">{f.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Section tabs floating at the foot of the screen, within thumb reach. They
 * appear once the guide's sections are on screen, light up the one in view,
 * and step aside again over the footer.
 */
function SectionNav() {
  const [active, setActive] = useState<string>(SECTIONS[0]!.id);
  const [inGuide, setInGuide] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const shown = inGuide && !atFooter;
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement =>
      Boolean(el),
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));

    const area = document.getElementById("guide-sections");
    const show = new IntersectionObserver(([e]) => setInGuide(Boolean(e?.isIntersecting)), {
      rootMargin: "0px 0px -40% 0px",
    });
    if (area) show.observe(area);
    const footer = document.querySelector("footer");
    const foot = new IntersectionObserver(([e]) => setAtFooter(Boolean(e?.isIntersecting)), {
      rootMargin: "0px 0px -12% 0px",
    });
    if (footer) foot.observe(footer);
    return () => {
      io.disconnect();
      show.disconnect();
      foot.disconnect();
    };
  }, []);

  // Keep the active tab in view on a phone, where the tabs may scroll sideways.
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !el) return;
    list.scrollTo({
      left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.nav
          key="guide-tabs"
          aria-label="On this page"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 px-3 sm:px-5"
        >
          <ul
            ref={listRef}
            className="pointer-events-auto mx-auto grid w-full max-w-md grid-cols-5 gap-1 rounded-[1.5rem] border border-white/15 bg-navy-950/85 p-1.5 shadow-[0_20px_50px_-12px_rgba(0,10,30,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:flex sm:w-auto sm:max-w-max sm:rounded-full sm:p-1"
          >
            {SECTIONS.map((s) => {
              const on = s.id === active;
              return (
                <li key={s.id} data-id={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={on ? "true" : undefined}
                    className={`flex min-h-[3.75rem] w-full flex-col items-center justify-center gap-1 rounded-[1.125rem] px-1 text-[0.6875rem] font-semibold leading-none transition-colors duration-300 sm:min-h-10 sm:flex-row sm:gap-2 sm:rounded-full sm:px-4 sm:text-[0.8125rem] ${
                      on ? "bg-white text-navy-900" : "text-white/70 hover:text-white"
                    }`}
                  >
                    <s.icon
                      className={`size-5 shrink-0 sm:size-4 ${on ? "text-royal" : "text-current"}`}
                      strokeWidth={1.9}
                    />
                    <span className="hidden whitespace-nowrap min-[360px]:inline sm:hidden">
                      {s.short}
                    </span>
                    <span className="whitespace-nowrap min-[360px]:hidden">
                      {s.tiny ?? s.short}
                    </span>
                    <span className="hidden whitespace-nowrap sm:inline">{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function GuideSection({
  id,
  eyebrow,
  title,
  text,
  last = false,
  tone,
  palm,
  pattern = true,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  text?: string;
  last?: boolean;
  /** Its ground: the guide alternates white and blue, section by section. */
  tone: "light" | "dark";
  palm?: "left" | "right";
  /** Off when the band continues the one above it. */
  pattern?: boolean;
  children: ReactNode;
}) {
  return (
    <Band tone={tone} pattern={pattern} {...(palm ? { palm } : {})}>
      <section
        id={id}
        className={`relative scroll-mt-24 pt-14 sm:pt-20 ${last ? "pb-20 sm:pb-28" : "pb-14 sm:pb-20"}`}
      >
        <Reveal>
          <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky sm:text-[0.9375rem]">
            {eyebrow}
          </p>
          <h2 className="wordmark mt-3 pr-[0.06em] text-[clamp(1.75rem,6.4vw,2.75rem)] text-white">
            <Emphasis text={title} />
          </h2>
          {text && (
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-white/70 sm:text-base">
              {text}
            </p>
          )}
        </Reveal>
        <Reveal delay={0.06} className="mt-7">
          {children}
        </Reveal>
      </section>
    </Band>
  );
}

function InfoTitle({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-base font-semibold text-white">
      <Icon className="size-[1.15rem] text-cyan" />
      {children}
    </p>
  );
}

function Tip({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <li className="surface flex gap-4 p-4 sm:p-5 md:flex-col md:gap-0">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan/12 text-cyan">
        <Icon className="size-5" strokeWidth={1.8} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col md:mt-4">
        <span className="text-base font-semibold text-white">{title}</span>
        <span className="mt-1 text-sm leading-relaxed text-white/65">{text}</span>
        {action && <span className="mt-2.5 text-sm md:mt-auto md:pt-4">{action}</span>}
      </span>
    </li>
  );
}
