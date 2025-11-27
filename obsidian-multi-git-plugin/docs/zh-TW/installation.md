# Language / 言語 / 语言
**[English](../en/installation.md)** | **[日本語](../ja/installation.md)** | **[简体中文](../zh-CN/installation.md)** | **[繁體中文](../zh-TW/installation.md)**

---

# Obsidian Multi Git Manager - 安裝手冊

## 📋 系統需求

### 必要條件
- **Obsidian**: 版本 1.0.0 或更高
- **作業系統**: Windows, macOS, Linux (僅桌面版)
- **Git**: 系統中已安裝 Git
- **Node.js**: 僅開發/建置時需要

### 支援環境
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Fedora, Arch等)
- ❌ Obsidian 行動版 (不支援)

## 🚀 安裝方法

### 方法1: 手動安裝 (推薦)

#### 步驟 1: 建置外掛
```bash
# 進入專案目錄
cd D:\Project\2510_obsidianGit\obsidian-multi-git-plugin

# 安裝相依性
npm install

# 建置外掛
npm run build
```

#### 步驟 2: 確認外掛檔案
建置後，確認生成了以下檔案：
```
obsidian-multi-git-plugin/
├── main.js          # ← 必需
├── manifest.json    # ← 必需
└── styles.css       # ← 必需
```

#### 步驟 3: 複製到 Obsidian 外掛資料夾
```bash
# 確認 Obsidian 設定資料夾位置
# Windows: %APPDATA%\Obsidian\
# macOS: ~/Library/Application Support/obsidian/
# Linux: ~/.config/obsidian/

# 進入外掛資料夾
cd "[YOUR_VAULT]/.obsidian/plugins/"

# 建立外掛目錄
mkdir multi-git-manager

# 複製必要檔案
cp /path/to/obsidian-multi-git-plugin/main.js multi-git-manager/
cp /path/to/obsidian-multi-git-plugin/manifest.json multi-git-manager/
cp /path/to/obsidian-multi-git-plugin/styles.css multi-git-manager/
```

#### 步驟 4: 在 Obsidian 中啟用外掛
1. 開啟 Obsidian
2. **設定** (⚙️) → **社群外掛**
3. 開啟 **社群外掛**
4. 在 **已安裝外掛** 中找到「Multi Git Manager」
5. **啟用** 外掛

### 方法2: 開發者模式 (進階使用者)

#### 步驟 1: 建立符號連結到外掛資料夾
```bash
# 進入 Vault 的外掛資料夾
cd "[YOUR_VAULT]/.obsidian/plugins/"

# 建立符號連結 (Windows)
mklink /D multi-git-manager "D:\Project\2510_obsidianGit\obsidian-multi-git-plugin"

# 建立符號連結 (macOS/Linux)
ln -s "/path/to/obsidian-multi-git-plugin" multi-git-manager
```

#### 步驟 2: 以開發模式執行
```bash
cd obsidian-multi-git-plugin

# 開發模式建置 (監視檔案變化)
npm run dev
```

## 🔧 安裝後設定

### 1. Git 檢查
確認外掛能夠正常運作：
```bash
# 檢查命令列中 Git 是否可用
git --version

# 檢查在 Obsidian Vault 中能否執行 git status
cd "[YOUR_VAULT]"
git status
```

### 2. 初次設定
1. **重新啟動 Obsidian**
2. 開啟 **命令選擇器** (Ctrl/Cmd + P)
3. 輸入「Git Manager」並執行 **Open Git Manager**
4. 確認顯示 GitManager 檢視

### 3. 功能確認
1. **狀態列** 顯示「Git: X changes」
2. **功能區圖示** (左側欄) 顯示 Git 圖示
3. **命令選擇器** 中可使用以下命令：
   - Open Git Manager
   - Show Git Status
   - Git Commit
   - Git Push
   - Git Pull

## 🎯 可用功能

