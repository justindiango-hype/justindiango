"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/content/site";
import { IntroPanel } from "./intro";
import { ProjectModal } from "./project-modal";
import { WORK_BG, WorkPanel } from "./work";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    /** Scroll position where the work gallery is fully on screen (for the "Work" nav link). */
    __workY?: number;
    /** Where the stage's phases sit, for the traveling bolt (travel-bolt.tsx). */
    __stage?: { tl: gsap.core.Timeline; slide: number; start: number; galleryEndY: number; endY: number };
  }
}

export const SLIDE = 1.1; // screen-heights of scrolling for the sideways slide
const GROW = 1.1; // screen-heights after the last project: the bolt grows and spins up, then BOOM

/**
 * "A business mind…" and the work share one locked stage. Scrolling down, the
 * screen slides sideways: the spinning 3D bolt flies in from the right and brings
 * the work in behind it while "A business mind…" slides out to the left.
 * Then "THE WORK." slams in and the projects glide past (arriving from the right).
 */
export function SideStage() {
  const stage = useRef<HTMLElement>(null);
  const [motion, setMotion] = useState(false);
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    setMotion(mq.matches);
    const on = () => setMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el || !motion) return;
    const ctx = gsap.context(() => {
      const intro = el.querySelector<HTMLElement>("[data-intro-panel]")!;
      const work = el.querySelector<HTMLElement>("[data-work-panel-wrap]")!;
      const vp = el.querySelector<HTMLElement>("[data-work-viewport]")!;
      const tr = el.querySelector<HTMLElement>("[data-work-track]")!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", tr);
      const distance = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
      const gallery = () => distance() / window.innerHeight; // in screen-heights
      const total = () => SLIDE + gallery() + GROW;

      // When the work lands: a flash, a little shake, then the projects fly in.
      const land = gsap.timeline({ paused: true });
      land
        .fromTo("[data-work-flash]", { opacity: 0.5 }, { opacity: 0, duration: 0.6, ease: "power2.out", immediateRender: false })
        .to("[data-shake]", { keyframes: { x: [8, -10, 6, -4, 2, 0], y: [-5, 4, -2, 1, 0, 0] }, duration: 0.3, ease: "none" }, "<")
        .fromTo(
          "[data-fly]",
          { x: 220, rotateY: -30, opacity: 0, transformPerspective: 1400 },
          { x: 0, rotateY: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 },
          "<0.05",
        );
      let slammed = false;

      let playing: HTMLVideoElement | null = null;
      const stopVideo = () => {
        playing?.pause();
        playing = null;
      };
      const updateCards = (galleryOn: boolean) => {
        const r0 = vp.getBoundingClientRect();
        const mid = r0.left + r0.width / 2;
        let best: HTMLElement | null = null;
        let bestOff = Infinity;
        cards.forEach((card) => {
          const r = card.getBoundingClientRect();
          const off = (r.left + r.width / 2 - mid) / r0.width;
          const c = Math.max(-1, Math.min(1, off));
          const amp = window.innerWidth < 640 ? 0.45 : 1;
          gsap.set(card.querySelector("[data-tilt]"), { rotateY: c * -16 * amp, z: -Math.abs(c) * 120 * amp, transformPerspective: 1400 });
          if (Math.abs(off) < bestOff) {
            bestOff = Math.abs(off);
            best = card;
          }
        });
        const nearest = best as HTMLElement | null;
        const v = galleryOn && bestOff < 0.5 && nearest ? nearest.querySelector("video") : null;
        if (v !== playing) {
          playing?.pause();
          v?.play().catch(() => {});
          playing = v;
        }
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${total() * window.innerHeight}`,
          pin: true,
          scrub: 0.6,
          refreshPriority: 1, // measured before the sections after it (Let's talk)
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            const vh = window.innerHeight;
            window.__workY = self.start + SLIDE * vh;
            window.__stage = { tl, slide: SLIDE, start: self.start, galleryEndY: self.start + (SLIDE + gallery()) * vh, endY: self.end };
            updateCards(false);
          },
          onUpdate: (self) => {
            const t = self.progress * total();
            if (!slammed && t >= SLIDE * 0.9) {
              slammed = true;
              land.restart();
            } else if (slammed && t < SLIDE * 0.5) {
              slammed = false;
              land.pause(0);
              gsap.set("[data-work-flash]", { opacity: 0 }); // never leave the flash glowing
            }
            updateCards(t >= SLIDE * 0.95);
          },
          onLeave: stopVideo,
          onLeaveBack: stopVideo,
        },
      });

      // 1. The sideways slide: the work arrives from the right, "A business mind…" leaves to the left.
      tl.fromTo(work, { xPercent: 100 }, { xPercent: 0, duration: SLIDE, ease: "power1.inOut" }, 0)
        .fromTo(intro, { xPercent: 0 }, { xPercent: -100, duration: SLIDE, ease: "power1.inOut" }, 0);
      // "THE WORK." follows right behind the traveling bolt, letter by letter, as the panel slides in.
      tl.fromTo(
        "[data-slam]",
        { xPercent: 140, opacity: 0, rotate: 10 },
        { xPercent: 0, opacity: 1, rotate: 0, duration: SLIDE * 0.35, ease: "power3.out", stagger: SLIDE * 0.035 },
        SLIDE * 0.18,
      ).fromTo("[data-work-sub], [data-work-year]", { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: SLIDE * 0.3, ease: "power2.out" }, SLIDE * 0.5);
      // 2. The gallery: projects glide in from the right.
      tl.fromTo(tr, { x: 0 }, { x: () => -distance(), duration: gallery }, SLIDE);
      // 3. After "Yours could be here": the work steps back while the bolt grows (travel-bolt.tsx).
      tl.fromTo("[data-shake]", { scale: 1, opacity: 1 }, { scale: 0.92, opacity: 0.2, duration: GROW, ease: "power1.in" }, ">");
    }, el);
    // This pin is created after the later sections' triggers, so re-measure them.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      window.__workY = undefined;
      window.__stage = undefined;
    };
  }, [motion]);

  return (
    <>
      <section id="about" ref={stage} aria-label="About and selected work" className={`relative overflow-hidden ${motion ? "h-[100svh]" : ""}`}>
        <span id="work" className="absolute top-0" aria-hidden="true" />
        {motion ? (
          <>
            <IntroPanel className="absolute inset-0" />
            <div data-work-panel-wrap className="absolute inset-0">
              {/* The work's background, with a long soft fade on its leading edge so there's no line as it slides in */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-[-40vw] right-0"
                style={{
                  backgroundColor: "#01047B",
                  backgroundImage: WORK_BG,
                  maskImage: "linear-gradient(to right, transparent 0, #000 40vw)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 40vw)",
                }}
              />
              <WorkPanel onOpen={setOpen} bg={false} className="absolute inset-0" />
              {/* Where the traveling bolt leads the work in from the right */}
              <div data-bolt-slot="lead" aria-hidden="true" className="pointer-events-none absolute left-[-14vw] top-[30%] aspect-square w-[clamp(110px,14vw,240px)]" />
            </div>
          </>
        ) : (
          <>
            <IntroPanel />
            <WorkPanel onOpen={setOpen} />
          </>
        )}
      </section>
      <ProjectModal project={open} onClose={close} />
    </>
  );
}
