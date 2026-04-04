@echo off
echo ========================================================
echo        Starting Tri-Netra Dashboard (Production)
echo ========================================================
echo.
echo Starting backend server...
start "Tri-Netra Backend" cmd /c "cd backend && venv\Scripts\activate.bat && python app.py"
echo Waiting 5 seconds for backend to start...
timeout /t 5 >nul
echo.
echo Starting LocalTunnel to expose the Dashboard...
echo Your public URL will appear below (it might take a few seconds).
echo Press Ctrl+C to stop sharing.
cmd /c "npx localtunnel --port 5000"
