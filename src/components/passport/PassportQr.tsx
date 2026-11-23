import { useEffect, useState } from "react";
import QRCode from "qrcode";
import logo from "@/assets/brand/dulux-logo-color.webp";

/**
 * The pass QR, generated in the browser from the pass code. JTI rendered it on
 * the server from a signed token; this prototype has no backend, so the code
 * simply encodes the sample pass ID — it will not verify at a real scanner.
 *
 * Error correction H survives the Dulux plate covering the centre.
 */
export function usePassQr(value: string) {
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    QRCode.toString(value, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 0,
      color: { dark: "#0a2c52", light: "#ffffff00" },
    }).then((s) => alive && setSvg(s));
    return () => {
      alive = false;
    };
  }, [value]);
  return svg;
}

export function PassportQr({ value, className = "" }: { value: string; className?: string }) {
  const svg = usePassQr(value);
  return (
    <div className={`relative aspect-square ${className}`}>
      {svg ? (
        <div
          aria-hidden
          className="[&>svg]:h-auto [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div aria-hidden className="size-full animate-pulse rounded-xl bg-paper-border" />
      )}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 grid w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[18%] bg-navy-900 px-[3%] py-[4%] ring-[5px] ring-white"
      >
        <img src={logo} alt="" className="w-full" />
      </span>
    </div>
  );
}
