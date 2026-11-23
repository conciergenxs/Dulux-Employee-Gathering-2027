import { Clock, Compass, MapPin, QrCode, Users } from "lucide-react";
import { Band } from "@/components/site/Band";
import { Reveal } from "@/components/site/Reveal";
import { SectionIntro } from "@/components/activities/SectionIntro";
import { BlockHead, CheckInCard, DayHead } from "@/components/activities/ActivityKit";
import { COMMITMENT_CARD, LIVING_LEGACY, RUNDOWN } from "@/lib/event";
import { ACTIVITY_PHOTO } from "@/lib/quota";

/** Day 3 (deck p.104–107): the final morning, then the canvas goes home. */
export function DayThree() {
  const day = RUNDOWN.day3;
  return (
    <div>
      <Band tone="light" pattern={false} className="pb-10 sm:pb-12">
        <DayHead date={`Day 3 · ${day.date}`} title={day.title} />
        <Reveal delay={0.04}>
          <p className="mx-auto mt-3 max-w-md text-center text-[0.9375rem] text-white/70">
            The bigger picture is clear. Now, let's make it happen. Sesi pagi berlangsung pukul
            07.00–10.00.
          </p>
        </Reveal>
      </Band>

      <Band tone="light" pattern={false} className="pb-14 sm:pb-20">
        <div id="breakfast-reconnect" className="scroll-mt-28">
          <SectionIntro
            eyebrow="Day 3 · Morning"
            title="Breakfast &"
            accent="Reconnect"
            text="Sarapan santai bersama sebelum sesi pagi terakhir."
          />
          <CheckInCard
            id="breakfast-reconnect"
            image={ACTIVITY_PHOTO["breakfast-reconnect"]}
            alt="Colleagues at breakfast on a terrace by the sea"
            mood
            title="Check In At Breakfast"
            text="Tunjukkan QR My Canvas Pass ke crew di Restoran Swissôtel."
          />
        </div>
      </Band>

      <Band tone="dark" palm="right" className="py-14 sm:py-20">
        <div id="direction-recap" className="scroll-mt-28">
          <SectionIntro
            eyebrow="Day 3 · Session"
            title="Direction"
            accent="Recap"
            text="Pimpinan merangkum kembali prioritas utama Dulux untuk 2027, supaya semua pulang dengan fokus yang sama."
          />
          <CheckInCard
            id="direction-recap"
            image={ACTIVITY_PHOTO["direction-recap"]}
            alt="A leader on stage in front of seated colleagues"
            mood
            title="Check In At The Session"
            text="Tekan Check in now begitu sesi dimulai."
          />
        </div>
      </Band>

      <Band tone="light" className="py-14 sm:py-20">
        <div id="functional-huddle" className="scroll-mt-28">
          <SectionIntro
            eyebrow="Day 3 · Session"
            title="Functional"
            accent="Huddle"
            text="Berkumpul per fungsi untuk menerjemahkan prioritas bersama jadi langkah nyata. Setiap fungsi mengisi satu Commitment Card dan menempelkannya di Our Next Moves Wall."
          />

          <div className="mt-8">
            <BlockHead title="The Commitment Card" note="Big ambition. Clear first moves." />
            <ol className="grid gap-3 md:grid-cols-3">
              {COMMITMENT_CARD.map((c, i) => (
                <Reveal as="li" key={c.key} delay={i * 0.05} className="h-full">
                  <div className="surface h-full rounded-[0.5rem_1.5rem_0.5rem_1.5rem] p-5">
                    <p className="font-[family-name:var(--font-kv-condensed)] text-[0.875rem] uppercase tracking-[0.18em] text-sky">
                      {c.key}
                    </p>
                    <p className="mt-2 text-[0.9375rem] font-semibold text-white">{c.q}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <CheckInCard
            id="functional-huddle"
            image={ACTIVITY_PHOTO["functional-huddle"]}
            alt="Colleagues pinning commitment cards to a wall"
            mood
            title="Check In With Your Function"
            text="Tekan Check in now saat huddle fungsimu dimulai."
          />
        </div>

        {/* Where the canvas goes (deck p.106–107). */}
      </Band>
      <Band tone="dark" palm="left" className="py-14 sm:py-20">
        <Reveal className="block">
          <div
            data-tone="dark"
            className="relative isolate overflow-hidden rounded-[0.75rem_2.75rem_0.75rem_2.75rem] border-[2.5px] border-silver p-6 text-center shadow-[0_0_0_1px_rgba(8,18,36,0.7),0_0_24px_rgba(150,215,255,0.22)] sm:p-10 lg:rounded-[1rem_4rem_1rem_4rem]"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_75%,rgba(56,160,255,0.32)_0%,rgba(56,160,255,0)_72%),linear-gradient(180deg,#081a2f_0%,#0a2340_35%,#0b3354_60%,#0e5f8f_88%,#1290c3_100%)]"
            />
            <p className="font-[family-name:var(--font-kv-condensed)] text-[0.9375rem] uppercase tracking-[0.2em] text-sky">
              The Living Legacy
            </p>
            <p className="wordmark mx-auto mt-3 max-w-xl text-[clamp(1.5rem,6vw,2.25rem)] text-white">
              The event ends. The next chapter continues.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-white/80">
              {LIVING_LEGACY}
            </p>
          </div>
        </Reveal>
      </Band>
    </div>
  );
}
