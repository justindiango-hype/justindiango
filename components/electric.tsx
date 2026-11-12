"use client";

import { useEffect, useRef } from "react";

/** A jagged lightning path across a w×h box. */
export function arcPath(w: number, h: number, segments = 9) {
  const pts: [number, number][] = [];
  const y0 = h * (0.3 + Math.random() * 0.4);
  for (let i = 0; i <= segments; i++) {
    const x = (w * i) / segments;
    const y = i === 0 || i === segments ? y0 + (Math.random() - 0.5) * h * 0.3 : h * (0.15 + Math.random() * 0.7);
    pts.push([x, y]);
  }
  return "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
}

/**
 * Wraps a word so it surges with electricity about once a second:
 * a neon flicker and a glow pulse.
 * With reduced motion it simply glows.
 */
export function Electric({
  children,
  className = "",
  interval,
  tone = "acid",
  strong = false,
  text,
}: {
  children: React.ReactNode;
  className?: string;
  /** Fixed time between surges in ms (default: roughly once a second). */
  interval?: number;
  /** Text colour: acid yellow or white. */
  tone?: "acid" | "white";
  /** A bigger glitch-zap: white-hot flicker, shake and RGB-split slices. */
  strong?: boolean;
  /** The plain text of the word (used for the glitch layers when strong). */
  text?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const surge = () => {
      if (visible && !document.hidden) {
        el.classList.remove("is-surging");
        void el.offsetWidth; // restart the CSS animation
        el.classList.add("is-surging");
        if (interval) window.dispatchEvent(new Event("jd:beat"));
      }
      timer = window.setTimeout(surge, interval ?? (strong ? 2200 + Math.random() * 1400 : 900 + Math.random() * 350));
    };
    timer = window.setTimeout(surge, interval ? 600 : 400 + Math.random() * 600);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [interval, strong]);

  return (
    <span
      ref={root}
      data-text={strong ? text : undefined}
      className={`electric relative inline-block ${tone === "white" ? "electric-white text-white" : "text-acid"} ${strong ? "electric-strong" : ""} ${className}`}
    >
      <span className="electric-text inline-block">{children}</span>
    </span>
  );
}
