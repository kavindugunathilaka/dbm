// DBM wordmark geometry, traced from the logo in DBM's own invoice template (Excel).
// Stroke-based paths in a 200 × 52 box (viewBox "4 4 200 52"), stroke width 8, butt caps.
export const LOGO = {
  viewBox: "4 4 200 52",
  x: 4,
  y: 4,
  width: 200,
  height: 52,
  stroke: 8,
  ink: "#000000",
  red: "#ff0000",
  d: "M53.5 4V40A12 12 0 0 1 41.5 52H20A12 12 0 0 1 8 40V36A10 10 0 0 1 18 26H44",
  b: "M67.5 4V40A12 12 0 0 0 79.5 52H101A12 12 0 0 0 113 40V36A10 10 0 0 0 103 26H77",
  m: "M128 56V38A12 12 0 0 1 140 26H151.5A12 12 0 0 1 163.5 38V56M163.5 38A12 12 0 0 1 175.5 26H188A12 12 0 0 1 200 38V56",
} as const;
