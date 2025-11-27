# GitHub Release Creation Script for v1.0.1
# Usage: .\create_release.ps1
# Requires: Set $env:GITHUB_TOKEN="your_token_here" first

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken = $env:GITHUB_TOKEN
)

if (-not $GitHubToken) {
    Write-Error "GitHub token not provided. Please set `$env:GITHUB_TOKEN or pass -GitHubToken parameter"
    exit 1
}

$repoOwner = "officefutaro"
$repoName = "obsidian-multi-git-plugin"
$tagName = "v1.0.1"
$releaseName = "v1.0.1: ボタンの処理中フィードバック機能"

$releaseBody = @"
## 🎉 新機能

### ボタンの処理中フィードバック
- すべてのGit操作ボタンに処理中の視覚的フィードバックを追加しました
- ボタンを押すと「⏳ Processing...」と表示され、処理中であることが分かりやすくなりました
- パルスアニメーション効果で処理中を視覚的に表現
- 処理完了後は自動的に元の状態に戻ります

## 📦 インストール

BRATプラグインをお使いの方は、プラグインの設定から更新チェックを実行してください。
"@

Write-Host "Creating GitHub release for $tagName..." -ForegroundColor Green

# Prepare headers
$headers = @{
    "Authorization" = "token $GitHubToken"
    "Accept" = "application/vnd.github.v3+json"
    "Content-Type" = "application/json"
}

# Prepare release data
$releaseData = @{
    tag_name = $tagName
    target_commitish = "master"
    name = $releaseName
    body = $releaseBody
    draft = $false
    prerelease = $false
} | ConvertTo-Json -Depth 3

try {
    # Create the release
    $releaseResponse = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/releases" -Method Post -Headers $headers -Body $releaseData

    Write-Host "✅ Release created successfully!" -ForegroundColor Green
    Write-Host "Release ID: $($releaseResponse.id)" -ForegroundColor Cyan
    
    # Get upload URL (remove the {?name,label} part)
    $uploadUrl = $releaseResponse.upload_url -replace '\{\?name,label\}', ''
    
    Write-Host "📦 Uploading release assets..." -ForegroundColor Green
    
    # File paths
    $files = @{
        "main.js" = "obsidian-multi-git-plugin\main.js"
        "manifest.json" = "obsidian-multi-git-plugin\manifest.json"
        "styles.css" = "obsidian-multi-git-plugin\styles.css"
    }
    
    $contentTypes = @{
        "main.js" = "application/javascript"
        "manifest.json" = "application/json"
        "styles.css" = "text/css"
    }
    
    foreach ($fileName in $files.Keys) {
        $filePath = $files[$fileName]
        $contentType = $contentTypes[$fileName]
        
        if (Test-Path $filePath) {
            Write-Host "Uploading $fileName..." -ForegroundColor Yellow
            
            $uploadHeaders = @{
                "Authorization" = "token $GitHubToken"
                "Content-Type" = $contentType
            }
            
            $fileBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $filePath).Path)
            
            try {
                $uploadResponse = Invoke-RestMethod -Uri "$uploadUrl?name=$fileName" -Method Post -Headers $uploadHeaders -Body $fileBytes
                Write-Host "✅ $fileName uploaded successfully" -ForegroundColor Green
            }
            catch {
                Write-Warning "Failed to upload $fileName : $($_.Exception.Message)"
            }
        }
        else {
            Write-Warning "File not found: $filePath"
        }
    }
    
    Write-Host "🎉 Release v1.0.1 is now available at: https://github.com/$repoOwner/$repoName/releases/tag/$tagName" -ForegroundColor Green
    
}
catch {
    Write-Error "Failed to create release: $($_.Exception.Message)"
    Write-Error "Response: $($_.Exception.Response)"
}