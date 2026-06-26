@echo off
title Clear Foush POS Test Data
echo ====================================================================
echo WARNING: This will permanently delete all test sales, shifts, and
echo expenses. It will preserve your menu, employees, and settings.
echo.
echo تحذير: هذا الإجراء سيقوم بمسح كافة المبيعات والمصاريف التجريبية نهائياً.
echo سيتم الاحتفاظ بالمنيو والموظفين والإعدادات الحالية كما هي.
echo ====================================================================
echo.
set /p CHOICE="Are you sure you want to clear all test data? هل تريد المسح؟ (Y/N): "
if /i "%CHOICE%"=="Y" goto CLEAR_DATA
if /i "%CHOICE%"=="y" goto CLEAR_DATA
echo.
echo Operation cancelled. Exiting...
timeout /t 3 >nul
exit

:CLEAR_DATA
echo.
echo Clearing test data...
cd /d "%~dp0local-server"
node clear_test_data.js
echo.
pause
exit
