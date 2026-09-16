#!/bin/bash

# AI-Powered Resume Screening and Candidate Intelligence System
# One-Click Launch Script for macOS and Linux

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "==============================================================================="
echo "  AI-POWERED RESUME SCREENING AND CANDIDATE INTELLIGENCE SYSTEM"
echo "  CSE Master's Final Year Project (M.Tech / MS CSE)"
echo "==============================================================================="
echo ""

# Ensure backend .env exists
if [ ! -f "$PROJECT_ROOT/backend/.env" ]; then
    echo "[INFO] Creating backend/.env from .env.example..."
    cp "$PROJECT_ROOT/backend/.env.example" "$PROJECT_ROOT/backend/.env"
fi

# 1. Setup Backend Environment if needed
if [ ! -d "$PROJECT_ROOT/backend/venv" ]; then
    echo "[INFO] Setting up Python virtual environment..."
    python3 -m venv "$PROJECT_ROOT/backend/venv"
    "$PROJECT_ROOT/backend/venv/bin/pip" install --upgrade pip
    "$PROJECT_ROOT/backend/venv/bin/pip" install -r "$PROJECT_ROOT/backend/requirements.txt"
fi

# 2. Setup Frontend dependencies if needed
if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    echo "[INFO] Installing frontend dependencies..."
    (cd "$PROJECT_ROOT/frontend" && npm install)
fi

echo "[INFO] Starting FastAPI Backend on http://localhost:8000..."
"$PROJECT_ROOT/backend/venv/bin/uvicorn" app.main:app --app-dir "$PROJECT_ROOT/backend" --reload --port 8000 &
BACKEND_PID=$!

echo "[INFO] Starting React + Vite Frontend on http://localhost:5173..."
(cd "$PROJECT_ROOT/frontend" && npm run dev) &
FRONTEND_PID=$!

cleanup() {
    echo ""
    echo "[INFO] Shutting down AI Resume Screening System..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID 2>/dev/null || true
    wait $FRONTEND_PID 2>/dev/null || true
    echo "[INFO] All services stopped gracefully."
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

echo ""
echo "==============================================================================="
echo "  Applications are live and accessible:"
echo "  - Backend API & Interactive Docs: http://localhost:8000/docs"
echo "  - Frontend Candidate & Recruiter Portal: http://localhost:5173"
echo "==============================================================================="
echo "Press Ctrl+C to terminate both servers."

wait
