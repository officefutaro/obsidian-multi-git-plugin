# Obsidian Multi Git Plugin - v1.1.5.10リリーススクリプト
# PowerShell版: ローカルからGitHubリリースを作成 (GitHub CLI不要)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Obsidian Multi Git Plugin - v1.1.5.10リリース" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# 現在のディレクトリ確認
$currentDir = Get-Location
if (!(Test-Path "manifest.json")) {
    Write-Host "❌ manifest.json が見つかりません。obsidian-multi-git-plugin ディレクトリで実行してください。" -ForegroundColor Red
    exit 1
}

# バージョン確認
$manifest = Get-Content "manifest.json" | ConvertFrom-Json
$currentVersion = $manifest.version
$tagName = "v$currentVersion"

Write-Host "📦 バージョン確認: $tagName" -ForegroundColor Green

# 必須ファイル確認
$requiredFiles = @("main.js", "manifest.json", "styles.css")
foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        Write-Host "❌ 必須ファイルが見つかりません: $file" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ 必須ファイル確認完了" -ForegroundColor Green

# GitHub Actions/Web UI案内
Write-Host "`n⚠️  GitHub CLI (gh) が利用できないため、手動でリリースを作成します" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 以下の手順でリリースを作成してください:" -ForegroundColor Yellow

# ブラウザで開く
Write-Host "`n1️⃣ ブラウザでGitHubリリースページを開きます..." -ForegroundColor Cyan
Start-Process "https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=$tagName"

Write-Host ""
Write-Host "2️⃣ ブラウザで以下を入力してください:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Tag: $tagName (既に選択済みのはず)" -ForegroundColor White
Write-Host "   Title: 🔧 Release $tagName - Restore v1.0.2 UI Layout" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣ 説明文として以下をコピー&ペースト:" -ForegroundColor Yellow
Write-Host ""

$releaseNotes = @"
## What's Changed

### 🔧 UI Fixes
- **Restored v1.0.2 UI layout** for Git Manager View
- Fixed button arrangement (Refresh button above, then Commit/Push/Pull All buttons)
- Removed unnecessary View button from repository actions
- Fixed controls section layout structure to match original design

### 🚀 Features
- 🔍 Auto-detect multiple Git repositories (vault, parent, subdirectories)
- 📊 Unified status bar showing total changes across all repos
- 🎛️ Batch operations (commit, push, pull) for all repositories
- 📁 Custom Git Manager View in sidebar
- ⚡ Real-time status updates

### 🔧 Requirements
- Obsidian 1.0.0+
- Git installed on your system
- Desktop only (mobile not supported)

### 📦 Installation
1. Download the attached files (main.js, manifest.json, styles.css)
2. Place them in your vault's `.obsidian/plugins/obsidian-multi-git-plugin/` folder
3. Enable the plugin in Community Plugins

Or install via BRAT:
1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add URL: https://github.com/officefutaro/obsidian-multi-git-plugin
3. Enable after installation

---
*Built and tested with Obsidian API*
*Report issues: https://github.com/officefutaro/obsidian-multi-git-plugin/issues*
"@

# クリップボードにコピー
$releaseNotes | Set-Clipboard
Write-Host "✅ 説明文をクリップボードにコピーしました！" -ForegroundColor Green
Write-Host "   ブラウザでCtrl+V でペーストしてください" -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣ ファイルをアップロード:" -ForegroundColor Yellow
Write-Host ""

# 現在のディレクトリパス取得
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
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

# 待機
Write-Host "リリース作成が完了したらEnterキーを押してください..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "🎉 完了！" -ForegroundColor Green
Write-Host ""
Write-Host "📦 リリースURL:" -ForegroundColor Cyan
Write-Host "https://github.com/officefutaro/obsidian-multi-git-plugin/releases/tag/$tagName" -ForegroundColor White
Write-Host ""
Write-Host "📦 BRATでインストール可能:" -ForegroundColor Green
Write-Host "https://github.com/officefutaro/obsidian-multi-git-plugin" -ForegroundColor White
Write-Host ""

Write-Host "完了しました！" -ForegroundColor Green