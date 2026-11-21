import type { ReactNode } from "react";
import heroPatternTop from "@/assets/pattern/hero-top.webp";

/**
 * The page field shared by the inner pages: lit royal blue rather than flat
 * navy, with soft glows alternating sides. It starts and ends on the page
 * navy, so it meets the page hero and the footer without an edge. Cards keep
 * their own solid surface, so content never sits on it unbacked.
 */
export function PageField({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative isolate overflow-clip ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,#000_16rem)] bg-[radial-gradient(60rem_34rem_at_0%_8%,rgba(31,123,255,0.22)_0%,rgba(31,123,255,0)_70%),radial-gradient(56rem_32rem_at_100%_30%,rgba(60,202,255,0.14)_0%,rgba(60,202,255,0)_70%),radial-gradient(60rem_34rem_at_0%_55%,rgba(84,60,230,0.16)_0%,rgba(84,60,230,0)_70%),radial-gradient(56rem_32rem_at_100%_80%,rgba(31,123,255,0.2)_0%,rgba(31,123,255,0)_70%),linear-gradient(180deg,var(--navy-900)_0%,#03208a_14%,#021a76_45%,#03208a_75%,var(--navy-900)_100%)]"
      />
      {children}
    </div>
  );
}

/**
 * Texture, not ornament: the KV's own corner, large and faint, bleeding off
 * the screen edge and fading into the field. `right` sits in the top-right
 * corner of its positioned parent, `left` in the bottom-left; pass a class to
 * fine-tune the offset.
 */
export function KvTexture({
  side,
  className = "",
}: {
  side: "left" | "right";
  className?: string;
}) {
  const right = side === "right";
  // The art's tiles meet the image border on one edge (the top for the
  // right-hand corner, the bottom for the flipped left one); fade that edge
  // so the texture never draws a straight line across the page.
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 w-[78vw] max-w-[34rem] sm:w-[52vw] ${
        right
          ? "right-0 [mask-image:linear-gradient(to_bottom,transparent,#000_35%)]"
          : "left-0 [mask-image:linear-gradient(to_top,transparent,#000_35%)]"
      } ${className}`}
    >
      <img
        src={heroPatternTop}
        alt=""
        loading="lazy"
        className={`block w-full select-none opacity-[0.22] [mask-image:radial-gradient(circle_at_0%_0%,#000_28%,transparent_70%)] ${
          right ? "-scale-x-100" : "-scale-y-100"
        }`}
      />
    </div>
  );
}
