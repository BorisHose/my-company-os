# Etappe 0 „Fundament“ – Plan und Stand

Freigegeben von Boris am 16.10.2026. Ziel: Für Boris sieht das Cockpit danach gleich aus; es ist gesichert, testbar und bereit für viele Aufträge.

| Schritt | Inhalt | Stand |
| --- | --- | --- |
| 0.1 | Live-Quelltext v49 ins Git, in Teile aufgeteilt, `build.py` (byte-gleich) | erledigt 16.10.2026, Tag `cockpit-v49` |
| 0.6 | Smoke-Test mit erfundenen Testdaten | erledigt, mit v50 auf 27 Prüfungen erweitert (Umstellung, Archiv, Nummern, Abbruch) |
| 0.2 | Speicher-Schnittstelle: alle Datenbankzugriffe in `18-speicher.js` bündeln (heute 16 Stellen in 3 Dateien: 15, 16, 18); `schemaVersion` in `meta/config`; Umzugsschritte | erledigt 16.10.2026, v50: Schicht `Store` in `18-speicher.js`, keine Datenbankzugriffe mehr außerhalb; `settings.schema = 2` |
| 0.3 | Auftragsnummern über Sperre (`acquire` auf `zaehler/auftrag`); Zustände gesammelt · läuft · wartet · erledigt · abgebrochen; Felder `org`, `abt`, `team`, `fTag`, `fMon` nachtragen | erledigt v50: Zähler unter Sperre (Ausweichweg mit Existenzprüfung), Zustand `cancel`, Umstellung trägt Felder nach; Zustand `inbox` vorbereitet |
| 0.4 | Gezielte Abfragen statt „alles laden“ (heute 1.000er-Grenze); Archiv `archiv/<org>-<JJJJ-MM>` nach 90 Tagen, Bilder dann löschen | erledigt v50: zwei Abfragen (offen · fertig in 90 Tagen), Archivlauf beim Start unter Sperre |
| 0.5 | Anweisungstext: eine Quelle (`anweisung/ki-auftrag.txt`) mit Version, Eintrag `pv` im Auftrag; beide geplanten Aufgaben auf denselben Stand | erledigt v50: Protokoll 2 (`PROTOKOLL: 2`, `pv`), Trigger-IDs überschreibbar über `settings.trig` |

## Befunde aus der Aufteilung (16.10.2026)
- Datenbankzugriffe sind bereits gebündelt: nur 16 Stellen in 3 Dateien – die Speicher-Schnittstelle ist überschaubar.
- Organisationen `og-bodo`/`og-ba` stehen nur in `06-organisationen.js` (Startwerte und Umzugslogik).
- Trigger-IDs stehen in `16-ki-auftraege.js` → kommen in Schritt 0.5 in die Konfiguration.
- Speichern arbeitet als Abgleich „Stand im Browser gegen zuletzt Gespeichertes“ und schreibt nur Geändertes; Rückmeldungen der KI-Sitzung werden vorher übernommen. Bei mehreren gleichzeitigen Nutzern gilt „letzter gewinnt“ – wird mit 0.2 je Sammlung abgesichert.

## Regeln für jeden Schritt
1. Änderung in `src/`, `python3 build.py`, `node tests/smoke.js` grün.
2. Vor jedem Schritt, der Daten in der Live-Datenbank umbaut: Sicherung aller Sammlungen (Export) in `05 Datensicherung`.
3. VERSION, CHANGELOG, Commit, Tag; danach veröffentlichen.
