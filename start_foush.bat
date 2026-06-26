@echo off
title Foush POS Local Server
echo Checking Node.js installation...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ==============================================================
    echo Node.js is NOT installed on this computer!
    echo Node.js غير مثبت على هذا الجهاز، وهو ضروري لتشغيل النظام.
    echo ==============================================================
    echo.
    set /p CHOICE="Would you like to install the bundled Node.js now? هل تريد تثبيت البرنامج الآن؟ (Y/N): "
    if /i "%CHOICE%"=="Y" goto INSTALL_NODE
    if /i "%CHOICE%"=="y" goto INSTALL_NODE
    echo Node.js is required. Exiting...
    pause
    exit
)

:START_SERVER
echo Starting Foush POS System... Please wait.
cd /d "%~dp0local-server"
start /min cmd /c "node server.js"

:: Wait 3 seconds for server to start
timeout /t 3 /nobreak >nul

:: Launch browser (checking for Chrome in common paths)
set "CHROME_PATH="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%LocalAppData%\Google\Chrome\Application\chrome.exe"
)

if defined CHROME_PATH (
    start "" "%CHROME_PATH%" --app=http://localhost:3000/index.html?t=%RANDOM%
) else (
    :: Fallback to chrome.exe in PATH, if that fails fallback to default browser
    start "" chrome.exe --app=http://localhost:3000/index.html?t=%RANDOM% 2>nul
    if %errorlevel% neq 0 (
        start http://localhost:3000/index.html?t=%RANDOM%
    )
)
exit

:INSTALL_NODE
:: Check if architecture is 64-bit
set "MSI_NAME=node-v13.14.0-x86.msi"
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" set "MSI_NAME=node-v13.14.0-x64.msi"
if "%PROCESSOR_ARCHITEW6432%"=="AMD64" set "MSI_NAME=node-v13.14.0-x64.msi"

set "INSTALLER_PATH=%~dp0%MSI_NAME%"
if not exist "%INSTALLER_PATH%" (
    echo Installer file %MSI_NAME% not found in root directory!
    pause
    exit
)

echo Running installer %MSI_NAME%...
msiexec /i "%INSTALLER_PATH%"
echo.
echo Node.js installation finished! Please run start_foush.bat again to start the POS.
pause
exit
