import { describe, expect, test } from 'vitest';
import { addExtra, moveExtra, removeExtra, setField } from '../src/logic/editor-ops';
import type { CardConfig } from '../src/types';

const cfg = (): CardConfig => ({
  type: 'custom:power-flow-refined',
  solar: { entity: 'sensor.a', max: 8000 },
  extras: [{ entity: 'sensor.e0' }, { entity: 'sensor.e1' }, { entity: 'sensor.e2' }],
});

describe('setField', () => {
  test('setzt den Wert ohne die Eingabe zu verändern', () => {
    const c = cfg();
    const n = setField(c, ['solar', 'entity'], 'sensor.x');
    expect(n.solar?.entity).toBe('sensor.x');
    expect(c.solar?.entity).toBe('sensor.a');
  });
  test('leerer Wert entfernt den Schlüssel', () => {
    const n = setField(cfg(), ['solar', 'max'], '');
    expect('max' in (n.solar ?? {})).toBe(false);
  });
  test('legt fehlende Objekte an', () => {
    const n = setField({ type: 't' }, ['grid', 'entity'], 'sensor.g');
    expect(n.grid).toEqual({ entity: 'sensor.g' });
  });
  test('false bleibt erhalten (Schalter aus)', () => {
    const n = setField(cfg(), ['solar', 'invert'], false);
    expect(n.solar?.invert).toBe(false);
  });
  test('Pfad in extras per Index', () => {
    const n = setField(cfg(), ['extras', 1, 'name'], 'Auto');
    expect(n.extras?.[1].name).toBe('Auto');
    expect(n.extras?.[0].name).toBeUndefined();
  });
});

describe('Zusatzkreise', () => {
  test('addExtra hängt einen leeren Eintrag an', () => {
    expect(addExtra(cfg()).extras).toHaveLength(4);
    expect(addExtra({ type: 't' }).extras).toEqual([{ entity: '' }]);
  });
  test('removeExtra entfernt den richtigen Index', () => {
    expect(removeExtra(cfg(), 1).extras?.map((e) => e.entity)).toEqual(['sensor.e0', 'sensor.e2']);
  });
  test('moveExtra verschiebt', () => {
    expect(moveExtra(cfg(), 1, -1).extras?.map((e) => e.entity)).toEqual(['sensor.e1', 'sensor.e0', 'sensor.e2']);
  });
  test('moveExtra am Rand ändert nichts', () => {
    const order = (c: CardConfig) => c.extras?.map((e) => e.entity);
    expect(order(moveExtra(cfg(), 0, -1))).toEqual(order(cfg()));
    expect(order(moveExtra(cfg(), 2, 1))).toEqual(order(cfg()));
  });
});
