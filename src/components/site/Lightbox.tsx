import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxItem = { src: string; alt: string; caption?: string };

export function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange(((index ?? 0) + 1) % items.length);
      if (e.key === "ArrowLeft") onIndexChange(((index ?? 0) - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, items.length, onClose, onIndexChange]);

  const item = index === null ? null : items[index];

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/92 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.figure
            className="relative max-h-full w-full max-w-4xl"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={item.src}
              src={item.src}
              alt={item.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="max-h-[76vh] w-full rounded-[var(--radius-card)] object-contain"
            />
            {item.caption && (
              <figcaption className="mt-4 text-center text-sm text-white/85">
                {item.caption}
              </figcaption>
            )}

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-2 right-0 grid size-10 -translate-y-full place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 active:scale-90"
            >
              <X className="size-5" />
            </button>

            {items.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => onIndexChange((index - 1 + items.length) % items.length)}
                  aria-label="Previous photo"
                  className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 active:scale-90"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                  {index + 1} / {items.length}
                </span>
                <button
                  onClick={() => onIndexChange((index + 1) % items.length)}
                  aria-label="Next photo"
                  className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 active:scale-90"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
