# 今すぐ v1.0.0-beta.1 のリリースを作成する緊急スクリプト
# GitHub CLI不要版 - curlを使用

$ErrorActionPreference = "Stop"

Write-Host "🚀 緊急リリース作成 - v1.0.0-beta.1" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# 必須ファイル確認
$requiredFiles = @("main.js", "manifest.json", "styles.css")
foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        Write-Host "❌ ファイルが見つかりません: $file" -ForegroundColor Red
        Write-Host "obsidian-multi-git-plugin ディレクトリで実行してください" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "✅ 必須ファイル確認OK" -ForegroundColor Green
Write-Host ""
Write-Host "📝 次の手順でリリースを作成します:" -ForegroundColor Yellow
Write-Host ""

# ブラウザで開く
Write-Host "1️⃣ ブラウザでGitHubリリースページを開きます..." -ForegroundColor Cyan
Start-Process "https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=v1.0.0-beta.1"

Write-Host ""
Write-Host "2️⃣ ブラウザで以下を入力してください:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Tag: v1.0.0-beta.1 (既に入力済みのはず)" -ForegroundColor White
Write-Host "   Title: v1.0.0-beta.1 - Initial Beta Release" -ForegroundColor White
Write-Host "   ☑️ This is a pre-release にチェック" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣ 説明文として以下をコピー&ペースト:" -ForegroundColor Yellow
Write-Host ""

$releaseBody = @"
## 🚀 Obsidian Multi Git Plugin - Beta Release

First beta release for testing via BRAT.

### Installation
1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this URL: ``https://github.com/officefutaro/obsidian-multi-git-plugin``
3. Enable the plugin in Community Plugins

### ✨ Features
- 🔍 Auto-detect multiple Git repositories (vault, parent, subdirectories)
- 📊 Unified status bar showing total changes across all repos
- 🎛️ Batch operations (commit, push, pull) for all repositories
- 📁 Custom Git Manager View in sidebar
- ⚡ Real-time status updates every 30 seconds

### 🔧 Requirements
- Obsidian 1.0.0+
- Git installed on your system
- Desktop only (mobile not supported)

### 📝 Known Issues
- Windows path handling may require escaping in some cases
- Large repositories may experience slower status updates

### 🐛 Feedback
Please report issues at: https://github.com/officefutaro/obsidian-multi-git-plugin/issues
"@

# クリップボードにコピー
$releaseBody | Set-Clipboard
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
Write-Host "🎉 完了！BRATで以下のURLを追加できるようになりました:" -ForegroundColor Green
Write-Host "https://github.com/officefutaro/obsidian-multi-git-plugin" -ForegroundColor White
Write-Host ""

# BRATテスト案内
Write-Host "📦 BRATでのテスト方法:" -ForegroundColor Cyan
Write-Host "1. Obsidian設定 → BRAT → Add Beta Plugin" -ForegroundColor Gray
Write-Host "2. URL入力: https://github.com/officefutaro/obsidian-multi-git-plugin" -ForegroundColor Gray
Write-Host "3. Add Plugin → Enable after installing にチェック" -ForegroundColor Gray
Write-Host ""

Write-Host "完了しました！" -ForegroundColor Green