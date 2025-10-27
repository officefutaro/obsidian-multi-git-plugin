# BRAT経由でのベータテスト実施手順書

**作成日**: 2025年10月26日  
**対象**: Obsidian Multi Git Plugin v1.0.0-beta  
**前提**: GitHubリポジトリ作成済み

---

## 📋 1. BRAT概要

### 1.1 BRATとは
- **正式名**: Beta Reviewer's Auto-update Tool
- **用途**: Obsidianプラグインのベータ版配布・自動更新
- **特徴**: GitHub連携、自動更新、複数ベータ管理

### 1.2 なぜBRATを使うか
- ✅ コミュニティプラグイン登録前にテスト可能
- ✅ 自動更新でテスター負担軽減
- ✅ フィードバック収集が容易
- ✅ 段階的リリースが可能

---

## 🚀 2. 開発者側の準備

### 2.1 GitHubリポジトリ準備

#### Step 1: リポジトリ作成
```bash
# ローカルリポジトリから GitHub へプッシュ
cd D:\Project\2510_obsidianGit\obsidian-multi-git-plugin

# GitHub リモート追加
git remote add github https://github.com/[YOUR-USERNAME]/obsidian-multi-git-plugin.git

# 初回プッシュ
git push -u github master
```

#### Step 2: 必須ファイル確認
```
obsidian-multi-git-plugin/
├── main.js          ✅ ビルド済みファイル
├── manifest.json    ✅ プラグイン情報
├── styles.css       ✅ スタイルシート（オプション）
└── README.md        ✅ 説明文書
```

### 2.2 リリース作成

#### 方法1: 手動リリース
```bash
# 1. タグ作成
git tag v1.0.0-beta.1
git push github v1.0.0-beta.1

# 2. GitHub Web UIでリリース作成
# - Releases → Create a new release
# - Tag: v1.0.0-beta.1
# - Title: v1.0.0-beta.1 - Initial Beta Release
# - Pre-release: ✅ チェック
# - ファイル添付: main.js, manifest.json, styles.css
```

#### 方法2: GitHub Actions自動リリース
`.github/workflows/release.yml` を作成:

```yaml
name: Release Obsidian Plugin

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build plugin
      run: npm run build
    
    - name: Create Release
      uses: softprops/action-gh-release@v1
      with:
        files: |
          main.js
          manifest.json
          styles.css
        prerelease: true
        body: |
          ## 🚀 Beta Release
          
          ### Installation
          Use BRAT: https://github.com/${{ github.repository }}
          
          ### What's New
          - Multiple Git repository management
          - Unified status bar
          - Custom Git Manager View
```

### 2.3 manifest.json設定確認
```json
{
  "id": "obsidian-multi-git",
  "name": "Multi Git Manager",
  "version": "1.0.0-beta.1",
  "minAppVersion": "1.0.0",
  "description": "Manage multiple Git repositories in Obsidian",
  "author": "Your Name",
  "authorUrl": "https://github.com/your-username",
  "isDesktopOnly": true
}
```

---

## 👥 3. テスター向け手順

### 3.1 BRATプラグインインストール

#### Step 1: コミュニティプラグインからインストール
1. Obsidian設定 → コミュニティプラグイン
2. "BRAT" を検索
3. インストール → 有効化

#### Step 2: BRAT初期設定
1. 設定 → BRAT
2. "Enable Auto-Update" をON
3. "Update check interval" を設定（推奨: 12時間）

### 3.2 ベータプラグイン追加

#### 方法1: URL直接入力
1. BRAT設定 → "Add Beta plugin"
2. URL入力: `https://github.com/[USERNAME]/obsidian-multi-git-plugin`
3. "Add Plugin" クリック

#### 方法2: コマンドパレット
1. `Ctrl/Cmd + P` でコマンドパレット
2. "BRAT: Add a beta plugin" 選択
3. URL入力して追加

### 3.3 プラグイン有効化
1. 設定 → コミュニティプラグイン
2. "Multi Git Manager" を探す
3. 有効化トグルをON

---

## 📊 4. ベータテスト実施計画

### 4.1 テストフェーズ

#### Phase 1: クローズドベータ（Week 1）
**対象**: 5-10名の信頼できるテスター
```markdown
## 招待メッセージテンプレート
Obsidian Multi Git Plugin のクローズドベータテストにご協力いただけますか？

### インストール方法
1. BRATプラグインをインストール
2. 以下URLを追加: https://github.com/[USERNAME]/obsidian-multi-git-plugin
3. プラグインを有効化

### お願いしたいこと
- 日常使用での動作確認
- バグ・不具合の報告
- UI/UXの改善提案

フィードバックは GitHub Issues または Discord でお願いします。
```

#### Phase 2: オープンベータ（Week 2-3）
**対象**: 20-50名の一般テスター

**告知場所**:
- Reddit r/ObsidianMD
- Obsidian Discord #share-and-showcase
- Obsidian Forum Plugin Development
- Twitter/X #ObsidianMD

