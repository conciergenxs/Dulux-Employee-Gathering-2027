import { useSyncExternalStore } from "react";
import { CHECK_INS, type CheckInId, type PulseWord, type StrengthId } from "@/lib/event";

export type { CheckInId };

/**
 * Frontend-only prototype state.
 *
 * The JTI microsite kept the passport, missions and check-ins on a Redis-backed
 * server. This build has no backend, so the participant's progress lives in
 * this browser's localStorage and nothing leaves the device. Every place that
 * would talk to a server in production says so in the UI.
 *
 * `useSyncExternalStore` keeps SSR honest: the server (and the hydration pass)
 * always renders the empty state, and the browser's saved state takes over
 * right after — no hydration mismatch.
 */

/** Sample participant. Clearly mock data — no real employee. */
export const PARTICIPANT = {
  name: "Nadia Pratiwi",
  department: "Marketing",
  passCode: "DEG27-0417",
  /** Revealed at check-in. Sample values for the prototype only. */
  team: "Team 07",
  room: "1207",
} as const;

export type Question = { id: string; text: string; at: string };

export type ParticipantState = {
  firstStroke: { strength: StrengthId; at: string } | null;
  questions: Question[];
  checkIns: Partial<Record<CheckInId, string>>;
  pulse: { word: PulseWord; at: string } | null;
};

const KEY = "deg27-prototype-v1";

const EMPTY: ParticipantState = {
  firstStroke: null,
  questions: [],
  checkIns: {},
  pulse: null,
};

let current: ParticipantState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) current = { ...EMPTY, ...(JSON.parse(raw) as Partial<ParticipantState>) };
  } catch {
    current = EMPTY;
  }
}

function commit(next: ParticipantState) {
  current = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage blocked: the session still works, it just won't persist.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    current = EMPTY;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return current;
}

const getServerSnapshot = () => EMPTY;

export function useParticipant() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const now = () => new Date().toISOString();

export const actions = {
  setFirstStroke(strength: StrengthId) {
    commit({ ...getSnapshot(), firstStroke: { strength, at: now() } });
  },
  clearFirstStroke() {
    commit({ ...getSnapshot(), firstStroke: null });
  },
  addQuestion(text: string) {
    const q: Question = { id: Math.random().toString(36).slice(2, 10), text, at: now() };
    commit({ ...getSnapshot(), questions: [...getSnapshot().questions, q] });
  },
  checkIn(id: CheckInId) {
    const s = getSnapshot();
    commit({ ...s, checkIns: { ...s.checkIns, [id]: now() } });
  },
  setPulse(word: PulseWord) {
    commit({ ...getSnapshot(), pulse: { word, at: now() } });
  },
  clearPulse() {
    commit({ ...getSnapshot(), pulse: null });
  },
  reset() {
    commit(EMPTY);
  },
};

/* ── Derived progress ─────────────────────────────────────────────── */

export function progressOf(s: ParticipantState) {
  const checklist = [Boolean(s.firstStroke), s.questions.length > 0];
  const activities = CHECK_INS.map((a) => Boolean(s.checkIns[a.id]));
  return {
    checklistDone: checklist.filter(Boolean).length,
    checklistTotal: checklist.length,
    mandatoryDone: Boolean(s.firstStroke),
    activitiesDone: activities.filter(Boolean).length,
    activitiesTotal: activities.length,
    arrived: Boolean(s.checkIns.welcome),
  };
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
