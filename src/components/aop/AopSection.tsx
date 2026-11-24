import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Lock, PenLine, ScanLine } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { MotionImage } from "@/components/site/MotionImage";
import { PrototypeNote } from "@/components/activities/Badges";
import { usePassQr } from "@/components/passport/PassportQr";
import { useDemoMode } from "@/lib/demo";
import { AOP_CHARTER } from "@/lib/event";
import { formatTime, useParticipant } from "@/lib/participant";
import leadership from "@/assets/aop/leadership.webp";
import participation from "@/assets/aop/participation.webp";
import activation from "@/assets/aop/activation.webp";
import reveal from "@/assets/aop/reveal.webp";

const STEP_PHOTO: Record<string, string> = { leadership, participation, activation, reveal };

/** The Signing Experience: four steps, a swipeable row on a phone. */
export function AopSteps() {
  return (
    <ol className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
      {AOP_CHARTER.steps.map((s, i) => (
        <Reveal
          as="li"
          key={s.id}
          delay={i * 0.05}
          className="w-[74%] max-w-[17rem] shrink-0 snap-start sm:w-[44%] lg:w-auto lg:max-w-none"
        >
          <article className="surface flex h-full flex-col overflow-hidden">
            <div className="relative">
              <MotionImage
                src={STEP_PHOTO[s.id] ?? leadership}
                alt={s.title}
                className="aspect-[4/3]"
              />
              <span
                data-tone="dark"
                className="absolute left-3 top-3 rounded-full bg-navy-950/70 px-2.5 py-1 font-display text-[0.75rem] text-white backdrop-blur-sm"
              >
                0{i + 1}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="text-[1rem] font-semibold text-white">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/65">{s.text}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}

/**
 * Where the participant stands: locked until the LED's QR is scanned, then
 * the signing page is a tap away, then signed. In demo mode (`?demo=1`) the
 * LED's QR is shown here too, so the flow can be tried on a phone.
 */
export function AopStatus() {
  const state = useParticipant();
  const demo = useDemoMode();
  const [signUrl, setSignUrl] = useState("");
  useEffect(() => setSignUrl(`${window.location.origin}/sign?k=${AOP_CHARTER.key}`), []);
  const qr = usePassQr(signUrl || "about:blank");
  const signed = state.aop?.signedAt;
  const unlocked = Boolean(state.aop);

  return (
    <div className="surface p-5 sm:p-6">
      <div className="flex items-start gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-cyan">
          {signed ? (
            <Check className="size-5" strokeWidth={2.5} />
          ) : unlocked ? (
            <PenLine className="size-5" />
          ) : (
            <Lock className="size-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[1rem] font-semibold text-white">
            {signed
              ? "Komitmenmu sudah aktif"
              : unlocked
                ? "Tanda tangan digitalmu siap"
                : "Scan QR di layar LED untuk membuka"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-white/65">
            {signed
              ? `Diaktifkan ${formatTime(signed)}. Tanda tanganmu tampil di LED bersama rekan lainnya.`
              : unlocked
                ? "Lihat tanda tanganmu, lalu tekan This Is My Commitment untuk mengaktifkannya."
                : "Halaman tanda tangan baru terbuka setelah kamu scan QR yang tampil di layar LED saat AOP Charter Sign-Off, Day 2 malam."}
          </p>
          {unlocked && !signed && (
            <Link to="/sign" className="btn btn-primary mt-4 inline-flex font-bold">
              Buka tanda tanganku
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </div>

      {demo && !unlocked && (
        <div className="proto mt-5 p-4">
          <PrototypeNote>
            Mode demo. Di acara, QR ini hanya tampil di layar LED ballroom. Scan dengan kamera HP,
            atau tekan tombol di bawah.
          </PrototypeNote>
          <div className="mt-3 flex items-center gap-4">
            <div className="size-24 shrink-0 rounded-xl bg-white p-2">
              {qr && (
                <div
                  aria-hidden
                  className="[&>svg]:h-auto [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qr }}
                />
              )}
            </div>
            <Link
              to="/sign"
              search={{ k: AOP_CHARTER.key }}
              className="btn btn-ghost min-h-10 text-[0.8125rem]"
            >
              <ScanLine className="size-4" />
              Simulate LED scan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
