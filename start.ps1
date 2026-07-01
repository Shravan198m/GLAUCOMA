# Backward-compatible launcher -> START_PROJECT.ps1
# Run as:  .\start.ps1   (do not paste these lines into the terminal)

$ErrorActionPreference = "Stop"

if ($PSScriptRoot) {
    $Root = $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
    $Root = Split-Path -Parent $MyInvocation.MyCommand.Path
} elseif (Test-Path (Join-Path (Get-Location) "START_PROJECT.ps1")) {
    $Root = (Get-Location).Path
} else {
    Write-Host "ERROR: Could not find project root." -ForegroundColor Red
    Write-Host ""
    Write-Host "Run one of these from the GLAUCOMA folder:" -ForegroundColor Yellow
    Write-Host "  .\START_PROJECT.ps1" -ForegroundColor Cyan
    Write-Host "  .\start.bat" -ForegroundColor Cyan
    Write-Host "  powershell -ExecutionPolicy Bypass -File START_PROJECT.ps1" -ForegroundColor Cyan
    exit 1
}

$MainScript = Join-Path $Root "START_PROJECT.ps1"
if (-not (Test-Path $MainScript)) {
    Write-Host "ERROR: START_PROJECT.ps1 not found at: $MainScript" -ForegroundColor Red
    exit 1
}

& $MainScript @args
