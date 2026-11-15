@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js 22 veya ustunu kurup tekrar acin: https://nodejs.org/
 pause
 exit /b 1
)
set "KULE_OPEN_BROWSER=1"
echo Oyun baslatiliyor. Dogru adres tarayicida otomatik acilacak.
echo 3000 portu doluysa baska bir bos port secilecek.
node server.mjs
pause
