# pf-ring-flow-card – Design

Stand: 2026-11-25. Status: Entwurf, wartet auf Freigabe.

## Ziel und Grund
Eine eigene Home-Assistant-Karte für den Energiefluss. Sie macht, was die `power-flow-card-plus` schon kann, und zeigt zusätzlich um jeden Wert einen offenen Ring (Bogen). Die Idee stammt von `hrudkaav/deye-lcd-tehnika`. Die Optik kommt komplett aus dem Theme „Power Flow“.

## Ziele
- Hauptkreise: Solar, Netz, Batterie, Haus um einen zentralen Knoten, mit animierten Flusslinien.
- Ring: 256° Bogen, unten offen. Füllung = Wert / Maximum. In der Mitte stehen Wert und Einheit (W/kW automatisch).
- Batterie-Ring zeigt den Ladestand (SoC), die Leistung steht als Zahl. Alle anderen Ringe zeigen Leistung / Maximum.
- Optionale Zusatzkreise (`extras:`), frei konfigurierbar, gedacht für E-Auto und Wärmepumpe. Auch eine Wallbox ist damit möglich.
- Klick auf einen Kreis öffnet den More-Info-Dialog der Entität. Optional `tap_action`.
- Farben nur aus Theme-Variablen (`--pf-*`, `--energy-*`). Hell/Dunkel und alle 15 Themes funktionieren ohne Zusatzarbeit.
- Ausfall (Entität `unavailable`/`unknown`, z. B. FoxESS) zeigt einen grauen Kreis mit „–“, Fluss aus.
- Voller visueller Editor (Lit, HA-Entitätsauswahl, Zusatzkreise verwaltbar) plus YAML.

## Nicht-Ziele
- Keine Deye-spezifische Logik, kein Wechselrichter-Menü, keine Steuerung/Schreibzugriffe.
- Kein Update-Check, keine externen Anfragen, keine Laufzeit-Abhängigkeiten außer dem eingebundenen Lit.
- Keine Übernahme von Code oder Grafiken des Vorbilds (Lizenz CC BY-NC-SA 4.0). Nur die Idee „Ring um den Wert“.

## Anti-Ziele (wäre ein Fehlschlag, auch wenn es läuft)
- Hex-Farben oder `#fff`-Overlays in der Karte (im hellen Theme unsichtbar).
- Globale JS-Hacks oder MutationObserver (siehe frühere Probleme mit `fix-inputs.js`).
- Eine Karte, die beim Theme-Wechsel anders aussieht als der Rest.

## Randbedingungen
- Datei `/config/www/pf-ring-flow-card/pf-ring-flow-card.js`, als Dashboard-Ressource (`type: module`) mit `?v=`-Version eingebunden (HA cached `/local/` 31 Tage).
- Lit-Element (TypeScript), `customElements.define('pf-ring-flow-card', …)`, Shadow DOM, SVG. Eintrag in `window.customCards`.
- Theme-Variablen funktionieren in CSS (`style=`/Klassen), nicht in SVG-Attributen: Farben deshalb über CSS-Klassen/`style="stroke:var(--…)"` setzen.
- Karten-Rahmen, Hover-Glow, Radius und `tabular-nums` liefert schon `card-mod-card` des Themes: die Karte rendert in einer normalen `ha-card`.
- `prefers-reduced-motion`: Flussanimation aus.
- Dashboards laden im App-Browser langsam (10–25 s), Prüfung entsprechend geduldig.
- Sicherer Ablauf aus dem HA-Skill: Backup der Dashboard-Config vor dem Einbau, erst im Probe-Dashboard testen.

## Ansätze (Entscheidung: B, geändert von A am 2026-11-25)
- A – Reines JS + SVG, einfacher Editor: eine Datei, kein Build, aber mehr Handarbeit bei Reaktivität und Editor.
- **B – Lit + TypeScript mit vollem Editor (gewählt):** Reaktivität, typisierte Konfiguration, sauberer Editor. Kostet einen Build-Schritt (Node 26/npm sind auf dem Mac vorhanden) und etwas mehr Pflege.
- C – button-card/svg-card-Templates: schnell, aber Flusslinien, mehrere Ringe und variable Zusatzkreise werden unwartbar.

Folgen von B:
- Projektordner mit `package.json`, `src/` (Karte, Editor, Ring-/Fluss-Komponenten), Build mit esbuild zu **einer** gebündelten Datei `pf-ring-flow-card.js` (Lit wird eingebunden, keine Laufzeit-Abhängigkeiten, keine Netzwerkzugriffe).
- Das Bundle wird per SSH/MCP nach `/config/www/pf-ring-flow-card/` kopiert und mit `?v=` eingebunden. Der Quellcode bleibt lokal.
- Der Editor ist ein vollwertiger `LovelaceCardEditor` (Lit): Entitätsauswahl per `ha-entity-picker`, je Kreis Maximum/Invertierung/Icon/Farbe, Zusatzkreise hinzufügen, entfernen, sortieren.
- Das Projekt braucht einen festen Ordner (Git-Repo empfohlen), weil mehrere Dateien entstehen und der Build wiederholt läuft.

## Konfiguration (Skizze)
```yaml
type: custom:pf-ring-flow-card
solar:    { entity: sensor.evcc_pv_power, max: 8000 }
grid:     { entity: sensor.grid_power,
            export_entity: sensor.grid_export_power, max: 10000 }
battery:  { entity: sensor.evcc_battery_power, soc_entity: sensor.evcc_battery_soc, max: 5000 }
home:     { entity: sensor.evcc_home_power, max: 10000 }
extras:
  - { name: E-Auto, icon: mdi:car-electric, entity: sensor.evcc_go_e_charger_charge_power, max: 11000,
      ring: soc, ring_entity: <SoC-Entität des Kia EV3> }
  - { name: Wärmepumpe, icon: mdi:heat-pump, entity: <Leistungssensor Wolf>, max: 3000 }
```
Die Entitäten oben sind Vorschläge aus dem laufenden Server. Welche genau Netz-Vorzeichen, Batterie-Richtung und Wolf-Leistung liefern, prüft der Bau (Wolf-Status kommt aus `operating_mode_heater`, siehe Referenz).

## Verhalten im Detail
- Richtung: positive/negative Werte bestimmen Flussrichtung und Farbe (Netzbezug = Akzent, Einspeisung = `--energy-grid-return-color`, Batterie laden/entladen = `--energy-battery-*`). Mit `invert: true` je Kreis umdrehbar.
- Einheiten: nach `unit_of_measurement` (W/kW) umrechnen, Dezimalkomma.
- Layout: 2×2 um die Mitte, Zusatzkreise kleiner in einer Reihe darunter. Responsiv: schmale Karten skalieren per `viewBox`.
- Zusatzkreise ohne Konfiguration werden nicht gezeichnet.

## Dem Bauenden überlassen
- Genaue Geometrie (Radius, Abstände, Animationsdauer), Icon-Darstellung.
- Aufbau und Aufteilung der Lit-Komponenten, Build-Skripte, Testumfang (Logik wie Umrechnung/Ringwerte per Unit-Tests).
- Name der Version/`?v=`-Konvention und Ablage der Probe-Ansicht.
