# Obsidian Multi Git Plugin - 自動リリーススクリプト
# PowerShell版: ローカルからGitHubリリースを作成

param(
    [Parameter(Mandatory=$false)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [switch]$Beta = $true,
    
    [Parameter(Mandatory=$false)]
    [string]$Message = "Beta release for BRAT testing"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Obsidian Multi Git Plugin - 自動リリース" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# 現在のディレクトリ確認
$currentDir = Get-Location
if (!(Test-Path "manifest.json")) {
    Write-Host "❌ manifest.json が見つかりません。obsidian-multi-git-plugin ディレクトリで実行してください。" -ForegroundColor Red
    exit 1
}

# manifest.json からバージョン取得
$manifest = Get-Content "manifest.json" | ConvertFrom-Json
$currentVersion = $manifest.version

if (!$Version) {
    $Version = $currentVersion
    Write-Host "📦 manifest.json からバージョンを取得: v$Version" -ForegroundColor Green
}

# バージョンタグ作成
$tagName = "v$Version"
if ($Beta) {
    # ベータ番号を自動インクリメント
    $existingTags = git tag -l "$tagName-beta.*" 2>$null
    if ($existingTags) {
        $betaNumbers = $existingTags | ForEach-Object { 
            if ($_ -match 'beta\.(\d+)$') { [int]$matches[1] } 
        } | Sort-Object -Descending
        $nextBeta = ($betaNumbers[0] + 1)
    } else {
        $nextBeta = 1
    }
    $tagName = "$tagName-beta.$nextBeta"
}

Write-Host "🏷️  リリースタグ: $tagName" -ForegroundColor Yellow

# ビルド実行
Write-Host "`n🔨 プラグインをビルド中..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ビルド失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✅ ビルド完了" -ForegroundColor Green

# 必須ファイル確認
$requiredFiles = @("main.js", "manifest.json", "styles.css")
foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        Write-Host "❌ 必須ファイルが見つかりません: $file" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ 必須ファイル確認完了" -ForegroundColor Green

# Git変更確認
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "`n⚠️  未コミットの変更があります:" -ForegroundColor Yellow
    Write-Host $gitStatus
    $response = Read-Host "コミットしてから続行しますか? (Y/n)"
    if ($response -ne "n") {
        git add -A
        git commit -m "Release $tagName"
        git push origin master
        git push github master
    }
}

# タグ作成とプッシュ
Write-Host "`n🏷️  タグを作成中: $tagName" -ForegroundColor Yellow
git tag -a $tagName -m "$Message"
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  タグは既に存在します。スキップします。" -ForegroundColor Yellow
} else {
    git push github $tagName
    Write-Host "✅ タグをGitHubにプッシュしました" -ForegroundColor Green
}

# GitHub CLI確認
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
if (!$ghInstalled) {
    Write-Host "`n⚠️  GitHub CLI (gh) がインストールされていません" -ForegroundColor Yellow
    Write-Host "以下のいずれかの方法でリリースを作成してください:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. GitHub Actions (自動) - タグプッシュ後、自動でリリースが作成されます" -ForegroundColor Cyan
    Write-Host "   https://github.com/officefutaro/obsidian-multi-git-plugin/actions" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. GitHub Web UI (手動)" -ForegroundColor Cyan
    Write-Host "   https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new" -ForegroundColor Gray
    Write-Host "   - Tag: $tagName を選択" -ForegroundColor Gray
    Write-Host "   - ファイルをアップロード: main.js, manifest.json, styles.css" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. GitHub CLI インストール" -ForegroundColor Cyan
    Write-Host "   winget install GitHub.cli" -ForegroundColor Gray
    Write-Host "   またはhttps://cli.github.com/" -ForegroundColor Gray
    
    exit 0
}

# GitHub認証確認
Write-Host "`n🔐 GitHub認証を確認中..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  GitHub認証が必要です" -ForegroundColor Yellow
    Write-Host "以下のコマンドで認証してください:" -ForegroundColor Cyan
    Write-Host "gh auth login" -ForegroundColor White
    exit 1
}
Write-Host "✅ GitHub認証確認完了" -ForegroundColor Green

# リリース作成
Write-Host "`n📦 GitHubリリースを作成中..." -ForegroundColor Yellow

$releaseNotes = @"
## 🚀 Obsidian Multi Git Plugin - $($Beta ? "Beta " : "")Release

### Installation via BRAT
1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this URL: ``https://github.com/officefutaro/obsidian-multi-git-plugin``
3. Enable the plugin in Community Plugins

### ✨ Features
- 🔍 Auto-detect multiple Git repositories
- 📊 Unified status bar showing total changes
- 🎛️ Batch operations across all repositories
- 📁 Custom Git Manager View in sidebar

### 📝 Changes in this release
$Message

### 🔧 Requirements
- Obsidian 1.0.0+
- Git installed on your system
- Desktop only (mobile not supported)

---
*Report issues: https://github.com/officefutaro/obsidian-multi-git-plugin/issues*
"@

# GitHub CLIでリリース作成
$prerelease = if ($Beta) { "--prerelease" } else { "" }

gh release create $tagName `
    --repo officefutaro/obsidian-multi-git-plugin `
    --title "$tagName - $($Beta ? "Beta " : "")Release" `
    --notes $releaseNotes `
    $prerelease `
    main.js manifest.json styles.css

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ リリース作成完了！" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 リリースURL:" -ForegroundColor Cyan
    Write-Host "https://github.com/officefutaro/obsidian-multi-git-plugin/releases/tag/$tagName" -ForegroundColor White
    Write-Host ""
    Write-Host "📦 BRATでインストール可能になりました:" -ForegroundColor Green
    Write-Host "URL: https://github.com/officefutaro/obsidian-multi-git-plugin" -ForegroundColor White
} else {
    Write-Host "❌ リリース作成に失敗しました" -ForegroundColor Red
    Write-Host "手動で作成してください: https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new" -ForegroundColor Yellow
}

Write-Host "`n完了しました！" -ForegroundColor Green