# PowerShell script to create GitHub release
# Run this script to create release v1.1.5.10

Write-Host "Creating GitHub Release v1.1.5.10" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Open GitHub releases page
$url = "https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=v1.1.5.10"
Start-Process $url

Write-Host ""
Write-Host "GitHub release page opened in browser!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please complete the release with these details:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Release Title:" -ForegroundColor White
Write-Host "🔧 Release v1.1.5.10 - Restore v1.0.2 UI Layout" -ForegroundColor Green
Write-Host ""
Write-Host "Release Notes:" -ForegroundColor White
Write-Host @"
## What's Changed

### 🔧 UI Fixes
- **Restored v1.0.2 UI layout** for Git Manager View
- Fixed button arrangement (Refresh button above, then Commit/Push/Pull All buttons)
- Removed unnecessary View button from repository actions
- Fixed controls section layout structure to match original design

### 📦 Files to Upload
Please attach these files from obsidian-multi-git-plugin folder:
- main.js - Compiled plugin code
- manifest.json - Plugin manifest  
- styles.css - Plugin styles

---
*Built and tested with Obsidian API*
"@ -ForegroundColor Gray

Write-Host ""
Write-Host "Press Enter to exit..." -ForegroundColor Yellow
Read-Host