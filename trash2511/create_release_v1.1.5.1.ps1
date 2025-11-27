# v1.1.5.1 リリース作成スクリプト
$ErrorActionPreference = "Stop"

Write-Host "🚀 v1.1.5.1 リリース作成" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# 必須ファイル確認
$currentPath = Get-Location
$pluginPath = Join-Path $currentPath "obsidian-multi-git-plugin"
$requiredFiles = @(
    (Join-Path $pluginPath "main.js"),
    (Join-Path $pluginPath "manifest.json"),
    (Join-Path $pluginPath "styles.css")
)

foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        Write-Host "❌ ファイルが見つかりません: $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ 必須ファイル確認OK" -ForegroundColor Green

# ブラウザでリリースページを開く
Write-Host "1️⃣ ブラウザでGitHubリリースページを開きます..." -ForegroundColor Cyan
$releaseUrl = "https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=v1.1.5.1"
Start-Process $releaseUrl

Write-Host ""
Write-Host "2️⃣ ブラウザで以下を設定してください:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Tag: v1.1.5.1 (既に入力済み)" -ForegroundColor White
Write-Host "   Title: v1.1.5.1: Patch version update" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣ 説明文として以下をコピー&ペースト:" -ForegroundColor Yellow
Write-Host ""

$releaseBody = @"
## 🔧 Patch Version Update

### Changes
- ✅ Version incremented to v1.1.5.1
- ✅ Maintained all existing functionality  
- ✅ Compatible with previous v1.1.5 release
- ✅ Consistent manifest.json synchronization

### For BRAT Users
Standard patch update. Update via BRAT to get the latest version.

### Installation via BRAT
1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this URL: https://github.com/officefutaro/obsidian-multi-git-plugin
3. Update the plugin to get version v1.1.5.1

🤖 Generated with [Claude Code](https://claude.ai/code)
"@

# クリップボードにコピー
try {
    $releaseBody | Set-Clipboard
    Write-Host "✅ 説明文をクリップボードにコピーしました！" -ForegroundColor Green
    Write-Host "   ブラウザでCtrl+V でペーストしてください" -ForegroundColor Gray
} catch {
    Write-Host "⚠️ クリップボードコピーに失敗。手動でコピーしてください" -ForegroundColor Yellow
    Write-Host $releaseBody
}

Write-Host ""
Write-Host "4️⃣ ファイルをアップロード:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   以下の3つのファイルを「Attach binaries」にアップロード:" -ForegroundColor White
Write-Host "   • $pluginPath\main.js" -ForegroundColor Gray
Write-Host "   • $pluginPath\manifest.json" -ForegroundColor Gray  
Write-Host "   • $pluginPath\styles.css" -ForegroundColor Gray
Write-Host ""

# プラグインフォルダをエクスプローラーで開く
Write-Host "   📂 プラグインフォルダをエクスプローラーで開きます..." -ForegroundColor Cyan
explorer.exe $pluginPath

Write-Host ""
Write-Host "5️⃣ 最後に「Publish release」ボタンをクリック" -ForegroundColor Yellow
Write-Host ""
Write-Host "完了したらEnterキーを押してください..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "🎉 v1.1.5.1リリース完了！" -ForegroundColor Green
Write-Host "BRATでプラグインを更新してください" -ForegroundColor White