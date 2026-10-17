# Änderungen – Cockpit

## 71 · 17.10.2026 · Agenten im Organigramm anlegen und bearbeiten (Konzept freigegeben von Boris)
- Im Organigramm „+ Agent“ je Abteilung, je Team und unter „Ohne Abteilung“ (die Spalte erscheint auch, wenn die Organisation noch keine Abteilungen hat); an jeder Agentenkarte ✎ neben ▶. Beides nur außerhalb von „✎ Bearbeiten“ des Organigramms.
- Assistent in 4 Schritten: Grunddaten (Name Pflicht, Ziel, Produkt vorbelegt mit dem der Organisation, Modell, Abteilung/Team, Verantwortlich/Vertretung, Verbindungen) · Skills aus dem Katalog (Suche, Gruppen, Produktfilter, Entwürfe/Vorschläge markiert, Auswahl rechts) · Regeln (eigene, geerbte zur Ansicht, allgemeine Vorgaben) · Zusammenfassung mit Hinweisen (Einsatz für das Plugin offen, Skill eines anderen Produkts, Skill noch nicht im Konto).
- Gearbeitet wird auf einer Kopie: erst „Agent anlegen“ bzw. „Änderungen speichern“ übernimmt und speichert, Abbrechen verwirft (mit Rückfrage, wenn etwas geändert wurde). Doppelte Namen werden abgewiesen.
- Nach dem Anlegen: „▶ Ersten Auftrag geben“, „Im Agenten öffnen“ oder „Fertig“. Beim Bearbeiten gelten die Regeln zur Rückgabe an Claude wie im Agenten-Editor.
- Die Skill-Auswahl ist eine gemeinsame Komponente (`skAuswahl`), genutzt vom Assistenten und von „+ Skills hinzufügen …“ im Agenten-Editor.
- Agentenkarte: ▶ und ✎ untereinander, lange Namen brechen um statt über den Rand zu laufen.
- Smoke-Test: 104 Prüfungen.

## 70 · 17.10.2026 · Adapter-Umbau (Architektur, ohne sichtbare Änderung)
- Backend-Systeme hängen jetzt an je einem Adapter mit festem Vertrag: `07a-adapter-basis.js` (Verbindung, Fehlertexte, Register, Vertrag), `07b-adapter-bodo.js`, `07c-adapter-sellify.js`. Ein weiteres System = eine weitere Adapter-Datei.
- Projekte (Übernehmen/Verbinden, Kontext für Claude), Anbindungen (Systemauswahl, Mandanten, Verbindung prüfen), Benutzer-Zuordnung (Suchen, Abgleichen) und KI-Kontext fragen nur noch den Adapter; feste Unterscheidungen „bodo/sellify“ im Code entfallen.
- Aufgeteilt: Bodo-Benutzerverwaltung (Mandanten pflegen, Assistent, Einladen) in `07d-bodo-benutzerverwaltung.js`, Benutzer-Zuordnung in `10a-benutzer-zuordnung.js`, `modalBox` zu den Dialogen; `07-bodo-anbindung.js` entfällt. Doppelte Systemlisten (SYS, SYSKAT, PJSYS) entfallen.
- Projektdialog heißt `pjBackendDlg`; der zuletzt gewählte Mandant wird je System gemerkt (`pjMand`), der bisherige Bodo-Wert wird weiter gelesen.
- Neu `berechtigungen.json`: Berechtigungen der Seite als Datei im Repo.
- Texte korrigiert: Hinweis beim Lösen einer Zuordnung nennt die heutigen Knöpfe („Abgleichen“, „In … suchen“).
- Geprüft: Smoke-Test 103 Prüfungen (neu: Adapter-Vertrag, Berechtigungen, Projekte/Benutzer/Prüfung/Fehler/Kontext je System); zusätzlich Vergleich mit Version 69: Anbindungen, Prüfergebnisse, Projekt-Kontext, KI-Kontext, Projekt- und Benutzeransicht inhaltsgleich.

