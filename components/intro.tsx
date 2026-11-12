"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { intro } from "@/content/site";
import { Electric } from "./electric";
import { LogoMarquee } from "./logo-marquee";

gsap.registerPlugin(ScrollTrigger);

/**
 * "A business mind with a designer's eye…" + the tool logos, as a full-screen
 * panel inside the side-scrolling stage. Transparent, so the hero's Magic Rings
 * show through behind it.
 *
 * As it comes up, each word rises out of its own mask with a slight tilt, the
 * accent words land last with a little overshoot. Plays each time you arrive
 * from the hero.
 */
export function IntroPanel({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  // Split the statement into words, keeping *accent* words marked.
  const words = intro.statement
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .flatMap((part) => {
      const accent = part.startsWith("*") && part.endsWith("*");
      return (accent ? part.slice(1, -1) : part)
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({ w, accent }));
    });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(
          "[data-word-inner]",
          { yPercent: 115, rotate: 6, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.045 },
        )
          .fromTo(
            "[data-word-accent]",
            { scale: 0.7, yPercent: 40 },
            { scale: 1, yPercent: 0, duration: 0.7, ease: "back.out(2.2)", stagger: 0.08 },
            "-=0.55",
          )
          .fromTo("[data-intro-logos]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
        const trigger = el.closest("section") ?? el;
        ScrollTrigger.create({
          trigger,
          start: "top 62%",
          onEnter: () => tl.restart(),
          onLeaveBack: () => tl.pause(0),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} data-intro-panel className={`relative flex h-[100svh] flex-col overflow-hidden pb-10 pt-24 sm:pb-12 ${className}`}>
      <div className="relative mx-auto flex w-full max-w-[90rem] flex-1 items-center px-5 sm:px-8">
        <p
          data-statement
          className="max-w-[19ch] text-[clamp(1.9rem,min(4.6vw,8.6svh),5.2rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
        >
          {words.map(({ w, accent }, i) => (
            <span key={i}>
              <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-word-inner className="inline-block origin-bottom-left will-change-transform">
                  {accent ? (
                    <span data-word-accent className="inline-block origin-bottom-left">
                      <Electric strong text={w}>
                        {w}
                      </Electric>
                    </span>
                  ) : (
                    w
                  )}
                </span>
              </span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>

      <div data-intro-logos className="relative mt-10">
        <LogoMarquee items={intro.stack} />
      </div>
    </div>
  );
}
