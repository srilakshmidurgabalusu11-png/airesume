@echo off
title AI-Powered Resume Screening and Candidate Intelligence System
echo ===============================================================================
echo   AI-POWERED RESUME SCREENING AND CANDIDATE INTELLIGENCE SYSTEM
echo   CSE Master's Final Year Project (M.Tech / MS CSE)
echo ===============================================================================
echo.
echo Starting Backend (FastAPI on http://localhost:8000)...
start cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo Starting Frontend (Vite + React on http://localhost:5173)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ===============================================================================
echo   Applications are launching:
echo   - Backend API Docs: http://localhost:8000/docs
echo   - Frontend Portal:  http://localhost:5173
echo ===============================================================================
pause
