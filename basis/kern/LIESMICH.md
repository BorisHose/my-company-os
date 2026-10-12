# Basis · Kern (v2)

Stand: 12.10.2026

Gemeinsamer Rahmen aller Fassungen v2 von Company OS. Enthält **keine Kundendaten**.

| Datei | Was |
|---|---|
| `kern.css` | Gestaltung: Farben (hell/dunkel), Menü, Tagesleiste, Kacheln, Tabellen, Detailseiten, Sprungmarken, Postfach, KI-Assistent |
| `kern.js` | Rahmen und Seitentypen: `K.dash`, `K.list`, `K.detail`, `K.inbox`, Finden (Strg F), Neu (N), KI-Assistent, Mandantenwechsel |

## Aufbau (Bodo-Muster)
Menü mit Gruppen · Tagesleiste · Startseite mit Kacheln („Braucht Aufmerksamkeit“ / „Bestand“) · Übersichten mit Reitern und Tabelle · Detailseite mit Kopf, drei Karten, Sprungmarken und Bereichen · Postfach zweigeteilt.

## Nutzung
Eine Ableitung ruft `K.start(cfg)` auf – mit Menü, Tagesleiste, Ansichten, KI-Antworten und Suche.
- Ein Unternehmen: `cfg.mandant = {name, rolle, farbe, ini, user}` (so bei abcfinance).
- Mehrere Unternehmen: `cfg.mandanten = {schlüssel: {…}}` und `cfg.mstart`. Dann ist der Kopf im Menü ein Umschalter; die Ansichten lesen den aktuellen Schlüssel aus `K.st.m`. Optional `brand` je Mandant, wenn die Logofarbe für Knöpfe zu hell ist.
- Die Seite schreibt nur in `<div id="k-root">` – nötig, damit Stile auf claude.ai erhalten bleiben.

## Wer den Kern nutzt
- `ableitungen/abcfinance/konfiguration/v2/build_v2.py`
- `ableitungen/pilot-business-acts-bodo/konfiguration/v2/build_pilot_v2.py`

Nach jeder Änderung am Kern beide Fassungen neu bauen und prüfen.
