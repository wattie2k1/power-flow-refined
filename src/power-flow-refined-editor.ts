import { LitElement, css, html, nothing } from 'lit';
import { addExtra, moveExtra, removeExtra, setField } from './logic/editor-ops';
import type { CardConfig, NodeConfig } from './types';

type Selector = Record<string, unknown>;
interface Field {
  key: keyof NodeConfig;
  label: string;
  selector: Selector;
  /** nur anzeigen, wenn diese Bedingung für den Knoten gilt */
  when?: (node: Partial<NodeConfig>) => boolean;
}

const COMMON: Field[] = [
  { key: 'entity', label: 'Entität (Leistung)', selector: { entity: {} } },
  { key: 'name', label: 'Name', selector: { text: {} } },
  { key: 'icon', label: 'Icon', selector: { icon: {} } },
  { key: 'color', label: 'Farbe (Theme-Variable, z. B. pf-purple)', selector: { text: {} } },
  { key: 'max', label: 'Maximum (W) für den Ring', selector: { number: { mode: 'box', min: 1, step: 100 } } },
  { key: 'invert', label: 'Vorzeichen umkehren', selector: { boolean: {} } },
];

const SECTIONS: Array<{ key: 'solar' | 'grid' | 'battery' | 'home'; title: string; extra: Field[] }> = [
  { key: 'solar', title: 'Solar', extra: [] },
  {
    key: 'grid',
    title: 'Netz',
    extra: [{ key: 'export_entity', label: 'Entität Einspeiseleistung (optional)', selector: { entity: {} } }],
  },
  {
    key: 'battery',
    title: 'Batterie',
    extra: [{ key: 'soc_entity', label: 'Entität Ladestand (SoC, für den Ring)', selector: { entity: {} } }],
  },
  {
    key: 'home',
    title: 'Haus',
    extra: [
      { key: 'subtract_extras', label: 'Leistung der Zusatzkreise abziehen', selector: { boolean: {} } },
    ],
  },
];

const EXTRA_FIELDS: Field[] = [
  ...COMMON,
  {
    key: 'ring',
    label: 'Ring zeigt',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: 'power', label: 'Leistung' },
          { value: 'soc', label: 'Ladestand (SoC)' },
        ],
      },
    },
  },
  {
    key: 'ring_entity',
    label: 'Entität Ladestand (SoC)',
    selector: { entity: {} },
    when: (n) => n.ring === 'soc',
  },
];

export class PowerFlowRefinedEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass?: unknown;
  _config?: CardConfig;

  static styles = css`
    :host {
      display: block;
    }
    details {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      margin-bottom: 8px;
      padding: 0 12px;
    }
    summary {
      cursor: pointer;
      padding: 12px 0;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .fields {
      display: grid;
      gap: 6px;
      padding-bottom: 12px;
    }
    .row {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
    }
    button {
      background: transparent;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 6px 10px;
      cursor: pointer;
      font: inherit;
    }
    button:hover {
      border-color: var(--primary-color);
    }
    .add {
      width: 100%;
      margin-top: 4px;
    }
  `;

  setConfig(config: CardConfig) {
    this._config = config;
  }

  private _commit(next: CardConfig) {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config: next }, bubbles: true, composed: true }),
    );
  }

  private _field(path: Array<string | number>, f: Field, node: Partial<NodeConfig>) {
    if (f.when && !f.when(node)) return nothing;
    const value = node[f.key];
    return html`<ha-selector
      .hass=${this.hass}
      .label=${f.label}
      .required=${f.key === 'entity'}
      .selector=${f.selector}
      .value=${value}
      @value-changed=${(e: CustomEvent) => {
        e.stopPropagation();
        const v = e.detail.value;
        this._commit(setField(this._config!, [...path, f.key], v));
      }}
    ></ha-selector>`;
  }

  protected render() {
    if (!this._config) return nothing;
    const cfg = this._config;
    const extras = cfg.extras ?? [];
    return html`
      <div class="fields" style="margin-bottom: 12px">
        <ha-selector
          .hass=${this.hass}
          .label=${'Titel (optional)'}
          .required=${false}
          .selector=${{ text: {} }}
          .value=${cfg.title}
          @value-changed=${(e: CustomEvent) => {
            e.stopPropagation();
            this._commit(setField(cfg, ['title'], e.detail.value));
          }}
        ></ha-selector>
      </div>
      ${SECTIONS.map(
        (s) => html`
          <details ?open=${!!cfg[s.key]?.entity}>
            <summary>${s.title}</summary>
            <div class="fields">
              ${[...COMMON, ...s.extra].map((f) => this._field([s.key], f, cfg[s.key] ?? {}))}
            </div>
          </details>
        `,
      )}
      <h3>Zusatzkreise</h3>
      ${extras.map(
        (x, i) => html`
          <details open>
            <summary>${x.name || `Zusatzkreis ${i + 1}`}</summary>
            <div class="fields">
              ${EXTRA_FIELDS.map((f) => this._field(['extras', i], f, x))}
              <div class="row">
                <span>
                  <button type="button" @click=${() => this._commit(moveExtra(cfg, i, -1))} ?disabled=${i === 0}>
                    ↑
                  </button>
                  <button
                    type="button"
                    @click=${() => this._commit(moveExtra(cfg, i, 1))}
                    ?disabled=${i === extras.length - 1}
                  >
                    ↓
                  </button>
                </span>
                <button type="button" @click=${() => this._commit(removeExtra(cfg, i))}>Entfernen</button>
              </div>
            </div>
          </details>
        `,
      )}
      <button class="add" type="button" @click=${() => this._commit(addExtra(cfg))}>
        + Zusatzkreis hinzufügen
      </button>
    `;
  }
}