### 主要功能
| 功能 | 說明 | 存取方式 |
|------|------|-------------|
| **Git Manager View** | 所有儲存庫的統一管理介面 | 點擊功能區圖示 |
| **狀態顯示** | 即時顯示修改檔案數量 | 狀態列 |
| **批次提交** | 同時提交多個儲存庫 | 命令選擇器 |
| **Push/Pull** | 與遠端儲存庫同步 | 命令選擇器 |
| **狀態確認** | 詳細的變更情況確認 | 命令選擇器 |

### 支援的儲存庫類型
- ✅ **主 Vault**: Obsidian Vault 本身
- ✅ **父目錄**: Vault 外的專案根目錄
- ✅ **子資料夾**: Vault 內的子專案

## 🔍 故障排除

### 常見問題

#### 1. 外掛不顯示
**原因**: 檔案複製錯誤或權限問題
```bash
# 確認檔案結構
ls -la "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager/"

# 確認必要檔案存在
# - main.js
# - manifest.json  
# - styles.css
```

**解決方法**:
1. 重新複製檔案
2. 完全重新啟動 Obsidian
3. 關閉社群外掛後重新開啟

#### 2. Git 命令無法執行
**原因**: Git 未設定在系統路徑中

**解決方法**:
```bash
# 確認 Git 安裝
git --version

# 如果路徑未設定，設定環境變數
# Windows: 在系統環境變數中新增 Git 的 bin 資料夾
# macOS/Linux: 在 ~/.bashrc 或 ~/.zshrc 中新增路徑
export PATH="/usr/local/git/bin:$PATH"
```

#### 3. 「not a git repository」錯誤
**原因**: Vault 或資料夾未初始化為 Git 儲存庫

**解決方法**:
```bash
# 在 Vault 中初始化 git
cd "[YOUR_VAULT]"
git init
git add .
git commit -m "Initial commit"
```

#### 4. 權限錯誤 (Linux/macOS)
**原因**: 檔案權限不正確

**解決方法**:
```bash
# 修正權限
chmod 644 "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager/main.js"
chmod 644 "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager/manifest.json"
```

### 日誌確認方法

#### 開發者工具除錯
1. **在 Obsidian 中開啟開發者工具**:
   - Windows/Linux: `Ctrl + Shift + I`
   - macOS: `Cmd + Option + I`

2. 在 **Console** 標籤頁確認錯誤日誌:
```javascript
// 搜尋外掛相關日誌
console.log("Multi Git Manager"); // 確認外掛是否已載入
```

3. 在 **Network** 標籤頁確認檔案載入錯誤

#### 啟用外掛日誌
```javascript
// Obsidian 設定 → 進階設定 → 開發者模式 設為開啟
// 主控台會輸出詳細日誌
```

## 🔄 更新方法

### 手動更新
1. 取得最新外掛程式碼
2. 執行建置:
```bash
cd obsidian-multi-git-plugin
git pull
npm run build
```
3. 將新的 `main.js` 複製到現有外掛資料夾
4. 重新啟動 Obsidian

### 使用開發者模式時
```bash
# 使用符號連結的情況
cd obsidian-multi-git-plugin
git pull
npm run build
# Obsidian 會自動載入新檔案
```

## 🗑️ 解除安裝方法

1. 在 **Obsidian 設定** 中停用外掛
2. 刪除外掛資料夾:
```bash
rm -rf "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager"
```
3. 重新啟動 Obsidian

## 📞 技術支援

### 問題回報
- **GitHub Issues**: 在專案 Issues 中回報問題
- **日誌檔案**: 包含開發者工具 Console 日誌
- **環境資訊**: 記錄 OS、Obsidian 版本、Git 版本

### 常見問題
問: **能在行動版 Obsidian 上使用嗎？**
答: 不可以，此外掛僅支援桌面版。

問: **可以在多個 Vault 中使用嗎？**
答: 可以，需要在每個 Vault 中個別安裝。

問: **會影響現有的 Git 工作流程嗎？**
答: 不會，使用標準 Git 命令，與現有工作流程相容。

---

**📝 如果此手冊無法解決您的問題，請在專案 Issues 頁面告知我們。**

*🤖 Created with Claude Code integration by Lean consultant Futaro (OfficeFutaro)*