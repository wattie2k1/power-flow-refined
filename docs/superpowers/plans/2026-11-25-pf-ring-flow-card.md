# pf-ring-flow-card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine Home-Assistant-Karte `custom:pf-ring-flow-card`, die Solar, Netz, Batterie und Haus (plus optionale Zusatzkreise) als Kreise mit offenem 256°-Ring und animierten Flusslinien zeigt, optisch komplett aus dem Theme „Power Flow“.

**Architecture:** Reine Logik (Einheiten, Ringgeometrie, Konfiguration, Knotenzustand) liegt in `src/logic/` und wird per Vitest getestet. Die Lit-Karte rendert daraus SVG in einer `ha-card`; der Editor ist ein zweites Lit-Element. Esbuild bündelt alles zu einer Datei, die per SSH nach `/config/www/pf-ring-flow-card/` kopiert wird.

**Tech Stack:** TypeScript, Lit 3, esbuild, Vitest, Node 26/npm (lokal vorhanden).

**Spec:** `docs/superpowers/specs/2026-11-25-pf-ring-flow-card-design.md`

## Global Constraints

- Karte heißt `pf-ring-flow-card`, Editor `pf-ring-flow-card-editor`, Eintrag in `window.customCards`.
- Ring: 256° Bogen, unten offen, Füllung = Wert / Maximum; Wert und Einheit (W/kW automatisch) in der Mitte.
- Batterie-Ring zeigt den Ladestand (SoC), die Leistung steht als Zahl.
- Hauptkreise: Solar, Netz, Batterie, Haus; Zusatzkreise nur aus `extras:`, nicht konfigurierte Kreise werden nicht gezeichnet.
- Farben ausschließlich aus Theme-Variablen (`--pf-*`, `--energy-*`); kein Hex, kein `#fff`/`rgba(255,255,255,…)`. In SVG per CSS-Klassen oder `style=`, nie per `fill=`/`stroke=`-Attribut mit `var()`.
- Rendert in einer normalen `ha-card` (Rahmen, Hover-Glow, `tabular-nums` kommt aus dem Theme-`card-mod-card`).
- Ausfall (`unavailable`/`unknown`/nicht numerisch/Entität fehlt): grauer Kreis mit „–“, Fluss aus.
- Zahlen mit Dezimalkomma, Einheit nach `unit_of_measurement` (W/kW).
- `prefers-reduced-motion`: Flussanimation aus.
- Klick auf Kreis öffnet More-Info der Entität; optional `tap_action`.
- Keine Netzwerkzugriffe, keine Laufzeit-Abhängigkeiten außer eingebundenem Lit, kein Update-Check.
- Kein Code und keine Grafiken aus `hrudkaav/deye-lcd-tehnika` (CC BY-NC-SA).
- Bundle-Datei: `/config/www/pf-ring-flow-card/pf-ring-flow-card.js`, Ressource `type: module` mit `?v=`-Version (HA cached `/local/` 31 Tage).
- Projektordner: `pf-ring-flow-card` (Git-Repo).

## Review Focus

1. Konfigurierte Entität existiert nicht in `hass.states` (Tippfehler): grauer Kreis „–“, kein Fehler in der Konsole. → Task 5.
2. Zustand ist `unknown`, `unavailable`, leer oder Text („Unbekannt“): wie Ausfall behandeln. → Task 5.
3. `unit_of_measurement` ist `kW`, `W` oder fehlt (dann W annehmen): richtige Umrechnung, 0,85 kW wird „850 W“. → Task 2 und 5.
4. `max` fehlt, 0 oder negativ: kein Teilen durch null, Ring bleibt leer statt `NaN`. → Task 3 und 4.
5. SoC außerhalb 0–100, negative Leistung bei Netz/Batterie und mehr als vier Zusatzkreise: Werte klemmen, Richtung stimmt, Layout bricht nicht. → Task 3, 5 und 6.

---

## Dateistruktur

```
package.json, tsconfig.json, esbuild.mjs, vitest.config.ts, .gitignore, README.md
src/index.ts                      Registrierung, window.customCards
src/types.ts                      Konfigurations- und Zustandstypen
src/logic/units.ts                formatPower
src/logic/ring.ts                 Ringgeometrie
src/logic/config.ts               normalizeConfig
src/logic/node-state.ts           resolveNode (hass + Konfig -> NodeState)
src/pf-ring-flow-card.ts          Lit-Karte (Layout, SVG, Klick)
src/styles.ts                     CSS mit Theme-Variablen
src/pf-ring-flow-card-editor.ts   Lit-Editor
tests/*.test.ts                   je eine Testdatei pro Logikmodul
scripts/deploy.sh                 Build + Kopie nach HA
```

