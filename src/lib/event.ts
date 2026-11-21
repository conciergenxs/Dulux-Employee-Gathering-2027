/**
 * Everything the microsite says about the event, in one place.
 *
 * Sources, in priority order:
 *   1. Planner brief ("brief dulux.pdf") — sitemap and current scope.
 *   2. Glow Act deck ("Employee Gathering 2027 - Glow Act.pdf") — concept,
 *      copy, Day 1 flow, venue, transport, line-up.
 *
 * Nothing here is invented. Where the materials are silent (clock times,
 * pick-up points, the evening venue, Day 2–3 rundowns) the value is marked
 * `TBC` and the UI shows a clearly labelled placeholder instead.
 */

export const TBC = "To be confirmed";

export const EVENT = {
  brand: "Dulux",
  name: "Dulux Employee Gathering 2027",
  theme: "Greater Together",
  concept: "The Living Canvas",
  statement: "Many hands. One bigger picture.",
  /** Deck p.10 — the theme reveal line. */
  promise:
    "Karena babak berikutnya bukan sesuatu yang cukup kita tonton dari jauh. Babak itu kita bangun bersama.",
  /** Deck p.19 (Save the Date): 16–18 December 2026. No start time is given,
   *  so the countdown runs to the start of Day 1's date in Jakarta. */
  startISO: "2026-12-16T00:00:00+07:00",
  endISO: "2026-12-18T23:59:59+07:00",
  datesLabel: "16–18 December 2026",
  datesShort: "16–18 Dec 2026",
  /** For Indonesian sentences. */
  datesLabelId: "16–18 Desember 2026",
  venue: "Swissôtel Jakarta PIK Avenue",
  area: "Pantai Indah Kapuk, Jakarta",
  /** Deck p.2 */
  attendees: 215,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Swissôtel Jakarta PIK Avenue"),
} as const;

/** Deck p.11 — the creative manifesto. */
export const MANIFESTO = {
  lines: ["One brand.", "Many perspectives.", "Every hand matters."],
  body: "Kita tidak harus membuat goresan yang sama. Yang penting, setiap orang tahu kenapa goresannya berarti.",
};

/* ── Event journey (deck p.16, planner brief p.3) ─────────────────── */

export type PhaseId = "pre" | "on" | "post";

export const PHASES: {
  id: PhaseId;
  stage: string;
  title: string;
  arc: string;
  text: string;
}[] = [
  {
    id: "pre",
    stage: "Pre-Event",
    title: "Discover Your Piece",
    arc: "From Curiosity to Belonging",
    text: "Setiap karyawan menemukan tempatnya di gambaran besar.",
  },
  {
    id: "on",
    stage: "On Event",
    title: "Connect the Pieces",
    arc: "From Connection to Collective Ownership",
    text: "Kontribusi tiap orang tumbuh menjadi pencapaian bersama.",
  },
  {
    id: "post",
    stage: "Post-Event",
    title: "Carry the Picture Forward",
    arc: "From Commitment to Action",
    text: "Visi bersama terus hidup lewat langkah-langkah yang berarti.",
  },
];

export function currentPhase(now = Date.now()): PhaseId {
  if (now < new Date(EVENT.startISO).getTime()) return "pre";
  if (now <= new Date(EVENT.endISO).getTime()) return "on";
  return "post";
}

/**
 * The countdown's line changes with the reminder series in the deck (p.24):
 * D-7 teaser, D-3 get ready, D-1 final countdown, and the hand-over (p.25).
 */
export function countdownMessage(daysLeft: number, phase: PhaseId) {
  if (phase === "on") return { title: "Your piece is ready. Let's connect.", sub: "" };
  if (phase === "post")
    return { title: "Carry the picture forward.", sub: "Visi bersama kita terus berjalan." };
  if (daysLeft < 1)
    return {
      title: "Tomorrow, we come together.",
      sub: "Kepinganmu sudah siap. Perjalananmu segera dimulai.",
    };
  if (daysLeft <= 3)
    return {
      title: "Your piece is almost in place.",
      sub: "Gambaran besarnya mulai utuh. Pastikan kamu siap untuk langkah berikutnya.",
    };
  if (daysLeft <= 7)
    return {
      title: "Something greater is taking shape.",
      sub: "Setiap kontribusi berarti. Sebentar lagi, kita akan melihat apa yang bisa kita ciptakan bersama.",
    };
  return {
    title: "A bigger chapter is coming.",
    sub: "Same colour. Bigger canvas.",
  };
}

