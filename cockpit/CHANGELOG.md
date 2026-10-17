# Änderungen – Cockpit

## 83 · 17.10.2026 · Fehlerbehebung Knopf bei Rückfragen
- Wartet ein Auftrag auf eine Rückfrage (nicht auf eine Freigabe), heißt der Knopf in der Übersicht und auf der Auftragskarte jetzt „Antworten“ statt „Prüfen & freigeben“.

## 82 · 17.10.2026 · Fehlerbehebung Hinweistext
- Archiv-Hinweis in der Einzahl korrekt: „1 alter Auftrag ins Archiv verschoben“.

## 81 · 17.10.2026 · Fehlerbehebung Benutzer-Zuordnung
- „Welcher Benutzer in … ist …?“: Bei mehreren Treffern wird jetzt der gewählte Benutzer übernommen (vorher immer der erste, weil die Auswahl erst nach dem Schließen gelesen wurde).
- Smoke-Test: 133 Prüfungen.

## 80 · 17.10.2026 · Nachbesserungen nach Code-Prüfung (Etappe 6)
- Formatierter Text: Zeilen wie „17. Oktober …“ oder „2024. …“ werden nicht mehr als nummerierte Liste gelesen (Listen nur ab 1 und fortlaufend); „5 * 3 * 2“ bleibt unverändert; Einfügen aus Outlook/Word/Webseiten ohne falsche Zeilenumbrüche, Tabellenzellen mit „|“ getrennt.
- Rückfragen von Claude ohne Antwort-Optionen: eigenes Feld „Antwort senden“ (geht ohne „Ändern:“ an Claude), daneben weiter „Änderung senden“.
- Platzhalter-Werte mit „$“ werden wörtlich übernommen; Vorlagen-Auswahl auf dem Handy einspaltig; kein Fehler mehr, wenn der Vorlagen-Editor kurz nach einer Eingabe geschlossen wird; Menü im Auftragsfenster mit einem gemeinsamen Klick-Listener; Bestätigungsfenster teilen den Titel nicht mehr am „?“ eines Auftragstitels.
- Hinweis „Claude arbeitet“ korrigiert (Stand laden statt automatischer Aktualisierung im geöffneten Fenster).
- Smoke-Test: 132 Prüfungen.

## 79 · 17.10.2026 · Auftragsvorlagen mit Schnellwahl (Etappe 5)
- Neue Sammlung `vorlagen` (über die Speicher-Schicht, gespeichert wie Projekte); `18h-vorlagen.js`. Jede Vorlage gehört zu genau einer Organisation und damit zu deren System (Bodo/sellify) – Auswahl, Schnellwahl und Verwaltung zeigen nur Vorlagen der gewählten Organisation. Kundeninstanzen sind über ihre eigene Datenbank getrennt.
- „Neuer Auftrag“: Leiste mit „📋 Vorlage wählen …“ und Schnellwahl-Knöpfen in zwei Gruppen „Für alle“ und „Meine“ (je höchstens 4), „✎ Schnellwahl anpassen“. Auswahlfenster mit Suche, Filter (Alle/Für alle/Nur meine), Gruppen nach Abteilung, Vorschau und Nutzungszähler.
- Platzhalter wie `[Kunde]`: werden vor dem Füllen abgefragt (Hinweis je Feld, Pflichtfelder), „überspringen“ möglich; offene Pflicht-Platzhalter werden vor dem Start gemeldet. Platzhalter sind im Text gelb markiert.
- Vorlagen bringen auch Priorität und Fälligkeit („in N Tagen“) für den Eingang mit (gilt bei „Nur sammeln“/Sammeln).
- Sichtbar für „alle Benutzer“ der Instanz oder „nur mich“ (Ordnungshilfe, kein Zugriffsschutz – die Anmeldung wird je Browser gewählt). Ändern dürfen Ersteller und Inhaber der Instanz; alle anderen können duplizieren. Schnellwahl „für alle“ ändert der Inhaber (`settings.schnell`), „meine“ steht am Benutzer (`schnell`, `schnellAus`) und gilt damit auf jedem Gerät.
- Verwaltung unter ⚙ Einstellungen › Auftragsvorlagen: Liste je Organisation (Sichtbar für, Schnellwahl, genutzt), Bearbeiten, Duplizieren, freigeben/nur für mich, in andere Organisation kopieren (Agent, Abteilung, Prozess, Projekt dort neu wählen), Ausprobieren, Löschen mit Bestätigung. Editor im Aufbau von „Neuer Auftrag“ mit „＋ Platzhalter“ und automatisch erkannter Platzhalter-Tabelle.
- Im Auftrag: Menü ⋯ › „📋 Als Vorlage speichern …“. Der Auftrag merkt sich `vorlage`/`vorlageN` („angelegt mit Vorlage …“ im Verlauf); spätere Änderungen an der Vorlage ändern bestehende Aufträge nicht.
- Handy: Menüs im Fensterkopf über die volle Breite.
- Smoke-Test: 131 Prüfungen (neu: Vorlage anlegen, Trennung Bodo/sellify, verwenden mit Platzhaltern, Pflicht-Hinweis, Sammeln mit Vorlagen-Priorität, „nur ich“/Rechte, „Als Vorlage speichern“, Löschen; alle Dialoge bei 390 px).

