@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Lade My Company OS zu GitHub hoch ...
echo.
git push -u origin main --follow-tags
echo.
if errorlevel 1 (echo FEHLER - bitte die Meldung oben an Claude weitergeben.) else (echo Fertig - der Stand liegt jetzt auf GitHub.)
echo.
pause
