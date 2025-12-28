$ErrorActionPreference = "Stop"

Write-Host "Starting frontend deploy..." -ForegroundColor Cyan

# Paths (resolved relative to frontend directory)
$frontendDist = Join-Path $PSScriptRoot "dist"
$frontendImages = Join-Path $PSScriptRoot "images"
$backendFrontendDist = Join-Path $PSScriptRoot "..\backend\frontend\dist"

# 1. Build frontend
Write-Host "Running Vite build..." -ForegroundColor Cyan
npx vite build

if (-not (Test-Path $frontendDist)) {
    throw "Build failed: dist folder not found."
}

# 2. Remove existing backend dist folder
if (Test-Path $backendFrontendDist) {
    Write-Host "Removing existing backend dist..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $backendFrontendDist
}

# Ensure target directory exists
New-Item -ItemType Directory -Path $backendFrontendDist | Out-Null

# 3. Copy dist to backend
Write-Host "Copying dist to backend..." -ForegroundColor Cyan
Copy-Item -Recurse -Force $frontendDist\* $backendFrontendDist

# 4. Copy images to backend dist (if present)
if (Test-Path $frontendImages) {
    Write-Host "Copying images to backend dist..." -ForegroundColor Cyan
    Copy-Item -Recurse -Force $frontendImages $backendFrontendDist
} else {
    Write-Host "No images folder found, skipping." -ForegroundColor Yellow
}

Write-Host "Deploy completed successfully." -ForegroundColor Green
