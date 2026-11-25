import { LitElement, html, nothing, svg, type PropertyValues } from 'lit';
import { normalizeConfig } from './logic/config';
import { connectorPoints, labelPoint, layoutHeight, layoutHub, layoutNodes, offsetPolyline, VIEW_WIDTH, type LaidOutNode } from './logic/layout';
import { resolveNode, type NodeState } from './logic/node-state';
import { arcPath, arcSegment } from './logic/ring';
import { computeMix, sinkShares, type Mix, type SinkShare } from './logic/solar-share';
import { formatPower } from './logic/units';
import { cardStyles } from './styles';
import type { CardConfig, NormalizedConfig, NormalizedNode } from './types';

interface HassState {
  state: string;
  attributes: Record<string, unknown>;
}
interface Hass {
  states: Record<string, HassState | undefined>;
  locale?: { language?: string };
  language?: string;
}

const HUB_R = 16;
/** Unter dieser Leistung wird eine Solar-/Rest-Spur nicht gezeichnet. */
const LANE_MIN_W = 10;

function watchedEntities(node: NormalizedNode): string[] {
  return [node.entity, node.export_entity, node.soc_entity, node.ring_entity].filter(
    (e): e is string => !!e,
  );
}

function fire(el: HTMLElement, type: string, detail: unknown) {
  el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

export class PowerFlowRefined extends LitElement {
  static styles = cardStyles;
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass?: Hass;
  _config?: NormalizedConfig;

  static getConfigElement() {
    return document.createElement('power-flow-refined-editor');
  }

  static getStubConfig(): CardConfig {
    return {
      type: 'custom:power-flow-refined',
      solar: { entity: 'sensor.evcc_pv_power', max: 8000 },
      battery: { entity: 'sensor.evcc_battery_power', soc_entity: 'sensor.evcc_battery_soc', max: 5000 },
      home: { entity: 'sensor.evcc_home_power', max: 10000 },
    };
  }

  setConfig(config: CardConfig) {
    this._config = normalizeConfig(config);
  }

  getCardSize(): number {
    if (!this._config) return 4;
    return Math.ceil(layoutHeight(layoutNodes(this._config.nodes)) / 50);
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.has('_config') || !this._config) return true;
    const old = changed.get('hass') as Hass | undefined;
    if (!old || !this.hass) return true;
    return this._config.nodes.some((n) =>
      watchedEntities(n).some((e) => old.states[e] !== this.hass!.states[e]),
    );
  }

  private _tap(node: NormalizedNode) {
    const action = node.tap_action?.action ?? 'more-info';
    if (action === 'none') return;
    if (action === 'navigate' && node.tap_action?.navigation_path) {
      history.pushState(null, '', node.tap_action.navigation_path);
      fire(window as unknown as HTMLElement, 'location-changed', { replace: false });
      return;
    }
    fire(this, 'hass-more-info', { entityId: node.entity });
  }

  private _renderLine(node: NormalizedNode, layout: LaidOutNode[], s: NodeState, share?: SinkShare, lang = 'de') {
    const pts = connectorPoints(layout, node.key);
    if (pts.length < 2) return nothing;
    const path = (p: typeof pts) => p.map((q, i) => `${i ? 'L' : 'M'} ${q.x} ${q.y}`).join(' ');
    // Flussrichtung: Pfad vom Kreis zum Hub (to-center) bzw. vom Hub zum Kreis (from-center)
    const flowPts = s.dir === 'to-center' ? [...pts].reverse() : pts;
    const style = node.color && s.available ? `--c: var(--${node.color})` : nothing;
    const wantLanes = this._config!.flow_style === 'lanes' || this._config!.flow_style === 'combined';
    const solarOn = !!share && share.solarWatts >= LANE_MIN_W;
    const restOn = !!share && share.restWatts >= LANE_MIN_W;
    if (wantLanes && share && s.dir === 'from-center' && (solarOn || restOn)) {
      const both = solarOn && restOn;
      const lane = (cls: string, d: number) =>
        svg`<path class="flow ${cls}" d=${path(both ? offsetPolyline(pts, d) : pts)}></path>`;
      let label: unknown = nothing;
      if (solarOn) {
        const p = pts.length > 2 ? labelPoint([pts[1], pts[2]], 0.5) : labelPoint(pts, 0.6);
        const f = formatPower(share.solarWatts, 'W', lang);
        const text = `\u2600\uFE0E ${f.text} ${f.unit}`;
        const w = text.length * 6.4 + 10;
        label = svg`<g class="lane-label">
          <rect x=${p.x - w / 2} y=${p.y - 8} width=${w} height="16" rx="8"></rect>
          <text x=${p.x} y=${p.y + 4}>${text}</text>
        </g>`;
      }
      return svg`
        <g class="node-line ${node.kind} ${s.mode ?? ''}" style=${style}>
          <path class="line" d=${path(pts)}></path>
          ${solarOn ? lane('solar', -2) : nothing}
          ${restOn ? lane('rest', 2) : nothing}
          ${label}
        </g>`;
    }
    return svg`
      <g class="node-line ${node.kind} ${s.mode ?? ''} ${s.available ? '' : 'unavailable'}" style=${style}>
        <path class="line" d=${path(pts)}></path>
        ${s.dir !== 'idle' ? svg`<path class="flow" d=${path(flowPts)}></path>` : nothing}
      </g>`;
  }

  private _renderNode(node: NormalizedNode, pos: LaidOutNode, s: NodeState, lang: string, share?: SinkShare, mix?: Mix) {
    const { cx, cy, r } = pos;
    const track = arcPath(cx, cy, r - 4, 1);
    const fill = s.available ? arcPath(cx, cy, r - 4, s.fraction) : '';
    const power = s.available ? formatPower(s.watts, 'W', lang) : undefined;
    const iconSize = node.kind === 'extra' ? 16 : 20;
    const wantRing = this._config!.flow_style === 'ring' || this._config!.flow_style === 'combined';
    const split = wantRing && !!share && !!mix && share.splitRing && s.fraction > 0;
    const r4 = r - 4;
    const segs = split
      ? [
          ['solar', 0, s.fraction * mix!.solar],
          ['battery', s.fraction * mix!.solar, s.fraction * (mix!.solar + mix!.battery)],
          ['grid', s.fraction * (mix!.solar + mix!.battery), s.fraction],
        ]
      : [];
    const cls = ['node', node.kind, s.mode ?? '', s.available ? '' : 'unavailable'].join(' ').replace(/\s+/g, ' ');
    return svg`
      <g class=${cls} style=${node.color && s.available ? `--c: var(--${node.color})` : nothing} role="button" tabindex="0" aria-label=${node.name}
         @click=${() => this._tap(node)}
         @keydown=${(e: KeyboardEvent) => {
           if (e.key === 'Enter' || e.key === ' ') {
             e.preventDefault();
             this._tap(node);
           }
         }}>
        <circle class="bg" cx=${cx} cy=${cy} r=${r}></circle>
        <path class="track" d=${track}></path>
        ${split
          ? segs.map(([k, a, b]) => svg`<path class="fill seg ${k}" d=${arcSegment(cx, cy, r4, a as number, b as number)}></path>`)
          : fill
            ? svg`<path class="fill" d=${fill}></path>`
            : nothing}
        <foreignObject x=${cx - iconSize / 2} y=${cy - r * 0.62} width=${iconSize} height=${iconSize}>
          <ha-icon class="icon" .icon=${node.icon}></ha-icon>
        </foreignObject>
        <text class="value" x=${cx} y=${cy + (node.kind === 'extra' ? 8 : 10)}>
          ${power
            ? svg`<tspan>${power.text}</tspan><tspan class="unit" dx="3">${power.unit}</tspan>`
            : svg`<tspan>–</tspan>`}
        </text>
        ${s.soc !== undefined
          ? svg`<text class="sub" x=${cx} y=${cy + r - 2}>${Math.round(s.soc)} %</text>`
          : split
            ? svg`<text class="sub solar-share" x=${cx} y=${cy + r - 2}>\u2600\uFE0E ${Math.round(mix!.solar * 100)} %</text>`
            : nothing}
        <text class="name" x=${cx} y=${cy + r + (node.kind === 'extra' ? 16 : 20)}>${node.name}</text>
      </g>`;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const lang = this.hass.locale?.language ?? this.hass.language ?? 'de';
    const nodes = this._config.nodes;
    const layout = layoutNodes(nodes);
    const posByKey = new Map(layout.map((p) => [p.key, p]));
    const hub = layoutHub(layout);
    const extraWatts = nodes.reduce(
      (sum, n) => (n.kind === 'extra' ? sum + Math.max(0, resolveNode(this.hass!.states, n).watts) : sum),
      0,
    );
    const states = nodes.map((n) => resolveNode(this.hass!.states, n, extraWatts));
    const height = layoutHeight(layout);
    const mix = this._config.flow_style === 'classic' ? undefined : computeMix(nodes, states);
    const shares = mix ? sinkShares(nodes, states, mix) : new Map<string, SinkShare>();
    const hasMain = nodes.some((n) => n.kind !== 'extra');
    return html`
      <ha-card>
        ${this._config.title ? html`<div class="title">${this._config.title}</div>` : nothing}
        <svg viewBox="0 0 ${VIEW_WIDTH} ${height}" role="group" aria-label=${this._config.title ?? 'Energiefluss'}>
          ${nodes.map((n, i) => this._renderLine(n, layout, states[i], shares.get(n.key), lang))}
          ${hasMain && nodes.length > 1 ? svg`<circle class="hub" cx=${hub.cx} cy=${hub.cy} r=${HUB_R}></circle>` : nothing}
          ${nodes.map((n, i) => this._renderNode(n, posByKey.get(n.key)!, states[i], lang, shares.get(n.key), mix))}
        </svg>
      </ha-card>
    `;
  }
}
