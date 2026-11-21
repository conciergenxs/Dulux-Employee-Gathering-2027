import { useSyncExternalStore } from "react";

/**
 * Presentation mode by default: the site shows only what attendees will see.
 * The controls that stand in for event-day systems (simulating the crew's
 * scan, resetting saved answers) appear only in demo mode, switched on with
 * `?demo=1` and off with `?demo=0`. The choice is remembered on this device.
 */
const KEY = "deg27-demo";
const listeners = new Set<() => void>();

function read(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const param = new URLSearchParams(window.location.search).get("demo");
    if (param === "1") window.localStorage.setItem(KEY, "1");
    if (param === "0") window.localStorage.removeItem(KEY);
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

// Read as soon as the app loads on the client, so `?demo=1` is remembered
// even on a page that has no demo controls of its own.
let cached: boolean | null = typeof window === "undefined" ? null : read();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot() {
  if (cached === null) cached = read();
  return cached;
}

export function useDemoMode(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
