"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { logos } from "@/lib/logos";

gsap.registerPlugin(ScrollTrigger);

/**
 * A row of tool logos that drifts on its own and speeds up with scroll velocity
 * (and reverses when you scroll up). Two copies make the loop seamless.
 */
export function LogoMarquee({ items, className = "" }: { items: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let dir = 1;
    let boost = 0;
    const base = 0.45; // px per frame at rest

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        dir = v < 0 ? -1 : 1;
        boost = Math.min(18, Math.abs(v) / 120);
      },
    });

    const tick = () => {
      const half = el.scrollWidth / 2;
      boost *= 0.94; // ease back to the resting drift
      x -= (base + boost) * dir;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      gsap.set(el, { x });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  const row = (copy: number) =>
    items.map((name) => {
      const logo = logos[name];
      const color = logo ? (logo.hex === "#000000" || logo.hex === "#191919" ? "#ffffff" : logo.hex) : undefined;
      return (
        <li
          data-logo-item
          key={`${copy}-${name}`}
          aria-hidden={copy === 1 ? true : undefined}
          className="group flex shrink-0 items-center gap-3 rounded-full border border-line bg-white/[0.04] py-3 pl-4 pr-6 sm:py-4 sm:pl-5 sm:pr-7"
        >
          {logo ? (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-6 fill-white/85 transition-[fill] duration-300 group-hover:fill-[var(--brand)] sm:size-7"
              style={{ "--brand": color } as React.CSSProperties}
            >
              <path d={logo.path} />
            </svg>
          ) : (
            <span aria-hidden="true" className="grid size-6 place-items-center rounded-md bg-white/10 text-[0.6rem] font-extrabold sm:size-7">
              {name.slice(0, 2)}
            </span>
          )}
          <span className="whitespace-nowrap text-base font-bold tracking-tight sm:text-lg">{name}</span>
        </li>
      );
    });

  return (
    <div className={`relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none] ${className}`}>
      <div ref={track} className="flex w-max will-change-transform motion-reduce:w-auto motion-reduce:px-5 sm:motion-reduce:px-8">
        <ul className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4 motion-reduce:shrink motion-reduce:flex-wrap">{row(0)}</ul>
        <ul className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4 motion-reduce:hidden" aria-hidden="true">
          {row(1)}
        </ul>
      </div>
    </div>
  );
}
