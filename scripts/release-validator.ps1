# Obsidian Multi-Git Plugin Release Validator
# This script validates and creates a safe GitHub release

param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Obsidian Multi-Git Plugin Release Validator v1.0" -ForegroundColor Cyan
Write-Host "Version: $Version" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Change to plugin directory
$pluginDir = "obsidian-multi-git-plugin"
if (-not (Test-Path $pluginDir)) {
    Write-Error "Plugin directory not found: $pluginDir"
    exit 1
}

Set-Location $pluginDir

# Step 1: Check package.json version
Write-Host "`n[1/7] Checking package.json version..." -ForegroundColor Green
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ($packageJson.version -ne $Version) {
    Write-Warning "package.json version ($($packageJson.version)) doesn't match target version ($Version)"
    $update = Read-Host "Update package.json? (y/n)"
    if ($update -eq 'y') {
        $packageJson.version = $Version
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
        Write-Host "Updated package.json to version $Version" -ForegroundColor Green
    }
}

# Step 2: Check manifest.json version
Write-Host "`n[2/7] Checking manifest.json version..." -ForegroundColor Green
$manifestJson = Get-Content "manifest.json" | ConvertFrom-Json
if ($manifestJson.version -ne $Version) {
    Write-Warning "manifest.json version ($($manifestJson.version)) doesn't match target version ($Version)"
    $update = Read-Host "Update manifest.json? (y/n)"
    if ($update -eq 'y') {
        $manifestJson.version = $Version
        $manifestJson | ConvertTo-Json -Depth 10 | Set-Content "manifest.json"
        Write-Host "Updated manifest.json to version $Version" -ForegroundColor Green
    }
}

# Step 3: Build the plugin
Write-Host "`n[3/7] Building plugin..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# Step 4: Validate build output
Write-Host "`n[4/7] Validating build files..." -ForegroundColor Green

# Check main.js
if (-not (Test-Path "main.js")) {
    Write-Error "main.js not found!"
    exit 1
}
$mainSize = (Get-Item "main.js").Length
if ($mainSize -lt 50000) {
    Write-Error "main.js is too small ($mainSize bytes). Build may have failed!"
    exit 1
}
Write-Host "✓ main.js: $mainSize bytes" -ForegroundColor Green

# Check manifest.json
if (-not (Test-Path "manifest.json")) {
    Write-Error "manifest.json not found!"
    exit 1
}
$manifestSize = (Get-Item "manifest.json").Length
Write-Host "✓ manifest.json: $manifestSize bytes" -ForegroundColor Green

# Check styles.css
if (-not (Test-Path "styles.css")) {
    Write-Error "styles.css not found!"
    exit 1
}
$stylesSize = (Get-Item "styles.css").Length
Write-Host "✓ styles.css: $stylesSize bytes" -ForegroundColor Green

# Step 5: Create release directory
Write-Host "`n[5/7] Creating release package..." -ForegroundColor Green
$releaseDir = "../release-$Version"
if (Test-Path $releaseDir) {
    Remove-Item $releaseDir -Recurse -Force
}
New-Item -ItemType Directory -Path $releaseDir | Out-Null

# Copy files
Copy-Item "main.js" "$releaseDir/"
Copy-Item "manifest.json" "$releaseDir/"
Copy-Item "styles.css" "$releaseDir/"

# Create zip
$zipPath = "../obsidian-multi-git-plugin-$Version.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}
Compress-Archive -Path "$releaseDir/*" -DestinationPath $zipPath

Write-Host "✓ Created release package: $zipPath" -ForegroundColor Green

# Step 6: Final validation
Write-Host "`n[6/7] Final validation..." -ForegroundColor Green
Write-Host "Release files:" -ForegroundColor Yellow
Get-ChildItem $releaseDir | ForEach-Object {
    Write-Host "  - $($_.Name): $($_.Length) bytes"
}

# Step 7: Git operations
Write-Host "`n[7/7] Git operations..." -ForegroundColor Green
$continue = Read-Host "Commit changes and create tag v$Version? (y/n)"
if ($continue -eq 'y') {
    Set-Location ..
    git add .
    git commit -m "Release v$Version - Validated build"
    git tag -a "v$Version" -m "Release v$Version"
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "✅ Release preparation complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Push to GitHub: git push origin main --tags" -ForegroundColor White
    Write-Host "2. GitHub Actions will automatically create the release" -ForegroundColor White
    Write-Host "3. Or manually upload these files to GitHub release:" -ForegroundColor White
    Write-Host "   - $releaseDir\main.js" -ForegroundColor Gray
    Write-Host "   - $releaseDir\manifest.json" -ForegroundColor Gray
    Write-Host "   - $releaseDir\styles.css" -ForegroundColor Gray
    Write-Host "   - $zipPath" -ForegroundColor Gray
} else {
    Write-Host "`nRelease preparation complete (no git operations)" -ForegroundColor Yellow
}