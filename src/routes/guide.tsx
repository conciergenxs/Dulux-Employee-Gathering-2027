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
  Plane,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
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
import heroPatternTop from "@/assets/pattern/hero-top.webp";
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

      {/* The page field: lit royal blue rather than flat navy, with soft glows
          that alternate sides down the page. It sits behind everything, and
          the cards keep their own solid surface, so text never sits on it
          unbacked except the section headings, which stay high-contrast. */}
      <div className="relative isolate overflow-clip">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,#000_16rem)] bg-[radial-gradient(60rem_34rem_at_0%_8%,rgba(31,123,255,0.22)_0%,rgba(31,123,255,0)_70%),radial-gradient(56rem_32rem_at_100%_30%,rgba(60,202,255,0.14)_0%,rgba(60,202,255,0)_70%),radial-gradient(60rem_34rem_at_0%_55%,rgba(84,60,230,0.16)_0%,rgba(84,60,230,0)_70%),radial-gradient(56rem_32rem_at_100%_80%,rgba(31,123,255,0.2)_0%,rgba(31,123,255,0)_70%),linear-gradient(180deg,var(--navy-900)_0%,#03208a_14%,#021a76_45%,#03208a_75%,var(--navy-900)_100%)]"
        />

        <AtAGlance />
        <SectionNav />

        <div id="guide-sections" className="px-5 pb-16 sm:pb-10">
          <div className="mx-auto max-w-5xl">
            {/* ── Dress code ────────────────────────────────────── */}
            <GuideSection
              id="dress-code"
              texture="right"
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
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-sky">
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
                      search={{ section: "before" }}
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
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-sky">
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
              texture="left"
              eyebrow="Transportation Information"
              title="Getting around"
              text="Selama acara, perjalanan antarlokasi diatur oleh tim acara."
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="surface overflow-hidden">
                  <div className="grid grid-cols-2 gap-1">
                    <MotionImage src={bus} alt="An event coach bus" className="aspect-[4/3]" />
                    <MotionImage
                      src={busInterior}
                      alt="Coach bus seating"
                      className="aspect-[4/3]"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <InfoTitle icon={Bus}>Bus antarlokasi</InfoTitle>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/70">
                      Kamu berangkat dengan bus sesuai jadwal tim. Tempat duduk diatur per tim, dan
                      timmu diumumkan saat check-in.
                    </p>
                  </div>
                </div>
                <div className="surface p-5 sm:p-6">
                  <InfoTitle icon={Plane}>Transfer bandara</InfoTitle>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/70">
                    Transfer dari bandara dikoordinasikan tim acara, termasuk bantuan untuk peserta
                    yang tiba lebih awal.
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
            <GuideSection id="faq" eyebrow="FAQ" title="Good to know" last>
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
            className="pointer-events-auto mx-auto grid w-full max-w-md grid-cols-5 gap-1 rounded-[1.5rem] border border-white/15 bg-navy-950/85 p-1.5 shadow-[0_20px_50px_-12px_rgba(0,6,40,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:flex sm:w-auto sm:max-w-max sm:rounded-full sm:p-1"
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

/**
 * Texture, not ornament: the KV's own corner, large and faint, bleeding off
 * the screen edge beside a section heading and fading into the field. It is
 * tied to its section, so it lands in the same place on every screen.
 */
function Texture({ side }: { side: "left" | "right" }) {
  const right = side === "right";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -top-6 -z-10 w-[78vw] max-w-[34rem] [mask-image:linear-gradient(to_bottom,transparent,#000_35%)] sm:w-[52vw] ${
        right
          ? "right-[calc(min(0px,(64rem-100vw)/2)-1.25rem)]"
          : "left-[calc(min(0px,(64rem-100vw)/2)-1.25rem)]"
      }`}
    >
      <img
        src={heroPatternTop}
        alt=""
        loading="lazy"
        className={`block w-full select-none opacity-[0.22] [mask-image:radial-gradient(circle_at_0%_0%,#000_28%,transparent_70%)] ${
          right ? "-scale-x-100" : ""
        }`}
      />
    </div>
  );
}

function GuideSection({
  id,
  eyebrow,
  title,
  text,
  last = false,
  texture,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  text?: string;
  last?: boolean;
  /** A KV corner bleeding off this side of the screen, behind the heading. */
  texture?: "left" | "right";
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 pt-14 sm:pt-20 ${last ? "pb-20 sm:pb-28" : ""}`}
    >
      {texture && <Texture side={texture} />}
      <Reveal>
        <p className="flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-sky sm:text-xs">
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-white/0 to-sky/80" />
          {eyebrow}
        </p>
        <h2 className="wordmark mt-3 pr-[0.06em] text-[clamp(1.75rem,6.4vw,2.75rem)] text-white">
          {title}
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