/* ── Pre-event: The First Stroke (deck p.22) ──────────────────────── */

export type StrengthId = "connect" | "create" | "solve" | "deliver";

export const STRENGTHS: {
  id: StrengthId;
  name: string;
  tagline: string;
  /** Short line shown with the piece once chosen. */
  piece: string;
}[] = [
  {
    id: "connect",
    name: "Connect",
    tagline: "Menyatukan orang",
    piece:
      "Kamu menyatukan orang. Kepinganmu yang menghubungkan satu goresan dengan goresan berikutnya.",
  },
  {
    id: "create",
    name: "Create",
    tagline: "Membawa ide-ide segar",
    piece: "Kamu membawa ide-ide segar. Kepinganmu yang menambahkan warna baru di kanvas.",
  },
  {
    id: "solve",
    name: "Solve",
    tagline: "Menemukan solusi yang lebih baik",
    piece: "Kamu menemukan solusi yang lebih baik. Kepinganmu yang membuat semuanya saling pas.",
  },
  {
    id: "deliver",
    name: "Deliver",
    tagline: "Mengubah rencana menjadi hasil",
    piece:
      "Kamu mengubah rencana menjadi hasil. Kepinganmu yang membuat gambaran besar ini jadi nyata.",
  },
];

export const FIRST_STROKE_DISCLAIMER =
  "Jawaban ini tidak digunakan untuk menilai kemampuan karyawan, dan tidak menjadi dasar penempatan kerja.";

/* ── Day 1 (deck p.29–44, planner brief p.4–8) ────────────────────── */

export type Day1Id =
  | "pre-opening"
  | "welcome"
  | "journey-to-sunset"
  | "sunset-welcome"
  | "open-table"
  | "change-talk"
  | "sunset-social";

export type Day1Item = {
  id: Day1Id;
  title: string;
  /** The deck's one-liner from the Day 1 Flow slide. */
  line: string;
  summary: string;
  checkIn?: boolean;
  /** What the microsite does in this moment, if anything. */
  microsite?: string;
  personalTime?: boolean;
  /** Has its own chapter on the Activities page. */
  hasActivity: boolean;
  /** Clock time, once the event team confirms it (e.g. "13.00"). */
  time?: string;
  /** Part of the day, as the deck describes it (p.32–43). */
  daypart: string;
  /** Where it happens, only once it is confirmed (deck p.32, 35). */
  where?: string;
  /** One short instruction for the attendee, from the brief and the deck. */
  note?: string;
};

