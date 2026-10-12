# Ableitung abcfinance · Posteingang mit KI (ASS)

Stand: 12.10.2026 · Basis: `basis/company-os-prototyp.html`, Commit ef475e3
Ansprechpartner intern: Boris, Andreas (business//acts)

## Zweck
Die heutige Posteingangsverarbeitung von abcfinance in sellify (Kennbegriffe je Dokumenttyp, Deckungsgrad, Aufgaben dahinter) als KI-gestützter Prozess in Company OS. Zum Vorführen bei abcfinance gedacht; enthält nur Beispieldaten.

## Dateien
| Datei | Was |
|---|---|
| `prototyp/company-os-prototyp-abcfinance.html` | **Hauptfassung:** genereller Prototyp, konfiguriert für abcfinance, mit Seite „ASS-Abgleich“ (vorhanden / Umdeutung / Erweiterung) |
| `prototyp/ass-prototyp-abcfinance.html` | erste Fassung: eigenständiger ASS-Prototyp ohne Company-OS-Funktionen |
| `konfiguration/data.js` | abcfinance-Daten: Dokumenttypen, Mails, Organigramm, Prozesse, Agenten, Skills, Übergabewege |
| `konfiguration/fn.js` | angepasste und neue Ansichten (Auftragsprotokoll, Skill-Profile, ASS-Abgleich) |
| `konfiguration/extra.css` | zusätzliche Stile |
| `konfiguration/build.py` | baut die Hauptfassung: `python build.py` |
| `konfiguration/ass/` | Quelle und Bauskript der ersten Fassung: `python ass/build_ass.py` |
| `prototyp/company-os-abcfinance-v2.html` | **Fassung v2 (Entwurf):** Aufbau nach dem Bodo-Muster – Menü, Tagesleiste, Übersichten, Detailseiten mit Sprungmarken, zweigeteiltes Postfach |
| `basis/kern/kern.css`, `kern.js` | **Kern** (seit 12.10.2026 in `basis/kern`, gemeinsam mit der allgemeinen Fassung): Rahmen und Seitentypen ohne Kundendaten |
| `konfiguration/v2/abc-v2.css`, `abc-v2.js` | abcfinance-Ansichten für den Kern; Daten kommen aus `konfiguration/data.js` (dieselben wie Hauptfassung) |
| `konfiguration/v2/build_v2.py` | baut die Fassung v2: `python v2/build_v2.py` |
| `konzept/` | Strukturvorschlag (Screenshot und Quelle) |

## Veröffentlicht (private Seiten auf claude.ai)
- Company OS Prototyp abcfinance – https://claude.ai/artifact/RSqJ1Q2eSgxHvoPfGV8hsZ
- ASS Prototyp abcfinance – https://claude.ai/artifact/65sSurfxFqaoRDuw2GcjaD
- Company OS abcfinance v2 (Bodo-Aufbau, Entwurf) – https://claude.ai/artifact/Mj3uNW1UYRGungjA9VWGkV

## Erweiterungen gegenüber der Basis (Kandidaten für die Basis)
1. Start durch Ereignis (neue E-Mail) und Anschluss-Rolle „Eingangskanal“
2. Schwelle in der Entscheidung (Wert aus dem Vorschritt gegen Schwelle im Skill-Profil)
3. Auftragsprotokoll mit Ergebnis, Sicherheit und Begründung je Schritt
4. Sammelansicht der Aufträge und Kennzahlen je Prozess

## Fassung v2 und Kern
- v2 übernimmt den strukturellen Aufbau des Bodo-Entwurfs (Ordner „Bodo - UX/UI/Sprungmarken-Entwurf“): Menü mit Gruppen, Tagesleiste, Startseite mit Kacheln, Übersichten mit Reitern und Tabelle, Detailseite mit Kopf, Karten, Sprungmarken und Bereichen, Postfach zweigeteilt.
- Ziel: Ein Kern für alle Ausprägungen (generelle Fassung business//acts · Bodo, abcfinance, weitere Kunden). Der Kern-Entwurf liegt vorerst hier und wandert nach Freigabe nach `basis/`.
- Die bisherige Hauptfassung bleibt unverändert bestehen, bis v2 freigegeben ist.

## Hinweise
- `build.py` übernimmt Funktionen über feste Zeilenbereiche aus der Basis und prüft vorher Ankerzeilen. Ändert sich die Basis, bricht der Bau mit Meldung ab. Dauerhafte Lösung: Basis in Kern und Daten trennen.
- Beide Prototypen wurden nach dem Umzug neu gebaut und sind byte-gleich mit den veröffentlichten Fassungen.
- KI-Werte (Sicherheit, Begründung) sind feste Beispielwerte; live berechnet wird nur der Deckungsgrad der Kennbegriffe.