---

### Task 1: Projektgerüst, Build und Test-Lauf

**Files:**
- Create: `package.json`, `tsconfig.json`, `esbuild.mjs`, `vitest.config.ts`, `.gitignore`, `src/index.ts`, `tests/smoke.test.ts`
- Run: `git init` im Projektordner

**Interfaces:**
- Produces: `npm run build` erzeugt `dist/pf-ring-flow-card.js` (ein ESM-Bundle, minifiziert, inkl. Lit); `npm test` führt Vitest aus.

- [ ] **Step 1: `git init`, `.gitignore` (`node_modules`, `dist`), `npm init`, dann `npm i lit` und `npm i -D typescript esbuild vitest`**
- [ ] **Step 2: Schreibe `tests/smoke.test.ts` mit `expect(1 + 1).toBe(2)`; `npm test` läuft grün**
- [ ] **Step 3: `esbuild.mjs`: Eintrag `src/index.ts`, `bundle: true`, `format: 'esm'`, `target: 'es2021'`, `minify: true`, Ausgabe `dist/pf-ring-flow-card.js`. `tsconfig.json`: `strict`, `experimentalDecorators: true`, `useDefineForClassFields: false` (Lit-Dekoratoren). Skripte `build`, `test`, `typecheck` (`tsc --noEmit`) in `package.json`.**
- [ ] **Step 4: `src/index.ts` enthält vorerst `console.info('pf-ring-flow-card geladen')`. Run: `npm run build && ls -l dist`. Expected: Datei existiert.**
- [ ] **Step 5: Commit** (`git add -A && git commit -m "chore: project scaffold"`)

---

### Task 2: Einheiten und Zahlenformat

**Files:**
- Create: `src/logic/units.ts`
- Test: `tests/units.test.ts`

**Interfaces:**
- Produces: `formatPower(value: number, unit?: string, lang?: string): { text: string; unit: 'W' | 'kW' }` und `toWatts(value: number, unit?: string): number`.

- [ ] **Step 1: Schreibe die Tests:**
  - `toWatts(1.2, 'kW') === 1200`, `toWatts(850, 'W') === 850`, `toWatts(850, undefined) === 850`
  - `formatPower(850, 'W')` gibt `{ text: '850', unit: 'W' }`
  - `formatPower(1247, 'W')` gibt `{ text: '1,2', unit: 'kW' }` (bei `lang` Standard `'de'`)
  - `formatPower(0.85, 'kW')` gibt `{ text: '850', unit: 'W' }`
  - `formatPower(-1500, 'W')` gibt `{ text: '1,5', unit: 'kW' }` (Betrag; Richtung regelt Task 5)
  - `formatPower(0, 'W')` gibt `{ text: '0', unit: 'W' }`
- [ ] **Step 2: `npm test -- units` schlägt fehl (Modul fehlt)**
- [ ] **Step 3: Implementiere beide Funktionen. Ab 1000 W kW mit einer Nachkommastelle, `Intl.NumberFormat(lang)` für das Komma, unter 1000 W ganze Zahl.**
- [ ] **Step 4: `npm test -- units` ist grün**
- [ ] **Step 5: Commit**

---

### Task 3: Ringgeometrie

**Files:**
- Create: `src/logic/ring.ts`
- Test: `tests/ring.test.ts`

**Interfaces:**
- Produces:
  - `RING_START_DEG = 142`, `RING_SWEEP_DEG = 256` (Winkel in SVG-Grad von der +x-Achse im Uhrzeigersinn; die Lücke von 38° bis 142° liegt unten)
  - `ringFraction(value: number, max: number): number` (Betrag/Maximum, geklemmt auf 0–1; `max <= 0`, `NaN` oder nicht endlich gibt 0)
  - `polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number }`
  - `arcPath(cx: number, cy: number, r: number, fraction: number): string` (SVG-Pfad `d` vom Startwinkel über `fraction * 256°`; leerer String bei `fraction <= 0`)

