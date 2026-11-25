import type { NormalizedNode } from '../types';
import type { NodeState } from './node-state';

export interface Mix {
  solar: number;
  grid: number;
  battery: number;
}

export interface SinkShare {
  watts: number;
  solarWatts: number;
  restWatts: number;
  /** Anteil Solar an der Versorgung, 0–1 */
  solarShare: number;
  /** Der Ring zeigt Leistung (nicht Ladestand) und darf aufgeteilt werden. */
  splitRing: boolean;
}

/** Anteile der Quellen an der Versorgung (Solar, Netzbezug, Batterie-Entladung). Rechnerisch, nicht gemessen. */
export function computeMix(nodes: NormalizedNode[], states: NodeState[]): Mix | undefined {
  const sum: Mix = { solar: 0, grid: 0, battery: 0 };
  nodes.forEach((n, i) => {
    const s = states[i];
    if (!s.available || s.dir !== 'to-center') return;
    if (n.kind === 'solar') sum.solar += Math.abs(s.watts);
    else if (n.kind === 'grid') sum.grid += Math.abs(s.watts);
    else if (n.kind === 'battery') sum.battery += Math.abs(s.watts);
  });
  const total = sum.solar + sum.grid + sum.battery;
  if (total <= 0) return undefined;
  return { solar: sum.solar / total, grid: sum.grid / total, battery: sum.battery / total };
}

/** Jede Senke (Fluss vom Zentrum weg) erhält dieselbe Quellenmischung, in Watt aufgeteilt. */
export function sinkShares(nodes: NormalizedNode[], states: NodeState[], mix: Mix): Map<string, SinkShare> {
  const out = new Map<string, SinkShare>();
  nodes.forEach((n, i) => {
    const s = states[i];
    if (!s.available || s.dir !== 'from-center') return;
    const watts = Math.abs(s.watts);
    out.set(n.key, {
      watts,
      solarWatts: watts * mix.solar,
      restWatts: watts * (1 - mix.solar),
      solarShare: mix.solar,
      splitRing: s.soc === undefined,
    });
  });
  return out;
}