## 78 · 17.10.2026 · Übersicht „Aufträge“ neu (Etappe 4)
- „Aufträge & Verlauf“ heißt „Aufträge“: eine Reiterreihe nach Status mit Zählern – Wartet auf dich · Läuft · Eingang · Alle offenen | Erledigt · Alle. „Alle“ zeigt offene und darunter erledigte Aufträge (Entscheidung Boris).
- Filter als Auswahl oben statt Häkchen-Spalte links: Abteilung/Agent (wie bisher mit Zählern, Alle/Keine) und neu **Projekt** (Ohne Projekt + Projekte der Organisation, Mehrfachauswahl, gemerkt; gilt auch fürs Archiv). Zeitfenster und „Abgebrochene zeigen“ bei Erledigt und Alle; Sortierschalter im Eingang.
- Organisation und „+ Neuer Auftrag“ im Kopf; Projekt erscheint in der Auftragszeile; Klick auf eine Eingangszeile öffnet den Auftrag. Verwerfen aus dem Eingang mit „Behalten“ / „Ja, verwerfen“.
- Handy: Reiter brechen um, Auswahlmenüs über die volle Breite.
- Smoke-Test: 122 Prüfungen (neu: Reiter „Alle“, Projektfilter, Reiter „Wartet auf dich“).

## 77 · 17.10.2026 · Ein Fenster je Auftrag (Etappe 3)
- „Ergebnis“ und „Details“ sind zusammengelegt (`16a-auftrag-fenster.js`, `jobView`); `resultModal` und `jobModal` leiten dorthin weiter, alle Einstiege bleiben gleich.
- Links steht, was zu tun ist: Freigabe/Rückfrage mit allen Antwort-Optionen und den Ergebnissen direkt darin, Feld „Änderung wünschen“ (geht als „Ändern: …“ an Claude), Plan des KI-Teamleiters mit Agentenwahl je Schritt, „Claude arbeitet“ mit Stand laden/Erneut anstoßen, „Nächster Schritt“ bei manuellen Aufträgen, „Im Eingang“ mit „Jetzt starten“. Danach Rückmeldung, Ergebnisse, Teilaufträge und der formatierte Auftragstext mit Bildern.
- Rechts: Fortschritt als Schrittliste (Ablaufbild aufklappbar, wird erst beim Aufklappen gezeichnet), Claude-Sitzungen, Verlauf (gekürzt, „alle Einträge“), Datenspur, Verbrauch.
- Eine Antwort-Option „Abbrechen“ wird nicht mehr als Antwort an Claude angeboten; abgebrochen wird nur über „Auftrag abbrechen“ im Fuß (vorher je Fenster unterschiedlich).
- „Auftrag löschen …“ im Menü ⋯ mit eigenem Bestätigungsfenster (was verloren geht, „nicht rückgängig“, „Endgültig löschen“ / „Behalten“).
- Smoke-Test: 119 Prüfungen.

## 76 · 17.10.2026 · „Neuer Auftrag“ neu aufgebaut, Sammeln im selben Fenster, „Claude direkt“ (Etappe 2)
- „Neuer Auftrag“ in zwei Spalten: links Kurzbezeichnung, großes Auftragsfeld mit Formatierungsleiste (fett, kursiv, Zwischenüberschrift, Aufzählung, Nummerierung, Link) und Bildablage; rechts „Wer erledigt den Auftrag?“ als Liste (Claude direkt · Abteilung · Bestimmter Agent · Prozess) mit dem jeweils passenden Feld (Team, Agent, Skill, Prozess, „Von Claude ausführen lassen“), „Wie gründlich?“ als Umschalter und „Freigabe“. Organisation und Projekt im Kopf, Zusammenfassung im Fuß.
- Formatierter Auftragstext wird als einfaches Markdown im bisherigen Feld gespeichert (`17b-text-format.js`); alter Klartext bleibt gültig, eingefügter Text aus Word/Mail wird bereinigt, Claude bekommt den Text unverändert. Auftragskarten zeigen einen Klartext-Auszug.
- Sammeln: kein eigenes Fenster mehr – „Neuer Auftrag“ im Sammel-Modus (Hinweis „wird gesammelt“, Block „Für den Eingang“ mit Priorität und Fälligkeit). „📥 Nur sammeln“ erscheint bei Abteilung und Agent; „Nicht sammeln“ schaltet zurück.
- „Freie Aufgabe“ heißt sichtbar „Claude direkt“ (Auswahl, Kartenzeilen, Verlauf, Übersicht, Prozessknoten ohne festen Agenten). Interner Wert `frei` bleibt; der Systemablauf heißt weiter „Freie Aufgabe“.
- Element-IDs und Speicherlogik unverändert. Smoke-Test: 119 Prüfungen (neu: formatierter Auftragstext hin und zurück, Bereinigung beim Einfügen, alter Klartext).