- [ ] **Step 1: Schreibe die Tests:**
  - `ringFraction(5000, 10000) === 0.5`, `ringFraction(-5000, 10000) === 0.5`, `ringFraction(20000, 10000) === 1`
  - `ringFraction(100, 0) === 0`, `ringFraction(100, -5) === 0`, `ringFraction(NaN, 100) === 0`
  - `polar(0, 0, 10, 0)` ist `{ x: 10, y: 0 }` (auf 6 Stellen), `polar(0, 0, 10, 90)` ist `{ x: 0, y: 10 }`
  - `arcPath(0, 0, 10, 0) === ''`; `arcPath(0, 0, 10, 1)` beginnt mit `M ` und enthält das Large-Arc-Flag `1` (256° > 180°)
  - `arcPath(0, 0, 10, 0.25)` hat Large-Arc-Flag `0` (64°)
- [ ] **Step 2: Test schlägt fehl**
- [ ] **Step 3: Implementiere die Funktionen. Pfad: `M start A r r 0 <large> 1 end` (Sweep-Flag 1 = Uhrzeigersinn).**
- [ ] **Step 4: Test ist grün**
- [ ] **Step 5: Commit**

---

### Task 4: Konfiguration und Normalisierung

**Files:**
- Create: `src/types.ts`, `src/logic/config.ts`
- Test: `tests/config.test.ts`

**Interfaces:**
- Produces (`src/types.ts`):
  ```ts
  export type NodeKind = 'solar' | 'grid' | 'battery' | 'home' | 'extra';
  export interface NodeConfig {
    entity: string; name?: string; icon?: string; max?: number; invert?: boolean;
    export_entity?: string;   // nur Netz: Einspeiseleistung
    soc_entity?: string;      // nur Batterie
    ring?: 'power' | 'soc';   // nur extras
    ring_entity?: string;     // nur extras mit ring: soc
    tap_action?: { action: 'more-info' | 'navigate' | 'none'; navigation_path?: string };
  }
  export interface CardConfig {
    type: string; title?: string;
    solar?: NodeConfig; grid?: NodeConfig; battery?: NodeConfig; home?: NodeConfig;
    extras?: NodeConfig[];
  }
  export interface NormalizedNode extends NodeConfig {
    key: string; kind: NodeKind; name: string; icon: string; max: number; invert: boolean;
  }
  export interface NormalizedConfig { title?: string; nodes: NormalizedNode[]; }  // Hauptkreise zuerst, dann extras
  ```
- Produces (`src/logic/config.ts`): `normalizeConfig(raw: CardConfig): NormalizedConfig`; wirft `Error` mit deutscher Meldung, wenn kein einziger Kreis mit `entity` konfiguriert ist.

Standardwerte (meine Festlegung): Solar `max` 8000, Netz 10000, Batterie 5000, Haus 10000, Extras 3000; Namen „Solar“, „Netz“, „Batterie“, „Haus“, bei Extras `name` oder `Zusatz n`; Icons `mdi:solar-power`, `mdi:transmission-tower`, `mdi:battery`, `mdi:home`, Extras `mdi:flash`; Hauptkreise ohne `entity` werden weggelassen.

- [ ] **Step 1: Schreibe die Tests:**
  - Konfiguration nur mit `home.entity`: `nodes` hat genau einen Eintrag, `kind: 'home'`, `max: 10000`, `name: 'Haus'`
  - Reihenfolge `solar, grid, battery, home, extra…` unabhängig von der YAML-Reihenfolge
  - Hauptkreis `solar: {}` ohne `entity` wird nicht übernommen
  - `max: 0` und `max: -5` fallen auf den Standardwert zurück (kein Teilen durch null)
  - `extras: []` oder fehlendes `extras` ergibt keine Extra-Knoten; fünf Extras ergeben fünf Knoten mit Schlüssel `extra-0` bis `extra-4`
  - Keinerlei `entity`: `normalizeConfig` wirft einen `Error`
- [ ] **Step 2: Test schlägt fehl**
- [ ] **Step 3: Implementiere `normalizeConfig` und lege die Typen an**
- [ ] **Step 4: Test ist grün; `npm run typecheck` ist sauber**
- [ ] **Step 5: Commit**

---

### Task 5: Knotenzustand aus hass

**Files:**
- Create: `src/logic/node-state.ts`
- Test: `tests/node-state.test.ts`

