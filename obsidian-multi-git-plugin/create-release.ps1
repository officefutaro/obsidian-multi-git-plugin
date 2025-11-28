# PowerShell script to create GitHub release
# Run this script to create release v1.1.5.9

Write-Host "Creating GitHub Release v1.1.5.9" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Open GitHub releases page
$url = "https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=v1.1.5.9"
Start-Process $url

Write-Host ""
Write-Host "GitHub release page opened in browser!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please complete the release with these details:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Release Title:" -ForegroundColor White
Write-Host "🎨 Release v1.1.5.9 - Clean UI Restoration" -ForegroundColor Green
Write-Host ""
Write-Host "Release Notes:" -ForegroundColor White
Write-Host @"
## What's Changed

### 🎨 UI Improvements
- **Restored clean, simple UI** without debug elements
- Removed all debug banners and version displays from Git Manager View  
- Cleaned up settings page by removing massive update notifications
- Fixed button layout to maintain original horizontal arrangement
- Removed unnecessary automode UI elements from main view

### 🐛 Bug Fixes
- Fixed UI clutter that was unintentionally introduced
- Restored the original clean interface design

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