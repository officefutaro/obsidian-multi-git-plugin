# v1.1.5 リリース作成スクリプト
$ErrorActionPreference = "Stop"

Write-Host "🚀 v1.1.5 リリース作成" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# 必須ファイル確認
$requiredFiles = @("main.js", "manifest.json", "styles.css")
foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        Write-Host "❌ ファイルが見つかりません: $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ 必須ファイル確認OK" -ForegroundColor Green

# ブラウザでリリースページを開く
Write-Host "1️⃣ ブラウザでGitHubリリースページを開きます..." -ForegroundColor Cyan
Start-Process "https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=v1.1.5"

Write-Host ""
Write-Host "2️⃣ ブラウザで以下を設定してください:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Tag: v1.1.5 (既に入力済み)" -ForegroundColor White
Write-Host "   Title: v1.1.5: Fix version synchronization" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣ 説明文として以下をコピー&ペースト:" -ForegroundColor Yellow
Write-Host ""

$releaseBody = @"
## 🔧 Version Synchronization Fix

### Fixed
- ✅ Resolved BRAT version mismatch error
- ✅ Synchronized both manifest.json files to version 1.1.5  
- ✅ Fixed hardcoded version display in console log
- ✅ Ensured consistency between release tag and manifest version

### For BRAT Users
This release fixes the "Version mismatch detected" error when installing via BRAT.

### Installation via BRAT
1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this URL: https://github.com/officefutaro/obsidian-multi-git-plugin
3. Update the plugin to get the latest version

🤖 Generated with [Claude Code](https://claude.ai/code)
"@

# クリップボードにコピー
$releaseBody | Set-Clipboard
Write-Host "✅ 説明文をクリップボードにコピーしました！" -ForegroundColor Green
Write-Host "   ブラウザでCtrl+V でペーストしてください" -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣ ファイルをアップロード:" -ForegroundColor Yellow
Write-Host ""

$currentPath = Get-Location
Write-Host "   以下の3つのファイルを「Attach binaries」にドラッグ&ドロップ:" -ForegroundColor White
Write-Host "   • $currentPath\main.js" -ForegroundColor Gray
Write-Host "   • $currentPath\manifest.json" -ForegroundColor Gray  
Write-Host "   • $currentPath\styles.css" -ForegroundColor Gray
Write-Host ""

# エクスプローラーを開く
Write-Host "   📂 ファイルの場所をエクスプローラーで開きます..." -ForegroundColor Cyan
explorer.exe $currentPath

Write-Host ""
Write-Host "5️⃣ 最後に「Publish release」ボタンをクリック" -ForegroundColor Yellow
Write-Host ""

Write-Host "完了したらEnterキーを押してください..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "🎉 v1.1.5リリース完了！" -ForegroundColor Green
Write-Host "BRATでプラグインを更新してください" -ForegroundColor White