export const DAY1: Day1Item[] = [
  {
    id: "pre-opening",
    title: "Pre-opening Readiness",
    line: "Koordinasi transfer bandara, persiapan registrasi, dan bantuan untuk yang datang lebih awal",
    summary:
      "Tim acara mengatur transfer dari bandara, menyiapkan registrasi, dan membantu peserta yang tiba lebih awal.",
    hasActivity: false,
    daypart: "Before arrival",
    where: "Bandara & hotel",
  },
  {
    id: "welcome",
    title: "The Welcome Experience",
    line: "Check-in lewat microsite, sambutan personal, perkenalan tim, dan clue pack",
    summary:
      "Tunjukkan QR pass pribadimu di meja registrasi. Setelah dipindai, kamu akan menerima info kamar, identitas tim, dan welcome kit berisi clue pack tersegel untuk aktivitas hari berikutnya.",
    checkIn: true,
    microsite: "Pass kamu menampilkan “Your Piece Has Arrived” setelah check-in",
    hasActivity: true,
    daypart: "Arrival",
    where: "Lobi Swissôtel",
    note: "Tunjukkan QR di meja registrasi. Kamu akan menerima info kamar, tim, dan welcome kit.",
  },
  {
    id: "journey-to-sunset",
    title: "Journey to Sunset",
    line: "Waktu pribadi di awal siang, lalu berangkat ke venue malam",
    summary:
      "Waktunya beristirahat dan bersiap sebelum acara sore, tanpa aktivitas wajib. Setelah itu, perjalanan berlanjut ke venue malam.",
    personalTime: true,
    hasActivity: true,
    daypart: "Early afternoon",
    where: "Kamar hotel",
    note: "Waktu bebas untuk istirahat. Bus ke venue malam berangkat sesuai jadwal tim.",
  },
  {
    id: "sunset-welcome",
    title: "Sunset Welcome",
    line: "Musik akustik, networking santai, dan suasana senja yang indah",
    summary:
      "Kamu akan disambut musik akustik, hidangan ringan saat senja, dan suasana yang membuat obrolan mengalir dengan sendirinya.",
    checkIn: true,
    hasActivity: true,
    daypart: "Sunset",
    note: "Scan QR saat tiba di venue. Acara dibuka dengan musik akustik dan hidangan ringan.",
  },
  {
    id: "open-table",
    title: "The Open Table",
    line: "Makan malam saat senja, ditemani obrolan bersama para pimpinan",
    summary:
      "Saat makan malam, para pimpinan duduk berbaur dengan rekan dari berbagai fungsi. Setiap meja punya satu conversation card untuk membuka obrolan.",
    microsite: "Open the conversation card",
    hasActivity: true,
    daypart: "Sunset dinner",
    note: "Makan malam bersama pimpinan. Setiap meja mendapat satu conversation card.",
  },
  {
    id: "change-talk",
    title: "The Change Talk",
    line: "Sharing dari pimpinan, tanya jawab bersama moderator, dan rangkuman yang jelas",
    summary:
      "Pimpinan berbagi konteks dan arah perusahaan menuju 2027. Moderator lalu membawakan pertanyaan, termasuk pertanyaan anonim yang terkumpul lewat microsite ini.",
    microsite: "Questions from the Change Talk Question Box",
    hasActivity: true,
    daypart: "Evening",
    note: "Pimpinan menjelaskan arah Dulux menuju 2027 dan menjawab pertanyaan dari Question Box.",
  },
  {
    id: "sunset-social",
    title: "Sunset Social",
    line: "Musik, DJ, obrolan santai, dan teaser Day 2",
    summary:
      "Malam berlanjut lebih santai dengan musik akustik live, DJ, dan networking informal. Sebelum acara selesai, pilih satu kata yang mewakili harapanmu untuk 2027.",
    microsite: "The One-Word Pulse",
    hasActivity: true,
    daypart: "Evening",
    note: "Musik live dan DJ untuk menutup malam. Pilih satu kata harapanmu untuk 2027 lewat microsite.",
  },
];

/** Deck p.45 — the Day 1 experience arc. */
export const DAY1_ARC = [
  { word: "Arrive", feel: "Feel welcomed" },
  { word: "Open Up", feel: "Feel heard" },
  { word: "Connect", feel: "Feel together" },
];

export const DAYS = [
  { id: "day1", label: "Day 1", date: "Wed, 16 Dec", ready: true },
  { id: "day2", label: "Day 2", date: "Thu, 17 Dec", ready: false },
  { id: "day3", label: "Day 3", date: "Fri, 18 Dec", ready: false },
] as const;

/** Deck p.36 — arrival & check-in flow. */
export const ARRIVAL_STEPS = [
  {
    title: "Welcome & Greet",
    text: "Tim acara menyambutmu dan mengantarmu ke area registrasi.",
  },
  {
    title: "Digital Registration",
    text: "QR dari microsite dipindai untuk memastikan kehadiranmu dan mengaktifkan pass digitalmu.",
  },
  { title: "Welcome Kit", text: "Ambil welcome kit dan merchandise yang sudah disiapkan untukmu." },
  { title: "Hotel Check-in", text: "Verifikasi kamar dan pengambilan kunci." },
  {
    title: "Settle In & Explore",
    text: "Masuk ke kamar, beristirahat, dan lihat agenda acara di microsite ini.",
  },
];

