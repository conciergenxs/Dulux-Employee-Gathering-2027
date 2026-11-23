import type { ReactNode } from "react";
import { KvLinePattern, RootedPalm } from "@/components/kv/KickOffKv";

/**
 * One section of a page, in one of the KV's two grounds, so a long page
 * alternates instead of running one colour top to bottom:
 *
 *   dark  — the wall's denim, with one palm crown at the screen edge.
 *   light — white, with the KV wall drawn as outlines at the edges, and
 *           the type re-inked navy (see `.tone-light` in styles.css).
 *
 * The ground runs the full width of the screen, behind content that stays in
 * its own container; the band only adds the vertical rhythm.
 */
export function Band({
  tone,
  palm = "right",
  pattern = true,
  fade = false,
  className = "",
  children,
}: {
  tone: "light" | "dark";
  /** Which edge the palm stands at, on a dark band. */
  palm?: "left" | "right";
  /** Leave the decoration out, for a band that continues the one above. */
  pattern?: boolean;
  /** Fade the pattern out at the foot, for a short band that runs on into
   *  another white one, so the outlines never stop on a hard line. */
  fade?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const light = tone === "light";
  return (
    <div className={`relative isolate ${light ? "tone-light" : ""} ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden"
      >
        {light ? (
          <>
            <div className="absolute inset-0 bg-white" />
            {pattern && (
              <KvLinePattern
                className={
                  fade ? "[mask-image:linear-gradient(to_bottom,#000_30%,transparent_100%)]" : ""
                }
              />
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(50rem_26rem_at_50%_0%,rgba(56,160,255,0.14)_0%,rgba(56,160,255,0)_70%),linear-gradient(180deg,#0d4a80_0%,#0b3c6b_100%)]" />
            {/* Crown only: the trunk fades out just below it. */}
            <div
              hidden={!pattern}
              className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_0%,#000_30%,transparent_75%)]"
            >
              <RootedPalm
                className={`top-[-2rem] w-[22rem] opacity-30 sm:w-[28rem] lg:w-[30rem] lg:opacity-25 ${
                  palm === "right"
                    ? "right-[-12rem] -scale-x-100 sm:right-[-13rem] lg:right-[calc(50%-54rem)]"
                    : "left-[-12rem] sm:left-[-13rem] lg:left-[calc(50%-54rem)]"
                }`}
              />
            </div>
          </>
        )}
      </div>
      {children}
    </div>
  );
}
