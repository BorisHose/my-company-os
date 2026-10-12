# Company OS (Arbeitstitel)

Sicherung des Arbeitsstands: Prototyp, Präsentationen, Konzept und Werkzeuge.
Stand: 12.10.2026 · Repository privat (github.com/BorisHose/my-company-os)

## Inhalt

| Ordner | Was | Live-Fassung auf claude.ai |
|---|---|---|
| `basis/company-os-prototyp.html` | Genereller Prototyp (Basis für alle Ableitungen), startet als „Musterfirma“ (erfundene Daten), Knopf „Pilotdaten zeigen“ | https://claude.ai/artifact/9hY1WKqMz4Ziy4En4QGHwM |
| `ableitungen/` | Kundenspezifische Ableitungen der Basis, je Kunde ein Ordner mit `konfiguration/`, `prototyp/`, `konzept/`, `LIESMICH.md`; Vorlage: `_vorlage/`. Aufbau und Regeln: `ableitungen/LIESMICH.md` | – |
| `ableitungen/abcfinance/` | Posteingang mit KI (ASS) für abcfinance, Beispieldaten, kundentauglich | https://claude.ai/artifact/RSqJ1Q2eSgxHvoPfGV8hsZ |
| `ableitungen/pilot-business-acts-bodo/` | Prototyp Pilot: Bodo Solutions und business//acts, echte Bodo-Daten (Projekt MIV Hagen Migration, Stand 11.10.2026) mit Links in Bodo – **nur intern** | https://claude.ai/artifact/WQY9F8gvWox6PKfiX9hnw7 |
| `marketing/vorstellung-neutral/` | Detail-Präsentation, neutral mit Musterfirma (32 Folien); `gen.py` erzeugt die Bildschirm-Folien | https://claude.ai/artifact/KUxJuoTYq3SUdZd3md4wrR |
| `marketing/vorstellung-pilot/` | Detail-Präsentation Pilot business//acts · Bodo (33 Folien, echte Daten) – **nur intern** | https://claude.ai/artifact/4tzo3KSdLWSyK5ZENyKW9X |
| `marketing/elevator-pitch/` | Elevator Pitch (8 Folien, neutral) | https://claude.ai/artifact/NBtdCmL1LTtGg5X94dYY4o |
| `marketing/endlosschleife-ipad/` | Selbstablaufende Kurzfassung (12 Folien) als PowerPoint für Keynote; Video-Skript | – |
| `konzepte/` | Gesamtkonzept „Prozesse, Prozesskette und Kundeninstanzen“ | Projekt „My Company OS“ auf claude.ai |
| `werkzeuge/` | Skripte: Klicktests, Screenshots, Folienprüfung, PDF-Erzeugung, Prototyp-Patches | – |

## Hinweise

- Folien liegen im Format des claude.ai-Folientyps: `project/deck.json` (Reihenfolge, Abschnitte) und `project/slides/<id>.html`. Bilder verweisen auf `/_blob/<id>` im jeweiligen Artefakt; die Bilddateien liegen zusätzlich unter `screenshots/` bzw. `bilder/`.
- Die PDFs der Präsentationen liegen in `08 Marketing` (nicht im Repository).
- Die Pilot-Fassungen enthalten echte Kunden- und Personendaten – Repository privat halten, nicht an Dritte weitergeben.
- Die Skripte unter `werkzeuge/` enthalten Pfade der Arbeitsumgebung von Claude; sie dienen als Referenz und müssen für eine lokale Nutzung angepasst werden.
