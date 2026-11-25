import type { CardConfig, FlowStyle, NodeConfig, NodeKind, NormalizedConfig, NormalizedNode } from '../types';

const DEFAULTS: Record<NodeKind, { name: string; icon: string; max: number }> = {
  solar: { name: 'Solar', icon: 'mdi:solar-power', max: 8000 },
  grid: { name: 'Netz', icon: 'mdi:transmission-tower', max: 10000 },
  battery: { name: 'Batterie', icon: 'mdi:battery', max: 5000 },
  home: { name: 'Haus', icon: 'mdi:home', max: 10000 },
  extra: { name: 'Zusatz', icon: 'mdi:flash', max: 3000 },
};

const STYLES: FlowStyle[] = ['classic', 'ring', 'lanes', 'combined'];
const MAIN: Array<Exclude<NodeKind, 'extra'>> = ['solar', 'grid', 'battery', 'home'];

/** Nur Theme-Variablennamen zulassen (kein Hex, keine freien CSS-Werte). */
function validColor(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const name = v.replace(/^--/, '');
  return /^[a-z][a-z0-9-]*$/i.test(name) ? name : undefined;
}

function build(key: string, kind: NodeKind, cfg: NodeConfig, fallbackName: string): NormalizedNode {
  const d = DEFAULTS[kind];
  const max = typeof cfg.max === 'number' && Number.isFinite(cfg.max) && cfg.max > 0 ? cfg.max : d.max;
  return {
    ...cfg,
    key,
    kind,
    name: cfg.name || fallbackName,
    icon: cfg.icon || d.icon,
    max,
    invert: !!cfg.invert,
    color: validColor(cfg.color),
  };
}

export function normalizeConfig(raw: CardConfig): NormalizedConfig {
  const nodes: NormalizedNode[] = [];
  for (const kind of MAIN) {
    const cfg = raw?.[kind];
    if (cfg?.entity) nodes.push(build(kind, kind, cfg, DEFAULTS[kind].name));
  }
  (raw?.extras ?? []).forEach((cfg, i) => {
    if (cfg?.entity) nodes.push(build(`extra-${i}`, 'extra', cfg, `${DEFAULTS.extra.name} ${i + 1}`));
  });
  if (nodes.length === 0) {
    throw new Error('Mindestens ein Kreis mit einer Entität muss konfiguriert sein (z. B. home.entity).');
  }
  const style = raw.flow_style ?? 'classic';
  if (!STYLES.includes(style)) {
    throw new Error(`flow_style muss einer von ${STYLES.join(', ')} sein (war: ${String(style)}).`);
  }
  return { title: raw.title, flow_style: style, nodes };
}
