import { DAY1 } from "@/lib/event";
import type { CheckInId, ParticipantState } from "@/lib/participant";
import lobby from "@/assets/venue/lobby.webp";
import sunsetWelcome from "@/assets/mood/sunset-welcome.webp";

/** The on-site activities that stamp the pass (Dulux sitemap: Day 1). */
export type QuotaActivity = {
  id: CheckInId;
  name: string;
  day: string;
  tag: string;
  where: string;
  image: string;
  quota: number;
  how: string;
};

export const QUOTA_ACTIVITIES: QuotaActivity[] = [
  {
    id: "welcome",
    name: "The Welcome Experience",
    day: "Day 1 · Wed, 16 Dec",
    tag: DAY1.find((d) => d.id === "welcome")!.line,
    where: "Meja registrasi, lobi Swissôtel",
    image: lobby,
    quota: 1,
    how: "Setelah QR dipindai, kamu menerima info kamar, identitas tim, dan welcome kit berisi clue pack tersegel untuk hari berikutnya. Pass-mu lalu menampilkan “Your Piece Has Arrived”.",
  },
  {
    id: "sunset-welcome",
    name: "Sunset Welcome",
    day: "Day 1 · Wed, 16 Dec",
    tag: DAY1.find((d) => d.id === "sunset-welcome")!.line,
    where: "Venue malam",
    image: sunsetWelcome,
    quota: 1,
    how: "Kamu disambut musik akustik, hidangan ringan saat senja, dan suasana yang membuat obrolan mengalir dengan sendirinya.",
  },
];

export function stampsOf(state: ParticipantState) {
  return QUOTA_ACTIVITIES.filter((a) => state.checkIns[a.id]).length;
}
