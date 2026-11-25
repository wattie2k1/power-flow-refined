import { describe, expect, test } from 'vitest';
import { normalizeConfig } from '../src/logic/config';
import { labelPoint, layoutHeight, layoutHub, layoutNodes, offsetPolyline } from '../src/logic/layout';

const cfg = (extra = 0, main: string[] = ['solar', 'grid', 'battery', 'home']) =>
  normalizeConfig({
    type: 't',
    ...Object.fromEntries(main.map((k) => [k, { entity: `sensor.${k}` }])),
    extras: Array.from({ length: extra }, (_, i) => ({ entity: `sensor.e${i}` })),
  }).nodes;

describe('layoutNodes', () => {
  test('vier Hauptknoten im 2x2-Raster innerhalb der Breite', () => {
    const l = layoutNodes(cfg());
    expect(l).toHaveLength(4);
    expect(l[0].cy).toBe(l[1].cy);
    expect(l[2].cy).toBe(l[3].cy);
    expect(l[2].cy).toBeGreaterThan(l[0].cy);
    expect(l[0].cx).toBe(l[2].cx);
    for (const n of l) {
      expect(n.cx - n.r).toBeGreaterThanOrEqual(0);
      expect(n.cx + n.r).toBeLessThanOrEqual(400);
    }
  });
  test('fünf Extras: vier in der ersten Reihe, einer in der zweiten, keine Überlappung', () => {
    const l = layoutNodes(cfg(5));
    const ex = l.filter((n) => n.key.startsWith('extra'));
    expect(ex.filter((n) => n.cy === ex[0].cy)).toHaveLength(4);
    expect(ex[4].cy).toBeGreaterThan(ex[0].cy);
    for (let i = 0; i < l.length; i++)
      for (let j = i + 1; j < l.length; j++)
        expect(Math.hypot(l[i].cx - l[j].cx, l[i].cy - l[j].cy)).toBeGreaterThanOrEqual(l[i].r + l[j].r);
  });
  test('nur Haus: ein Kreis, horizontal zentriert', () => {
    const l = layoutNodes(cfg(0, ['home']));
    expect(l).toHaveLength(1);
    expect(l[0].cx).toBe(200);
  });
  test('leere Liste', () => expect(layoutNodes([])).toEqual([]));
  test('Extras liegen unter den Hauptkreisen', () => {
    const l = layoutNodes(cfg(2));
    const mainBottom = Math.max(...l.filter((n) => !n.key.startsWith('extra')).map((n) => n.cy + n.r));
    for (const n of l.filter((n) => n.key.startsWith('extra'))) expect(n.cy - n.r).toBeGreaterThan(mainBottom);
  });
});

describe('layoutHub und layoutHeight', () => {
  test('Hub liegt mittig zwischen den Hauptreihen', () => {
    const l = layoutNodes(cfg());
    expect(layoutHub(l)).toEqual({ cx: 200, cy: (l[0].cy + l[2].cy) / 2 });
  });
  test('Höhe umfasst alle Kreise', () => {
    const l = layoutNodes(cfg(5));
    expect(layoutHeight(l)).toBeGreaterThanOrEqual(Math.max(...l.map((n) => n.cy + n.r)));
  });
});

import { connectorPoints } from '../src/logic/layout';

function segDist(p: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

describe('Verbinder (I2)', () => {
  test('drei Hauptkreise: der dritte sitzt links in der zweiten Reihe, nicht mittig', () => {
    const l = layoutNodes(cfg(0, ['solar', 'grid', 'home']));
    expect(l[2].cx).toBe(72);
  });
  test('Hauptkreis-Verbinder geht vom Hub zum Kreismittelpunkt', () => {
    const l = layoutNodes(cfg());
    const hub = layoutHub(l);
    const pts = connectorPoints(l, 'solar');
    expect(pts[0]).toEqual({ x: hub.cx, y: hub.cy });
    expect(pts[pts.length - 1]).toEqual({ x: l[0].cx, y: l[0].cy });
  });
  test.each([
    ['4 Haupt + 4 Extras', ['solar', 'grid', 'battery', 'home'], 4],
    ['3 Haupt + 5 Extras', ['solar', 'grid', 'home'], 5],
    ['2 Haupt + 2 Extras', ['solar', 'home'], 2],
    ['1 Haupt + 3 Extras', ['home'], 3],
  ])('%s: keine Linie schneidet einen fremden Kreis', (_n, main, extras) => {
    const nodes = cfg(extras as number, main as string[]);
    const l = layoutNodes(nodes);
    const hub = layoutHub(l);
    for (const n of l) {
      const pts = connectorPoints(l, n.key);
      for (const other of l) {
        if (other.key === n.key) continue;
        if (other.cx === hub.cx && other.cy === hub.cy) continue; // einzelner Hauptkreis liegt im Hub
        for (let i = 0; i + 1 < pts.length; i++) {
          expect(segDist({ x: other.cx, y: other.cy }, pts[i], pts[i + 1])).toBeGreaterThanOrEqual(other.r);
        }
      }
    }
  });
  test('nur Extras: keine Verbinder (M6)', () => {
    const l = layoutNodes(cfg(3, []));
    for (const n of l) expect(connectorPoints(l, n.key)).toEqual([]);
  });
});

describe('offsetPolyline', () => {
  test('gerade Linie wird senkrecht verschoben', () => {
    const r = offsetPolyline([{ x: 0, y: 0 }, { x: 10, y: 0 }], 2);
    expect(r[0].x).toBeCloseTo(0);
    expect(r[0].y).toBeCloseTo(2);
    expect(r[1].y).toBeCloseTo(2);
  });
  test('rechter Winkel: beide Schenkel behalten den Abstand 2', () => {
    const r = offsetPolyline([{ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 10 }], 2);
    expect(r[0].x).toBeCloseTo(-2);
    expect(r[1]).toMatchObject({ x: expect.closeTo(-2), y: expect.closeTo(12) });
    expect(r[2].y).toBeCloseTo(12);
  });
  test('negativer Abstand verschiebt auf die andere Seite', () =>
    expect(offsetPolyline([{ x: 0, y: 0 }, { x: 10, y: 0 }], -2)[0].y).toBeCloseTo(-2));
  test('labelPoint liegt auf der Linie', () => {
    const p = labelPoint([{ x: 0, y: 0 }, { x: 100, y: 0 }], 0.6);
    expect(p).toEqual({ x: 60, y: 0 });
  });
});
