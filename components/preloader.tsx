"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { arcPath } from "./electric";
import { Logo } from "./logo";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

function finish() {
  if (window.__introDone) return;
  window.__introDone = true;
  window.dispatchEvent(new Event("jd:intro"));
}

/** True once the loading screen has finished (or was skipped). */
export function useIntro() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (window.__introDone) return setDone(true);
    const on = () => setDone(true);
    window.addEventListener("jd:intro", on);
    return () => window.removeEventListener("jd:intro", on);
  }, []);
  return done;
}

/** A full-height lightning bolt with a couple of branches, in a W×H box. */
function strikePath(W: number, H: number) {
  let x = W * (0.42 + Math.random() * 0.16);
  let y = -20;
  const main: [number, number][] = [[x, y]];
  const branches: string[] = [];
  while (y < H + 20) {
    y += 28 + Math.random() * 46;
    x += (Math.random() - 0.5) * 120;
    main.push([x, y]);
    if (Math.random() < 0.16 && y < H * 0.8) {
      const b: [number, number][] = [[x, y]];
      let bx = x;
      let by = y;
      const dir = Math.random() < 0.5 ? -1 : 1;
      for (let k = 0; k < 4 + Math.random() * 4; k++) {
        bx += dir * (20 + Math.random() * 60);
        by += 20 + Math.random() * 40;
        b.push([bx, by]);
      }
      branches.push("M" + b.map((p) => p.join(" ")).join(" L"));
    }
  }
  return { main: "M" + main.map((p) => p.join(" ")).join(" L"), branches, pts: main };
}

const SPARKS = 14;

