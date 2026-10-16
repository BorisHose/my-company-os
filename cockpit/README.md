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
  VERSION, CHANGELOG.md
```

## Ablauf je Änderung
1. In `src/` ändern (nie in `dist/`).
2. `python3 build.py`
3. `node tests/smoke.js` – muss „alle Prüfungen bestanden“ melden.
4. `VERSION` und `CHANGELOG.md` fortschreiben, committen, Tag `cockpit-v<N>`.
5. `dist/my-company-os.html` veröffentlichen (Claude, Artefakt EAd2LV81xPn1ZHoAkGEfKE, Fähigkeiten unverändert lassen).

## Regeln (Architektur, Stand 16.10.2026)
- Nur die Speicher-Schicht spricht mit der Datenbank (Umbau in Etappe 0.2).
- Nichts Kundenspezifisches im Code (Organisationen, Trigger-IDs, Mandanten) – schrittweise in die Konfiguration.
- Der Anweisungstext hat eine Version; beide geplanten Aufgaben bekommen denselben Text aus `anweisung/`.
- Echte Daten nie in `tests/`.
