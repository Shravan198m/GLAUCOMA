# =============================================================================
#  GLAUCOMA DETECTION SYSTEM - ONE-COMMAND START
# =============================================================================
#
#  Run from anywhere:
#    powershell -ExecutionPolicy Bypass -File START_PROJECT.ps1
#
#  Or from the GLAUCOMA folder:
#    .\START_PROJECT.ps1
#
#  Or double-click:  start.bat
#
# =============================================================================

$ErrorActionPreference = "Stop"

# Project root = folder where this script lives
if ($PSScriptRoot) {
    $Root = $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
    $Root = Split-Path -Parent $MyInvocation.MyCommand.Path
} else {
    Write-Host "ERROR: Run this as a file, not by pasting into the terminal." -ForegroundColor Red
    Write-Host "  cd C:\Users\svmoo\OneDrive\Documents\GLAUCOMA" -ForegroundColor Yellow
    Write-Host "  powershell -ExecutionPolicy Bypass -File START_PROJECT.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  GlaucomaAI - Starting API + Frontend" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  $Root" -ForegroundColor DarkGray
Write-Host ""

# --- Python ---
$Python = Join-Path $Root ".venv\Scripts\python.exe"
if (-not (Test-Path $Python)) {
    $Python = Join-Path $Root "glaucoma_project\venv\Scripts\python.exe"
}
if (-not (Test-Path $Python)) {
    Write-Host "[X] Python venv not found." -ForegroundColor Red
    Write-Host ""
    Write-Host "First-time setup:" -ForegroundColor Yellow
    Write-Host "  cd `"$Root`"" -ForegroundColor White
    Write-Host "  python -m venv .venv" -ForegroundColor White
    Write-Host "  .\.venv\Scripts\pip install -r glaucoma_project\requirements.txt" -ForegroundColor White
    Write-Host "  cd glaucoma-app && npm install" -ForegroundColor White
    exit 1
}
Write-Host "[OK] Python: $Python" -ForegroundColor Green

# --- Node ---
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[X] npm not found. Install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] npm found" -ForegroundColor Green

# --- Frontend deps ---
$AppDir = Join-Path $Root "glaucoma-app"
if (-not (Test-Path (Join-Path $AppDir "node_modules"))) {
    Write-Host "[..] Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location $AppDir
    npm install
    if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
    Pop-Location
    Write-Host "[OK] npm install done" -ForegroundColor Green
}

# --- Model ---
$Model = Join-Path $Root "glaucoma_project\outputs\models\best_model.pth"
if (-not (Test-Path $Model)) {
    Write-Host "[!] Model missing: best_model.pth (predictions will fail)" -ForegroundColor Yellow
} else {
    Write-Host "[OK] Model weights found" -ForegroundColor Green
}

# --- Ports ---
try {
    if (Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue) {
        Write-Host "[!] Port 8000 in use - close old API window or it may conflict" -ForegroundColor Yellow
    }
    if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue) {
        Write-Host "[!] Port 5173 in use - close old frontend window or it may conflict" -ForegroundColor Yellow
    }
} catch { }

# --- Launch scripts (temp files work reliably on OneDrive paths) ---
$ApiDir = Join-Path $Root "glaucoma_project"
$ApiLauncher = Join-Path $env:TEMP "glaucoma_api.ps1"
$FeLauncher = Join-Path $env:TEMP "glaucoma_fe.ps1"

@(
    "Set-Location -LiteralPath '$ApiDir'"
    "Write-Host '=== GlaucomaAI API ===' -ForegroundColor Cyan"
    "Write-Host 'http://localhost:8000  |  Docs: /docs' -ForegroundColor Green"
    "Write-Host 'Ctrl+C to stop' -ForegroundColor Yellow"
    "Write-Host ''"
    "& '$Python' -m uvicorn src.api:app --host 0.0.0.0 --port 8000"
) | Set-Content -Path $ApiLauncher -Encoding UTF8

@(
    "Set-Location -LiteralPath '$AppDir'"
    "Write-Host '=== GlaucomaAI Frontend ===' -ForegroundColor Cyan"
    "Write-Host 'http://localhost:5173' -ForegroundColor Green"
    "Write-Host 'Ctrl+C to stop' -ForegroundColor Yellow"
    "Write-Host ''"
    "npm run dev"
) | Set-Content -Path $FeLauncher -Encoding UTF8

Write-Host ""
Write-Host "Starting API (port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $ApiLauncher

Write-Host "Waiting for API..." -ForegroundColor Yellow
$ready = $false
for ($i = 0; $i -lt 45; $i++) {
    Start-Sleep -Seconds 2
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 3
        if ($r.StatusCode -eq 200) { $ready = $true; break }
    } catch { }
}
if ($ready) {
    Write-Host "[OK] API is ready" -ForegroundColor Green
} else {
    Write-Host "[!] API slow to start - check the API window for errors" -ForegroundColor Yellow
}

Write-Host "Starting frontend (port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $FeLauncher

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  READY" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  App      http://localhost:5173" -ForegroundColor White
Write-Host "  API      http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "  Stop: close the two PowerShell windows or Ctrl+C in each." -ForegroundColor DarkGray
Write-Host ""
