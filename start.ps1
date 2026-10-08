# TaskLink Interactive Runner Script (PowerShell)
param (
    [string]$Service = "mobile" # mobile | api | matching | test | all
)

# Ensure portable node and python are in PATH
$env:Path = "C:\Users\mohit\tools\node;C:\Users\mohit\tools\python;C:\Users\mohit\tools\python\Scripts;" + $env:Path

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   TaskLink - Cooperative Gig Marketplace (0% Commission)  " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

switch ($Service.ToLower()) {
    "mobile" {
        Write-Host "Launching Mobile Map Discovery App on http://localhost:5173..." -ForegroundColor Green
        Set-Location "$PSScriptRoot\apps\mobile"
        npm.cmd run dev
    }
    "admin" {
        Write-Host "Launching Federation Admin Web Dashboard on http://localhost:5174..." -ForegroundColor Green
        Set-Location "$PSScriptRoot\apps\admin"
        npm.cmd run dev
    }
    "api" {
        Write-Host "Launching Node.js API Gateway on http://localhost:4000..." -ForegroundColor Green
        Set-Location "$PSScriptRoot\services\api"
        node dist/services/api/src/index.js
    }
    "matching" {
        Write-Host "Launching Python FastAPI Six-Factor Matching Engine on http://localhost:8000..." -ForegroundColor Green
        Set-Location "$PSScriptRoot\services\matching"
        python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
    }
    "voice" {
        Write-Host "Launching AI Voice Gateway on http://localhost:4001..." -ForegroundColor Green
        Set-Location "$PSScriptRoot\services\voice"
        node dist/services/voice/src/index.js
    }
    "demo" {
        Write-Host "Running End-to-End Demo Walkthrough..." -ForegroundColor Cyan
        Set-Location "$PSScriptRoot"
        node scripts/demo_walkthrough.js
    }
    "test" {
        Write-Host "Running Python ML Matching Engine Unit Tests..." -ForegroundColor Cyan
        python "$PSScriptRoot\services\matching\tests\test_matching.py"

        Write-Host "`nRunning Phase 1 Integration Tests..." -ForegroundColor Cyan
        Set-Location "$PSScriptRoot\services\api"
        node tests/phase1.test.js
    }
    "all" {
        Write-Host "Starting all services in separate PowerShell windows..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$PSScriptRoot\services\api'; node dist/services/api/src/index.js"
        Start-Sleep -Seconds 1
        Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$PSScriptRoot\services\matching'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"
        Start-Sleep -Seconds 1
        Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$PSScriptRoot\services\voice'; node dist/services/voice/src/index.js"
        Start-Sleep -Seconds 1
        Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$PSScriptRoot\apps\mobile'; npm.cmd run dev"
        Start-Sleep -Seconds 1
        Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$PSScriptRoot\apps\admin'; npm.cmd run dev"
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:5173"
        Write-Host "All services started! Browser opened to http://localhost:5173 (Mobile App) and Admin is on http://localhost:5174" -ForegroundColor Green
    }
    default {
        Write-Host "Unknown option: $Service" -ForegroundColor Red
        Write-Host "Usage: .\start.ps1 [mobile | admin | api | matching | voice | demo | test | all]" -ForegroundColor Yellow
    }
}
