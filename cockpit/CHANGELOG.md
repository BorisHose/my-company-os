# Änderungen – Cockpit

## 50 · 16.10.2026 · Etappe 0 „Fundament“
- Datenschicht `Store`: alle Datenbankzugriffe an einer Stelle (lesen, schreiben, Abfragen, Beobachten, Sperren).
- Datenstand 2 (`settings.schema`): einmalige Umstellung unter Sperre – abgebrochene Aufträge erhalten den Zustand `cancel`, erledigte ein Datum (`fertig` in UTC, `fTag`, `fMon`), fehlende `org`/`abt`/`team` werden aus Ablauf und Agent nachgetragen, Zähler `zaehler/auftrag` wird gesetzt.
- Auftragsnummern über den Zähler unter Sperre statt „höchste Nummer im Browser + 1“; bei fremder Sperre Ausweichweg mit Existenzprüfung.
- Neuer Endzustand „✕ Abgebrochen“; Abbrechen setzt `cancel` statt `done`.
- Laden gezielt: offene Aufträge plus erledigte der letzten 90 Tage statt alles bis 1.000. Ein Auftrag, der aus beiden Abfragen fällt, wird geprüft statt gelöscht.
- Archiv: Aufträge, die länger als 90 Tage fertig sind, als Kurzfassung in `archiv/<Org>-<JJJJ-MM>`, danach samt Bildern gelöscht.
- Protokoll 2 für die Claude-Sitzungen (`PROTOKOLL: 2`, Feld `pv`); Anweisungstext ergänzt (Zustände, Datumsfelder). Trigger-IDs über `settings.trig` änderbar.
- Smoke-Test: nachgebildete Datenbank mit Abfragen und Sperren, 27 Prüfungen.

## 49 · 16.10.2026 · Ausgangsstand im Git
- Live-Version 49 unverändert übernommen (Build ist byte-gleich zur veröffentlichten Datei, sha256 346d86521ea33df3…).
- Quelltext in 19 Programmteile nach Verantwortung aufgeteilt, Stile und Grundgerüst getrennt; `build.py` setzt sie zusammen.
- Smoke-Test (13 Prüfungen) mit erfundenen Testdaten.
- Anweisungstext der geplanten Aufgaben als Datei `anweisung/ki-auftrag.txt` (Stand 15.10.2026).
- Frühere Versionen 1–48: siehe Projekt-Dokumente `stand-und-entscheidungen.md` und `stand-v45-bis-v49-und-praesentation.md`.
