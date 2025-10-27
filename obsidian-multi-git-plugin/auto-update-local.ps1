# Obsidian Multi Git Plugin - ローカルGitea自動更新スクリプト
# Giteaから最新版を取得して自動インストール

param(
    [string]$GiteaUrl = "http://192.168.68.72:3000",
    [string]$RepoPath = "futaro/obsidian-multi-git-plugin",
    [switch]$AllVaults
)

$ErrorActionPreference = "Stop"

Write-Host "🔄 Obsidian Multi Git Plugin 自動更新スクリプト" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Obsidianプラグインフォルダを検出
function Find-ObsidianVaults {
    $vaults = @()
    
    # AppDataのObsidianフォルダ確認
    $obsidianConfig = "$env:APPDATA\obsidian\obsidian.json"
    if (Test-Path $obsidianConfig) {
        $config = Get-Content $obsidianConfig | ConvertFrom-Json
        foreach ($vault in $config.vaults.PSObject.Properties) {
            $vaultPath = $vault.Value.path
            if (Test-Path $vaultPath) {
                $vaults += $vaultPath
            }
        }
    }
    
    return $vaults
}

# プラグインダウンロード
function Download-Plugin {
    param([string]$VaultPath)
    
    $pluginDir = Join-Path $VaultPath ".obsidian\plugins\obsidian-multi-git"
    
    # フォルダ作成
    if (!(Test-Path $pluginDir)) {
        New-Item -ItemType Directory -Path $pluginDir -Force | Out-Null
    }
    
    Write-Host "📥 $VaultPath にダウンロード中..." -ForegroundColor Yellow
    
    # ファイルダウンロード
    $files = @("main.js", "manifest.json", "styles.css")
    $baseUrl = "$GiteaUrl/$RepoPath/raw/branch/master/obsidian-multi-git-plugin"
    
    foreach ($file in $files) {
        $url = "$baseUrl/$file"
        $dest = Join-Path $pluginDir $file
        
        try {
            Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
            Write-Host "  ✅ $file" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ $file: $_" -ForegroundColor Red
            return $false
        }
    }
    
    return $true
}

# バージョン確認
function Check-Version {
    param([string]$VaultPath)
    
    $manifestPath = Join-Path $VaultPath ".obsidian\plugins\obsidian-multi-git\manifest.json"
    if (Test-Path $manifestPath) {
        $manifest = Get-Content $manifestPath | ConvertFrom-Json
        return $manifest.version
    }
    return "未インストール"
}

# メイン処理
Write-Host "`n🔍 Obsidian Vault を検索中..." -ForegroundColor Yellow
$vaults = Find-ObsidianVaults

if ($vaults.Count -eq 0) {
    Write-Host "❌ Obsidian Vault が見つかりません" -ForegroundColor Red
    exit 1
}

Write-Host "📦 見つかったVault: $($vaults.Count)個" -ForegroundColor Green

# 更新処理
$updated = 0
foreach ($vault in $vaults) {
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    $vaultName = Split-Path $vault -Leaf
    Write-Host "📁 Vault: $vaultName" -ForegroundColor Cyan
    Write-Host "   Path: $vault" -ForegroundColor DarkGray
    
    $oldVersion = Check-Version $vault
    Write-Host "   現在のバージョン: $oldVersion" -ForegroundColor DarkGray
    
    if (!$AllVaults) {
        $response = Read-Host "このVaultを更新しますか？ (Y/n)"
        if ($response -eq "n") {
            Write-Host "   スキップしました" -ForegroundColor Yellow
            continue
        }
    }
    
    if (Download-Plugin $vault) {
        $newVersion = Check-Version $vault
        Write-Host "✨ 更新完了! (v$newVersion)" -ForegroundColor Green
        $updated++
    } else {
        Write-Host "❌ 更新失敗" -ForegroundColor Red
    }
}

# 完了メッセージ
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "✅ 更新完了: $updated / $($vaults.Count) Vaults" -ForegroundColor Green

# 自動更新スケジューラ設定
Write-Host "`n💡 自動更新を設定しますか？" -ForegroundColor Cyan
$autoUpdate = Read-Host "Windowsタスクスケジューラに登録 (Y/n)"

if ($autoUpdate -ne "n") {
    $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File `"$PSCommandPath`" -AllVaults"
    $trigger = New-ScheduledTaskTrigger -Daily -At "09:00"
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive
    
    Register-ScheduledTask -TaskName "ObsidianMultiGitUpdate" `
        -Action $action `
        -Trigger $trigger `
        -Principal $principal `
        -Description "Obsidian Multi Git Plugin 自動更新" `
        -Force | Out-Null
    
    Write-Host "✅ 毎日9:00に自動更新するよう設定しました" -ForegroundColor Green
}

Write-Host "`n⚠️  Obsidianを再起動してプラグインを有効にしてください" -ForegroundColor Yellow
Write-Host "完了しました。" -ForegroundColor Green