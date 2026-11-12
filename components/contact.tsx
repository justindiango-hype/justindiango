"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contact, site } from "@/content/site";
import { DubaiTime } from "./dubai-time";
import { Electric } from "./electric";
import { Logo } from "./logo";
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger);


/**
 * The finish. The traveling bolt (travel-bolt.tsx) grows over the work and
 * goes BOOM; on that beat this section is revealed: a shake, Ocean Blue floods
 * out from the middle, "LET'S TALK." slams in letter by letter and the details
 * rise in, while the bolt settles beside "TALK.". Scrolling back up hides it
 * again. The nav's right-hand links step aside while you're here.
 *
 * With motion on, it overlaps the last screen of the work stage (-100svh), so
 * at the BOOM it is already in place at the top of the screen.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        ScrollTrigger.create({ trigger: el, start: "top 50%", end: "bottom top", toggleClass: { targets: html, className: "in-contact" } });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const flood = el.querySelector<HTMLElement>("[data-flood]")!;
        const at = () => {
          const s = el.getBoundingClientRect();
          return `50% ${(((window.innerHeight * 0.5 - s.top) / s.height) * 100).toFixed(1)}%`;
        };
        gsap.set(el, { autoAlpha: 0 });

        const tl = gsap.timeline({ paused: true });
        tl.addLabel("hit", 0)
          .to("[data-cta-shake]", { keyframes: { x: [12, -14, 9, -6, 3, 0], y: [-7, 6, -4, 2, 0, 0] }, duration: 0.34, ease: "none" }, "hit")
          // The flood spreads out from where the bolt burst.
          .fromTo(flood, { clipPath: () => `circle(0% at ${at()})` }, { clipPath: () => `circle(150% at ${at()})`, duration: 1.1, ease: "power3.inOut", immediateRender: false }, "hit")
          // LET'S TALK. slams in letter by letter, flickering.
          .fromTo(
            "[data-cta-letter]",
            { opacity: 0, scale: 1.8, yPercent: -40, rotate: () => gsap.utils.random(-14, 14) },
            { opacity: 1, scale: 1, yPercent: 0, rotate: 0, duration: 0.45, ease: "power4.in", stagger: 0.05, immediateRender: false },
            "hit+=0.1",
          );
        [0.15, 1, 0.3, 1, 0.6, 1].forEach((o, i) => tl.to("[data-cta-title]", { opacity: o, duration: 0.04 }, `hit+=${0.65 + i * 0.05}`));
        tl.fromTo("[data-cta-fade]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out", stagger: 0.08, immediateRender: false }, "hit+=0.8");

        const onBoom = () => {
          gsap.set(el, { autoAlpha: 1 });
          gsap.set("[data-cta-letter], [data-cta-fade]", { opacity: 0 });
          html.classList.add("in-contact");
          tl.restart();
        };
        const onUnboom = () => {
          tl.pause(0);
          gsap.set(el, { autoAlpha: 0 });
          html.classList.remove("in-contact");
        };
        window.addEventListener("jd:boom", onBoom);
        window.addEventListener("jd:unboom", onUnboom);
        return () => {
          window.removeEventListener("jd:boom", onBoom);
          window.removeEventListener("jd:unboom", onUnboom);
        };
      });
    }, el);
    return () => {
      ctx.revert();
      html.classList.remove("in-contact");
    };
  }, []);

  const words = contact.title.split(" ");

  return (
    <section id="contact" ref={root} aria-label="Contact" className="relative isolate z-[2] flex flex-col overflow-hidden bg-midnight pt-[calc(env(safe-area-inset-top)+6.5rem)] sm:pt-24 motion-safe:-mt-[100svh] motion-safe:min-h-[100svh]">
      {/* Ocean flood (revealed from the strike point) */}
      <div data-flood aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg, #01047B 0%, #0F7FC4 38%, #01047B 100%)" }} />

      <div data-cta-shake className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="relative">
          <h2 data-cta-title aria-label={contact.title.replace(/\*/g, "")} className="display text-[clamp(4rem,min(13vw,21svh),14rem)]">
            {words.map((w, i) => {
              const accent = w.startsWith("*");
              const text = accent ? w.slice(1, -1) : w;
              const letters = Array.from(text).map((c, j) => (
                <span key={j} data-cta-letter aria-hidden="true" className="inline-block will-change-transform">
                  {c}
                </span>
              ));
              return (
                <span key={i} className="block">
                  {accent ? (
                    <Electric strong text={text}>
                      {letters}
                    </Electric>
                  ) : (
                    letters
                  )}
                </span>
              );
            })}
          </h2>

          {/* Where the traveling bolt settles after the BOOM */}
          <div data-bolt-slot="cta" aria-hidden="true" className="pointer-events-none absolute right-[4%] top-[-6%] aspect-square w-[clamp(90px,min(13vw,26svh),230px)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/bolt-cta.webp")} alt="" className="hidden h-full w-full object-contain motion-reduce:block" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 pb-12 sm:mt-10 sm:pb-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p data-cta-fade className="max-w-md text-pretty text-lg font-semibold leading-relaxed sm:text-xl">
              {contact.sub}
            </p>
            <div data-cta-fade className="relative mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${site.email}`} className="btn btn-acid relative h-14 px-7 text-base">
                Email me <span aria-hidden="true">→</span>
              </a>
              <a href={site.whatsapp.link} target="_blank" rel="noreferrer" className="btn btn-ghost h-14 px-7 text-base">
                WhatsApp
              </a>
            </div>
          </div>
          <div data-cta-fade>
            <ContactRow label="Email" value={site.email} href={`mailto:${site.email}`} />
            <ContactRow label="WhatsApp" value={site.whatsapp.display} href={site.whatsapp.link} external />
            <div className="flex items-center justify-between border-b border-white/15 py-5">
              <span className="label text-white/55">Dubai</span>
              <span className="text-lg font-bold">
                <DubaiTime />
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto border-t border-white/10 bg-midnight-deep/60">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo className="h-7 w-auto text-white" />
          <p className="text-xs font-semibold text-white/50">© 2026 Justin Diango · Designed &amp; built in Dubai with Claude Code</p>
          <a href="#top" className="text-xs font-bold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-acid">
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}

function ContactRow({ label, value, href, external = false }: { label: string; value: string; href: string; external?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/15 py-5">
      <div className="min-w-0">
        <p className="label text-white/55">{label}</p>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="mt-1 block truncate text-lg font-bold transition-colors duration-200 hover:text-acid sm:text-2xl"
        >
          {value}
        </a>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-xs font-bold transition-colors duration-200 hover:bg-white/10"
      >
        <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
      </button>
    </div>
  );
}
