import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PanelHead } from "@/components/passport/Checklist";
import { Reveal } from "@/components/site/Reveal";
import type { Faq } from "@/lib/event";

/**
 * The JTI passport's FAQ accordion: closed to start, one answer at a time.
 * Shared by the pass and the practical guide, each with its own questions.
 */
export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `faq-${item.q.replace(/\W+/g, "-").toLowerCase()}`;
        return (
          <Reveal key={item.q} delay={Math.min(i, 4) * 0.05}>
            <div
              className={`overflow-hidden rounded-[var(--radius-card)] border transition-colors duration-300 ${
                isOpen ? "border-cyan/50 bg-white/[0.07]" : "border-border bg-white/[0.04]"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={id}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3.5 text-left sm:px-5"
              >
                <span className="text-[0.9375rem] font-semibold leading-snug text-white">
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-white/8 text-cyan"
                >
                  <ChevronDown className="size-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={id}
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="t-body px-4 pb-5 text-muted-foreground sm:px-5">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

export function FaqSection({
  items,
  id = "faq",
  className = "",
  narrow = false,
}: {
  items: Faq[];
  id?: string;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 ${className}`}>
      <div className={`mx-auto ${narrow ? "max-w-md lg:max-w-none" : "max-w-3xl"}`}>
        <Reveal>
          <PanelHead eyebrow="Good to know" title="Frequently Asked" accent="Questions" />
        </Reveal>
        <div className="mt-5">
          <FaqList items={items} />
        </div>
      </div>
    </section>
  );
}
