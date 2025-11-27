# GitHub Release v1.1.5.2 - 正しいファイルでの再リリース

## 🚨 重要：正しいファイルをアップロードする

**v1.1.5.1の問題：**
- ❌ ソースコードのmain.js（ビルドされていない）がアップロードされた
- ❌ styles.cssが欠落していた
- ❌ Obsidianで動作しないファイルだった

## ✅ v1.1.5.2 リリース手順

### 1. GitHubリリースページを開く
```
https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=v1.1.5.2
```

### 2. リリース情報
**Tag:** `v1.1.5.2` （既に選択済み）

**Title:** `v1.1.5.2: Fix release with correct built files`

**Description:**
```markdown
## 🔧 Fixed Release with Correct Files

### Critical Fix
- ✅ Now includes properly built main.js (27KB compiled version)
- ✅ Added missing styles.css file
- ✅ All files from the correct plugin directory

### Previous Issue (v1.1.5.1)
The v1.1.5.1 release contained source files instead of built files, which caused the plugin not to work in Obsidian. This has been fixed.

### Changes in v1.1.5.2
- Version incremented to v1.1.5.2
- Correct built files included
- Fully functional in Obsidian

### Installation via BRAT
1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this URL: https://github.com/officefutaro/obsidian-multi-git-plugin
3. Update the plugin to get version v1.1.5.2

### Files Included
- main.js (27,379 bytes) - Compiled/built version
- manifest.json (362 bytes) - v1.1.5.2
- styles.css (7,714 bytes) - UI styles

🤖 Generated with [Claude Code](https://claude.ai/code)
```

### 3. 📁 正しいファイルをアップロード

**⚠️ 重要：以下の正確なパスからファイルを選択**

```
D:\Project\2510_obsidianGit\obsidian-multi-git-plugin\
├── main.js       (27,379 bytes) ← このファイル
├── manifest.json (362 bytes)    ← このファイル
└── styles.css    (7,714 bytes)  ← このファイル
```

**注意：**
- ❌ ルートディレクトリ（`D:\Project\2510_obsidianGit\`）のファイルは使用しない
- ✅ `obsidian-multi-git-plugin\` フォルダ内のファイルを使用する

### 4. リリースを公開
- [ ] 3つのファイルがアップロードされていることを確認
- [ ] ファイルサイズが正しいことを確認
- [ ] "Publish release" をクリック

## 🔍 リリース後の確認

1. **ダウンロードテスト**
   ```bash
   curl -L https://github.com/officefutaro/obsidian-multi-git-plugin/releases/download/v1.1.5.2/main.js | wc -c
   # 27379 が表示されるはず
   ```

2. **BRATで更新**
   - プラグインを削除して再インストール
   - バージョン1.1.5.2が表示される

3. **動作確認**
   - プラグインが正常に読み込まれる
   - UIが正しく表示される
   - コンソールエラーがない

---
作成日: 2025-11-28