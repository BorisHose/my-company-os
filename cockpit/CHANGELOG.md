# Änderungen – Cockpit

## 60 · 17.10.2026 · Etappe 4b, Teil 3 „Anbindungen“ (Freigabe Boris)
- ⚙ Einstellungen › Anbindungen: je Organigramm vier Dienste – CRM, Auftragsmanagement (kommerzieller Auftrag), Projekt, Zeiterfassung – mit System, Mandant und Entität; mehrere Dienste dürfen auf dasselbe System zeigen, der Mandant wird für weitere Dienste desselben Systems vorgeschlagen.
- Systemkatalog im Code (Bodo: contact, member, opportunity, lead, order, project, timeEntry; sellify: contact, person, sale, project; keine Zeiterfassung). Neues System = neuer Katalogeintrag.
- „Verbindung prüfen“: Bodo-Mandant erreichbar, KI-Zugang aktiv, Entität lesbar (Ergebnis wird gespeichert); sellify ist aus der Seite nicht prüfbar (Hinweis).
- Zeiterfassung mit sellify ausgegraut mit Hinweis, sich beim Hersteller zu melden; „Laufzeit hier buchen“ vorbereitet, aber noch nicht aktiv (Verbrauch vorerst nur in Company OS).
- KI-Benutzer je System im Katalog vorgesehen (Bodo und sellify: noch nicht).
- Claude bekommt die Anbindungen als Standard-Zielsysteme im Kontext und schreibt eine Datenspur (spur) der angelegten bzw. geänderten Datensätze; Anzeige im Ergebnisfenster.
- Projekte aus Bodo werden standardmäßig im Mandanten des Dienstes „Projekt“ gesucht.
- Smoke-Test: 87 Prüfungen.

## 59 · 17.10.2026 · Etappe 4b, Teil 2 „Verbrauch“ (Freigabe Boris)
- Jede Claude-Sitzung misst vor ihrem letzten Schreibvorgang Laufzeit und Tokens (Eingabe, Cache geschrieben, Cache gelesen, Ausgabe) aus ihrem eigenen Sitzungsprotokoll und schreibt sie in den Auftrag (Feld verb). Anweisung beider geplanten Aufgaben ergänzt.
- Anzeige im Ergebnisfenster (mit Teilaufträgen), je Auftrag in der Projektliste, Summe je Projekt und „Ohne Projekt“ (Laufzeit, Tokens, Sitzungen, gemessene Aufträge); Laufzeit auf der Projektkarte.
- Nur in Company OS erfasst, keine Buchung ins Backend. Euro-Werte bewusst nicht berechnet (Abo: Tokens zählen gegen das Kontingent).
- Archiv-Kurzfassung behält den Verbrauch.
- Smoke-Test: 82 Prüfungen.

## 58 · 17.10.2026 · Etappe 4b, Teil 1 „Projekte“ (Freigabe Boris)
- Neuer Reiter „Projekte“ (Leiste: Organigramm · Aufträge · Projekte · Prozesse · Agenten ▾): je Organigramm Übersicht nach Aktiv · Pausiert · Abgeschlossen mit offenen, wartenden und erledigten Aufträgen; Karte „Ohne Projekt“.
- Projekte werden in Company OS angelegt (Sammlung projects): Name, Kunde/Bezug, Status, Verantwortlich, Beschreibung.
- Verbindung mit einem Bodo-Projekt (Suche im gewählten Mandanten über den Connector) und „⇣ Aus Bodo übernehmen“ für mehrere aktive Projekte auf einmal; der zuletzt gewählte Mandant wird je Organigramm gemerkt.
- Aufträge: Projekt im Fenster „Neuer Auftrag“ wählbar (optional), „+ Auftrag in diesem Projekt“, Zuordnung im Ergebnisfenster änderbar; Teilaufträge eines Plans erben das Projekt; Projekt auf der Auftragskachel; Archiv behält die Zuordnung.
- Claude bekommt Projekt und ggf. Bodo-Projekt-ID im Kontext und legt Aufgaben, Notizen und Termine des Auftrags dort am Projekt an.
- Smoke-Test: 81 Prüfungen.

