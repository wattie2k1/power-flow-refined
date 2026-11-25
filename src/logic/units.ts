export function toWatts(value: number, unit?: string): number {
  return unit?.trim().toLowerCase() === 'kw' ? value * 1000 : value;
}

export function formatPower(
  value: number,
  unit?: string,
  lang = 'de',
): { text: string; unit: 'W' | 'kW' } {
  const watts = Math.abs(toWatts(value, unit));
  if (watts >= 1000) {
    const text = new Intl.NumberFormat(lang, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(watts / 1000);
    return { text, unit: 'kW' };
  }
  return { text: new Intl.NumberFormat(lang, { maximumFractionDigits: 0 }).format(watts), unit: 'W' };
}
