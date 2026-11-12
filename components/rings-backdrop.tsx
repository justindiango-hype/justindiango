"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const MagicRings = dynamic(() => import("./ui/magic-rings"), { ssr: false });

/**
 * React Bits · Magic Rings in the brand colours, as a fixed backdrop behind the
 * hero and "A business mind…". It drifts up slower than the page (parallax) and
 * switches off once the work has slid over it.
 */
export function RingsBackdrop() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const end = window.__workY ?? vh * 2.2; // where the work fully covers it
      el.style.display = y > end ? "none" : "";
      if (!reduce) el.style.transform = `translate3d(0, ${(-Math.min(y, end) * 0.3).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 will-change-transform">
      <div className="absolute inset-x-[-25%] bottom-[-10%] top-[22svh] [mask-image:radial-gradient(closest-side,#000_62%,transparent_100%)] md:inset-y-[-10%] md:left-[8%] md:right-[-50%]">
        <MagicRings
          color="#DEF434"
          colorTwo="#0F7FC4"
          ringCount={6}
          motion="pulse"
          speed={0.8}
          lineThickness={2}
          glow={1.1}
          baseRadius={0.3}
          radiusStep={0.1}
          opacity={0.85}
          followMouse
          mouseInfluence={0.15}
          clickBurst={false}
          maxDevicePixelRatio={1.5}
        />
      </div>
    </div>
  );
}