**Interfaces:**
- Consumes: `NormalizedNode` (Task 4); `toWatts` (Task 2); `ringFraction` (Task 3).
- Produces:
  ```ts
  export type FlowDir = 'to-center' | 'from-center' | 'idle';
  export interface NodeState {
    available: boolean;
    watts: number;            // vorzeichenbehaftet; 0, wenn nicht verfügbar
    unit?: string;            // Originaleinheit der Hauptentität
    fraction: number;         // Ringfüllung 0–1
    dir: FlowDir;
    mode?: 'charging' | 'discharging' | 'import' | 'export';  // für Farbe
    soc?: number;             // nur Batterie bzw. ring: soc, geklemmt 0–100
  }
  export function resolveNode(states: Record<string, { state: string; attributes: Record<string, unknown> } | undefined>, node: NormalizedNode): NodeState;
  ```

Regeln (meine Festlegungen, wo die Spec schweigt):
- Nicht verfügbar, wenn die Entität fehlt oder der Zustand `unknown`, `unavailable`, leer oder nicht numerisch ist.
- Ruhe-Schwelle: |watts| < 10 gibt `dir: 'idle'`.
- Solar: Erzeugung fließt **zur Mitte**: `to-center`. Haus und Extras: `from-center`.
- Netz: `watts > 0` Bezug, `to-center`, `mode: 'import'`. Mit `export_entity` und Einspeisung > 0 ist `watts` = −Einspeisung, `from-center`, `mode: 'export'`. Ohne `export_entity` bedeutet ein negativer Wert Einspeisung.
- Batterie: positiv = Entladen (`to-center`, `mode: 'discharging'`), negativ = Laden (`from-center`, `mode: 'charging'`); `invert: true` kehrt das Vorzeichen um. Ring-Bruchteil = `soc / 100`, wenn `soc_entity` gültig, sonst Leistung/`max`.
- Extras mit `ring: 'soc'` und gültiger `ring_entity` nutzen den SoC als Ring; sonst Leistung/`max`.
- `invert` kehrt bei allen Knoten das Vorzeichen von `watts` vor der Richtungsbestimmung um.

- [ ] **Step 1: Schreibe die Tests (je ein Test pro Zeile):**
  - Entität fehlt in `states`: `{ available: false, watts: 0, dir: 'idle', fraction: 0 }`
  - Zustände `'unknown'`, `'unavailable'`, `''`, `'Unbekannt'`: `available: false`
  - Solar `'2400'` mit Einheit `W`: `watts 2400`, `dir 'to-center'`, `fraction 0.3` bei `max 8000`
  - Solar `'2.4'` mit Einheit `kW`: `watts 2400`
  - Solar `'5'` ohne Einheit: `watts 5`, `dir 'idle'` (unter Schwelle)
  - Netz `'1247'` ohne `export_entity`: `mode 'import'`, `dir 'to-center'`; Netz `'-800'`: `mode 'export'`, `dir 'from-center'`
  - Netz `'0'` mit `export_entity` `'1500'`: `watts -1500`, `mode 'export'`
  - Batterie `'-1100'`: `mode 'charging'`, `dir 'from-center'`; mit `invert: true`: `mode 'discharging'`
  - Batterie mit `soc_entity` `'8'`: `soc 8`, `fraction 0.08`; SoC `'140'` wird zu `100`, `'-3'` zu `0`
  - Batterie mit ungültigem `soc_entity` (`'unknown'`): `fraction` aus Leistung/`max`
  - Extra mit `ring: 'soc'` und `ring_entity` `'55'`: `fraction 0.55`, `watts` aus der Hauptentität
- [ ] **Step 2: Test schlägt fehl**
- [ ] **Step 3: Implementiere `resolveNode` nach den Regeln oben. Eine kleine interne Hilfsfunktion `readNumber(states, entityId)` liest Zahl und Einheit.**
- [ ] **Step 4: Test ist grün**
- [ ] **Step 5: Commit**

---

### Task 6: Karte, Layout, Flusslinien, Klick

**Files:**
- Create: `src/pf-ring-flow-card.ts`, `src/styles.ts`
- Modify: `src/index.ts` (importiert die Karte, `window.customCards.push({ type: 'pf-ring-flow-card', name: 'PF Ring Flow', description: 'Energiefluss mit Ringen', preview: false })`)
- Test: `tests/layout.test.ts` (nur die reine Layoutfunktion)