/** Deck p.33 — starter kit. Visuals are placeholders until final mockups arrive. */
export const WELCOME_KIT = [
  {
    id: "badge",
    name: "Event Badge / ID",
    note: "Badge berbentuk kepingan puzzle yang tetap serasi saat disambungkan dengan milik orang lain.",
  },
  { id: "hat", name: "Bucket Hat", note: "Dengan logo acara." },
  { id: "tee", name: "Oversized T-Shirt", note: "Dengan logo acara." },
  { id: "fan", name: "Mini Hand Fan", note: "Dengan logo acara." },
] as const;

/** Deck p.39 / planner brief p.6 */
export const CONVERSATION_CARD =
  "What is one thing about working together that we should carry into 2027?";

/** Deck p.41 — how The Change Talk runs. */
export const CHANGE_TALK_PARTS = [
  {
    title: "The Context",
    text: "Pimpinan menjelaskan konteks perubahan secara ringkas dan konsisten.",
  },
  {
    title: "The Direction",
    text: "Arah besar perusahaan menuju 2027, tanpa mendahului pembahasan AOP yang lebih detail pada malam Day 2.",
  },
  {
    title: "The Questions That Matter",
    text: "Moderator membawakan pertanyaan dari microsite, termasuk pertanyaan anonim yang terkumpul sejak pre-event.",
  },
  {
    title: "The Clarity Moment",
    text: "Pimpinan merangkum apa yang sudah pasti, apa yang masih berjalan, dan ke mana karyawan bisa mencari kabar terbaru setelah acara.",
  },
];

/** Deck p.42 — listed as proposed guest stars with proposed topics. */
export const CHANGE_TALK_GUESTS = [
  {
    id: "praz-teguh",
    name: "Praz Teguh",
    bio: "Komika dan podcaster yang dikenal lewat gaya bicaranya yang santai dan obrolannya yang menghibur. Kariernya sendiri juga pernah berubah arah, termasuk setelah keluar dari Podcast Warung Kopi pada 2024.",
    topic: "Life Doesn't Always Go According to Plan.",
  },
  {
    id: "rico-lubis",
    name: "Rico Lubis",
    bio: "Pengusaha di balik Urbain Inc. yang dikenal di komunitas streetball dan lewat konten-konten obrolannya. Ia pernah menjadi pembicara di pelatihan bisnis seputar adaptasi dan transformasi digital.",
    topic: "Evolve or Be Left Behind.",
  },
  {
    id: "ernest-prakasa",
    name: "Ernest Prakasa",
    bio: "Beralih dari stand-up comedy ke penyutradaraan dan dunia usaha lewat Hahaha Corp dan Imajinari. Ia kerap berbicara di forum industri soal membangun bisnis kreatif dan berani mengambil keputusan besar.",
    topic: "Different Chapters. Same Drive.",
  },
] as const;

/** Deck p.43–44 — Sunset Social line-up (proposed / wishlist). */
export const SUNSET_LINEUP = [
  { id: "nyc-band", name: "NYC Band", role: "Acoustic Set" },
  { id: "overdoze", name: "Overdoze", role: "Acoustic Set" },
  { id: "naya-nyxx", name: "Naya NYXX", role: "FDJ" },
  { id: "nikita-ramli", name: "Nikita Ramli", role: "FDJ" },
] as const;

export const SPECIAL_WISHLIST = {
  id: "grind-boys",
  name: "Grind Boys",
  role: "DJ Set & Live Karaoke",
  note: "Wishlist spesial: Grind Boys memandu DJ karaoke di Day 1.",
};