## 57 · 17.10.2026 · Kopfzeile aufgeräumt (Freigabe Boris)
- Leiste: Organigramm · Aufträge · Prozesse · Agenten ▾; „Agenten ▾“ öffnet eine Unterleiste mit Agenten · Skills · Matrix, der zuletzt gewählte Reiter wird gemerkt. Platz für „Projekte“ kommt mit 4b.
- Begriffe: „KI-Aufträge“ → „Aufträge“, „+ KI-Auftrag“ → „+ Auftrag“, „Neuer KI-Auftrag“ → „Neuer Auftrag“; „Abläufe“/„Ablauf“ → „Prozesse“/„Prozess“ in Leiste, Designer und Auftragsfenster (Texte für Claude bleiben unverändert).
- Handy: Leiste waagerecht wischbar, Avatar und ⚙ bleiben sichtbar.
- Behoben: Farbschema und „Angemeldet als“ wurden in v56 nicht dauerhaft im Browser gespeichert.
- Smoke-Test: 72 Prüfungen.

## 56 · 17.10.2026 · Etappe 4a „Einstellungen“ (Freigabe Boris)
- Kopfzeile: Datum und Uhrzeit, Avatar des angemeldeten Benutzers, Zahnrad ⚙ für die Einstellungen; „Benutzer“ ist aus der Leiste in die Einstellungen gewandert.
- Einstellungen: Darstellung (Hell · Dunkel · Automatisch; angemeldeter Benutzer je Browser), Instanz (Name, Inhaber, Version), Organigramme (Name, Kurzname, Produkt, Geschäftsführung, Logo), Benutzer, Ausführung (Kennungen der geplanten Aufgaben), Anbindungen (Bodo-Mandanten; vier Dienste in Vorbereitung).
- Logo je Organigramm: erscheint mit Kurzname im Umschalter und in der Kopfbox des Organigramms.
- Dunkel-Modus: `tools/dunkel.py` erzeugt `src/1b-dunkel.css` aus den Stilen; build.py nimmt alle `1*.css` auf und setzt die Versionsnummer ein.
- Nichts Kundenspezifisches mehr im Code: Startorganisation neutral, eigene Bodo-Mandanten, Inhaber und Mandantenregel wandern per Datenstand 3 in die Einstellungen bzw. „Allgemeine Vorgaben“; Namen in Verläufen und im Kontext kommen vom angemeldeten Benutzer.
- Smoke-Test: 67 Prüfungen.

## 55 · 17.10.2026 · KI-Teamleiter je Team
- Teams im Organigramm haben ein eigenes „▶“ (Auftrag an das Team); Agenten direkt in der Abteilung bilden das Team „Allgemein“ mit eigenem „▶“.
- Fenster „Abteilung beauftragen“: bei Abteilungen mit Teams zusätzlich Auswahl „Ganze Abteilung“ oder ein Team; der KI-Teamleiter wählt nur aus den Agenten dieses Bereichs (Plan darf weiterhin andere Bereiche einbeziehen, wenn nötig).
- Auftrag speichert `team` (Team-ID oder `_allg`); Kontext, Kachel und Plan nennen „KI-Teamleiter Team …“.
- Smoke-Test: 61 Prüfungen.

## 54 · 17.10.2026 · Etappe 3 „KI-Teamleiter mit Plan“
- Bei „Abteilung beauftragen“ darf der KI-Teamleiter statt einer Einzelwahl einen Plan vorschlagen: bis zu 6 Teilaufträge mit Agent, optional Skill, Reihenfolge („startet nach …“) und Begründung; Agenten anderer Abteilungen nur, wenn fachlich nötig.
- Fenster „Vorschlag“: Plan mit Agentenwahl je Schritt, Hinweis bei fremder Abteilung (Zustimmung der Leitung, ohne Leitung Boris), „▶ Plan freigeben & starten“, „Ändern …“ (geht an den Teamleiter zurück), „Abbrechen“.
- Nach der Freigabe legt das Cockpit die Teilaufträge an (art „agent“, `parent`, `step`, `nach`), startet unabhängige sofort und abhängige automatisch, sobald die Vorschritte erledigt sind – mit deren Ergebnissen im Auftrag. Ist ein Vorschritt nicht erledigt, wartet der Folgeschritt im Eingang auf Boris.
- Der Hauptauftrag zeigt die Teilaufträge mit Stand und endet, wenn alle Teile beendet sind (erledigt / teilweise / nicht erledigt, Ergebnisse gesammelt). Abbrechen des Hauptauftrags bricht noch wartende Teile mit ab.
- Überwachung der Sitzungen: gleichzeitig laufende Aufträge auf derselben geplanten Aufgabe werden über die Sitzungskennung auseinandergehalten (vorher konnte ein späterer Lauf einen früheren fälschlich als „beendet“ melden).
- Anweisungstext beider geplanten Aufgaben um den Plan ergänzt. Smoke-Test: 58 Prüfungen.

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
