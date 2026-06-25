@echo off
title Foush POS Local Server
echo Starting Foush POS System... Please wait.
cd /d "C:\Users\dell\Desktop\foush\local-server"

:: Start the node server in a minimized window
start /min cmd /c "node server.js"

:: Wait 1 second for the server to start
timeout /t 1 /nobreak >nul

start http://localhost:3000/index.html

exit
