import { useEffect, useRef, useState } from "react";
import { EVENT } from "@/lib/event";

export function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    ms,
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

/** Ticks once a second. `null` until mounted, so SSR and hydration agree. */
export function useCountdown(targetISO: string = EVENT.startISO, onDone?: () => void) {
  const target = new Date(targetISO).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => {
      setT(diff(target));
      if (Date.now() >= target) {
        clearInterval(id);
        doneRef.current?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return t;
}

/**
 * The road-to-event clock: four condensed numerals divided by hairlines —
 * the deck's headline face, so the numbers read like the event's own type.
 */
export function Countdown({ targetISO = EVENT.startISO }: { targetISO?: string }) {
  const t = useCountdown(targetISO);
  const units: [string, string, number | null][] = [
    ["Days", "Days", t?.days ?? null],
    ["Hours", "Hrs", t?.hours ?? null],
    ["Minutes", "Min", t?.minutes ?? null],
    ["Seconds", "Sec", t?.seconds ?? null],
  ];

  return (
    <div
      className="grid grid-cols-4 divide-x divide-border"
      role="timer"
      aria-label={
        t
          ? `${t.days} days, ${t.hours} hours, ${t.minutes} minutes until Day 1`
          : "Countdown to Day 1"
      }
    >
      {units.map(([label, short, value], i) => (
        <div key={label} className={`min-w-0 ${i === 0 ? "pr-3" : "px-3"} sm:px-6 sm:first:pl-0`}>
          <div
            aria-hidden
            className={`font-display text-[2.6rem] leading-none tabular-nums sm:text-6xl lg:text-7xl ${
              i === 0 ? "text-together" : "text-white"
            }`}
          >
            {value === null ? "--" : String(value).padStart(2, "0")}
          </div>
          <div aria-hidden className="t-micro mt-2 text-muted-foreground">
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
