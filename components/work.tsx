"use client";

import { projects, work, type Project } from "@/content/site";
import { Electric } from "./electric";
import { ProjectDetails, ProjectFrame } from "./project-frame";

export const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];

/**
 * The work as a full-screen panel inside the side-scrolling stage:
 * "THE WORK." stays put on the left while the projects glide past.
 * The stage (side-stage.tsx) drives the movement.
 */
/** The work section's background gradient. */
export const WORK_BG =
  "radial-gradient(70% 65% at 88% 105%, rgba(15,127,196,0.42), transparent 70%), radial-gradient(55% 50% at 30% -10%, rgba(15,127,196,0.22), transparent 70%), linear-gradient(180deg, #01047B 0%, #01047B 55%, #000366 100%)";

export function WorkPanel({ className = "", onOpen, bg = true }: { className?: string; onOpen: (p: Project) => void; bg?: boolean }) {
  const featured = ordered[0];
  const rest = ordered.slice(1);
  return (
    <div data-work-panel aria-label="Selected work" className={`relative h-[100svh] overflow-hidden ${bg ? "bg-midnight" : ""} ${className}`}
      style={bg ? { backgroundImage: WORK_BG } : undefined}
    >
      <div
        data-work-flash
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 opacity-0"
        style={{ background: "radial-gradient(60% 60% at 20% 45%, rgba(222,244,52,0.45), transparent 70%)" }}
      />

      <div data-shake className="absolute inset-0">
        {/* Fixed title: stays put while the projects move */}
        <div className="absolute inset-x-0 top-0 z-20 px-5 pt-24 sm:px-8 lg:inset-y-0 lg:right-auto lg:flex lg:w-[36vw] lg:flex-col lg:justify-center lg:pt-0">
          <h2 className="display relative text-[clamp(3.6rem,16vw,6rem)] lg:text-[clamp(4rem,min(8.6vw,19svh),10rem)]" aria-label={`${work.title.replace(/\*/g, "")} ${work.year}`}>
            {/* The traveling bolt spins here, small, while you browse the work: beside "THE" on phones, on top of the title on desktop */}
            <span
              data-bolt-slot="work"
              aria-hidden="true"
              className="pointer-events-none absolute left-[3.75em] top-[-0.02em] block aspect-square w-[0.7em] lg:bottom-full lg:left-[-0.04em] lg:top-auto lg:mb-[0.08em] lg:w-[0.62em]"
            />
            {/* "2026 projects", tucked beside "THE" */}
            <span data-work-year aria-hidden="true" className="absolute left-[2.55em] top-[0.08em] flex flex-col leading-none">
              <span className="text-[0.3em] font-extrabold tracking-[-0.03em] text-acid">{work.year.split(" ")[0]}</span>
              <span className="mt-[0.35em] text-[max(0.62rem,0.085em)] font-bold tracking-[0.2em] text-white/70">{work.year.split(" ").slice(1).join(" ")}</span>
            </span>
            <SlamTitle text={work.title} />
          </h2>
          <p data-work-sub className="mt-4 max-w-sm text-pretty text-base font-semibold leading-snug text-muted lg:mt-6 lg:text-lg">
            {work.sub}
          </p>
        </div>

        {/* The moving gallery */}
        <div
          data-work-viewport
          className="absolute inset-x-0 bottom-0 top-[44svh] overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] lg:inset-y-0 lg:left-[36vw]"
        >
          <div data-work-track className="flex h-full w-max items-center gap-[12vw] px-[6vw] will-change-transform sm:gap-16 lg:gap-20 lg:pl-[3vw] motion-reduce:w-full motion-reduce:overflow-x-auto">
            <Card project={featured} featured onOpen={onOpen} />
            {rest.map((p) => (
              <Card key={p.name} project={p} onOpen={onOpen} />
            ))}
            <div className="flex w-[60vw] shrink-0 flex-col justify-center sm:w-[30vw] lg:w-[22vw]">
              <a href="#contact" className="display block text-[clamp(2.4rem,4.6vw,4.8rem)] transition-colors duration-300 hover:text-acid">
                Yours
                <br />
                could be
                <br />
                <span className="text-acid">here →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ project, featured = false, onOpen }: { project: Project; featured?: boolean; onOpen: (p: Project) => void }) {
  return (
    <button
      type="button"
      data-card
      onClick={() => onOpen(project)}
      aria-label={`Open ${project.name}`}
      className={`group relative shrink-0 text-left ${
        featured ? "w-[86vw] sm:w-[60vw] lg:w-[min(46vw,105svh)]" : "w-[78vw] sm:w-[48vw] lg:w-[min(36vw,82svh)]"
      }`}
    >
      <div data-fly>
        <div data-tilt className="will-change-transform">
          <div className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.02]">
            <ProjectFrame project={project} sizes={featured ? "(min-width: 1024px) 46vw, 86vw" : "(min-width: 1024px) 36vw, 78vw"} priority={featured} />
          </div>
          {featured && (
            <span className="absolute left-4 top-14 rounded-full bg-acid px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-midnight shadow-[0_8px_30px_-6px_rgba(222,244,52,0.8)]">
              Featured project
            </span>
          )}
          <div className="mt-5">
            <ProjectDetails project={project} link={false} />
          </div>
        </div>
      </div>
    </button>
  );
}

/** "The *work.*" split into letters for the slam-in; the *word* keeps its electric surge. */
function SlamTitle({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  const letters = (t: string, key: string) =>
    Array.from(t).map((c, i) => (
      <span key={key + i} data-slam aria-hidden="true" className="inline-block will-change-transform">
        {c === " " ? " " : c}
      </span>
    ));
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") ? (
          <span key={i} className="whitespace-nowrap lg:block">
            <Electric strong text={p.slice(1, -1)}>
              {letters(p.slice(1, -1), `a${i}`)}
            </Electric>
          </span>
        ) : (
          <span key={i}>{letters(p, `p${i}`)}</span>
        ),
      )}
    </>
  );
}
