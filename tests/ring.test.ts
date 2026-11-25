import { describe, expect, test } from 'vitest';
import { arcPath, arcSegment, polar, ringFraction } from '../src/logic/ring';

describe('ringFraction', () => {
  test('Hälfte', () => expect(ringFraction(5000, 10000)).toBe(0.5));
  test('negativer Wert nutzt den Betrag', () => expect(ringFraction(-5000, 10000)).toBe(0.5));
  test('klemmt auf 1', () => expect(ringFraction(20000, 10000)).toBe(1));
  test('max 0 gibt 0', () => expect(ringFraction(100, 0)).toBe(0));
  test('negatives max gibt 0', () => expect(ringFraction(100, -5)).toBe(0));
  test('NaN gibt 0', () => expect(ringFraction(NaN, 100)).toBe(0));
});

describe('polar', () => {
  test('0 Grad liegt rechts', () => {
    const p = polar(0, 0, 10, 0);
    expect(p.x).toBeCloseTo(10, 6);
    expect(p.y).toBeCloseTo(0, 6);
  });
  test('90 Grad liegt unten', () => {
    const p = polar(0, 0, 10, 90);
    expect(p.x).toBeCloseTo(0, 6);
    expect(p.y).toBeCloseTo(10, 6);
  });
});

describe('arcPath', () => {
  test('Bruchteil 0 gibt leeren Pfad', () => expect(arcPath(0, 0, 10, 0)).toBe(''));
  test('voller Ring (256 Grad) hat Large-Arc-Flag 1', () => {
    const d = arcPath(0, 0, 10, 1);
    expect(d.startsWith('M ')).toBe(true);
    expect(d).toMatch(/A 10 10 0 1 1 /);
  });
  test('Viertel (64 Grad) hat Large-Arc-Flag 0', () =>
    expect(arcPath(0, 0, 10, 0.25)).toMatch(/A 10 10 0 0 1 /));
});

describe('arcSegment', () => {
  test('von 0 entspricht arcPath', () => expect(arcSegment(0, 0, 10, 0, 0.4)).toBe(arcPath(0, 0, 10, 0.4)));
  test('leeres Stück gibt leeren Pfad', () => expect(arcSegment(0, 0, 10, 0.3, 0.3)).toBe(''));
  test('beginnt dort, wo das vorige Stück endet', () => {
    const first = arcPath(0, 0, 10, 0.3).split(' ').slice(-2).join(' ');
    expect(arcSegment(0, 0, 10, 0.3, 0.6).startsWith(`M ${first}`)).toBe(true);
  });
});
