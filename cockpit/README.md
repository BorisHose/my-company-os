# Cockpit – My Company OS

Quelltext der Live-Seite „My Company OS“ (claude.ai-Artefakt EAd2LV81xPn1ZHoAkGEfKE).
Ab Version 49 gilt: **Die Seite wird nur noch aus diesem Ordner gebaut und veröffentlicht.**

## Aufbau
```
cockpit/
  src/
    0-kopf.html        Titel und Beginn der Stile
    1-stile.css        alle Stile
    2-markup.html      Grundgerüst der Ansichten
    js/NN-*.js         Programm, nach Verantwortung getrennt (Reihenfolge = Dateiname)
    9-fuss.html        Abschluss
  anweisung/ki-auftrag.txt   Anweisungstext der geplanten Aufgaben (schnell + gründlich)
  tests/smoke.js             Smoke-Test mit nachgebildeter Datenbank
  tests/testdaten.json       erfundene Testdaten (keine echten Kundendaten)
  build.py                   setzt src/ zu dist/my-company-os.html zusammen
  berechtigungen.json        Berechtigungen (Fähigkeiten) der veröffentlichten Seite – Quelle für Veröffentlichung und Installation
  VERSION, CHANGELOG.md
```

## Ablauf je Änderung
1. In `src/` ändern (nie in `dist/`).
2. `python3 build.py`
3. `node tests/smoke.js` – muss „alle Prüfungen bestanden“ melden.
4. `VERSION` und `CHANGELOG.md` fortschreiben, committen, Tag `cockpit-v<N>`.
5. `dist/my-company-os.html` veröffentlichen (Claude, Artefakt EAd2LV81xPn1ZHoAkGEfKE). Fähigkeiten nur mitgeben, wenn sich `berechtigungen.json` geändert hat – dann genau diese.

## Regeln (Architektur, Stand 16.10.2026)
- Nur die Speicher-Schicht spricht mit der Datenbank (Umbau in Etappe 0.2).
- Nichts Kundenspezifisches im Code (Organisationen, Trigger-IDs, Mandanten) – schrittweise in die Konfiguration.
- Der Anweisungstext hat eine Version; beide geplanten Aufgaben bekommen denselben Text aus `anweisung/`.
- Echte Daten nie in `tests/`.

## Backend-Systeme: Adapter (seit Version 70)
- Kein Teil der Seite spricht ein Backend-System direkt an. Projekte, Benutzer-Zuordnung, Anbindungen und KI-Kontext rufen nur die Funktionen eines Adapters auf.
- `07a-adapter-basis.js`: MCP-Verbindung, Fehlertexte, Register und der **Vertrag** eines Adapters (im Dateikopf beschrieben). `adapterRegistrieren()` weist unvollständige Adapter ab.
- Je System eine Datei: `07b-adapter-bodo.js`, `07c-adapter-sellify.js`. Systemeigene Oberflächen (z. B. `07d-bodo-benutzerverwaltung.js`) nutzen nur ihren Adapter.
- Neues System anbinden: Datei `07x-adapter-<system>.js` nach dem Vertrag anlegen, Werkzeuge in `berechtigungen.json` ergänzen, Mock in `tests/smoke.js` ergänzen. Der Smoke-Test prüft Vertrag und Berechtigungen für jeden Adapter.
- Die Kennung (`id`) eines Adapters steht in gespeicherten Daten (Zuordnungen, Projekte, Anbindungen) und wird nie geändert.

## Skill-Gruppen (seit Version 72)
- `meta/config.groups` = `[{id, n}]` in Anzeigereihenfolge; jeder Skill verweist mit `g` auf die Gruppen-Id (`""` = ohne Gruppe). Code in `11a-skill-gruppen.js`.
- Ältere Daten (Gruppen als Namen, `g` als Listenposition) stellt `grMigrieren()` beim Laden einmalig um.
- Pflege unter ⚙ Einstellungen › Skill-Gruppen (`18g-skill-gruppen-einstellungen.js`).
