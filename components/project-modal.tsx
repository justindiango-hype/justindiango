"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/content/site";
import { ProjectDetails } from "./project-frame";
import { asset } from "@/lib/asset";

/** Full-screen preview: the project's recording playing, with its details. Esc / backdrop / × to close. */
export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    window.__lenis?.stop();
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      prev?.focus?.();
    };
  }, [project, onClose]);

  if (!project) return null;
  const cover = asset(project.media ? `/work/${project.media}.webp` : project.cover ?? "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} preview`}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-midnight-deep/85 p-4 backdrop-blur-md animate-[modal-in_350ms_var(--ease-out)] sm:p-8"
      onClick={onClose}
    >
      <div className="relative w-[min(96vw,1400px)] animate-[modal-pop_500ms_var(--ease-out)]" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-midnight-deep shadow-[0_60px_140px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-3">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="ml-3 truncate text-xs font-semibold text-white/50">{project.name}</span>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="ml-auto grid size-8 place-items-center rounded-full text-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="relative aspect-[20/9] max-h-[70svh] w-full">
            {project.media ? (
              <video
                src={asset(`/work/${project.media}.mp4`)}
                poster={cover}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            ) : (
              cover && <Image src={cover} alt={`${project.name} cover`} fill sizes="96vw" className="object-cover" />
            )}
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <ProjectDetails project={project} />
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer" className="btn btn-acid shrink-0">
              Visit site ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
