import { PowerFlowRefined } from './power-flow-refined';
import { PowerFlowRefinedEditor } from './power-flow-refined-editor';

if (!customElements.get('power-flow-refined')) {
  customElements.define('power-flow-refined', PowerFlowRefined);
}

if (!customElements.get('power-flow-refined-editor')) {
  customElements.define('power-flow-refined-editor', PowerFlowRefinedEditor);
}

const w = window as unknown as { customCards?: Array<Record<string, unknown>> };
w.customCards = w.customCards || [];
if (!w.customCards.some((c) => c.type === 'power-flow-refined')) {
  w.customCards.push({
    type: 'power-flow-refined',
    name: 'Power Flow Refined',
    description: 'Energiefluss mit Ringen um Solar, Netz, Batterie, Haus und Zusatzkreise',
    preview: false,
  });
}
