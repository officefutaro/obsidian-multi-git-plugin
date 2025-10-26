# Obsidian Multi Git Manager - Auto Installer for Windows
# PowerShell Script
# Usage: powershell -ExecutionPolicy Bypass -File install.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Obsidian Multi Git Manager Installer" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$GITEA_URL = "http://192.168.68.72:3000"
$REPO_OWNER = "futaro"
$REPO_NAME = "obsidian-multi-git-plugin"
$PLUGIN_NAME = "multi-git-manager"

# Get latest release version
Write-Host "[1/5] Getting latest release information..." -ForegroundColor Yellow
try {
    $releases_url = "$GITEA_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/releases"
    $releases = Invoke-RestMethod -Uri $releases_url -Method Get
    
    if ($releases.Count -eq 0) {
        Write-Host "No releases found. Using direct file download..." -ForegroundColor Yellow
        $use_direct = $true
    } else {
        $latest_release = $releases[0]
        $version = $latest_release.tag_name
        Write-Host "  Found version: $version" -ForegroundColor Green
        $use_direct = $false
    }
} catch {
    Write-Host "  Could not fetch releases. Using direct file download..." -ForegroundColor Yellow
    $use_direct = $true
}

# Ask for Vault path
Write-Host ""
Write-Host "[2/5] Select your Obsidian Vault" -ForegroundColor Yellow

# Try to find Obsidian vaults automatically
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

# Also check common locations
$common_paths = @(
    "$env:USERPROFILE\Documents\Obsidian",
    "$env:USERPROFILE\OneDrive\Documents\Obsidian",
    "D:\Obsidian",
    "C:\Obsidian"
)

foreach ($path in $common_paths) {
    if (Test-Path $path) {
        $folders = Get-ChildItem -Path $path -Directory -ErrorAction SilentlyContinue
        foreach ($folder in $folders) {
            if (Test-Path "$($folder.FullName)\.obsidian") {
                $vaults += $folder.FullName
            }
        }
    }
}

# Remove duplicates
$vaults = $vaults | Select-Object -Unique

if ($vaults.Count -gt 0) {
    Write-Host "  Found Obsidian Vaults:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $vaults.Count; $i++) {
        Write-Host "    [$($i+1)] $($vaults[$i])"
    }
    Write-Host "    [0] Enter custom path"
    Write-Host ""
    
    $selection = Read-Host "  Select vault number"
    
    if ($selection -eq "0") {
        $vault_path = Read-Host "  Enter your Vault path"
    } elseif ($selection -match '^\d+$' -and [int]$selection -le $vaults.Count) {
        $vault_path = $vaults[[int]$selection - 1]
    } else {
        Write-Host "Invalid selection!" -ForegroundColor Red
        exit 1
    }
} else {
    $vault_path = Read-Host "  Enter your Vault path (e.g., C:\Users\YourName\Documents\MyVault)"
}

# Validate vault path
if (-not (Test-Path "$vault_path\.obsidian")) {
    Write-Host "  ERROR: Not a valid Obsidian vault! (.obsidian folder not found)" -ForegroundColor Red
    exit 1
}

Write-Host "  Using vault: $vault_path" -ForegroundColor Green

# Create plugin directory
Write-Host ""
Write-Host "[3/5] Creating plugin directory..." -ForegroundColor Yellow
$plugin_dir = "$vault_path\.obsidian\plugins\$PLUGIN_NAME"

if (-not (Test-Path "$vault_path\.obsidian\plugins")) {
    New-Item -ItemType Directory -Path "$vault_path\.obsidian\plugins" -Force | Out-Null
}

if (Test-Path $plugin_dir) {
    Write-Host "  Plugin directory already exists." -ForegroundColor Yellow
    $overwrite = Read-Host "  Overwrite existing installation? (y/n)"
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
Write-Host "[4/5] Downloading plugin files..." -ForegroundColor Yellow

$files = @(
    @{name="main.js"; required=$true},
    @{name="manifest.json"; required=$true},
    @{name="styles.css"; required=$true}
)

$download_success = $true

foreach ($file in $files) {
    Write-Host "  Downloading $($file.name)..." -NoNewline
    
    try {
        if ($use_direct) {
            # Direct download from repository
            $file_url = "$GITEA_URL/$REPO_OWNER/$REPO_NAME/raw/branch/master/$($file.name)"
        } else {
            # Download from release assets
            $asset = $latest_release.assets | Where-Object { $_.name -eq $file.name }
            if ($asset) {
                $file_url = $asset.browser_download_url
            } else {
                # Fallback to direct download
                $file_url = "$GITEA_URL/$REPO_OWNER/$REPO_NAME/raw/branch/master/$($file.name)"
            }
        }
        
        $output_path = Join-Path $plugin_dir $file.name
        
        # Download file
        Invoke-WebRequest -Uri $file_url -OutFile $output_path -ErrorAction Stop
        
        # Verify file was downloaded
        if (Test-Path $output_path) {
            $file_size = (Get-Item $output_path).Length
            if ($file_size -gt 0) {
                Write-Host " OK ($file_size bytes)" -ForegroundColor Green
            } else {
                Write-Host " ERROR (empty file)" -ForegroundColor Red
                $download_success = $false
            }
        } else {
            Write-Host " ERROR (file not saved)" -ForegroundColor Red
            $download_success = $false
        }
        
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
        Write-Host "    Error: $_" -ForegroundColor Red
        
        if ($file.required) {
            $download_success = $false
        }
    }
}

if (-not $download_success) {
    Write-Host ""
    Write-Host "ERROR: Failed to download required files!" -ForegroundColor Red
    Write-Host "Please check your network connection and Gitea server accessibility." -ForegroundColor Yellow
    exit 1
}

# Final instructions
Write-Host ""
Write-Host "[5/5] Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart Obsidian (close and reopen)" -ForegroundColor White
Write-Host "  2. Go to Settings -> Community plugins" -ForegroundColor White
Write-Host "  3. Turn off Safe Mode if needed" -ForegroundColor White
Write-Host "  4. Enable 'Multi Git Manager'" -ForegroundColor White
Write-Host ""
Write-Host "The plugin is installed in:" -ForegroundColor Gray
Write-Host "  $plugin_dir" -ForegroundColor Gray
Write-Host ""

# Ask if user wants to open Obsidian
$open_obsidian = Read-Host "Open Obsidian now? (y/n)"
if ($open_obsidian -eq 'y') {
    # Try to find and open Obsidian
    $obsidian_exe = "$env:LOCALAPPDATA\Obsidian\Obsidian.exe"
    if (Test-Path $obsidian_exe) {
        Start-Process $obsidian_exe
    } else {
        Write-Host "Could not find Obsidian.exe. Please open it manually." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Thank you for installing Multi Git Manager!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan