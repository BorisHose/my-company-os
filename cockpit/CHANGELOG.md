# Änderungen – Cockpit

## 53 · 16.10.2026 · Etappe 2 „Sammeln und Eingang“
- Organigramm je Abteilung: „📥 n“ (Eingang) und „+ Sammeln“ neben „▶ Abteilung beauftragen“ und „🕘 Verlauf“.
- Fenster „📥 Aufgabe sammeln“: Abteilung, Zuweisung („✦ KI-Teamleiter wählt“ oder ein Agent der Abteilung), Priorität (Dringend · Hoch · Normal · Niedrig), fällig bis, Anhänge, Tempo; Knöpfe „📥 Sammeln“ und „▶ Sammeln & sofort starten“.
- Gesammelte Aufträge haben den Zustand `inbox` (mit `prio`, `due`, `gesammelt`) und starten keine Claude-Sitzung.
- Eingang im Dialog „Aufträge & Verlauf“ (Offen → 📥 Gesammelt): sortiert nach Priorität, darin Fälligkeit, umschaltbar; „▶ Starten“ je Zeile, Auswahl und „Ausgewählte starten“; „✕“ verwirft (bleibt als abgebrochen im Verlauf).
- KI-Aufträge-Seite: Knopf „📥 n gesammelt“. Priorität und Fälligkeit gehen in den Kontext für Claude.
- „🕘 Aufträge & Verlauf“ oben öffnet immer alle Abteilungen; „📥“ und „🕘 Verlauf“ an der Abteilung wählen diese vor.
- Smoke-Test: 54 Prüfungen.

## 52 · 16.10.2026 · Abteilung beauftragen (Entscheidung Boris: vorgezogen)
- Organigramm: „▶ Abteilung beauftragen“ an jeder Abteilung als Hauptweg; ▶ am einzelnen Agenten bleibt, aber dezent.
- „Neuer KI-Auftrag“: neue Art „Abteilung beauftragen“ mit Abteilungswahl; zeigt, aus welchen Agenten der KI-Teamleiter wählt.
- Der KI-Teamleiter (in der Claude-Sitzung) wählt genau einen passenden Agenten, schreibt ihn in den Auftrag (`aid`, Verlauf „Teamleiter: an …“) und arbeitet als dieser Agent weiter; bei unklarer Wahl Rückfrage mit Agenten als Antworten.
- Bis zur Wahl erscheint der Auftrag als „✦ KI-Teamleiter“ (Kachel und Dialog „Aufträge & Verlauf“).
- Anweisungstext beider geplanten Aufgaben um „ABTEILUNG BEAUFTRAGT“ ergänzt.
- Smoke-Test: 46 Prüfungen.

## 51 · 16.10.2026 · Etappe 1 „Direkt beauftragen und Verlauf“
- Organigramm: ▶ an jeder Agenten-Kachel öffnet „Neuer KI-Auftrag“ mit diesem Agenten vorbelegt.
- Agenten-Kachel zeigt nur „● n läuft“, wenn gerade Aufträge laufen (Klick zeigt diese Aufträge).
- Neuer Dialog „🕘 Aufträge & Verlauf“ (oben im Organigramm; je Abteilung „🕘 Verlauf“ mit dieser Abteilung vorgewählt):
  - links Einschränken nach Organisation, Abteilungen (mehrere) und Agenten, mit Zahlen; „Alle · Keine“;
  - Offen: Läuft · Wartet auf dich (· Gesammelt, sobald es gesammelte gibt), „Prüfen & freigeben“ direkt in der Zeile;
  - Erledigt: Heute (Standard) · Diese Woche · Dieser Monat · Letzter Monat · Älter (inkl. Monatsarchiv), Abgebrochene ausgeblendet und einblendbar, 50 je Laden;
  - Suche; Auswahl und Filter werden im Browser gemerkt; auf dem Handy klappt „Einschränken“ zusammen.
- Neue Aufträge merken sich Abteilung und Team des Agenten (`abt`, `team`).
- Smoke-Test: 43 Prüfungen.

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
