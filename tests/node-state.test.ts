import { describe, expect, test } from 'vitest';
import { normalizeConfig } from '../src/logic/config';
import { resolveNode } from '../src/logic/node-state';
import type { CardConfig, NodeKind } from '../src/types';

type States = Record<string, { state: string; attributes: Record<string, unknown> } | undefined>;
const st = (state: string, unit?: string) => ({ state, attributes: unit ? { unit_of_measurement: unit } : {} });

function node(kind: Exclude<NodeKind, 'extra'> | 'extra', cfg: Record<string, unknown>) {
  const raw: CardConfig =
    kind === 'extra'
      ? { type: 't', extras: [{ entity: 'sensor.main', ...cfg }] }
      : ({ type: 't', [kind]: { entity: 'sensor.main', ...cfg } } as CardConfig);
  return normalizeConfig(raw).nodes[0];
}

describe('nicht verfügbar', () => {
  test('Entität fehlt', () =>
    expect(resolveNode({}, node('solar', {}))).toMatchObject({ available: false, watts: 0, dir: 'idle', fraction: 0 }));
  test.each(['unknown', 'unavailable', '', 'Unbekannt'])('Zustand "%s"', (s) =>
    expect(resolveNode({ 'sensor.main': st(s) }, node('solar', {})).available).toBe(false));
});

describe('Solar', () => {
  test('2400 W', () => {
    const r = resolveNode({ 'sensor.main': st('2400', 'W') }, node('solar', {}));
    expect(r).toMatchObject({ available: true, watts: 2400, dir: 'to-center', fraction: 0.3 });
  });
  test('2,4 kW', () =>
    expect(resolveNode({ 'sensor.main': st('2.4', 'kW') }, node('solar', {})).watts).toBe(2400));
  test('5 ohne Einheit liegt unter der Ruhe-Schwelle', () => {
    const r = resolveNode({ 'sensor.main': st('5') }, node('solar', {}));
    expect(r).toMatchObject({ watts: 5, dir: 'idle' });
  });
});

describe('Netz', () => {
  test('Bezug', () =>
    expect(resolveNode({ 'sensor.main': st('1247') }, node('grid', {}))).toMatchObject({ mode: 'import', dir: 'to-center' }));
  test('negativer Wert ohne export_entity ist Einspeisung', () =>
    expect(resolveNode({ 'sensor.main': st('-800') }, node('grid', {}))).toMatchObject({ mode: 'export', dir: 'from-center' }));
  test('export_entity überschreibt', () => {
    const s: States = { 'sensor.main': st('0'), 'sensor.exp': st('1500') };
    expect(resolveNode(s, node('grid', { export_entity: 'sensor.exp' }))).toMatchObject({
      watts: -1500,
      mode: 'export',
      dir: 'from-center',
    });
  });
});

describe('Batterie', () => {
  test('negativ = Laden', () =>
    expect(resolveNode({ 'sensor.main': st('-1100') }, node('battery', {}))).toMatchObject({
      mode: 'charging',
      dir: 'from-center',
    }));
  test('invert kehrt um', () =>
    expect(resolveNode({ 'sensor.main': st('-1100') }, node('battery', { invert: true }))).toMatchObject({
      mode: 'discharging',
      dir: 'to-center',
    }));
  test('SoC bestimmt den Ring', () => {
    const s: States = { 'sensor.main': st('0'), 'sensor.soc': st('8') };
    expect(resolveNode(s, node('battery', { soc_entity: 'sensor.soc' }))).toMatchObject({ soc: 8, fraction: 0.08 });
  });
  test('SoC 140 wird 100, -3 wird 0', () => {
    const hi = resolveNode({ 'sensor.main': st('0'), 'sensor.soc': st('140') }, node('battery', { soc_entity: 'sensor.soc' }));
    const lo = resolveNode({ 'sensor.main': st('0'), 'sensor.soc': st('-3') }, node('battery', { soc_entity: 'sensor.soc' }));
    expect(hi.soc).toBe(100);
    expect(lo.soc).toBe(0);
  });
  test('ungültiger SoC: Ring aus Leistung', () => {
    const s: States = { 'sensor.main': st('-2500'), 'sensor.soc': st('unknown') };
    expect(resolveNode(s, node('battery', { soc_entity: 'sensor.soc' })).fraction).toBe(0.5);
  });
});

describe('Haus und Extras', () => {
  test('Haus fließt von der Mitte weg', () =>
    expect(resolveNode({ 'sensor.main': st('1900') }, node('home', {})).dir).toBe('from-center'));
  test('Extra mit ring soc', () => {
    const s: States = { 'sensor.main': st('3700'), 'sensor.ev_soc': st('55') };
    expect(resolveNode(s, node('extra', { ring: 'soc', ring_entity: 'sensor.ev_soc' }))).toMatchObject({
      fraction: 0.55,
      watts: 3700,
      dir: 'from-center',
    });
  });
});

describe('Haus: Zusatzkreise abziehen', () => {
  const home = () => node('home', { subtract_extras: true });
  test('zieht übergebene Leistung ab', () => {
    const r = resolveNode({ 'sensor.main': st('3000', 'W') }, home(), 1800);
    expect(r).toMatchObject({ watts: 1200, dir: 'from-center', fraction: 0.12 });
  });
  test('wird nie negativ', () =>
    expect(resolveNode({ 'sensor.main': st('500', 'W') }, home(), 1800)).toMatchObject({ watts: 0, dir: 'idle' }));
  test('ohne Option bleibt der Wert unverändert', () =>
    expect(resolveNode({ 'sensor.main': st('3000', 'W') }, node('home', {}), 1800).watts).toBe(3000));
  test('nicht verfügbar bleibt nicht verfügbar', () =>
    expect(resolveNode({}, home(), 1800).available).toBe(false));
});
