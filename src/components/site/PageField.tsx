import type { ReactNode } from "react";
import { RootedPalm } from "@/components/kv/KickOffKv";

/**
 * The page field shared by the inner pages: the KV wall's mid denim (the
 * colour the page hero fades into), easing a shade deeper toward the foot,
 * with a soft light high up. Cards keep their own solid surface, so content
 * never sits on it unbacked.
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
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(50rem_26rem_at_50%_22rem,rgba(56,160,255,0.13)_0%,rgba(56,160,255,0)_70%),linear-gradient(180deg,#0d4a80_0rem,#0d4a80_6rem,#0c4274_45%,#0b3c6b_100%)]"
      />
      {children}
    </div>
  );
}

/**
 * A palm at the edge of the field, as on the home page: placed by its crown,
 * pushed out past the content, and faint. On a laptop it is rooted at the
 * foot of the field (its trunk runs down to wherever the field ends, fading
 * but never to nothing). On a phone only the crown shows: the trunk fades out
 * just below it, since on a long page a full-length trunk reads as a stray
 * bar down the screen edge. `right` hangs from the top of the field, `left` sits lower down;
 * pass a class to fine-tune the offset.
 */
export function KvTexture({
  side,
  className = "",
}: {
  side: "left" | "right";
  className?: string;
}) {
  const right = side === "right";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_40%,rgba(0,0,0,0.45)_100%)]"
    >
      <RootedPalm
        className={`w-[24rem] max-lg:[mask-image:linear-gradient(to_bottom,#000_50%,transparent_92%)] opacity-30 sm:w-[28rem] lg:w-[30rem] lg:opacity-25 ${
          right
            ? "right-[-12.5rem] -scale-x-100 sm:right-[-14rem] lg:right-[calc(50%-54rem)]"
            : "left-[-12.5rem] sm:left-[-14rem] lg:left-[calc(50%-54rem)]"
        } ${className}`}
      />
    </div>
  );
}
