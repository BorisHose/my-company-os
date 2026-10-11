# Software und Git – My Company OS

Stand: 10.10.2026 · Entscheidungen von Boris

## Entscheidungen
- **Ablage des Codes:** Unterordner `07 Software` im Company-OS-Ordner. Nur dieser Ordner wird ein Git-Repository; Konzepte, Mobil, Datensicherung usw. bleiben außerhalb.
- **Git-Konto:** ausschließlich Boris' privates GitHub-Konto **BorisHose** (github.com/BorisHose). Das business//acts-Git (git.businessacts.de) wird für Company OS **nicht** verwendet.
- **Repository:** `my-company-os`, **privat** → https://github.com/BorisHose/my-company-os (Umbenennen später möglich, Produktname noch offen).
- **Arbeitsteilung beim Push:** Claude richtet Git lokal ein, committet die Entwicklungsstände und setzt den Remote. Boris pusht unter Windows mit seinem gespeicherten Git-Login (wie bei sellify_Lab). Claude trägt keine Tokens oder Passwörter ein.
- **Projekt-Dashboard:** Company OS ist seit 10.10.2026 in `Claude/project-dashboard/projects.json` als Doku-Projekt (`type: docs`) eingetragen.

## Ablauf bei der ersten Software (Auslöser: erster lauffähiger Code)
1. Boris legt auf GitHub unter BorisHose das leere, private Repo `my-company-os` an (ohne README/Lizenz, damit der erste Push sauber durchgeht).
2. Claude legt den Code in `07 Software` ab, mit `.gitignore` (u. a. `node_modules/`, `.env`, `logs/`), `.env.example`, `README.md` und `package.json` (`start`-Skript, fester Port).
3. Claude führt `git init -b main`, ersten Commit und `git remote add origin https://github.com/BorisHose/my-company-os.git` aus. Hinweis: Git im OneDrive-Ordner braucht Löschrechte für Sperrdateien – Claude fragt dafür einmal nach.
4. Boris pusht unter Windows: `git push -u origin main` im Ordner `07 Software` (alternativ über das Dashboard, sobald dort Push möglich ist).
5. Claude stellt den Dashboard-Eintrag um: Pfad auf `…/My company OS/07 Software`, `type` entfernen, `url` (http://localhost:<Port>), `startCmd`/`startArgs` setzen – dann zeigt das Dashboard an, ob der Node.js-Server läuft, und die Git-Infos.
6. Danach: jeder relevante Entwicklungsstand wird von Claude committet (aussagekräftige Commit-Nachricht), Boris pusht.

## Port
Vorschlag (Annahme von Claude, noch nicht festgelegt): einen freien Port außerhalb der belegten wählen. Belegt laut Dashboard: 3000, 3001, 3002, 3030, 3100, 3737, 5173, 5174.

## Hintergrund: Projekt-Dashboard
- Ort: `C:\SD\BorisPrivat\OneDrive\Claude\project-dashboard` (Node/Express, `server.js`), läuft auf http://localhost:3030, gestartet per PM2 (`ecosystem.config.js`, `start-dashboard.ps1`, Watchdog/Supervisor).
- Projekte in `projects.json` (Name, Pfad, URL, Startbefehl); prüft Erreichbarkeit (Health), zeigt letzten Commit, Diff, Commit-Funktion, Remotes; Git-Server in `git-servers.json` („Boris privat“ = github.com/BorisHose, „b//a“ = git.businessacts.de).
