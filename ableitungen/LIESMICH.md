# Ableitungen von Company OS

Eine Ableitung ist eine kundenspezifische Fassung des generellen Prototyps aus `basis/`.
Jede Ableitung = **Basis + Kundenkonfiguration + ggf. Erweiterungen**.

## Aufbau je Ableitung
```
ableitungen/<kunde>/
  LIESMICH.md      Zweck, Stand, Links, auf welchem Basis-Stand aufgebaut, Erweiterungen
  konfiguration/   Kundendaten und Bauskript; erzeugt die Dateien in prototyp/
  prototyp/        erzeugte Prototypen (nicht von Hand ändern, sondern neu bauen)
  konzept/         kundenspezifische Konzepte
```
Neue Ableitung: Ordner `_vorlage` kopieren und umbenennen.

## Regeln
- In `prototyp/` nie von Hand ändern – Änderungen in `konfiguration/`, dann neu bauen.
- In der LIESMICH steht der Basis-Stand (Commit), auf dem die Ableitung aufbaut. Ändert sich die Basis, Ableitung prüfen und neu bauen.
- Was eine Ableitung an Funktionen ergänzt („Erweiterung“), ist ein Kandidat für die Basis.
- Echte Kundendaten nur in internen Ableitungen; diese in der LIESMICH als **nur intern** kennzeichnen.

## Ableitungen
| Ordner | Kunde / Zweck | Daten |
|---|---|---|
| `abcfinance/` | Posteingang mit KI (ASS) für abcfinance | Beispieldaten, kundentauglich |
| `pilot-business-acts-bodo/` | interner Pilot Bodo Solutions · business//acts | echte Bodo-Daten, **nur intern** |
