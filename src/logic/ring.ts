/** Winkel in SVG-Grad von der +x-Achse im Uhrzeigersinn; die Lücke (38° bis 142°) liegt unten. */
export const RING_START_DEG = 142;
export const RING_SWEEP_DEG = 256;

export function ringFraction(value: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(1, Math.abs(value) / max);
}

export function polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function arcPath(cx: number, cy: number, r: number, fraction: number): string {
  if (!(fraction > 0)) return '';
  const sweep = Math.min(1, fraction) * RING_SWEEP_DEG;
  const start = polar(cx, cy, r, RING_START_DEG);
  const end = polar(cx, cy, r, RING_START_DEG + sweep);
  const large = sweep > 180 ? 1 : 0;
  const f = (n: number) => +n.toFixed(3);
  return `M ${f(start.x)} ${f(start.y)} A ${r} ${r} 0 ${large} 1 ${f(end.x)} ${f(end.y)}`;
}
