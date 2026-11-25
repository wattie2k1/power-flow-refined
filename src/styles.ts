import { css } from 'lit';

/** Alle Farben kommen aus Theme-Variablen (--pf-*, --energy-*). Fallbacks sind HA-Standardvariablen. */
export const cardStyles = css`
  :host {
    --pf-ring-accent: var(--pf-accent, var(--primary-color));
    --pf-ring-track: var(--pf-border, var(--divider-color));
    --pf-ring-surface: var(--pf-surface, var(--card-background-color));
    --pf-ring-text: var(--pf-text, var(--primary-text-color));
    --pf-ring-text-2: var(--pf-text-secondary, var(--secondary-text-color));
    --pf-ring-disabled: var(--pf-text-disabled, var(--disabled-text-color));
  }
  ha-card {
    padding: 12px 8px 8px;
    overflow: hidden;
  }
  .title {
    padding: 0 12px 4px;
    font-size: 15px;
    font-weight: 600;
    color: var(--pf-ring-text);
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  /* Flusslinien */
  .line {
    fill: none;
    stroke: var(--pf-ring-track);
    stroke-width: 2;
    stroke-linecap: round;
  }
  .flow {
    fill: none;
    stroke: var(--c, var(--pf-ring-accent));
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 1 13;
    animation: flow 1.2s linear infinite;
  }
  .flow.solar {
    stroke: var(--energy-solar-color, var(--pf-ring-accent));
  }
  .lane-label rect {
    fill: var(--pf-ring-surface);
    stroke: var(--pf-ring-track);
    stroke-width: 1;
  }
  .lane-label text {
    fill: var(--energy-solar-color, var(--pf-ring-accent));
    font-size: 11px;
    font-weight: 700;
    text-anchor: start;
  }
  .sun {
    color: var(--energy-solar-color, var(--pf-ring-accent));
    --mdc-icon-size: 12px;
  }
  @keyframes flow {
    to {
      stroke-dashoffset: -14;
    }
  }
  .hub {
    fill: var(--pf-surface-2, var(--ha-card-background, var(--card-background-color)));
    stroke: var(--pf-ring-track);
    stroke-width: 2;
  }

  /* Knoten */
  .node {
    cursor: pointer;
    outline: none;
    --c: var(--pf-ring-accent);
  }
  .node.solar,
  .node-line.solar {
    --c: var(--energy-solar-color, var(--pf-ring-accent));
  }
  .node.grid,
  .node-line.grid {
    --c: var(--energy-grid-consumption-color, var(--pf-ring-accent));
  }
  .node.grid.export,
  .node-line.grid.export {
    --c: var(--energy-grid-return-color, var(--pf-ring-accent));
  }
  .node.battery,
  .node-line.battery {
    --c: var(--energy-battery-in-color, var(--pf-ring-accent));
  }
  .node.battery.discharging,
  .node-line.battery.discharging {
    --c: var(--energy-battery-out-color, var(--pf-ring-accent));
  }
  .node.unavailable,
  .node-line.unavailable {
    --c: var(--pf-ring-disabled);
  }
  .bg {
    fill: var(--pf-ring-surface);
  }
  .track,
  .fill {
    fill: none;
    stroke-linecap: round;
    stroke-width: 6;
  }
  .track {
    stroke: var(--pf-ring-track);
  }
  .fill {
    stroke: var(--c);
    transition: stroke 0.25s;
  }
  .seg.solar {
    stroke: var(--energy-solar-color, var(--pf-ring-accent));
  }
  .seg.battery {
    stroke: var(--energy-battery-out-color, var(--pf-ring-accent));
  }
  .seg.grid {
    stroke: var(--energy-grid-consumption-color, var(--pf-ring-accent));
  }
  .fill.seg {
    stroke-linecap: butt;
  }
  .sub.solar-share {
    text-anchor: start;
    fill: var(--energy-solar-color, var(--pf-ring-text-2));
    font-weight: 600;
  }
  .node.extra .track,
  .node.extra .fill {
    stroke-width: 5;
  }
  .node:hover .track {
    stroke: var(--pf-surface-3, var(--pf-ring-track));
  }
  .node:focus-visible .bg {
    stroke: var(--pf-ring-accent);
    stroke-width: 2;
  }
  .icon {
    color: var(--c);
    --mdc-icon-size: 20px;
  }
  .node.extra .icon {
    --mdc-icon-size: 16px;
  }
  .value {
    fill: var(--pf-ring-text);
    font-size: 18px;
    font-weight: 700;
    text-anchor: middle;
  }
  .node.extra .value {
    font-size: 14px;
  }
  .unit {
    fill: var(--pf-ring-text-2);
    font-size: 11px;
    font-weight: 500;
  }
  .node.unavailable .value {
    fill: var(--pf-ring-disabled);
  }
  .sub {
    fill: var(--pf-ring-text-2);
    font-size: 11px;
    text-anchor: middle;
  }
  .name {
    fill: var(--pf-text-label, var(--pf-ring-text-2));
    font-size: 13px;
    text-anchor: middle;
  }
  .node.extra .name {
    font-size: 11px;
  }

  @media (prefers-reduced-motion: reduce) {
    .flow {
      animation: none;
    }
    .fill {
      transition: none;
    }
  }
`;
