import type { ReactNode } from "react";

/**
 * Two-column section body for laptops.
 *
 * A phone reads one column, top to bottom: the heading (or search, or count)
 * first, then the content. That is the order the markup is written in, and
 * below `lg` nothing here changes it — the wrappers are plain blocks.
 *
 * From `lg` up the same two blocks become a grid. The heading moves into a
 * fixed rail on the left and stays with you while the content scrolls past,
 * so the section keeps its label and its controls in reach instead of leaving
 * them behind at the top of a long list. It also lines the content up with
 * the page container, which a narrower centred column never did.
 *
 * One rail width for the whole site. Sections that differ only in how wide
 * their middle column happens to be are the reason a layout stops feeling
 * designed.
 *
 * The sticky box is a child of the grid cell rather than the cell itself:
 * a stretched grid item has no room left to move in, so sticking it directly
 * mispositions it. Note also that any ancestor with `overflow: hidden`
 * silently disables sticky — sections that clip an ornament must use
 * `overflow-clip`, which clips without becoming a scroll container.
 */
export function RailSection({
  rail,
  children,
  railOnDesktopOnly = false,
  className = "",
}: {
  /** Heading, and anything that should stay in view beside the content. */
  rail: ReactNode;
  children: ReactNode;
  /** Rail content that only earns its place on a laptop: hidden below `lg`. */
  railOnDesktopOnly?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto max-w-6xl lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-x-16 ${className}`}
    >
      <div className={railOnDesktopOnly ? "hidden lg:block" : undefined}>
        <div className="lg:sticky lg:top-24">{rail}</div>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
