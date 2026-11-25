import type { NormalizedNode } from '../types';

export interface LaidOutNode {
  key: string;
  cx: number;
  cy: number;
  r: number;
}

export const VIEW_WIDTH = 400;
const MAIN_R = 44;
const MAIN_X = 72; // Mittelpunkt der linken Spalte, rechts gespiegelt
const EXTRA_R = 32;
const MAIN_ROW_Y = 60;
const MAIN_ROW_GAP = 130;
const EXTRA_GAP = 20;
const EXTRA_ROW_GAP = 90;
const EXTRAS_PER_ROW = 4;
const PAD_BOTTOM = 36; // Platz für den Namen unter dem untersten Kreis

/** Hauptkreise: zwei pro Reihe (einzelne Kreise zentriert), Extras kleiner darunter, bis zu vier pro Reihe. */
export function layoutNodes(nodes: NormalizedNode[]): LaidOutNode[] {
  const main = nodes.filter((n) => n.kind !== 'extra');
  const extras = nodes.filter((n) => n.kind === 'extra');
  const out: LaidOutNode[] = [];

  main.forEach((n, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const cx = main.length === 1 ? VIEW_WIDTH / 2 : col === 0 ? MAIN_X : VIEW_WIDTH - MAIN_X;
    out.push({ key: n.key, cx, cy: MAIN_ROW_Y + row * MAIN_ROW_GAP, r: MAIN_R });
  });

  const mainBottom = main.length
    ? MAIN_ROW_Y + (Math.ceil(main.length / 2) - 1) * MAIN_ROW_GAP + MAIN_R
    : 0;
  const extraY0 = mainBottom + EXTRA_GAP + EXTRA_R + (main.length ? PAD_BOTTOM - EXTRA_GAP : 0);
  extras.forEach((n, i) => {
    const row = Math.floor(i / EXTRAS_PER_ROW);
    const inRow = Math.min(EXTRAS_PER_ROW, extras.length - row * EXTRAS_PER_ROW);
    const col = i % EXTRAS_PER_ROW;
    out.push({
      key: n.key,
      cx: VIEW_WIDTH / 2 + (col - (inRow - 1) / 2) * (VIEW_WIDTH / Math.max(inRow, 2)),
      cy: (main.length ? extraY0 : EXTRA_R + 20) + row * EXTRA_ROW_GAP,
      r: EXTRA_R,
    });
  });
  return out;
}

/** Zentraler Knoten: mittig zwischen den Hauptreihen. */
export function layoutHub(layout: LaidOutNode[]): { cx: number; cy: number } {
  const main = layout.filter((n) => n.r === MAIN_R);
  if (main.length === 0) return { cx: VIEW_WIDTH / 2, cy: MAIN_ROW_Y };
  const ys = main.map((n) => n.cy);
  return { cx: VIEW_WIDTH / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2 };
}

export function layoutHeight(layout: LaidOutNode[]): number {
  if (layout.length === 0) return MAIN_ROW_Y;
  return Math.max(...layout.map((n) => n.cy + n.r)) + PAD_BOTTOM;
}

const BUS_GAP = 28; // Abstand der Sammelleitung unter dem untersten Hauptkreis

/** Linienzug vom Hub zum Kreis. Extras hängen an einer Sammelleitung unter den Hauptkreisen, damit keine Linie einen fremden Kreis kreuzt. */
export function connectorPoints(layout: LaidOutNode[], key: string): Array<{ x: number; y: number }> {
  const node = layout.find((n) => n.key === key);
  const main = layout.filter((n) => n.r === MAIN_R);
  if (!node || main.length === 0) return [];
  const hub = layoutHub(layout);
  const start = { x: hub.cx, y: hub.cy };
  if (node.r === MAIN_R) {
    if (node.cx === hub.cx && node.cy === hub.cy) return [];
    return [start, { x: node.cx, y: node.cy }];
  }
  const busY = Math.max(...main.map((n) => n.cy + n.r)) + BUS_GAP;
  return [start, { x: hub.cx, y: busY }, { x: node.cx, y: busY }, { x: node.cx, y: node.cy }];
}

type Pt = { x: number; y: number };

/** Verschiebt einen Linienzug um `d` zur Seite (positiv = links der Laufrichtung in SVG-Koordinaten), Ecken mit Gehrung. */
export function offsetPolyline(points: Pt[], d: number): Pt[] {
  const normals: Pt[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const len = Math.hypot(dx, dy) || 1;
    normals.push({ x: -dy / len, y: dx / len });
  }
  return points.map((p, i) => {
    if (i === 0) return { x: p.x + normals[0].x * d, y: p.y + normals[0].y * d };
    if (i === points.length - 1) {
      const n = normals[normals.length - 1];
      return { x: p.x + n.x * d, y: p.y + n.y * d };
    }
    const a = normals[i - 1];
    const b = normals[i];
    const sx = a.x + b.x;
    const sy = a.y + b.y;
    const sl = Math.hypot(sx, sy) || 1;
    const m = { x: sx / sl, y: sy / sl };
    const k = d / (m.x * a.x + m.y * a.y || 1);
    return { x: p.x + m.x * k, y: p.y + m.y * k };
  });
}

/** Punkt bei Anteil `t` (0–1) der Gesamtlänge des Linienzugs. */
export function labelPoint(points: Pt[], t: number): Pt {
  const lens = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  let rest = lens.reduce((a, b) => a + b, 0) * t;
  for (let i = 0; i < lens.length; i++) {
    if (rest <= lens[i] || i === lens.length - 1) {
      const f = lens[i] ? rest / lens[i] : 0;
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * f,
        y: points[i].y + (points[i + 1].y - points[i].y) * f,
      };
    }
    rest -= lens[i];
  }
  return points[0];
}
