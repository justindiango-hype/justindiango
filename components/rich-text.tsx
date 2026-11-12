import { Electric } from "./electric";

/**
 * Renders *word* as acid-yellow text (surging with electricity unless electric={false})
 * and ^word^ as white text that gets electrocuted every 2 seconds.
 */
export function RichText({
  text,
  electric = true,
  interval,
  strong = false,
}: {
  text: string;
  electric?: boolean;
  /** Fixed time between surges for *word* (ms). */
  interval?: number;
  /** A bigger electrocuted zap (used for "FAST" in the hero). */
  strong?: boolean;
}) {
  const parts = text.split(/(\*[^*]+\*|\^[^^]+\^)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("^") && p.endsWith("^"))
          return (
            <Electric key={i} tone="white" interval={2000}>
              {p.slice(1, -1)}
            </Electric>
          );
        if (p.startsWith("*") && p.endsWith("*"))
          return electric ? (
            <Electric key={i} interval={interval} strong={strong} text={p.slice(1, -1)}>
              {p.slice(1, -1)}
            </Electric>
          ) : (
            <span key={i} className="text-acid">
              {p.slice(1, -1)}
            </span>
          );
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
