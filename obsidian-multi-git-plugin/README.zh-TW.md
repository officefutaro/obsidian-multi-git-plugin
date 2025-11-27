# 🌳 Obsidian Multi Git Manager
### 🚀 Claude Code × Obsidian 優化插件

> 🌐 [English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | **繁體中文**

[![Claude Code Compatible](https://img.shields.io/badge/Claude_Code-Compatible-purple)](https://claude.ai)
[![Lean Method](https://img.shields.io/badge/Lean-Optimized-green)](https://lean.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-blueviolet)](https://obsidian.md/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**為 Claude Code 整合優化的強大 Obsidian 插件，高效管理多個 Git 儲存庫**

## 🎯 背景 - Claude Code × Obsidian 的完美協同

### 💡 插件創建的原因

**精實顧問師 Futaro (OfficeFutaro)** 開發了這個插件來解決實際工作流程中的挑戰。

在使用 Claude Code 進行「氛圍寫作」方法論（AI 輔助文件創建）時，Obsidian 的 markdown 文件提供了完美的相容性。然而，存在一個問題：

#### 🔄 典型工作流程
1. **Obsidian**：建構和管理知識庫
2. **Claude Code**：AI 輔助文件創建和程式碼生成
3. **Git**：版本控制和備份

#### ❌ 以前的痛點
- Claude Code 專案資料夾通常存在於 Vault 之外
- 管理多個儲存庫很麻煩（切換 VSCode、CLI 操作）
- 由於上下文切換導致生產力損失

#### ✅ 本插件的解決方案
**「在 Obsidian 內管理 Vault 外的儲存庫」** - 一種優化 Claude Code 工作流程的革命性方法！

### 🏆 精實方法優化
- **消除浪費**：減少工具切換時間
- **簡化流程**：在一個介面中完成所有操作
- **最大化價值**：保持不間斷的思維流

## ✨ 核心功能

### 🔍 **智慧儲存庫檢測**
- **Vault 本身**：當 Obsidian Vault 是 Git 儲存庫時
- **父目錄**：Vault 外的專案根目錄（完美適配 Claude Code 專案）
- **子資料夾**：Vault 內的單個專案

### 📊 **即時監控**
- 狀態列持續顯示變更數量
- 每 30 秒自動重新整理
- 視覺指示器提供即時變更感知

### 🎛️ **統一管理介面**
- Git Manager View：所有儲存庫的統一控制面板
- 批次操作：同時對多個儲存庫進行提交/推送/拉取
- 選擇性執行：僅針對必要的儲存庫

### ⚡ **進階 Git 操作**
- **提交**：批次提交到多個儲存庫
- **推送/拉取**：選擇性遠端同步
- **狀態**：詳細變更狀態檢視
- **分支資訊**：ahead/behind 狀態顯示

## 🤝 Claude Code 整合優化

### 📁 推薦資料夾結構
```
project-root/
├── obsidian-vault/          # Obsidian Vault（使用本插件）
│   ├── .obsidian/
│   ├── knowledge-base/
│   └── project-notes/
├── claude-projects/         # Claude Code 專案組
│   ├── project-a/          # 單個專案（Git 管理）
│   └── project-b/          # 單個專案（Git 管理）
└── shared-docs/            # 共享文件（Git 管理）
```

### ⚡ Claude Code 優化
- **CLAUDE.md 支援**：自動檢測專案上下文文件
- **Markdown 整合**：即時 Git 管理 Claude 生成的文件
- **AI 友善**：結構化提交訊息

## 🚀 快速開始

### 安裝

#### 從社群插件安裝（推薦）
1. 開啟 Obsidian
2. 設定 → 社群插件 → 瀏覽
3. 搜尋 "Multi Git Manager"
4. 安裝 → 啟用

#### 手動安裝（開發者）
對於開發環境或自訂需求，請參考 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 基本使用

1. **檢查狀態**：在狀態列檢視 "Git: X changes"
2. **管理面板**：點選左側邊欄的 Git 圖示 🌳
3. **執行命令**：`Ctrl/Cmd + P` → `Git: [操作]`

## 💼 實際使用案例

### 面向精實顧問師和技術寫作者
- **📝 Claude Code 整合**：在 Obsidian 中整理 AI 輔助文件，用 Git 管理
- **🔄 持續改進**：PDCA 文件的版本控制
- **📊 客戶工作**：多個專案的並行管理

### 具體效率提升
- **之前**：工具切換 5 分鐘/次 × 20 次/天 = 100 分鐘浪費
- **之後**：統一 Obsidian 管理減少到 0 → **年節省 400 小時**

### 實際應用範例
- **研究人員**：學術論文專案（多儲存庫管理）
- **開發者**：技術筆記 + 專案程式碼管理
- **寫作者**：部落格文章管理（草稿 → 發布工作流程）
- **顧問師**：客戶專案知識管理

## 📖 文件

| 文件 | 內容 | 受眾 |
|------|------|------|
| **[📋 安裝指南](docs/zh-TW/installation.md)** | 詳細安裝指南 | 所有使用者 |
| **[🚀 快速開始](docs/zh-TW/quick-start.md)** | 5 分鐘入門 | 初學者 |
| **[📚 使用者指南](docs/zh-TW/user-guide.md)** | 完整使用者指南 | 中級+ |

## 🎯 系統需求

### ✅ 支援的平台
- **Windows** 10/11
- **macOS** 10.15+  
- **Linux**（Ubuntu、Fedora、Arch 等）

### ⚠️ 限制
- **僅限桌面端**（不支援行動版 Obsidian）
- **需要 Git**：系統必須安裝 Git

## 🤝 貢獻

### 🐛 錯誤回報
如果發現問題：
1. 檢查 **GitHub Issues** 中的現有回報
2. 提供**重現步驟**、**環境資訊**、**錯誤日誌**進行回報
3. 如可能，提供**最小可重現範例**

### 💡 功能請求
對於新功能：
1. 解釋**具體使用案例**
2. 清楚描述**預期行為**
3. 如果可用，包含**替代方案**

### 🔧 程式碼貢獻
歡迎 Pull Request！詳情請參閱 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 🔄 路線圖

### 📅 即將推出
- [ ] **設定面板**：儲存庫排除、更新間隔設定
- [ ] **分支管理**：切換和合併功能
- [ ] **衝突解決**：視覺化工具
- [ ] **自動化**：基於時間的自動提交

### 🚀 未來願景
- [ ] **深度 Claude Code 整合**：CLAUDE.md 自動生成/更新
- [ ] **團隊協作**：共享儲存庫協作支援
- [ ] **CI/CD 整合**：GitHub Actions 連接

## 👨‍💻 關於開發者

**Futaro @ OfficeFutaro**
- 🎯 **認證精實方法顧問師**
- 📊 在大型精實企業的豐富經驗
- 🤖 AI 工作流程優化專家
- 📝 「氛圍寫作」方法論創建者

### 提供的服務
- 🔧 **精實諮詢**：業務流程優化
- 🤝 **Claude Code 實施**：AI 驅動的文件創建效率
- 📚 **Obsidian 設定支援**：知識管理系統設計

## 💖 支持本專案

如果本插件對您的生產力有所貢獻，請考慮支持：

- ⭐ **GitHub Star** - 提高專案知名度
- ☕ **Buy Me a Coffee** - 支持持續開發
- 💼 **企業諮詢** - 定製和實施服務
- 📝 **技術諮詢** - Git/Obsidian 工作流程優化

## 📞 支援

### 🆘 需要幫助？
- **📚 文件**：從[使用者指南](docs/zh-TW/user-guide.md)開始
- **💬 問題**：在 [GitHub Issues](https://github.com/officefutaro/obsidian-multi-git-plugin/issues) 提問
- **🔧 討論**：在 [Discussions](https://github.com/officefutaro/obsidian-multi-git-plugin/discussions) 分享使用技巧和想法

### 📧 聯絡方式
- **Email**：[contact@officefutaro.com](mailto:contact@officefutaro.com)
- **LinkedIn**：[linkedin.com/in/futaro](https://linkedin.com/in/futaro)
- **Twitter**：[@officefutaro](https://twitter.com/officefutaro)

## 📄 授權

**MIT License** - 可自由使用、修改和發布。

---

<div align="center">

**🌳 Multi Git Manager**

*優化 Claude Code × Obsidian 工作流程*

*由 [OfficeFutaro](https://officefutaro.com) 精心打造*
*用高效工具賦能知識工作者*

[![Twitter Follow](https://img.shields.io/twitter/follow/officefutaro?style=social)](https://twitter.com/officefutaro)
[![GitHub followers](https://img.shields.io/github/followers/officefutaro?style=social)](https://github.com/officefutaro)

**🎉 用精實方法論消除浪費，最大化價值！**

</div>