/** Deck p.43 — The One-Word Pulse. */
export const PULSE_WORDS = ["Trust", "Collaboration", "Growth", "Progress"] as const;
export type PulseWord = (typeof PULSE_WORDS)[number];

/* ── Practical guide ──────────────────────────────────────────────── */

/** Deck p.63 — announced for the Day 2 Kick-off Night. */
export const DRESS_CODE_KICKOFF = {
  title: "Greater Together Look",
  palette: "Blue Silver",
  words: ["Modern", "Elevated", "Connected"],
  text: "Datanglah dengan outfit terbaikmu yang mencerminkan semangat Greater Together: modern, percaya diri, dan selaras dengan tema acara.",
};

/* ── FAQ — answers only from the materials ────────────────────────── */

export type Faq = { q: string; a: string };

export const PASSPORT_FAQ: Faq[] = [
  {
    q: "Apa itu My Canvas Pass?",
    a: "Pass digital pribadimu untuk Greater Together 2027. Di sini ada QR code untuk check-in, checklist pre-event, dan status aktivitas Day 1. Cukup satu link untuk seluruh perjalanan acara.",
  },
  {
    q: "Apakah The First Stroke wajib diisi?",
    a: "Ya. Setelah registrasi, setiap peserta menjawab satu pertanyaan: kekuatan apa yang akan kamu bawa ke babak baru kita. Tidak sampai satu menit.",
  },
  {
    q: "Apakah jawaban First Stroke akan dinilai?",
    a: "Tidak. Ini momen partisipasi untuk menunjukkan kepinganmu dalam gambaran besar. Jawabannya tidak digunakan untuk menilai kemampuan karyawan, dan tidak menjadi dasar penempatan kerja.",
  },
  {
    q: "Apakah pertanyaan untuk The Change Talk benar-benar anonim?",
    a: "Ya. Question box ini anonim. Moderator akan mengelompokkan pertanyaan yang serupa supaya pimpinan bisa menyiapkan jawaban yang relevan untuk The Change Talk di Day 1.",
  },
  {
    q: "Bagaimana cara check-in di Day 1?",
    a: "Buka pass ini, lalu tunjukkan QR-nya di meja registrasi di lobi hotel. Setelah dipindai, pass kamu akan menampilkan status “Your Piece Has Arrived”.",
  },
  {
    q: "Aktivitas Day 1 mana saja yang perlu check-in?",
    a: "Ada dua: The Welcome Experience saat kamu tiba, dan Sunset Welcome menjelang malam. Keduanya memakai QR yang sama di pass ini.",
  },
];

export const GUIDE_FAQ: Faq[] = [
  {
    q: "Kapan dan di mana acaranya?",
    a: `${EVENT.datesLabelId} di ${EVENT.venue}, ${EVENT.area}.`,
  },
  {
    q: "Apa saja yang didapat saat check-in?",
    a: "Info kamar, identitas tim, dan welcome kit (badge/ID acara, bucket hat, kaus oversized, dan kipas tangan mini), lengkap dengan clue pack tersegel untuk aktivitas hari berikutnya.",
  },
  {
    q: "Apakah ada kegiatan wajib di siang hari Day 1?",
    a: "Tidak ada. Setelah check-in, waktu siang sepenuhnya milikmu untuk beristirahat dan bersiap sebelum acara malam.",
  },
  {
    q: "Bagaimana cara menuju acara malam?",
    a: "Karyawan berangkat dengan bus sesuai jadwal masing-masing dan duduk bersama tim barunya. Jam penjemputan akan diinformasikan oleh tim acara.",
  },
  {
    q: "Apa dress code-nya?",
    a: "Untuk Day 2 Kick-off Night, dress code-nya Greater Together Look dengan nuansa Blue Silver: modern, elevated, connected. Dress code untuk Day 1 belum diumumkan.",
  },
  {
    q: "Di mana bisa melihat jadwal Day 2 dan Day 3?",
    a: "Rundown Day 2 dan Day 3 masih difinalisasi. Jadwalnya akan muncul di halaman Schedule setelah dikonfirmasi.",
  },
];
