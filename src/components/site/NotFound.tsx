import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EVENT } from "@/lib/event";
import { JourneyPicture } from "@/components/canvas/Canvas";

/** A missing page, told as a missing piece. */
export function NotFound() {
  useEffect(() => {
    document.title = `Page not found · ${EVENT.name}`;
  }, []);

  return (
    <section className="relative grid min-h-[85dvh] place-items-center overflow-hidden px-5 pb-16 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[image:var(--glow-field)]"
      />
      <div className="relative mx-auto w-full max-w-md text-center">
        <JourneyPicture lit={8} className="mx-auto w-36" />
        <p className="eyebrow mt-8">404 — page not found</p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="t-h2 mt-3 text-white"
        >
          This piece is <span className="text-together">missing</span>
        </motion.h1>
        <p className="t-body mt-4 text-muted-foreground">
          Link-nya mungkin sudah berubah atau terpotong. Semua yang kamu butuhkan bisa dimulai dari
          halaman utama.
        </p>
        <Link to="/" className="btn btn-primary group mt-8 w-full sm:w-auto">
          Back to Greater Together
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
