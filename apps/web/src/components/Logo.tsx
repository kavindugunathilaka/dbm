// Official DBM wordmark: "db" black, "m" red, matching DBM's invoice template logo.
import { LOGO } from "@/lib/logo";

type Props = { className?: string; inverted?: boolean; title?: string };

export function Logo({ className = "h-8 w-auto", inverted = false, title = "DBM Associates" }: Props) {
  const ink = inverted ? "#ffffff" : LOGO.ink;
  return (
    <svg viewBox={LOGO.viewBox} className={className} role="img" aria-label={title} fill="none">
      <title>{title}</title>
      <g strokeWidth={LOGO.stroke} strokeLinecap="butt" strokeLinejoin="round">
        <path d={LOGO.d} stroke={ink} />
        <path d={LOGO.b} stroke={ink} />
        <path d={LOGO.m} stroke={LOGO.red} />
      </g>
    </svg>
  );
}
