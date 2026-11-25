import { describe, expect, test } from 'vitest';
import { formatPower, toWatts } from '../src/logic/units';

describe('toWatts', () => {
  test('rechnet kW in W um', () => expect(toWatts(1.2, 'kW')).toBe(1200));
  test('lässt W unverändert', () => expect(toWatts(850, 'W')).toBe(850));
  test('nimmt ohne Einheit W an', () => expect(toWatts(850, undefined)).toBe(850));
});

describe('formatPower', () => {
  test('unter 1000 W ganze Zahl in W', () =>
    expect(formatPower(850, 'W')).toEqual({ text: '850', unit: 'W' }));
  test('ab 1000 W kW mit Dezimalkomma', () =>
    expect(formatPower(1247, 'W')).toEqual({ text: '1,2', unit: 'kW' }));
  test('0,85 kW wird 850 W', () =>
    expect(formatPower(0.85, 'kW')).toEqual({ text: '850', unit: 'W' }));
  test('negativer Wert nutzt den Betrag', () =>
    expect(formatPower(-1500, 'W')).toEqual({ text: '1,5', unit: 'kW' }));
  test('null', () => expect(formatPower(0, 'W')).toEqual({ text: '0', unit: 'W' }));
});
