// DBM wordmark: monoline "db" in ink, "m" in brand red (redrawn from company stationery).
// TODO(DBM): replace with the official vector logo when supplied.
type Props = { className?: string; inverted?: boolean; title?: string };

export function Logo({ className = "h-8 w-auto", inverted = false, title = "DBM Associates" }: Props) {
  const ink = inverted ? "#ffffff" : "var(--color-ink)";
  return (
    <svg viewBox="0 0 92 38" className={className} role="img" aria-label={title} fill="none">
      <title>{title}</title>
      <g strokeWidth="5" strokeLinecap="butt" strokeLinejoin="round">
        {/* d */}
        <circle cx="12" cy="25" r="8.5" stroke={ink} />
        <path d="M20.5 1.5V36.5" stroke={ink} />
        {/* b */}
        <path d="M31 1.5V36.5" stroke={ink} />
        <circle cx="39.5" cy="25" r="8.5" stroke={ink} />
        {/* m */}
        <path
          d="M55 36.5V25a8.5 8.5 0 0 1 17 0v11.5M72 25a8.5 8.5 0 0 1 17 0v11.5"
          stroke="var(--color-brand)"
        />
      </g>
    </svg>
  );
}
