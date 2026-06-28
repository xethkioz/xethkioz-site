# XETHKIOZ Windows Clean Install Helper
# Run from Web_GITHUB with PowerShell.

Write-Host "XETHKIOZ clean install starting..." -ForegroundColor Cyan

npm config set registry https://registry.npmjs.org/

if (Test-Path node_modules) {
  Write-Host "Removing node_modules..." -ForegroundColor Yellow
  Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}

if (Test-Path dist) {
  Write-Host "Removing dist..." -ForegroundColor Yellow
  Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
}

if (Test-Path tsconfig.tsbuildinfo) {
  Remove-Item -Force tsconfig.tsbuildinfo -ErrorAction SilentlyContinue
}

Write-Host "Installing dependencies with npm ci..." -ForegroundColor Cyan
npm ci

Write-Host "Running deploy check..." -ForegroundColor Cyan
npm run deploy:check
