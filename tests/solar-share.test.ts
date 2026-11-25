import { describe, expect, test } from 'vitest';
import { normalizeConfig } from '../src/logic/config';
import { resolveNode } from '../src/logic/node-state';
import { computeMix, sinkShares } from '../src/logic/solar-share';

const st = (state: string) => ({ state, attributes: { unit_of_measurement: 'W' } });
const cfg = normalizeConfig({
  type: 't',
  solar: { entity: 'sensor.s' },
  grid: { entity: 'sensor.g' },
  battery: { entity: 'sensor.b' },
  home: { entity: 'sensor.h' },
  extras: [{ entity: 'sensor.e' }],
});
const run = (v: Record<string, string>) => {
  const states = Object.fromEntries(Object.entries(v).map(([k, x]) => [`sensor.${k}`, st(x)]));
  return cfg.nodes.map((n) => resolveNode(states, n));
};

describe('computeMix', () => {
  test('Abend: Solar 900, Batterie entlädt 500, Netzbezug 800', () => {
    const mix = computeMix(cfg.nodes, run({ s: '900', g: '800', b: '500', h: '1400', e: '800' }))!;
    expect(mix.solar).toBeCloseTo(900 / 2200);
    expect(mix.battery).toBeCloseTo(500 / 2200);
    expect(mix.grid).toBeCloseTo(800 / 2200);
  });
  test('Überschuss: nur Solar ist Quelle, Netz exportiert und Batterie lädt', () => {
    const mix = computeMix(cfg.nodes, run({ s: '3000', g: '-800', b: '-500', h: '1200', e: '0' }))!;
    expect(mix).toEqual({ solar: 1, grid: 0, battery: 0 });
  });
  test('keine Quelle über der Ruhe-Schwelle ergibt undefined', () =>
    expect(computeMix(cfg.nodes, run({ s: '0', g: '5', b: '0', h: '1', e: '0' }))).toBeUndefined());
  test('nicht verfügbare Quellen zählen als 0', () =>
    expect(computeMix(cfg.nodes, run({ s: '1000', h: '1000' }))).toEqual({ solar: 1, grid: 0, battery: 0 }));
});

describe('sinkShares', () => {
  test('nur Senken (from-center) bekommen Anteile, in Watt aufgeteilt', () => {
    const states = run({ s: '900', g: '800', b: '500', h: '1400', e: '800' });
    const mix = computeMix(cfg.nodes, states)!;
    const sh = sinkShares(cfg.nodes, states, mix);
    expect(sh.has('solar')).toBe(false);
    expect(sh.has('grid')).toBe(false);
    expect(sh.get('home')!.solarWatts).toBeCloseTo(1400 * (900 / 2200));
    expect(sh.get('extra-0')!.restWatts).toBeCloseTo(800 * (1300 / 2200));
  });
  test('Ladestand-Ringe (soc) bekommen keinen Ring-Anteil', () => {
    const c = normalizeConfig({ type: 't', solar: { entity: 'sensor.s' }, extras: [{ entity: 'sensor.e', ring: 'soc', ring_entity: 'sensor.soc' }] });
    const states = { 'sensor.s': st('2000'), 'sensor.e': st('1000'), 'sensor.soc': st('40') };
    const r = c.nodes.map((n) => resolveNode(states, n));
    const sh = sinkShares(c.nodes, r, computeMix(c.nodes, r)!);
    expect(sh.get('extra-0')).toMatchObject({ splitRing: false });
  });
});