**Interfaces:**
- Consumes: `normalizeConfig` (Task 4), `resolveNode`, `NodeState` (Task 5), `formatPower` (Task 2), `arcPath`, `RING_*` (Task 3).
- Produces:
  - `class PfRingFlowCard extends LitElement` mit `setConfig(config: CardConfig): void`, `set hass(hass)`, `getCardSize(): number`, statisch `getConfigElement()` (liefert `document.createElement('pf-ring-flow-card-editor')`) und `getStubConfig()` (liefert eine Beispiel-Konfiguration mit `home.entity: 'sensor.evcc_home_power'`).
  - In `src/pf-ring-flow-card.ts` exportiert: `layoutNodes(nodes: NormalizedNode[]): Array<{ key: string; cx: number; cy: number; r: number }>` – reine Funktion; viewBox 400 breit, Hauptkreise 2×2 um die Mitte (Radius 44), Extras kleiner (Radius 32) in einer Reihe darunter, mehr als 4 Extras brechen in weitere Reihen um.

Darstellung:
- Pro Kreis: Hintergrundring (`--pf-border`), Füllbogen (Klasse je Knoten, Farbe aus `--energy-solar-color`, `--energy-grid-consumption-color`, `--energy-grid-return-color`, `--energy-battery-in-color`, `--energy-battery-out-color`, Haus `--pf-accent`, Extras `--pf-accent`), Icon über dem Wert, Name darunter, Wert in der Mitte (`font-variant-numeric: tabular-nums` kommt aus dem Theme), Einheit klein daneben; Batterie zeigt zusätzlich „SoC %“.
- Nicht verfügbar: Klasse `unavailable`, Farben `--pf-text-disabled`, Text „–“.
- Mitte: ein Knoten (kleiner Kreis, `--pf-surface-2`), von dort Linien zu jedem Kreis. Flusspunkte per CSS-Animation (`stroke-dashoffset`) entlang der Linie, Richtung nach `dir`; `idle` ohne Animation.
- `@media (prefers-reduced-motion: reduce)`: Animation aus.
- Klick: `fireEvent(this, 'hass-more-info', { entityId })`; mit `tap_action: navigate` Navigation, `none` nichts.
- Fehler aus `normalizeConfig` werden in `setConfig` weitergeworfen (HA zeigt dann die Fehlerkarte mit der Meldung).

- [ ] **Step 1: Schreibe `tests/layout.test.ts` für `layoutNodes`:**
  - Vier Hauptknoten: Positionen in einem 2×2-Raster, alle Kreise liegen innerhalb `0..400` auf der x-Achse
  - Fünf Extras: erste Reihe vier, zweite Reihe einer; keine zwei Kreise überlappen (Abstand der Mittelpunkte ≥ r1 + r2)
  - Nur `home`: genau ein Kreis, horizontal zentriert
  - Leere Liste: leeres Array
- [ ] **Step 2: Test schlägt fehl**
- [ ] **Step 3: Implementiere `layoutNodes` (rein, ohne DOM)**
- [ ] **Step 4: Test ist grün**
- [ ] **Step 5: Implementiere `PfRingFlowCard` und `src/styles.ts` nach der Darstellung oben. Alle Farben nur als CSS-Klassen/`style=`. `npm run typecheck` und `npm run build` sind sauber.**
- [ ] **Step 6: Commit**

---

### Task 7: Visueller Editor

**Files:**
- Create: `src/pf-ring-flow-card-editor.ts`
- Modify: `src/index.ts` (Import des Editors)

**Interfaces:**
- Consumes: `CardConfig`, `NodeConfig` (Task 4).
- Produces: `class PfRingFlowCardEditor extends LitElement` mit `setConfig(config: CardConfig)`, `hass`-Property; feuert bei jeder Änderung `config-changed` (`detail: { config }`, `bubbles: true`, `composed: true`).

Umfang (laut Spec):
- Pro Hauptkreis (Solar, Netz, Batterie, Haus): `ha-entity-picker` für `entity`, Zahlenfeld `max`, Schalter `invert`; Netz zusätzlich `export_entity`; Batterie zusätzlich `soc_entity`; Textfeld `icon` (`ha-icon-picker`), Textfeld `name`.
- Zusatzkreise: Liste mit Hinzufügen, Entfernen und Hoch/Runter; je Zusatzkreis `name`, `icon`, `entity`, `max`, `ring` (Leistung/SoC) und `ring_entity`.
- Editieren erzeugt keinen leeren Müll: Felder, die geleert werden, entfernen den Schlüssel aus der Konfiguration.
- Formularelemente `ha-textfield`, `ha-switch`, `ha-entity-picker`, `ha-icon-picker` stammen von HA; im Editor-Code nicht importieren, nur verwenden.

