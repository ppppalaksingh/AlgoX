@echo off

cd /d "%~dp0"

call venv\Scripts\activate.bat

uvicorn app.main:app --reload --port 8000

pause