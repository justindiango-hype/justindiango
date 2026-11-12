import Image from "next/image";
import { forwardRef } from "react";
import type { Project } from "@/content/site";
import { BoltMark } from "./logo";

/** A project's screen recording (or a placeholder cover) in a slim browser frame. */
export const ProjectFrame = forwardRef<HTMLVideoElement, { project: Project; sizes: string; priority?: boolean }>(
  function ProjectFrame({ project, sizes, priority = false }, videoRef) {
    return (
      <div className="relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-midnight-deep shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] sm:rounded-[1.4rem]">
        <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="ml-3 truncate text-[0.7rem] font-semibold text-white/45">{project.name}</span>
          {project.media && (
            <span className="ml-auto flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-acid">
              <span className="size-1.5 animate-pulse rounded-full bg-current" />
              <span className="max-sm:hidden">Live preview</span>
            </span>
          )}
        </div>
        <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[20/9]">
          {project.media ? (
            <>
              <Image src={`/work/${project.media}.webp`} alt={`${project.name} landing page`} fill sizes={sizes} priority={priority} className="object-cover object-top" />
              <video
                ref={videoRef}
                src={`/work/${project.media}.mp4`}
                poster={`/work/${project.media}.webp`}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </>
          ) : project.cover ? (
            <Image src={project.cover} alt={`${project.name} cover`} fill sizes={sizes} className="object-cover" />
          ) : (
            <div
              className="absolute inset-0 flex flex-col justify-end p-[6%]"
              style={{ background: "radial-gradient(90% 120% at 100% 0%, rgba(15,127,196,0.65), transparent 60%), #01047B" }}
            >
              <BoltMark className="absolute right-[6%] top-[12%] h-[34%] w-auto opacity-90" />
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/50">Preview coming soon</p>
              <p className="display mt-3 text-[clamp(1.8rem,4vw,3.6rem)]">{project.name}</p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

/** Name, category, location and one line about the project. */
export function ProjectDetails({ project, align = "left", link = true }: { project: Project; align?: "left" | "right"; link?: boolean }) {
  const Title = project.url && link ? "a" : "span";
  return (
    <div className={align === "right" ? "sm:text-right" : ""}>
      <h3 className="text-[clamp(1.5rem,2.6vw,2.4rem)] font-extrabold tracking-[-0.03em]">
        <Title {...(project.url && link ? { href: project.url, target: "_blank", rel: "noreferrer", className: "hover:text-acid" } : {})}>
          {project.name}
          {project.url && <span aria-hidden="true"> ↗</span>}
        </Title>
      </h3>
      <p className="mt-1 text-sm font-semibold text-[#6cc0f5]">
        {project.category} <span className="text-white/35">·</span> <span className="text-white/60">{project.location}</span>
      </p>
      <p className={`mt-2 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-muted ${align === "right" ? "sm:ml-auto" : ""}`}>{project.summary}</p>
      {project.liveInDays && (
        <p className="mt-3 inline-flex rounded-full bg-acid/10 px-3 py-1 text-xs font-bold text-acid">Live in {project.liveInDays} days</p>
      )}
    </div>
  );
}
