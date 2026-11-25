import type { CardConfig } from '../types';

type Path = Array<string | number>;

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/** Setzt ein Feld in einer Kopie der Konfiguration; '', undefined und null entfernen den Schlüssel. */
export function setField(config: CardConfig, path: Path, value: unknown): CardConfig {
  const next = clone(config) as unknown as Record<string | number, unknown>;
  let cur: Record<string | number, unknown> = next;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (typeof cur[key] !== 'object' || cur[key] === null) {
      cur[key] = typeof path[i + 1] === 'number' ? [] : {};
    }
    cur = cur[key] as Record<string | number, unknown>;
  }
  const last = path[path.length - 1];
  if (value === '' || value === undefined || value === null) delete cur[last];
  else cur[last] = value;
  return next as unknown as CardConfig;
}

export function addExtra(config: CardConfig): CardConfig {
  const next = clone(config);
  next.extras = [...(next.extras ?? []), { entity: '' }];
  return next;
}

export function removeExtra(config: CardConfig, index: number): CardConfig {
  const next = clone(config);
  next.extras = (next.extras ?? []).filter((_, i) => i !== index);
  return next;
}

export function moveExtra(config: CardConfig, index: number, delta: -1 | 1): CardConfig {
  const next = clone(config);
  const list = next.extras ?? [];
  const target = index + delta;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) return next;
  [list[index], list[target]] = [list[target], list[index]];
  next.extras = list;
  return next;
}
