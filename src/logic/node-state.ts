import type { NormalizedNode } from '../types';
import { ringFraction } from './ring';
import { toWatts } from './units';

export type FlowDir = 'to-center' | 'from-center' | 'idle';

export interface NodeState {
  available: boolean;
  /** vorzeichenbehaftet; 0, wenn nicht verfügbar */
  watts: number;
  /** Originaleinheit der Hauptentität */
  unit?: string;
  /** Ringfüllung 0–1 */
  fraction: number;
  dir: FlowDir;
  mode?: 'charging' | 'discharging' | 'import' | 'export';
  /** nur Batterie bzw. ring: soc, geklemmt 0–100 */
  soc?: number;
}

type States = Record<string, { state: string; attributes: Record<string, unknown> } | undefined>;

/** Wenn |W| darunter liegt, gilt der Fluss als Ruhe. */
const IDLE_WATTS = 10;

function readNumber(states: States, entityId?: string): { value: number; unit?: string } | undefined {
  if (!entityId) return undefined;
  const s = states[entityId];
  if (!s || s.state.trim() === '') return undefined;
  const value = Number(s.state);
  if (!Number.isFinite(value)) return undefined;
  const unit = s.attributes?.unit_of_measurement;
  return { value, unit: typeof unit === 'string' ? unit : undefined };
}

function readSoc(states: States, entityId?: string): number | undefined {
  const n = readNumber(states, entityId);
  return n ? Math.min(100, Math.max(0, n.value)) : undefined;
}

/** `minus`: Leistung (W), die beim Haus abgezogen wird (Zusatzkreise), nur mit `subtract_extras`. */
export function resolveNode(states: States, node: NormalizedNode, minus = 0): NodeState {
  const main = readNumber(states, node.entity);
  if (!main) return { available: false, watts: 0, fraction: 0, dir: 'idle' };

  let watts = toWatts(main.value, main.unit);
  if (node.kind === 'grid') {
    const exp = readNumber(states, node.export_entity);
    const expW = exp ? toWatts(exp.value, exp.unit) : 0;
    if (expW > 0) watts = -expW;
  }
  if (node.invert) watts = -watts;
  if (node.kind === 'home' && node.subtract_extras) watts = Math.max(0, watts - minus);

  const idle = Math.abs(watts) < IDLE_WATTS;
  let dir: FlowDir = 'idle';
  let mode: NodeState['mode'];
  if (!idle) {
    switch (node.kind) {
      case 'solar':
        dir = 'to-center';
        break;
      case 'grid':
        dir = watts > 0 ? 'to-center' : 'from-center';
        mode = watts > 0 ? 'import' : 'export';
        break;
      case 'battery':
        dir = watts > 0 ? 'to-center' : 'from-center';
        mode = watts > 0 ? 'discharging' : 'charging';
        break;
      default:
        dir = 'from-center';
    }
  }

  let soc: number | undefined;
  if (node.kind === 'battery') soc = readSoc(states, node.soc_entity);
  else if (node.kind === 'extra' && node.ring === 'soc') soc = readSoc(states, node.ring_entity);

  const fraction = soc !== undefined ? soc / 100 : ringFraction(watts, node.max);
  return { available: true, watts, unit: main.unit, fraction, dir, mode, soc };
}
