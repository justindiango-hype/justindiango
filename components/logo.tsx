import { BOLT, LOGO_VIEWBOX, WORD_DIANGO, WORD_JUSTIN } from "@/lib/logo-paths";

/** The bolt + JustinDiango wordmark, as inline SVG so it stays crisp and themeable. */
export function Logo({ className = "", word = true }: { className?: string; word?: boolean }) {
  return (
    <svg viewBox={word ? LOGO_VIEWBOX : "-4 -86 70 118"} className={className} role="img" aria-label="Justin Diango">
      <g data-logo-bolt transform="translate(0 -78) scale(0.88)">
        <path d={BOLT} fill="#0F7FC4" transform="translate(6 4)" />
        <path d={BOLT} fill="#DEF434" />
      </g>
      {word && (
        <>
          <path d={WORD_JUSTIN} fill="currentColor" transform="translate(72 0)" />
          <path d={WORD_DIANGO} fill="#DEF434" transform="translate(72 0)" />
        </>
      )}
    </svg>
  );
}

/** Just the bolt outline, for small inline use. */
export function BoltMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-2 -2 66 104" className={className} aria-hidden="true">
      <path d={BOLT} fill="#0F7FC4" transform="translate(6 4)" />
      <path d={BOLT} fill="#DEF434" />
    </svg>
  );
}