## 69 · 17.10.2026 · sellify-Benutzer zuordnen (Wunsch Boris)
- Nutzt ein Organigramm des Benutzers sellify (Anbindung oder Produkt), gehört auch eine sellify-Zuordnung zum Soll; fehlt sie, erscheint „In sellify suchen“.
- Suche über den sellify-Connector (Benutzerliste, Suche nach Nachname, Treffer bei gleichem vollen Namen oder gleicher E-Mail); gelöschte Benutzer werden nicht angeboten, bereits anderen Benutzern zugeordnete ebenfalls.
- „Abgleichen“ (vorher „Mit Bodo abgleichen“) liest Bodo- und sellify-Zuordnungen neu und ergänzt fehlende eindeutige.
- Gespeichert: sellify-Benutzer-Id, Login, Name, E-Mail, Status (aktiv / ohne Anmeldung / ausgeschieden), Rollen.
- Seite darf dafür das sellify-Werkzeug sellify_user lesen (neue Berechtigung).
- Smoke-Test: 102 Prüfungen.

## 68 · 17.10.2026 · Benutzer-Zuordnungen nur systemseitig (Vorgabe Boris)
- „Vertreten in Zielsystemen“ ist nicht mehr von Hand änderbar (auch nicht im Bearbeitungsmodus): System, Mandant, Benutzer, E-Mail, Status und Kennungen werden nur angezeigt; „+ Zuordnung von Hand“ entfällt. Im Bearbeitungsmodus kann eine Zuordnung nur gelöst werden.
- Soll je Benutzer: eine Zuordnung in jedem Bodo-Mandanten seiner Organigramme (⚙ Anbindungen; ohne Anbindungen die eigenen Bodo-Mandanten). Fehlende erscheinen markiert mit „In Bodo suchen“.
- „In Bodo suchen“ sucht im Mandanten nach E-Mail und Name: ein Treffer wird übernommen, mehrere zur Auswahl, keiner → Hinweis auf „In weiteren Bodo-Mandanten anlegen …“. Ein Bodo-Benutzer, der schon einem anderen Company-OS-Benutzer zugeordnet ist, wird nicht angeboten.
- „Mit Bodo abgleichen“ liest bestehende Zuordnungen neu und ergänzt fehlende, wenn der Treffer eindeutig ist; jede Zuordnung zeigt „aus Bodo gelesen“ mit Datum.
- Smoke-Test: 101 Prüfungen.

## 67 · 17.10.2026 · Benutzerliste gleich hoch wie „Benutzer bearbeiten“ (Wunsch Boris)
- Der Kasten „Benutzer“ ist immer genau so hoch wie „Benutzer bearbeiten“ und wächst mit ihm; passen nicht alle Benutzer hinein, scrollt die Liste in sich.
- Schmale Fenster (unter 1100 px, untereinander): Liste höchstens halbe Bildschirmhöhe, darin scrollbar.
- Smoke-Test: 100 Prüfungen.

## 66 · 17.10.2026 · Benutzer in den Einstellungen eingebettet (Wunsch Boris)
- ⚙ Einstellungen › Benutzer verhält sich wie die übrigen Bereiche: Die Menüführung bleibt links, Benutzerliste und Bearbeitung erscheinen rechts daneben. Eigene Ansicht „Benutzer“ und Rücksprung-Link entfallen.
- Wechsel zwischen Bereichen ist gesperrt, solange ein Benutzer bearbeitet wird.
- ⚙ öffnet den zuletzt gewählten Bereich.
- Schmale Fenster (unter 1100 px): Liste und Bearbeitung untereinander.
- Smoke-Test: 99 Prüfungen.

## 65 · 17.10.2026 · „Agenten ▾“ als Auswahlliste (Wunsch Boris)
- Klick auf „Agenten ▾“ öffnet eine Auswahlliste direkt unter dem Knopf: Agenten · Skills · Matrix, der aktuelle Reiter mit ✓. Die zweite Leiste unter der Navigation entfällt, die Kopfzeile bleibt gleich hoch.
- Schließen per Auswahl, Klick daneben, Escape, Tab, Scrollen der Leiste oder Größenänderung; Pfeiltasten wählen in der Liste.
- Handy: Liste erscheint unter dem Knopf und bleibt ganz im Bild.
- Smoke-Test: 98 Prüfungen.

