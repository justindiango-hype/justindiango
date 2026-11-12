"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hero, site } from "@/content/site";
import { DubaiTime } from "./dubai-time";
import { useIntro } from "./preloader";
import { RichText } from "./rich-text";

gsap.registerPlugin(ScrollTrigger);


export function Hero() {
  const root = useRef<HTMLElement>(null);
  const intro = useIntro();

  // Entrance, once the spark has struck.
  useEffect(() => {
    const el = root.current;
    if (!el || !intro) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.set("[data-line-mask]", { overflow: "hidden" })
          .from("[data-line-inner]", { yPercent: 110, duration: 1.2, stagger: 0.09 })
          .from("[data-portrait]", { y: 80, opacity: 0, duration: 1.4 }, 0.1)
          .from("[data-fade]", { y: 18, opacity: 0, duration: 0.9, stagger: 0.06 }, 0.6)
          // Let the electric glow breathe once the words are in.
          .set("[data-line-mask]", { overflow: "visible" }, 1.5);
        // Replay the entrance whenever you come back up to the hero.
        ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom 40%", onEnterBack: () => tl.restart() });
      });
    }, el);
    return () => ctx.revert();
  }, [intro]);

  // Scroll: the headline parts, the portrait settles, the bolt lifts away.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-line='0']", { xPercent: -14, ease: "none", scrollTrigger: st });
        gsap.to("[data-line='1']", { xPercent: 10, ease: "none", scrollTrigger: st });
        gsap.to("[data-line='2']", { xPercent: -6, ease: "none", scrollTrigger: st });
        gsap.to("[data-portrait]", { yPercent: 8, scale: 0.95, ease: "none", scrollTrigger: st });
        gsap.to("[data-ui]", { opacity: 0, y: -30, ease: "none", scrollTrigger: { ...st, end: "40% top" } });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      aria-label="Introduction"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden"
    >
      {/* Soft blue glow, faded out before the bottom so it meets the next section seamlessly */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)]"
        style={{
          background:
            "radial-gradient(70% 60% at 62% 78%, rgba(15,127,196,0.55), transparent 70%), radial-gradient(50% 40% at 10% 0%, rgba(15,127,196,0.18), transparent 70%)",
        }}
      />
      <h1 className="sr-only">Fast doesn&apos;t have to look cheap. Justin Diango, landing page designer in Dubai.</h1>

      {/* Headline: lines 1–2 sit behind the portrait, "cheap." in front. */}
      <div aria-hidden="true" className="display pointer-events-none absolute inset-x-0 top-[17svh] text-[clamp(3.3rem,11.2vw,12.5rem)] md:text-[clamp(3.6rem,7.2vw,8.6rem)]">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
        {hero.headline.map((line, i) => (
          <div
            key={line}
            data-line={i}
            className={`relative w-fit ${i === 2 ? "z-30" : "z-[1]"}`}
          >
            <span data-line-mask className="-mx-[0.08em] block overflow-hidden px-[0.08em] pb-[0.06em]">
              <span data-line-inner className="block will-change-transform">
                <RichText text={line} interval={2000} strong />
              </span>
            </span>
          </div>
        ))}
        </div>
      </div>

      {/* Portrait, cropped at the torso — faded out before the bottom of the hero */}
      <div aria-hidden="false" className="pointer-events-none absolute inset-0 z-10 [mask-image:linear-gradient(to_bottom,#000_84%,transparent_99%)]">
      <div
        data-portrait
        className="pointer-events-none absolute left-1/2 top-[45svh] z-10 aspect-[765/1400] w-[min(112vw,560px)] -translate-x-1/2 md:left-[79%] md:top-[12svh] md:w-[min(108svh,56vw)]"
      >
        <Image
          src={site.portrait}
          alt={`Portrait of ${site.name}`}
          fill
          priority
          sizes="(min-width: 768px) 56vw, 112vw"
          className="object-cover object-top"
        />
      </div>
      </div>

      {/* Where the traveling 3D bolt starts (travel-bolt.tsx flies it from here). Static image if motion is reduced. */}
      <div data-bolt-slot="hero" aria-hidden="true" className="pointer-events-none absolute left-[68%] top-[24svh] z-20 aspect-square w-[clamp(96px,26vw,200px)] md:left-[45%] md:top-[50svh] md:w-[clamp(120px,12vw,220px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/bolt-hero.webp" alt="" className="hidden h-full w-full object-contain motion-reduce:block" />
      </div>

      {/* UI */}
      <div data-ui className="relative z-40 mt-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-8">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-sm">
            <p data-fade className="text-pretty text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
              {hero.sub}
            </p>
            <div data-fade className="mt-6 flex flex-wrap gap-3">
              <a href={hero.primaryCta.href} className="btn btn-acid">
                {hero.primaryCta.label} <span aria-hidden="true">↓</span>
              </a>
              <a href={hero.secondaryCta.href} className="btn btn-ghost">
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>
          <dl data-fade className="flex gap-8 text-sm max-md:hidden">
            <div>
              <dt className="label">Based in</dt>
              <dd className="mt-1 font-semibold">{site.location}</dd>
            </div>
            <div>
              <dt className="label">Local time</dt>
              <dd className="mt-1 font-semibold">
                <DubaiTime />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
