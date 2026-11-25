export type NodeKind = 'solar' | 'grid' | 'battery' | 'home' | 'extra';

export interface TapAction {
  action: 'more-info' | 'navigate' | 'none';
  navigation_path?: string;
}

export interface NodeConfig {
  entity: string;
  name?: string;
  icon?: string;
  /** Name einer Theme-Variable ohne --, z. B. pf-purple */
  color?: string;
  max?: number;
  invert?: boolean;
  /** nur Haus: Leistung der Zusatzkreise vom Hauswert abziehen */
  subtract_extras?: boolean;
  /** nur Netz: Einspeiseleistung */
  export_entity?: string;
  /** nur Batterie */
  soc_entity?: string;
  /** nur extras */
  ring?: 'power' | 'soc';
  /** nur extras mit ring: soc */
  ring_entity?: string;
  tap_action?: TapAction;
}

export interface CardConfig {
  type: string;
  title?: string;
  solar?: NodeConfig;
  grid?: NodeConfig;
  battery?: NodeConfig;
  home?: NodeConfig;
  extras?: NodeConfig[];
}

export interface NormalizedNode extends NodeConfig {
  key: string;
  kind: NodeKind;
  name: string;
  icon: string;
  max: number;
  invert: boolean;
}

export interface NormalizedConfig {
  title?: string;
  nodes: NormalizedNode[];
}
