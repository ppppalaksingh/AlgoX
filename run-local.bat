@echo off
title AlgoX - Launch All Services

echo ===================================================
echo             Starting AlgoX Dashboard
echo ===================================================
echo.

echo [1/3] Starting ML Service on http://localhost:8000...
start "AlgoX ML Service" cmd /k "cd /d "%~dp0ml-service" && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend on http://localhost:5000...
start "AlgoX Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend on http://localhost:5173...
start "AlgoX Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================
echo   All 3 services are running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:5000
echo   ML Docs  : http://localhost:8000/docs
echo ===================================================
echo.
pause
