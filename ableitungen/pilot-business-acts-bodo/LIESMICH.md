# Ableitung Pilot business//acts · Bodo – nur intern

Stand: 12.10.2026

## Zweck
Interner Pilot für Bodo Solutions und business//acts mit echten Bodo-Daten und Links in Bodo. **Nicht an Dritte weitergeben.**

## Fassung v2 (neu, allgemeine Fassung aus dem Kern)
Aufbau nach dem Bodo-Muster, gebaut aus `basis/kern`. Umschalter im Menükopf: Alle Unternehmen · Bodo Solutions · business//acts.

| Datei | Was |
|---|---|
| `prototyp/company-os-pilot-v2.html` | Fassung v2 (Ergebnis des Builds) |
| `konfiguration/v2/pilot-alt.js` | Daten des bisherigen Pilots (Organigramm, Prozesse, Vorlagen, Agenten, Skills, Aufträge, Setup) – einmalig aus der alten Datei übernommen |
| `konfiguration/v2/pilot-mcp.js` | per MCP gelesen am 12.10.2026, nur lesend: Bodo „Bodo Solutions“ (Meine Arbeit, Chancen, Projekte, Aufgaben MIV Hagen Migration) und sellify |
| `konfiguration/v2/pilot-v2.css`, `pilot-v2.js` | Ansichten des Pilots für den Kern |
| `konfiguration/v2/build_pilot_v2.py` | baut die Fassung: `python konfiguration/v2/build_pilot_v2.py` |

### Kennzeichnung der Daten
- **Bodo · echte Daten · Stand 12.10.2026** – Meine Arbeit, Chancen, Projekte, Aufgaben MIV Hagen, Kontaktzahlen.
- **sellify · Testdaten** – das per MCP erreichbare sellify enthält nach Einschätzung von Claude Test- und Demodaten. Das produktive sellify von business//acts ist noch nicht angebunden.
- **Beispieldaten** – Organigramm, Prozesse, Agenten, Aufträge, KI-Sitzungen aus dem bisherigen Prototyp.
- **Einschätzung** – z. B. welche Bodo-Aufgaben zu business//acts gehören (nach Titel zugeordnet).

### Daten auffrischen
`pilot-mcp.js` per MCP neu lesen (nur lesend) und den Stand oben in der Datei anpassen, dann neu bauen.

## Bisherige Fassung (unverändert)
| Datei | Was |
|---|---|
| `prototyp/company-os-prototyp-pilot.html` | Prototyp Pilot, bisheriger Aufbau |

## Veröffentlicht
- Company OS Pilot v2 (aus dem Kern) – https://claude.ai/artifact/UxLsoThE36ru8zRbvpMSGi
- Bisher: Company OS Prototyp – Pilot business//acts · Bodo – https://claude.ai/artifact/WQY9F8gvWox6PKfiX9hnw7

## Zurück zum alten Stand
Git-Tag `stand-vor-kern-v2-generell`. Alte Dateien und Artefakte bleiben unverändert.
