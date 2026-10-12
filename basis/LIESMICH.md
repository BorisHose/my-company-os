# Basis · genereller Prototyp und Kern

## Kern v2 (ab 12.10.2026)
`kern/` enthält den gemeinsamen Rahmen im Bodo-Aufbau (siehe `kern/LIESMICH.md`). Alle Fassungen v2 werden daraus gebaut:
- allgemeine Fassung (Pilot business//acts + Bodo Solutions): `../ableitungen/pilot-business-acts-bodo/`
- abcfinance: `../ableitungen/abcfinance/`

## Bisheriger genereller Prototyp (unverändert)
`company-os-prototyp.html` ist der bisherige generelle Prototyp von Company OS. Er startet als „Musterfirma“ (erfundene Daten). Über den Knopf „Pilotdaten zeigen“ enthält er auch interne Pilotdaten – die Datei deshalb nicht unverändert an Kunden geben; Kunden bekommen eine Ableitung.

Veröffentlicht: Company OS Prototyp – https://claude.ai/artifact/9hY1WKqMz4Ziy4En4QGHwM

Zurück zum Stand vor Kern v2: Git-Tag `stand-vor-kern-v2-generell` (`git checkout stand-vor-kern-v2-generell`). Die bisherigen Dateien und Artefakte sind zusätzlich unverändert vorhanden.

Kundenspezifische Fassungen entstehen unter `../ableitungen/`. Wer hier etwas ändert, prüft danach die Ableitungen (`build.py` meldet, wenn Zeilenanker nicht mehr passen).