## 75 · 17.10.2026 · Dialog-Bausteine und neue kleine Rückfragen (Etappe 1)
- Neue gemeinsame Stile für die Auftrags-Dialoge (`.dx-*` in `1-stile.css`, Dunkel-Regeln über `tools/dunkel.py`): Kopf mit Status, Fuß mit Zusammenfassung, zwei Spalten (unter 860 px einspaltig), Statuspillen, Schrittliste, Karten, Menüs, Chips.
- Kleine Rückfragen (`askOk`, `askText`) mit Titelzeile, Erklärung und eindeutigen Knöpfen; Rückgabewerte unverändert, gilt an allen rund 40 Stellen. Gefährliche Aktionen mit rotem Knopf.
- „Auftrag abbrechen?“: Folgen als Liste, Knöpfe „Weiterlaufen lassen“ / „Ja, abbrechen“. Rückfrage und Notiz mit mehrzeiligem Feld und Bezug zum Auftrag (Strg+Enter speichert).
- Smoke-Test: 118 Prüfungen.

## 74 · 17.10.2026 · Sicherheitsnetz für den Dialog-Umbau (Plan „Dialoge rund um Aufträge“, Etappe 0)
- Vor dem Umbau gesichert: Git-Tag `sicherung-vor-dialog-umbau-v73`, Datenbank-Export und Live-Seite unter `05 Datensicherung 2026-10-17`.
- Smoke-Test um 12 Verhaltens-Prüfungen erweitert, die nicht vom Aussehen abhängen: Auftrag je Art (Claude direkt mit Skill/Tempo/Freigabe/Projekt, Abteilung mit Team, Agent mit Skill, Prozess mit und ohne Claude), Art wechseln behält Titel und Text, Sammeln mit Priorität und Fälligkeit, Antwort-Option, Änderungswunsch, Abbrechen, Fortschritt pflegen, Löschen nur nach Bestätigung.
- Keine sichtbare Änderung. Smoke-Test: 118 Prüfungen.

## 73 · 17.10.2026 · Produktname „Organigraph“ (Entscheidung Boris)
- Seitentitel, Kopfzeile, Hinweise, Einstellungen und Texte für Claude heißen jetzt „Organigraph“ statt „My Company OS“/„Company OS“.
- Instanzname „(My) Company OS …“ wird beim Laden einmalig in „Organigraph …“ umbenannt und gespeichert (`nameMigrieren`); neue Instanzen starten mit „Organigraph business//acts“.
- Seitenüberschrift des Organigramms: „Unternehmensorganigramm“; der Menüpunkt bleibt kurz „Organigramm“.
- Kontextblock an Claude heißt „KONTEXT AUS ORGANIGRAPH“, eigene Rückfragen tragen den Absender „Organigraph“; ältere Aufträge mit Absender „Company OS“ werden weiter erkannt (`SYSFROM`). Anweisung `anweisung/ki-auftrag.txt` entsprechend angepasst.
- Hinweis „Organigraph abgleichen“ in den Skills; Plugin-Name in der Rückgabe: `organigraph-agenten`.
- Build-Datei heißt jetzt `dist/organigraph.html`. Adresse der Live-Seite, Datenbank und interne Kennungen bleiben unverändert.
- Smoke-Test: 106 Prüfungen (neu: Produktname).

## 72 · 17.10.2026 · Agenten-Assistent nach Feedback, Skill-Gruppen (Freigabe Boris)
- Assistent: Produkt (aus der Organisation) und Platz (aus dem Knopf) stehen fest und werden nur angezeigt.
- Skills-Schritt in voller Breite: oben **Vorschläge von Claude** aus Name und Ziel (einzeln oder alle übernehmen, „Neu vorschlagen“; läuft beim ersten Öffnen bzw. nach Änderung von Name oder Ziel automatisch, über das Abo), darunter die Auswahl als Leiste und der Katalog in aufklappbaren Gruppen (zu Beginn zu, Suche öffnet Gruppen mit Treffern, „Alle auf/zu“).
- Regeln-Schritt: nur die Regeln der gewählten Skills (je Skill, mit Kern/Produkt-Herkunft) und eigene Regeln; die allgemeinen Vorgaben bleiben in der Ansicht „Agenten“.
- Skill-Gruppen mit festen Kennungen statt Listenposition (`11a-skill-gruppen.js`); ältere Daten werden beim Laden umgestellt. Neu: ⚙ Einstellungen › Skill-Gruppen (anlegen, umbenennen, ordnen, entfernen – über ✎ Bearbeiten).
- Die Skill-Auswahl im Agenten-Editor ist ebenfalls aufklappbar (gemeinsame Komponente).
- Smoke-Test: 105 Prüfungen.

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