**告知文テンプレート**:
```markdown
## 🎉 Obsidian Multi Git Plugin - Beta Testing Open!

Manage multiple Git repositories directly from Obsidian!

### ✨ Features
- Auto-detect Git repos (vault/parent/subdirs)
- Unified status bar showing all changes
- Batch operations across repositories
- Custom sidebar view

### 🚀 How to Test
1. Install BRAT plugin
2. Add: https://github.com/[USERNAME]/obsidian-multi-git-plugin
3. Enable & enjoy!

### 💬 Feedback
- Issues: [GitHub Issues](https://github.com/[USERNAME]/obsidian-multi-git-plugin/issues)
- Discussion: [GitHub Discussions](https://github.com/[USERNAME]/obsidian-multi-git-plugin/discussions)

Help us make this plugin better! 🙏
```

### 4.2 フィードバック収集

#### GitHub Issuesテンプレート
`.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: 'bug, beta'
---

**Environment**
- Obsidian version: 
- Plugin version: 
- OS: 
- Git version: 

**Description**
A clear description of the bug.

**Steps to Reproduce**
1. 
2. 
3. 

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Console errors**
Check DevTools console (Ctrl+Shift+I)
```

#### フィードバックフォーム
Google Forms / Microsoft Forms で作成:
```
1. プラグインの全体的な満足度 (1-5)
2. 最も便利な機能は？
3. 改善が必要な点は？
4. 追加してほしい機能は？
5. バグや不具合はありましたか？
6. その他コメント
```

---

## 🔄 5. 更新とバージョン管理

### 5.1 バージョニング戦略
```
v1.0.0-beta.1  初回ベータ
v1.0.0-beta.2  バグ修正
v1.0.0-beta.3  機能追加
v1.0.0-rc.1    リリース候補
v1.0.0         正式版
```

### 5.2 更新手順
```bash
# 1. 修正実装
git add .
git commit -m "Fix: [issue description]"

# 2. バージョン更新
# manifest.json の version を更新

# 3. タグ作成とプッシュ
git tag v1.0.0-beta.2
git push github master
git push github v1.0.0-beta.2

# 4. GitHub Actions が自動でリリース作成
# または手動でリリース作成

# 5. BRAT が自動で更新を検知・適用
```

### 5.3 チェンジログ管理
`CHANGELOG.md`:
```markdown
# Changelog

## [1.0.0-beta.2] - 2025-10-27
### Fixed
- Windows path handling issue (#1)
- Status bar update timing (#2)

### Added
- Keyboard shortcuts support
- Japanese translation

### Changed
- Improved error messages
```

---

## 📈 6. 成功指標

### 6.1 定量指標
| 指標 | 目標 | 測定方法 |
|------|------|----------|
| インストール数 | 20+ | GitHub リリース統計 |
| アクティブユーザー | 15+ | Issues/Discussion参加 |
| バグ報告 | <10 | GitHub Issues |
| 満足度 | 4.0/5.0 | フィードバックフォーム |

### 6.2 定性指標
- ユーザーからの建設的フィードバック
- コミュニティでの肯定的な反応
- 他プラグイン開発者からの関心

---

## 🚧 7. トラブルシューティング

### 7.1 よくある問題

#### BRATで追加できない
```markdown
原因:
- リポジトリがプライベート
- main.js が存在しない
- manifest.json の形式エラー

解決:
1. リポジトリを Public に設定
2. npm run build でmain.js生成
3. manifest.json の検証
```

#### 自動更新されない
```markdown
原因:
- GitHub リリースが作成されていない
- タグとmanifest.jsonのバージョン不一致

解決:
1. GitHub Releases ページ確認
2. v1.0.0 形式のタグ使用
3. manifest.json version 更新
```

### 7.2 デバッグ方法
```javascript
// Obsidian DevTools (Ctrl+Shift+I)
// Console でプラグインの状態確認
app.plugins.plugins['obsidian-multi-git']

// BRAT の更新ログ確認
app.plugins.plugins['obsidian42-brat'].settings
```

---

## 🎯 8. 次のステップ

### 8.1 ベータ完了後
1. **フィードバック分析**
   - Issues 整理・優先順位付け
   - 共通要望の抽出
   - バグ修正完了確認

2. **正式版準備**
   - v1.0.0 リリース準備
   - ドキュメント最終化
   - コミュニティプラグイン申請

### 8.2 長期計画
- 月次アップデートサイクル確立
- コミュニティコントリビューター募集
- 関連プラグインとの統合検討

---

## 📚 9. 参考リソース

### 公式ドキュメント
- [BRAT GitHub](https://github.com/TfTHacker/obsidian42-brat)
- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)

### コミュニティ
- [Obsidian Discord](https://discord.gg/obsidianmd)
- [r/ObsidianMD](https://reddit.com/r/ObsidianMD)
- [Obsidian Forum](https://forum.obsidian.md)

---

**このガイドに従ってBRAT経由でのベータテストを実施することで、品質の高いプラグインリリースを実現できます。**

---

*作成: 2025年10月26日*  
*最終更新: 2025年10月26日*