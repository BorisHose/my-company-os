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
| `konzept/` | für das ASS-Konzept (noch leer) |

## Veröffentlicht (private Seiten auf claude.ai)
- Company OS Prototyp abcfinance – https://claude.ai/artifact/RSqJ1Q2eSgxHvoPfGV8hsZ
- ASS Prototyp abcfinance – https://claude.ai/artifact/65sSurfxFqaoRDuw2GcjaD

## Erweiterungen gegenüber der Basis (Kandidaten für die Basis)
1. Start durch Ereignis (neue E-Mail) und Anschluss-Rolle „Eingangskanal“
2. Schwelle in der Entscheidung (Wert aus dem Vorschritt gegen Schwelle im Skill-Profil)
3. Auftragsprotokoll mit Ergebnis, Sicherheit und Begründung je Schritt
4. Sammelansicht der Aufträge und Kennzahlen je Prozess

## Hinweise
- `build.py` übernimmt Funktionen über feste Zeilenbereiche aus der Basis und prüft vorher Ankerzeilen. Ändert sich die Basis, bricht der Bau mit Meldung ab. Dauerhafte Lösung: Basis in Kern und Daten trennen.
- Beide Prototypen wurden nach dem Umzug neu gebaut und sind byte-gleich mit den veröffentlichten Fassungen.
- KI-Werte (Sicherheit, Begründung) sind feste Beispielwerte; live berechnet wird nur der Deckungsgrad der Kennbegriffe.
