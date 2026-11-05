// Line-drawn front elevation of a warehouse + office block, in DBM blueprint style.
// Decorative only: no project photography exists yet.
export function BlueprintArt({ className = "" }: { className?: string }) {
  const line = "rgb(255 255 255 / 0.85)";
  const faint = "rgb(255 255 255 / 0.35)";
  return (
    <svg viewBox="0 0 480 300" className={className} fill="none" aria-hidden>
      {/* ground */}
      <path d="M16 240H464" stroke={line} strokeWidth="2" />
      <path d="M16 248H464" stroke={faint} strokeDasharray="4 6" />

      {/* warehouse portal frame */}
      <path d="M40 240V128L170 86L300 128V240" stroke={line} strokeWidth="2" />
      <path d="M40 140L170 98L300 140" stroke={faint} />
      {/* roller doors */}
      {[64, 132, 200].map((x) => (
        <g key={x}>
          <rect x={x} y="170" width="56" height="70" stroke={line} strokeWidth="1.5" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M${x} ${180 + i * 9}H${x + 56}`} stroke={faint} />
          ))}
        </g>
      ))}
      {/* ridge vents */}
      <path d="M150 92h40" stroke={line} strokeWidth="1.5" />

      {/* office block */}
      <path d="M300 240V108H440V240" stroke={line} strokeWidth="2" />
      <path d="M294 108H446" stroke={line} strokeWidth="2" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={314 + c * 31} y={122 + r * 32} width="20" height="20" stroke={faint} strokeWidth="1.5" />
        )),
      )}
      {/* entrance + canopy (brand accent) */}
      <rect x="358" y="216" width="26" height="24" stroke="var(--color-brand)" strokeWidth="2" />
      <path d="M340 212H402" stroke="var(--color-brand)" strokeWidth="3" />

      {/* dimension lines */}
      <g stroke="var(--color-brand)" strokeWidth="1.25">
        <path d="M40 268H440" />
        <path d="M40 262v12M300 262v12M440 262v12" />
        <path d="M466 108V240" />
        <path d="M460 108h12M460 240h12" />
      </g>
      <g fill="rgb(255 255 255 / 0.7)" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="1">
        <text x="150" y="286">WAREHOUSE</text>
        <text x="348" y="286">OFFICE</text>
        <text x="20" y="28">ELEVATION A — 1:200</text>
      </g>
      <path d="M20 36H150" stroke={faint} />
    </svg>
  );
}