## 64 · 17.10.2026 · Projekt-Detail mit Bearbeitungsmodus (Wunsch Boris)
- Die Projekt-Detailansicht startet im reinen Ansichtsmodus (Kunde, Status, Verantwortlich, Angelegt, Beschreibung, Backend-Verbindung, Aufträge, Verbrauch).
- „✎ Bearbeiten“ wie in den übrigen Bereichen: erst dann Felder, Status, Backend verbinden/lösen und „Projekt löschen“; „Speichern“ schreibt, „Abbrechen“ verwirft. Während der Bearbeitung sind Projektwechsel, Organigrammwechsel und Übernahme gesperrt.
- „+ Neues Projekt“ legt das Projekt direkt im Bearbeitungsmodus an; „Abbrechen“ verwirft es wieder.
- „+ Auftrag in diesem Projekt“ nur in der Ansicht.
- Smoke-Test: 97 Prüfungen.

## 63 · 17.10.2026 · Backend-Listen seitenweise (Grundsatz Boris)
- Grundsatz: Listen aus Backend-Systemen werden immer seitenweise geladen (25 je Abruf, „Weitere 25 laden“), nie komplett vorab; wo die Schnittstelle es kann, die zuletzt angelegten zuerst.
- Projekte übernehmen/verbinden: sellify lädt neueste zuerst (sort -registered) mit Anzeige „n von Gesamt“; Bodo seitenweise, Reihenfolge alphabetisch – die Bodo-Suche bietet laut Schnittstellenbeschreibung keine Sortierung nach Anlagedatum (Hinweis in der Liste).
- Angekreuzte Projekte bleiben beim Nachladen ausgewählt.
- Smoke-Test: 96 Prüfungen.

## 62 · 17.10.2026 · sellify-Projekte (Hinweis Boris)
- Projekte lassen sich jetzt auch aus sellify übernehmen bzw. mit einem sellify-Projekt verbinden („⇣ Aus Backend übernehmen …“, „↔ Mit Backend-Projekt verbinden …“, Umschalter Bodo · sellify; sellify ohne Mandant). Vorbelegt ist das System des Dienstes „Projekt“, sonst das Produkt des Organigramms.
- Status aus sellify: abgeschlossen (done), pausiert (Statusname), sonst aktiv; Projektnummer im Titel der Trefferliste.
- Claude bekommt bei sellify-Projekten die Projekt-Id und legt Aufgaben, Notizen und Termine am Projekt an.
- „Verbindung prüfen“ prüft bei sellify jetzt die Projekte (übrige sellify-Bereiche weiterhin nur über die Claude-Sitzung).
- Seite darf dafür das sellify-Werkzeug sellify_project lesen (neue Berechtigung, beim ersten Aufruf Zustimmung im Browser).
- Smoke-Test: 93 Prüfungen.

## 61 · 17.10.2026 · Etappe 4c „Handy“ (Freigabe Boris)
- Organigramm auf schmalen Bildschirmen (bis 760 px) untereinander statt als Baum: Geschäftsführung oben, Abteilungen darunter an einer senkrechten Linie, kein seitliches Scrollen mehr.
- Alle Ansichten ohne seitliches Scrollen der Seite (gemessen bei 320, 390, 430 und 768 px): zweispaltige Ansichten werden einspaltig, Filterleisten (Skills, Aufträge) sind wischbar statt abgeschnitten, Systemtabelle beim Benutzer scrollt in sich, Kopfzeilen mit Knöpfen brechen um.
- Bewusst seitlich verschiebbar bleiben: Prozess-Designer (Zeichenfläche), Matrix, Navigationsleiste.
- Smoke-Test: 89 Prüfungen.

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
