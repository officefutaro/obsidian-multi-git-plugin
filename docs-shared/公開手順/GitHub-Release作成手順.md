# GitHub Release作成手順（BRAT対応）

**作成日**: 2025年10月27日  
**エラー**: "No releases found in this repository"の解決

---

## 🚨 問題
BRATでプラグインを追加しようとすると「A manifest.json file does not exist in the latest release of the repository」エラーが発生

## ✅ 解決手順

### 1. GitHub Web UIでリリース作成

1. **GitHubリポジトリにアクセス**
   ```
   https://github.com/officefutaro/obsidian-multi-git-plugin
   ```

2. **Releasesページへ移動**
   - リポジトリページの右側「Releases」セクション
   - または「Code」タブの下の「0 releases」をクリック

3. **「Create a new release」ボタンをクリック**

4. **リリース情報を入力**
   ```
   Tag: v1.0.0-beta.1 (既に作成済み)
   Release title: v1.0.0-beta.1 - Initial Beta Release
   
   Description:
   ## 🚀 Obsidian Multi Git Plugin - Beta Release
   
   First beta release for testing via BRAT.
   
   ### Features
   - Auto-detect multiple Git repositories
   - Unified status bar
   - Batch Git operations
   - Custom Git Manager View
   
   ### Installation
   1. Install BRAT plugin
   2. Add this URL: https://github.com/officefutaro/obsidian-multi-git-plugin
   3. Enable the plugin
   
   ☑️ This is a pre-release (チェックを入れる)
   ```

5. **必須ファイルをアップロード**
   
   **重要**: 以下の3つのファイルを「Attach binaries」にドラッグ&ドロップ
   ```
   D:\Project\2510_obsidianGit\obsidian-multi-git-plugin\main.js
   D:\Project\2510_obsidianGit\obsidian-multi-git-plugin\manifest.json
   D:\Project\2510_obsidianGit\obsidian-multi-git-plugin\styles.css
   ```

6. **「Publish release」ボタンをクリック**

---

## 🔍 確認方法

### リリース作成後の確認
1. https://github.com/officefutaro/obsidian-multi-git-plugin/releases
2. 「v1.0.0-beta.1」リリースが表示される
3. Assets セクションに3つのファイルが表示される：
   - main.js
   - manifest.json
   - styles.css

### BRATで再度試す
1. Obsidianを開く
2. Settings → BRAT → Add Beta Plugin
3. URL入力: `https://github.com/officefutaro/obsidian-multi-git-plugin`
4. 「Add Plugin」クリック

---

## ⚠️ 重要な注意点

### ファイルの場所
現在のファイルパス:
```
D:\Project\2510_obsidianGit\obsidian-multi-git-plugin\
├── main.js          ← これをアップロード
├── manifest.json    ← これをアップロード
└── styles.css       ← これをアップロード
```

### manifest.jsonの確認
```json
{
  "id": "obsidian-multi-git",
  "name": "Multi Git Manager",
  "version": "1.0.0",
  "minAppVersion": "1.0.0",
  "description": "Manage multiple Git repositories including parent directories",
  "author": "Your Name",
  "authorUrl": "",
  "isDesktopOnly": true
}
```

### タグとバージョンの一致
- Gitタグ: `v1.0.0-beta.1`
- manifest.json version: `1.0.0`
- これは問題ありません（betaはタグのみ）

---

## 🎯 トラブルシューティング

### それでもエラーが出る場合

1. **キャッシュクリア**
   - Obsidian再起動
   - BRATの「Check for updates」実行

2. **URL形式確認**
   - 正しい: `https://github.com/officefutaro/obsidian-multi-git-plugin`
   - 間違い: `.git`を付けない、`/releases`を付けない

3. **ファイル確認**
   ```bash
   # main.jsが存在することを確認
   cd D:\Project\2510_obsidianGit\obsidian-multi-git-plugin
   ls main.js manifest.json styles.css
   ```

4. **リリースアセット確認**
   - GitHubのリリースページでファイルがダウンロード可能か確認
   - 各ファイルをクリックしてダウンロードできることを確認

---

## 📝 今後の更新時

新バージョンリリース時:
1. manifest.jsonのversionを更新
2. `npm run build`でビルド
3. 新しいタグを作成（例: v1.0.0-beta.2）
4. GitHubで新リリース作成
5. 3つのファイルを再度アップロード

---

**この手順に従ってGitHubリリースを作成すれば、BRATでプラグインを追加できるようになります。**