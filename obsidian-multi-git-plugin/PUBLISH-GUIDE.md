# 🚀 Obsidianコミュニティプラグイン公開ガイド

## 📝 公開前チェックリスト

### ✅ 必須ファイル
- [ ] `main.js` - プラグイン本体
- [ ] `manifest.json` - プラグイン情報
- [ ] `styles.css` - スタイルシート
- [ ] `README.md` - 説明文書
- [ ] `LICENSE` - ライセンスファイル（MIT推奨）

### ✅ manifest.json の確認
```json
{
  "id": "obsidian-multi-git",           // ユニークID（変更不可）
  "name": "Multi Git Manager",          // 表示名
  "version": "1.0.0",                   // バージョン
  "minAppVersion": "1.0.0",            // 最小Obsidianバージョン
  "description": "Manage multiple Git repositories",
  "author": "Your Name",                // あなたの名前に変更
  "authorUrl": "https://github.com/yourname",  // あなたのURL
  "isDesktopOnly": true
}
```

## 🌐 GitHubリポジトリのセットアップ

### 1. リポジトリ作成
```bash
# GitHubで新規リポジトリ作成
# リポジトリ名: obsidian-multi-git-plugin

# ローカルリポジトリと連携
cd obsidian-multi-git-plugin
git init
git remote add origin https://github.com/[YOUR_USERNAME]/obsidian-multi-git-plugin.git
```

### 2. 必須ファイル構成
```
obsidian-multi-git-plugin/
├── .github/
│   └── workflows/
│       └── release.yml    # 自動リリース設定
├── src/                   # ソースコード
├── main.js               # ビルド済みファイル
├── manifest.json         # プラグイン設定
├── styles.css           # スタイル
├── README.md            # 説明
├── LICENSE              # ライセンス
└── versions.json        # バージョン履歴
```

### 3. LICENSEファイル作成
```markdown
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 4. versions.jsonファイル作成
```json
{
  "1.0.0": "1.0.0"
}
```

### 5. GitHub Actions自動リリース設定
`.github/workflows/release.yml`:
```yaml
name: Release Obsidian Plugin

on:
  push:
    tags:
      - "*"

env:
  PLUGIN_NAME: obsidian-multi-git

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18.x"
          
      - name: Build plugin
        id: build
        run: |
          npm install
          npm run build
          
      - name: Create release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VERSION: ${{ github.ref_name }}
        with:
          tag_name: ${{ github.ref_name }}
          release_name: ${{ github.ref_name }}
          draft: false
          prerelease: false
          
      - name: Upload main.js
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./main.js
          asset_name: main.js
          asset_content_type: text/javascript
          
      - name: Upload manifest.json
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./manifest.json
          asset_name: manifest.json
          asset_content_type: application/json
          
      - name: Upload styles.css
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./styles.css
          asset_name: styles.css
          asset_content_type: text/css
```

## 📤 Obsidianコミュニティプラグインへの申請

### 1. プラグインレビュー準備
```bash
# コードの最終確認
npm run test        # テスト合格確認
npm run build       # ビルド成功確認

# Git pushとタグ作成
git add .
git commit -m "Release version 1.0.0"
git push origin main
git tag 1.0.0
git push origin 1.0.0
```

### 2. コミュニティプラグインPR作成

#### obsidian-releases リポジトリへのPR

1. **Fork** する: https://github.com/obsidianmd/obsidian-releases
2. **community-plugins.json** を編集:

```json
{
  // ... 既存のプラグイン ...
  {
    "id": "obsidian-multi-git",
    "name": "Multi Git Manager",
    "author": "Your Name",
    "description": "Manage multiple Git repositories in Obsidian",
    "repo": "YOUR_USERNAME/obsidian-multi-git-plugin"
  }
  // アルファベット順に挿入
}
```

3. **Pull Request作成**:
```markdown
# Add Multi Git Manager Plugin

## Plugin Information
- **Name**: Multi Git Manager
- **ID**: obsidian-multi-git
- **Description**: Manage multiple Git repositories including parent directories
- **Author**: Your Name
- **Repo**: https://github.com/YOUR_USERNAME/obsidian-multi-git-plugin

## Checklist
- [x] The plugin has a GitHub release with required files
- [x] The plugin ID is unique
- [x] The description is clear and concise
- [x] The plugin follows Obsidian plugin guidelines
- [x] I have tested the plugin

## First Release
- Version: 1.0.0
- Min Obsidian Version: 1.0.0

## Screenshots
[プラグインのスクリーンショットを添付]
```

### 3. レビューを待つ
- **通常2-4週間**でレビュー
- **修正依頼**が来たら対応
- **承認**されたらコミュニティプラグインに登場！

## 🎉 公開後のユーザーインストール方法

### 方法1: Obsidian内から直接インストール（承認後）
```
1. Obsidian設定を開く
2. コミュニティプラグイン → ブラウズ
3. "Multi Git Manager" を検索
4. インストール → 有効化
```

### 方法2: BRATプラグイン経由（承認前でも可能）
```
1. BRATプラグインをインストール
2. BRAT設定でベータプラグイン追加
3. リポジトリURL入力: https://github.com/YOUR_USERNAME/obsidian-multi-git-plugin
4. 自動インストール完了
```

### 方法3: 手動インストール（いつでも可能）
```
1. Latest Releaseからファイルダウンロード
   - main.js
   - manifest.json
   - styles.css
2. .obsidian/plugins/obsidian-multi-git/ にコピー
3. Obsidianでプラグイン有効化
```

## 📊 公開前の最終チェック

### セキュリティチェック
- [ ] APIキーがハードコードされていない
- [ ] ファイルシステムアクセスが適切に制限されている
- [ ] ユーザーデータが外部送信されない

### パフォーマンステスト
- [ ] 大規模Vault（1000+ファイル）でテスト
- [ ] メモリリークがない
- [ ] CPU使用率が適切

### ドキュメント確認
- [ ] README.mdが完成している
- [ ] インストール手順が明確
- [ ] 使用方法が説明されている
- [ ] トラブルシューティングがある

## 🔄 アップデート手順

### バージョン更新時
1. **manifest.json**のversion更新
2. **versions.json**に新バージョン追加
3. **CHANGELOG.md**に変更履歴記載
4. Gitタグ作成してpush
5. GitHub Actionsが自動リリース

```bash
# バージョン1.0.1リリース例
npm version patch
git push origin main
git push origin 1.0.1
```

## 🆘 申請時のよくある問題

### ❌ リジェクト理由と対策

#### 1. セキュリティ問題
- **問題**: `fs`モジュールの不適切な使用
- **対策**: Obsidian APIのみ使用

#### 2. パフォーマンス問題
- **問題**: 大規模Vaultで遅い
- **対策**: 非同期処理、遅延読み込み実装

#### 3. UI/UX問題
- **問題**: Obsidianのデザインに合わない
- **対策**: 標準CSSクラス使用

#### 4. ドキュメント不足
- **問題**: 使い方が不明確
- **対策**: 詳細なREADME.md作成

## 📈 公開後のメンテナンス

### ユーザーサポート
- GitHub Issuesで問題対応
- Obsidian Forumでサポート
- Discord communityで交流

### 統計確認
- GitHubスター数
- ダウンロード数（Obsidian統計）
- ユーザーフィードバック

---

**🎊 コミュニティプラグインとして公開成功をお祈りします！**