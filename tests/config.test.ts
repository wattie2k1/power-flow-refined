import { describe, expect, test } from 'vitest';
import { normalizeConfig } from '../src/logic/config';

const base = { type: 'custom:power-flow-refined' };

describe('normalizeConfig', () => {
  test('nur home: ein Knoten mit Standardwerten', () => {
    const c = normalizeConfig({ ...base, home: { entity: 'sensor.h' } });
    expect(c.nodes).toHaveLength(1);
    expect(c.nodes[0]).toMatchObject({ kind: 'home', max: 10000, name: 'Haus', key: 'home' });
  });
  test('feste Reihenfolge solar, grid, battery, home, extras', () => {
    const c = normalizeConfig({
      ...base,
      home: { entity: 'sensor.h' },
      extras: [{ entity: 'sensor.e' }],
      battery: { entity: 'sensor.b' },
      grid: { entity: 'sensor.g' },
      solar: { entity: 'sensor.s' },
    });
    expect(c.nodes.map((n) => n.key)).toEqual(['solar', 'grid', 'battery', 'home', 'extra-0']);
  });
  test('Hauptkreis ohne entity wird weggelassen', () => {
    const c = normalizeConfig({ ...base, solar: { entity: '' }, home: { entity: 'sensor.h' } });
    expect(c.nodes.map((n) => n.key)).toEqual(['home']);
  });
  test('max 0 und negativ fallen auf den Standard zurück', () => {
    const a = normalizeConfig({ ...base, solar: { entity: 'sensor.s', max: 0 } });
    const b = normalizeConfig({ ...base, solar: { entity: 'sensor.s', max: -5 } });
    expect(a.nodes[0].max).toBe(8000);
    expect(b.nodes[0].max).toBe(8000);
  });
  test('Standardmaxima je Art', () => {
    const c = normalizeConfig({
      ...base,
      grid: { entity: 'sensor.g' },
      battery: { entity: 'sensor.b' },
      extras: [{ entity: 'sensor.e' }],
    });
    expect(c.nodes.map((n) => n.max)).toEqual([10000, 5000, 3000]);
  });
  test('fehlendes oder leeres extras ergibt keine Extra-Knoten', () => {
    expect(normalizeConfig({ ...base, home: { entity: 'sensor.h' } }).nodes).toHaveLength(1);
    expect(normalizeConfig({ ...base, home: { entity: 'sensor.h' }, extras: [] }).nodes).toHaveLength(1);
  });
  test('fünf Extras bekommen Schlüssel extra-0 bis extra-4', () => {
    const extras = Array.from({ length: 5 }, (_, i) => ({ entity: `sensor.e${i}` }));
    const c = normalizeConfig({ ...base, extras });
    expect(c.nodes.map((n) => n.key)).toEqual(['extra-0', 'extra-1', 'extra-2', 'extra-3', 'extra-4']);
  });
  test('ohne irgendeine entity wird ein Fehler geworfen', () => {
    expect(() => normalizeConfig({ ...base })).toThrow(/Entität/);
  });
});

describe('color (I3)', () => {
  const c = (color: unknown) =>
    normalizeConfig({ type: 't', home: { entity: 'sensor.h', color: color as string } }).nodes[0].color;
  test('Theme-Variablenname wird übernommen', () => expect(c('pf-purple')).toBe('pf-purple'));
  test('führendes -- wird entfernt', () => expect(c('--pf-purple')).toBe('pf-purple'));
  test.each(['#ff0000', 'rgb(1,2,3)', 'red; background: x', '', 42])('ungültig: %s', (v) =>
    expect(c(v)).toBeUndefined());
});
