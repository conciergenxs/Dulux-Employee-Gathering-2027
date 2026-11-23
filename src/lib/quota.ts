import { CHECK_INS, DAYS, type CheckIn, type DayId } from "@/lib/event";
import type { ParticipantState } from "@/lib/participant";
import lobby from "@/assets/venue/lobby.webp";
import ballroom from "@/assets/venue/ballroom.webp";
import sunsetWelcome from "@/assets/mood/sunset-welcome.webp";
import openTable from "@/assets/mood/open-table.webp";
import sunsetVenue from "@/assets/mood/sunset-venue.webp";
import sunsetSocial from "@/assets/mood/sunset-social.webp";
import totem from "@/assets/activities/missing-piece-totem.webp";
import morningKickoff from "@/assets/activities/morning-kickoff.webp";
import teamBuilding from "@/assets/activities/team-building.webp";
import finalConnection from "@/assets/activities/final-connection.webp";
import solutionShowcase from "@/assets/activities/solution-showcase.webp";
import completeYourPiece from "@/assets/activities/complete-your-piece.webp";
import breakfastReconnect from "@/assets/activities/breakfast-reconnect.webp";
import directionRecap from "@/assets/activities/direction-recap.webp";
import functionalHuddle from "@/assets/activities/functional-huddle.webp";

/**
 * The on-site activities that stamp the pass, all three days (Dulux sitemap:
 * "Activity list & quota"). The list itself lives in `CHECK_INS`; this adds
 * what the pass shows with it: one photo per activity, never the same one
 * twice, so the list reads at a glance. Photos the venue hasn't supplied are
 * generated mood references, and the pages label them so.
 */
export type QuotaActivity = CheckIn & {
  dayLabel: string;
  image: string;
  quota: number;
};

export const ACTIVITY_PHOTO: Record<CheckIn["id"], string> = {
  welcome: lobby,
  "missing-piece-totem": totem,
  "sunset-welcome": sunsetWelcome,
  "open-table": openTable,
  "change-talk": sunsetVenue,
  "sunset-social": sunsetSocial,
  "morning-kickoff": morningKickoff,
  "team-building": teamBuilding,
  "final-connection": finalConnection,
  "solution-showcase": solutionShowcase,
  "complete-your-piece": completeYourPiece,
  "kickoff-night": ballroom,
  "breakfast-reconnect": breakfastReconnect,
  "direction-recap": directionRecap,
  "functional-huddle": functionalHuddle,
};

/** Generated mood references, labelled as such wherever they are shown large. */
export const MOOD_PHOTOS = new Set<CheckIn["id"]>([
  "missing-piece-totem",
  "morning-kickoff",
  "team-building",
  "final-connection",
  "solution-showcase",
  "complete-your-piece",
  "breakfast-reconnect",
  "direction-recap",
  "functional-huddle",
]);

export const QUOTA_ACTIVITIES: QuotaActivity[] = CHECK_INS.map((c) => {
  const day = DAYS.find((d) => d.id === c.day)!;
  return { ...c, dayLabel: `${day.label} · ${day.date}`, quota: 1, image: ACTIVITY_PHOTO[c.id] };
});

export function activitiesOn(day: DayId) {
  return QUOTA_ACTIVITIES.filter((a) => a.day === day);
}

export function stampsOf(state: ParticipantState) {
  return QUOTA_ACTIVITIES.filter((a) => state.checkIns[a.id]).length;
}
