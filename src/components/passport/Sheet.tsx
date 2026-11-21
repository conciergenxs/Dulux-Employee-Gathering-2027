import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

/**
 * The passport's detail surface.
 *
 * On a phone it is a sheet you can throw back down with your thumb; on a
 * desktop it settles into a centred panel. It is driven by the URL, so the
 * hardware back button closes it — which is what people actually reach for.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the sheet so the keyboard and screen readers follow it,
    // and hand it back to whatever opened the sheet on the way out.
    const restoreTo = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      restoreTo?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 w-full cursor-default bg-navy-950/70 lg:backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
            drag={reduce ? false : "y"}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 130 || info.velocity.y > 700) onClose();
            }}
            className="absolute inset-x-0 bottom-0 top-8 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-t-[1.6rem] border border-border bg-navy-900 outline-none sm:inset-y-10 sm:rounded-[1.6rem]"
          >
            {/* Drag starts from the handle only, so scrolling the content below
                never fights the dismiss gesture. */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="grid shrink-0 cursor-grab touch-none place-items-center pt-3 active:cursor-grabbing sm:hidden"
            >
              <span aria-hidden className="h-1 w-10 rounded-full bg-border" />
            </div>

            <div className="flex shrink-0 items-center gap-1 px-3 py-2.5">
              <button
                type="button"
                onClick={onClose}
                className="tap-target -ml-1 gap-1 rounded-full pl-2 pr-3.5 text-sm font-semibold text-cyan transition-transform active:scale-95"
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
