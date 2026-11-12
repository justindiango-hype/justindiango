"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Smooth scroll (off for reduced motion) + smooth anchor links. */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | undefined;
    let tick: ((t: number) => void) | undefined;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1 });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const target = id === "#top" ? 0 : id === "#work" && window.__workY ? window.__workY : document.querySelector<HTMLElement>(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.4, force: true });
      else if (typeof target === "number") window.scrollTo({ top: target });
      else target.scrollIntoView();
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return null;
}
