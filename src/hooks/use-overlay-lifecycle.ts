import { useEffect, useRef } from "react";

/**
 * Plumbing shared by every full-screen overlay that isn't the passport's own
 * `Sheet` (which has slightly different focus needs of its own): Escape
 * closes it, the page behind it stops scrolling while it's up, and focus
 * moves onto the panel on open and back to whatever opened it on close.
 *
 * Overlays can stack — a colleague picker over a mission, the terms over a
 * mission — so Escape belongs to whichever opened last: one press closes the
 * top layer, not every layer at once.
 *
 * Returns the ref to put on the focusable panel element.
 */
const openStack: symbol[] = [];

export function useOverlayLifecycle(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const layer = Symbol("overlay");
    openStack.push(layer);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openStack[openStack.length - 1] === layer) onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restoreTo = document.activeElement as HTMLElement | null;
    // preventScroll: focusing must never move the page behind the overlay —
    // on a phone that read as the page twitching as a sheet opened or closed.
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      openStack.splice(openStack.indexOf(layer), 1);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      restoreTo?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return panelRef;
}
