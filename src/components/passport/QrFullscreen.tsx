import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { PassportQr } from "@/components/passport/PassportQr";

/**
 * The scanner view, kept from the JTI pass: the code on a white plate, the
 * rest of the screen dark, nothing competing with it — a scanner locks on
 * faster that way across a busy registration desk.
 */
export function QrFullscreen({
  open,
  value,
  label,
  onClose,
}: {
  open: boolean;
  value: string;
  label: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restoreTo = document.activeElement as HTMLElement | null;
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      restoreTo?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="qr-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Pass QR code"
          className="fixed inset-0 z-[90] grid place-items-center bg-navy-950 p-6"
        >
          <div className="w-full max-w-[22rem]">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl bg-white p-6"
            >
              <PassportQr value={value} />
            </motion.div>
            <p className="mt-5 text-center font-display text-2xl tracking-wide text-white">
              {label}
            </p>
            <p className="t-small mt-1 text-center text-white/45">
              Tunjukkan QR ini ke crew di meja registrasi.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 grid size-11 place-items-center rounded-full text-white/50 transition-colors hover:text-white active:scale-90"
          >
            <X className="size-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
