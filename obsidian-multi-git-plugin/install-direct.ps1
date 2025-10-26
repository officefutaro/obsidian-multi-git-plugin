# Obsidian Multi Git Manager - Direct Installer
# This script directly installs from the specific file paths

param(
    [string]$VaultPath
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Multi Git Manager - Direct Installer" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$GITEA_URL = "http://192.168.68.72:3000"
$REPO_OWNER = "futaro"
$REPO_NAME = "obsidian-multi-git-plugin"
$PLUGIN_NAME = "multi-git-manager"

# Try different URL patterns
$URL_PATTERNS = @(
    "$GITEA_URL/$REPO_OWNER/$REPO_NAME/raw/branch/master",
    "$GITEA_URL/$REPO_OWNER/$REPO_NAME/raw/master",
    "$GITEA_URL/$REPO_OWNER/$REPO_NAME/raw/main"
)

Write-Host "[1/4] Testing Gitea URL patterns..." -ForegroundColor Yellow

$WORKING_URL = $null
foreach ($pattern in $URL_PATTERNS) {
    $test_url = "$pattern/manifest.json"
    Write-Host "  Testing: $test_url" -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $test_url -Method Head -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host " ✓ OK" -ForegroundColor Green
            $WORKING_URL = $pattern
            break
        }
    } catch {
        Write-Host " ✗ Failed" -ForegroundColor Red
    }
}

if (-not $WORKING_URL) {
    Write-Host ""
    Write-Host "ERROR: Could not access Gitea repository!" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. Network connection to 192.168.68.72:3000" -ForegroundColor White
    Write-Host "  2. Repository exists and is accessible" -ForegroundColor White
    Write-Host "  3. Files are pushed to master branch" -ForegroundColor White
    exit 1
}

Write-Host "  Using URL pattern: $WORKING_URL" -ForegroundColor Green

# Get Vault path if not provided
if (-not $VaultPath) {
    Write-Host ""
    Write-Host "[2/4] Finding Obsidian Vaults..." -ForegroundColor Yellow
    
    $obsidian_path = "$env:APPDATA\obsidian"
    $vaults = @()
    
    if (Test-Path $obsidian_path) {
        $vault_folders = Get-ChildItem -Path $obsidian_path -Directory
        foreach ($vault in $vault_folders) {
            if (Test-Path "$($vault.FullName)\.obsidian") {
                $vaults += $vault.FullName
            }
        }
    }
    
    if ($vaults.Count -gt 0) {
        Write-Host "  Found vaults:"
        for ($i = 0; $i -lt $vaults.Count; $i++) {
            Write-Host "    [$($i+1)] $($vaults[$i])"
        }
        Write-Host "    [0] Enter custom path"
        
        $selection = Read-Host "  Select vault number"
        
        if ($selection -eq "0") {
            $VaultPath = Read-Host "  Enter Vault path"
        } elseif ($selection -match '^\d+$' -and [int]$selection -le $vaults.Count) {
            $VaultPath = $vaults[[int]$selection - 1]
        } else {
            Write-Host "Invalid selection!" -ForegroundColor Red
            exit 1
        }
    } else {
        $VaultPath = Read-Host "  Enter your Vault path"
    }
}

# Validate vault
if (-not (Test-Path "$VaultPath\.obsidian")) {
    Write-Host "  ERROR: Not a valid Obsidian vault!" -ForegroundColor Red
    exit 1
}

Write-Host "  Using vault: $VaultPath" -ForegroundColor Green

# Create plugin directory
Write-Host ""
Write-Host "[3/4] Creating plugin directory..." -ForegroundColor Yellow
$plugin_dir = "$VaultPath\.obsidian\plugins\$PLUGIN_NAME"

if (-not (Test-Path "$VaultPath\.obsidian\plugins")) {
    New-Item -ItemType Directory -Path "$VaultPath\.obsidian\plugins" -Force | Out-Null
}

if (Test-Path $plugin_dir) {
    $overwrite = Read-Host "  Plugin directory exists. Overwrite? (y/n)"
    if ($overwrite -ne 'y') {
        Write-Host "  Installation cancelled." -ForegroundColor Red
        exit 0
    }
    Remove-Item -Path $plugin_dir -Recurse -Force
}

New-Item -ItemType Directory -Path $plugin_dir -Force | Out-Null
Write-Host "  Created: $plugin_dir" -ForegroundColor Green

# Download files
Write-Host ""
Write-Host "[4/4] Downloading plugin files..." -ForegroundColor Yellow

$files = @("main.js", "manifest.json", "styles.css")
$download_success = $true

foreach ($file in $files) {
    Write-Host "  Downloading $file..." -NoNewline
    
    try {
        $file_url = "$WORKING_URL/$file"
        $output_path = Join-Path $plugin_dir $file
        
        Invoke-WebRequest -Uri $file_url -OutFile $output_path -ErrorAction Stop
        
        if (Test-Path $output_path) {
            $file_size = (Get-Item $output_path).Length
            if ($file_size -gt 0) {
                Write-Host " OK ($file_size bytes)" -ForegroundColor Green
            } else {
                Write-Host " ERROR (empty file)" -ForegroundColor Red
                $download_success = $false
            }
        } else {
            Write-Host " ERROR (not saved)" -ForegroundColor Red
            $download_success = $false
        }
    } catch {
        Write-Host " ERROR: $_" -ForegroundColor Red
        $download_success = $false
    }
}

if (-not $download_success) {
    Write-Host ""
    Write-Host "ERROR: Download failed!" -ForegroundColor Red
    Write-Host "Manual download URLs:" -ForegroundColor Yellow
    foreach ($file in $files) {
        Write-Host "  $WORKING_URL/$file" -ForegroundColor Gray
    }
    exit 1
}

# Success
Write-Host ""
Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart Obsidian" -ForegroundColor White
Write-Host "  2. Settings → Community plugins" -ForegroundColor White
Write-Host "  3. Enable 'Multi Git Manager'" -ForegroundColor White
Write-Host ""
Write-Host "Plugin installed in:" -ForegroundColor Gray
Write-Host "  $plugin_dir" -ForegroundColor Gray
Write-Host ""

$open_obsidian = Read-Host "Open Obsidian now? (y/n)"
if ($open_obsidian -eq 'y') {
    $obsidian_exe = "$env:LOCALAPPDATA\Obsidian\Obsidian.exe"
    if (Test-Path $obsidian_exe) {
        Start-Process $obsidian_exe
    } else {
        Write-Host "Could not find Obsidian.exe" -ForegroundColor Yellow
    }
}

Write-Host "Installation complete! 🎉" -ForegroundColor Cyan