- [ ] **Step 1: Schreibe `tests/editor.test.ts` für die reinen Hilfsfunktionen, die du dafür aus dem Editor in `src/logic/editor-ops.ts` auslagerst: `setField(config, path, value)`, `addExtra(config)`, `removeExtra(config, index)`, `moveExtra(config, index, delta)`. Testfälle:**
  - `setField(cfg, ['solar', 'entity'], 'sensor.x')` setzt den Wert, ohne `cfg` zu verändern (neues Objekt)
  - `setField(cfg, ['solar', 'max'], '')` entfernt den Schlüssel `max`
  - `addExtra` hängt `{ entity: '' }` an; `removeExtra` entfernt den richtigen Index
  - `moveExtra(cfg, 0, -1)` und `moveExtra(cfg, last, +1)` ändern nichts (Randfall)
- [ ] **Step 2: Test schlägt fehl**
- [ ] **Step 3: Implementiere `src/logic/editor-ops.ts`**
- [ ] **Step 4: Test ist grün**
- [ ] **Step 5: Implementiere den Editor mit diesen Funktionen; `npm run typecheck` und `npm run build` sind sauber**
- [ ] **Step 6: Commit**

---

### Task 8: Auf Home Assistant bringen und prüfen

**Files:**
- Create: `scripts/deploy.sh`, `README.md`

**Interfaces:**
- Consumes: `dist/pf-ring-flow-card.js` aus dem Build.
- Produces: Karte in HA unter `/local/pf-ring-flow-card/pf-ring-flow-card.js`, eine Probe-Ansicht, README mit Konfigurationsbeispiel.

- [ ] **Step 1: `scripts/deploy.sh`: `npm run build`, dann `ssh ha 'sudo mkdir -p /config/www/pf-ring-flow-card && sudo tee /config/www/pf-ring-flow-card/pf-ring-flow-card.js >/dev/null' < dist/pf-ring-flow-card.js`. Vorher vorhandene Datei auf dem Server per `sudo cp -p` sichern (`…js.bak`), falls sie existiert. In Bash-Heredocs keine einfachen Anführungszeichen im Remote-Code.**
- [ ] **Step 2: Vor dem Einbau: Entitäten prüfen (`ha_get_state`): `sensor.evcc_pv_power`, `sensor.evcc_battery_power`, `sensor.evcc_battery_soc`, `sensor.evcc_home_power`, `sensor.grid_power`, `…_einspeiseleistung`. Vorzeichen von `evcc_battery_power` und Netz im Betrieb vergleichen (positive Werte beim Entladen bzw. Netzbezug erwartet). Bei Abweichung `invert: true` in der Probe-Konfiguration setzen. Passende Sensoren für Kia-EV3-SoC und Wolf-Wärmepumpen-Leistung suchen (`ha_search`; Wolf-Status kommt aus `operating_mode_heater`, siehe Referenz).**
- [ ] **Step 3: Deploy ausführen, die Ressource mit `ha_config_set_dashboard_resource` anlegen: URL `/local/pf-ring-flow-card/pf-ring-flow-card.js?v=1`, Typ `module`. Bei jedem späteren Deploy `?v=` erhöhen.**
- [ ] **Step 4: Neues Probe-Dashboard `pf-ring-probe` mit einer Karte dieser Konfiguration anlegen. Bestehende Dashboards bleiben unverändert (kein Backup nötig, aber vorhandene Konfiguration nicht anfassen).**
- [ ] **Step 5: Im eingebauten Browser prüfen (nach Login des Nutzers, 10–25 s Ladezeit abwarten):**
  - Karte rendert ohne Konsolenfehler (`read_console_messages`)
  - Berechnete Farbe eines Rings entspricht dem Theme (`getComputedStyle(...)`), kein Hex im Shadow-DOM
  - Hover-Glow der `ha-card` wie bei anderen Karten
  - Solar-Ausfall: grauer Kreis „–“ (falls Solar gerade nicht liefert)
  - Editor öffnen, einen Zusatzkreis hinzufügen und entfernen
  - Theme-Wechsel Hell und zurück auf Dunkel (Nutzer vorher informieren; `frontend/set_user_data`, danach sofort `{"theme": "Power Flow Dark"}`)
  - Screenshot als Beleg
- [ ] **Step 6: README schreiben (Installation, Konfiguration, Vorlage aus der Spec, bekannte Grenzen). Commit.**
