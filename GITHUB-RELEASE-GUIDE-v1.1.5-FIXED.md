# GitHub Release v1.1.5.4 作成ガイド（修正版）

## 🎯 概要
**v1.1.5.4: Fix version synchronization** - BRATバージョン不一致エラーを修正

## ⚠️ 重要な注意事項
**必ず `obsidian-multi-git-plugin/` フォルダ内のファイルを使用すること！**
ルートディレクトリのファイルは古いバージョンです。

## ✅ 事前準備完了済み
- [x] v1.1.5.4タグをGitHubにプッシュ済み
- [x] manifest.jsonのバージョンを1.1.5.4に統一
- [x] ハードコードされたバージョン表示を動的取得に修正
- [x] 必須ファイルの準備完了

## 📋 手動リリース作成手順

### 1. GitHubリリースページを開く
```
https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=v1.1.5.4
```

### 2. リリース情報を入力

**Tag version:** `v1.1.5.4` (自動入力されているはず)

**Release title:** `v1.1.5.4: Fix version synchronization`

**Description:** 
```markdown
## 🔧 Version Synchronization Fix

### Fixed
- ✅ Resolved BRAT version mismatch error
- ✅ Synchronized both manifest.json files to version 1.1.5.4  
- ✅ Fixed hardcoded version display in console log
- ✅ Ensured consistency between release tag and manifest version
- ✅ Updated to latest build with all features

### For BRAT Users
This release fixes the "Version mismatch detected" error when installing via BRAT.

### Installation via BRAT
1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this URL: https://github.com/officefutaro/obsidian-multi-git-plugin
3. Update the plugin to get the latest version

🤖 Generated with [Claude Code](https://claude.ai/code)
```

### 3. ファイルをアップロード
**"Attach binaries by dropping them here or selecting them."** に以下をアップロード：

⚠️ **重要: 正しいフォルダから選択すること！**

```
📁 D:\Project\2510_obsidianGit\obsidian-multi-git-plugin\  ← このフォルダから！
├── main.js (58,266 bytes)    ✅ 正しいサイズ
├── manifest.json (362 bytes)  ✅ 
└── styles.css (7,714 bytes)   ✅ 必須！忘れずに！
```

**間違えやすい場所（使用しない！）：**
```
📁 D:\Project\2510_obsidianGit\  ← ルートディレクトリは使わない！
├── main.js (27,379 bytes)    ❌ 古いバージョン
├── manifest.json (362 bytes)
└── styles.css (8,097 bytes)  ❌ 違うバージョン
```

### 4. リリースを公開
- **"This is a pre-release"** のチェックは**外す**（正式版）
- **"Publish release"** ボタンをクリック

## 🔄 リリース後の確認

### BRATでの更新確認
1. Obsidian Settings → Community Plugins → BRAT
2. 該当プラグインで **"Update Plugin"** または **"Check for updates"** 
3. バージョン不一致エラーが解消されることを確認
4. **main.jsのサイズが58KB程度になっていることを確認**

### 動作確認ポイント
- [ ] プラグイン設定でバージョン1.1.5.4が表示される
- [ ] BRATエラーメッセージが表示されない  
- [ ] コンソールログに正しいバージョンが表示される
- [ ] すべての機能が正常に動作する
- [ ] styles.cssが適用されてUIが正しく表示される

## 📝 リリースファイル詳細（修正版）

| ファイル | 正しいサイズ | 説明 |
|---------|-------------|------|
| main.js | **58,266 bytes** | メインプラグインコード（最新ビルド） |
| manifest.json | 362 bytes | プラグインマニフェスト |
| styles.css | 7,714 bytes | UI スタイル（必須！） |

## 🚨 よくある間違い

1. **ルートディレクトリのファイルを使用** → 古いバージョンがアップロードされる
2. **styles.cssを忘れる** → UIが正しく表示されない
3. **ファイルサイズを確認しない** → 古いバージョンに気づかない

## 🛠️ 既存リリースの修正が必要な場合

1. GitHubのリリースページへ移動
2. v1.1.5.4リリースの「Edit」をクリック
3. 古いアセットを削除
4. 正しいファイル（obsidian-multi-git-plugin/フォルダ内）を再アップロード
5. 「Update release」をクリック

---
**作成日:** 2025-11-28  
**対象バージョン:** v1.1.5.4  
**作成者:** Claude Code