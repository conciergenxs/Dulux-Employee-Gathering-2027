import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** vertical parallax travel in px (0 disables) */
  parallax?: number;
  /** zoom the image on hover of the wrapper/group */
  hoverZoom?: boolean;
  eager?: boolean;
  onClick?: () => void;
  caption?: string;
};

/**
 * Image with blur-up reveal, gentle scroll parallax and hover zoom.
 */
export function MotionImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  parallax = 0,
  hoverZoom = true,
  eager = false,
  onClick,
  caption,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, [src]);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const travel = reduce ? 0 : parallax;
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={onClick ? `View photo: ${alt}` : undefined}
      className={`group/img relative block w-full overflow-hidden ${onClick ? "cursor-zoom-in" : ""} ${className}`}
    >
      <div ref={ref} className="size-full">
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          style={{ y, scale: travel ? 1.12 : 1 }}
          onLoad={() => setLoaded(true)}
          animate={{ opacity: loaded ? 1 : 0, filter: loaded ? "blur(0px)" : "blur(14px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`size-full object-cover will-change-transform ${
            hoverZoom
              ? "transition-transform duration-[1100ms] ease-out group-hover/img:scale-[1.06] group-hover:scale-[1.06]"
              : ""
          } ${imgClassName}`}
        />
      </div>
      {/* shimmer placeholder */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-navy-800 transition-opacity duration-700 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      {caption && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1.5 items-end bg-gradient-to-t from-navy-950/80 via-navy-950/15 to-transparent p-4 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white opacity-100 transition-all duration-500 sm:translate-y-1.5 sm:opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          {caption}
        </span>
      )}
    </Wrapper>
  );
}
