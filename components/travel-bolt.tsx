"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useIntro } from "./preloader";
import { SpinBolt, type SpinBoltHandle } from "./spin-bolt";

/** Sprite frame size: the bolt is drawn at this size and scaled to fit each spot. */
const BASE = 560;

type Box = { x: number; y: number; s: number };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: Box, b: Box, k: number): Box => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, s: a.s + (b.s - a.s) * k });
const inOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * One 3D bolt for the whole page. It starts in the hero, travels to lead the
 * work in from the right, settles small on top of "THE WORK." while you browse,
 * then after "Yours could be here" it grows and spins faster and faster until
 * BOOM: a flash, and "Let's talk." is revealed with the bolt beside "TALK.".
 *
 * Spots are empty elements marked data-bolt-slot="hero|lead|work|cta".
 * Contact listens for the "jd:boom" / "jd:unboom" window events.
 */
export function TravelBolt() {
  const [motion, setMotion] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const enter = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const bolt = useRef<SpinBoltHandle>(null);
  const intro = useIntro();

  useEffect(() => {
    setMotion(window.matchMedia("(prefers-reduced-motion: no-preference)").matches);
  }, []);

  // Entrance once the loading screen has struck.
  useEffect(() => {
    if (!motion || !intro || !enter.current) return;
    const t = gsap.fromTo(enter.current, { scale: 0.4, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.2, delay: 0.5, ease: "back.out(1.8)" });
    return () => {
      t.kill();
    };
  }, [motion, intro]);

  useEffect(() => {
    if (!motion) return;
    const el = box.current!;
    const slot = (name: string) => document.querySelector<HTMLElement>(`[data-bolt-slot="${name}"]`);
    const read = (name: string): Box | null => {
      const n = slot(name);
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return { x: r.left, y: r.top, s: r.width / BASE };
    };
    const big = (): Box => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const size = Math.min(w * 0.72, h * 0.78, 680);
      return { x: (w - size) / 2, y: (h - size) / 2, s: size / BASE };
    };

    let boomed = false;
    let shown: Box | null = null;
    // Smooth hand-over when the bolt switches between "following" modes (boom / un-boom).
    const blend = { from: null as Box | null, k: 1 };
    let blendTween: gsap.core.Tween | null = null;
    const handOver = (duration: number, ease: string) => {
      blend.from = shown;
      blend.k = 0;
      blendTween?.kill();
      blendTween = gsap.to(blend, { k: 1, duration, ease });
    };

    const boom = () => {
      boomed = true;
      handOver(1.1, "power3.inOut");
      bolt.current?.kick(2600);
      gsap.fromTo(flash.current, { opacity: 1 }, { opacity: 0, duration: 0.9, ease: "power2.out", overwrite: true });
      window.dispatchEvent(new Event("jd:boom"));
    };
    const unboom = () => {
      boomed = false;
      handOver(0.5, "power2.out");
      gsap.set(flash.current, { opacity: 0, overwrite: true });
      window.dispatchEvent(new Event("jd:unboom"));
    };

    const frame = () => {
      const S = window.__stage;
      const y = window.scrollY;
      const hero = read("hero");
      if (!hero) return;
      let target: Box = hero;
      let spin = 0;

      if (S) {
        const lead = read("lead") ?? hero;
        const work = read("work") ?? lead;
        if (boomed && y < S.endY - 60) unboom();
        else if (!boomed && y >= S.endY - 4) boom();

        if (boomed) {
          target = read("cta") ?? big();
        } else if (y < S.start) {
          // Hero → the spot leading the work in.
          target = mix(hero, lead, inOut(clamp(y / Math.max(1, S.start))));
          spin = 60 * clamp(y / Math.max(1, S.start));
        } else if (y < S.galleryEndY) {
          // The slide (follows the scrubbed timeline, so it moves with the panel), then the gallery.
          const t = S.tl.time();
          const k = inOut(clamp((t - S.slide * 0.5) / (S.slide * 0.45)));
          target = mix(lead, work, k);
          spin = 80 * (1 - k);
        } else {
          // After the last project: grow, spin up.
          const g = clamp((y - S.galleryEndY) / Math.max(1, S.endY - S.galleryEndY));
          target = mix(work, big(), g * g * (3 - 2 * g));
          spin = g * g * 2600;
        }
      }

      let out = target;
      if (blend.k < 1 && blend.from) out = mix(blend.from, target, blend.k);
      shown = out;
      el.style.transform = `translate3d(${out.x.toFixed(1)}px, ${out.y.toFixed(1)}px, 0) scale(${out.s.toFixed(4)})`;
      bolt.current?.setSpin(spin);
    };

    gsap.ticker.add(frame);
    frame();
    el.style.visibility = "visible";
    return () => {
      gsap.ticker.remove(frame);
      blendTween?.kill();
    };
  }, [motion]);

  if (!motion) return null;
  return (
    <>
      <div
        ref={box}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[45] origin-top-left will-change-transform"
        style={{ width: BASE, height: BASE, visibility: "hidden" }}
      >
        <div ref={enter} className="h-full w-full" style={{ opacity: 0 }}>
          <div className="h-full w-full animate-[float_6s_ease-in-out_infinite]">
            <SpinBolt ref={bolt} className="w-full" speed={45} />
          </div>
        </div>
      </div>
      <div ref={flash} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55] bg-[#f4ffd0] opacity-0" />
    </>
  );
}
