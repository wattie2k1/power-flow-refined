import { describe, expect, test } from 'vitest';
import { cardStyles } from '../src/styles';

describe('Flusslinien übernehmen die Farbe ihres Kreises (I1)', () => {
  const css = cardStyles.cssText;
  test.each([
    '.node-line.solar',
    '.node-line.grid',
    '.node-line.grid.export',
    '.node-line.battery',
    '.node-line.battery.discharging',
    '.node-line.unavailable',
  ])('Selektor %s setzt --c', (sel) => {
    const re = new RegExp(`${sel.replace(/\./g, '\\.')}[^{}]*\\{[^}]*--c:`);
    expect(css).toMatch(re);
  });
});