/**
 * Loading screen: the screen builds a charge, a huge bolt strikes top to bottom —
 * BOOM, white-out and a shake — and as the light clears, JustinDiango is left
 * flickering like it's been electrocuted. Then it powers on and splits open.
 * Click, scroll or press a key to skip.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    window.__introDone = false;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const done = () => {
      html.style.overflow = "";
      setGone(true);
    };

    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap
          .timeline({ onComplete: done })
          .fromTo("[data-ld-logo]", { opacity: 0 }, { opacity: 1, duration: 0.4 })
          .add(finish, "+=0.3")
          .to(el, { opacity: 0, duration: 0.4 });
        return;
      }

      const W = window.innerWidth;
      const H = window.innerHeight;
      const stage = el.querySelector<HTMLElement>("[data-ld-stage]")!;
      const logo = el.querySelector<HTMLElement>("[data-ld-logo]")!;
      const lr = logo.getBoundingClientRect();

      // The strike
      const svg = el.querySelector<SVGSVGElement>("[data-ld-strike]")!;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const bolt = strikePath(W, H);
      svg.querySelectorAll<SVGPathElement>("[data-main]").forEach((p) => p.setAttribute("d", bolt.main));
      const branchG = svg.querySelector("[data-branches]")!;
      branchG.innerHTML = bolt.branches.map((d) => `<path d="${d}" />`).join("");

      // Arcs over the logo
      const arcSvg = el.querySelector<SVGSVGElement>("[data-ld-arcs]")!;
      arcSvg.setAttribute("viewBox", `0 0 ${lr.width} ${lr.height}`);
      const arcs = arcSvg.querySelectorAll("path");
      const zap = () => arcs.forEach((p, i) => p.setAttribute("d", arcPath(lr.width, lr.height, 9 + i * 4)));

      gsap.set(logo, { opacity: 0 });
      gsap.set(svg, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: done });
      // 1. The charge: two faint sky flickers.
      tl.to("[data-ld-flash]", { opacity: 0.12, duration: 0.05 }, 0.15)
        .to("[data-ld-flash]", { opacity: 0, duration: 0.12 }, 0.2)
        .to("[data-ld-flash]", { opacity: 0.22, duration: 0.04 }, 0.42)
        .to("[data-ld-flash]", { opacity: 0, duration: 0.1 }, 0.46);

      // 2. STRIKE — BOOM.
      const hit = 0.7;
      tl.set(svg, { opacity: 1 }, hit)
        .fromTo("[data-main]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.07, ease: "power1.in", immediateRender: false }, hit)
        .fromTo("[data-ld-flash]", { opacity: 1 }, { opacity: 0, duration: 0.9, ease: "power2.out", immediateRender: false }, hit + 0.06)
        .to(svg, { opacity: 0, duration: 0.05, repeat: 3, yoyo: true }, hit + 0.12)
        .to(svg, { opacity: 0, duration: 0.35, ease: "power2.out" }, hit + 0.32);
      // Shake
      [10, -14, 9, -6, 4, -2, 0].forEach((v, i) => {
        tl.to(stage, { x: v, y: -v * 0.6, duration: 0.035, ease: "none" }, hit + 0.06 + i * 0.035);
      });
      // Sparks burst from where the bolt crossed the logo
      const ly = lr.top + lr.height / 2;
      const seg = bolt.pts.findIndex((p, i) => i > 0 && p[1] >= ly);
      const [ax, ay] = bolt.pts[Math.max(0, seg - 1)];
      const [bx, by] = bolt.pts[Math.max(0, seg)];
      const lx = by === ay ? ax : ax + ((ly - ay) / (by - ay)) * (bx - ax);
      tl.set("[data-ld-sparks]", { x: lx, y: ly }, hit);
      el.querySelectorAll<HTMLElement>("[data-ld-spark]").forEach((s, i) => {
        const a = (i / SPARKS) * Math.PI * 2 + Math.random() * 0.4;
        const d = 120 + Math.random() * 180;
        tl.fromTo(
          s,
          { x: 0, y: 0, rotate: (a * 180) / Math.PI, scaleX: 1.4, opacity: 1 },
          { x: Math.cos(a) * d, y: Math.sin(a) * d, scaleX: 0.2, opacity: 0, duration: 0.7, ease: "power3.out", immediateRender: false },
          hit + 0.05,
        );
      });

      // 3. The name is left electrocuted.
      const shock = hit + 0.3;
      const flick = [1, 0.1, 0.95, 0.05, 0.8, 0.15, 1, 0.3, 1, 0.05, 0.9, 0.5, 1];
      flick.forEach((o, i) => {
        tl.set(logo, { opacity: o, x: i % 2 ? 5 : -4, y: i % 3 ? -3 : 2, skewX: i % 4 === 1 ? 6 : 0 }, shock + i * 0.05);
        if (i % 2 === 0) tl.call(zap, [], shock + i * 0.05);
      });
      tl.fromTo(arcs, { opacity: 1 }, { opacity: 0.1, duration: 0.08, repeat: 7, yoyo: true, immediateRender: false }, shock)
        .set(logo, { opacity: 1, x: 0, y: 0, skewX: 0 }, shock + flick.length * 0.05)
        .to(arcs, { opacity: 0, duration: 0.1 }, shock + flick.length * 0.05)
        .fromTo(
          logo,
          { filter: "drop-shadow(0 0 0px #DEF434)" },
          { filter: "drop-shadow(0 0 30px #DEF434)", duration: 0.22, yoyo: true, repeat: 1, immediateRender: false },
          ">",
        );

      // 4. Powered on: split open.
      tl.add(finish, "+=0.1")
        .to("[data-ld-top]", { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "<")
        .to("[data-ld-bottom]", { yPercent: 100, duration: 0.8, ease: "power4.inOut" }, "<")
        .to(logo, { scale: 1.12, opacity: 0, duration: 0.45, ease: "power2.in" }, "<");

      const skip = () => tl.progress(1);
      const opts = { once: true, passive: true } as const;
      window.addEventListener("pointerdown", skip, opts);
      window.addEventListener("keydown", skip, opts);
      window.addEventListener("wheel", skip, opts);
      window.addEventListener("touchmove", skip, opts);
      return () => {
        window.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("wheel", skip);
        window.removeEventListener("touchmove", skip);
      };
    }, el);

    return () => {
      ctx.revert();
      html.style.overflow = "";
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden">
      <div data-ld-top className="absolute inset-x-0 top-0 h-1/2 bg-midnight-deep" />
      <div data-ld-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-midnight-deep" />

      <div data-ld-stage className="absolute inset-0">
        <svg data-ld-strike className="absolute inset-0 h-full w-full opacity-0" preserveAspectRatio="none">
          <g fill="none" strokeLinejoin="bevel" strokeLinecap="round">
            <path data-main pathLength={1} strokeDasharray="1" stroke="#DEF434" strokeWidth="26" strokeOpacity="0.35" style={{ filter: "blur(10px)" }} />
            <path data-main pathLength={1} strokeDasharray="1" stroke="#DEF434" strokeWidth="9" style={{ filter: "drop-shadow(0 0 18px #DEF434)" }} />
            <path data-main pathLength={1} strokeDasharray="1" stroke="#ffffff" strokeWidth="3.5" />
            <g data-branches stroke="#ffffff" strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px #DEF434)" }} />
          </g>
        </svg>

        <div className="absolute inset-0 grid place-items-center">
          <div data-ld-logo className="relative opacity-0">
            <Logo className="h-auto w-[min(82vw,640px)] text-white" />
            <svg data-ld-arcs className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
              <path fill="none" stroke="#ffffff" strokeWidth="2" opacity="0" style={{ filter: "drop-shadow(0 0 6px #DEF434)" }} />
              <path fill="none" stroke="#DEF434" strokeWidth="1.6" opacity="0" style={{ filter: "drop-shadow(0 0 10px #DEF434)" }} />
            </svg>
          </div>
        </div>

        <div data-ld-sparks className="absolute left-0 top-0">
          {Array.from({ length: SPARKS }, (_, i) => (
            <span key={i} data-ld-spark className="absolute left-0 top-0 h-[3px] w-9 origin-left rounded-full bg-acid opacity-0 shadow-[0_0_10px_#DEF434]" />
          ))}
        </div>
      </div>

      <div data-ld-flash className="pointer-events-none absolute inset-0 bg-[#f4ffd0] opacity-0" />
    </div>
  );
}
