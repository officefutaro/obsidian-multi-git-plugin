# GitHub Actions 自動リリース完全ガイド

**作成日**: 2025年10月27日  
**状態**: ✅ 設定完了・即座に使用可能

---

## 🎯 概要

GitHub Actionsを使用して、**タグをプッシュするだけで自動的にBRAT対応リリースを作成**する仕組みです。

---

## 🏗️ 仕組みの構成

### 1. ワークフローファイル
```yaml
場所: .github/workflows/release.yml
```

このファイルが以下を自動実行：
1. タグプッシュを検知
2. Node.js環境セットアップ
3. `npm run build`でビルド実行
4. GitHubリリース作成
5. 必須3ファイル（main.js, manifest.json, styles.css）アップロード

### 2. トリガー条件
```yaml
on:
  push:
    tags:
      - 'v*'  # vで始まるタグ（例: v1.0.0, v1.0.0-beta.2）
```

---

## 🚀 使い方（超簡単3ステップ）

### Step 1: バージョン更新（必要な場合）
```bash
# manifest.json のバージョンを更新
cd obsidian-multi-git-plugin
# エディタで manifest.json の "version": "1.0.0" を変更
```

### Step 2: タグ作成
```bash
# 正式版
git tag v1.0.0

# ベータ版
git tag v1.0.0-beta.2

# メッセージ付きタグ（推奨）
git tag -a v1.0.0-beta.2 -m "Fix Windows path handling issue"
```

### Step 3: タグをプッシュ（これだけで自動リリース！）
```bash
git push github v1.0.0-beta.2
```

### 🎉 完了！
1. GitHub Actionsが自動起動
2. 約1-2分でリリース作成完了
3. BRATで即座にインストール可能

---

## 📊 動作確認方法

### 1. Actions タブで確認
```
https://github.com/officefutaro/obsidian-multi-git-plugin/actions
```

実行中のワークフローが表示されます：
- 🟡 黄色: 実行中
- ✅ 緑: 成功
- ❌ 赤: 失敗

### 2. リリースページで確認
```
https://github.com/officefutaro/obsidian-multi-git-plugin/releases
```

成功すると新しいリリースが表示されます。

---

## 🎮 実際のコマンド例

### 例1: 初回ベータリリース（今すぐ実行可能）
```bash
cd D:\Project\2510_obsidianGit\obsidian-multi-git-plugin

# タグ v1.0.0-beta.1 は既に存在するので、beta.2 を作成
git tag -a v1.0.0-beta.2 -m "Initial beta release for BRAT testing"
git push github v1.0.0-beta.2

# 1-2分待つと自動でリリース完成！
```

### 例2: バグ修正版リリース
```bash
# コード修正後
git add .
git commit -m "Fix: Windows path escaping issue"
git push github master

# 新しいベータタグ作成
git tag v1.0.0-beta.3
git push github v1.0.0-beta.3
```

### 例3: 正式版リリース
```bash
# manifest.json を v1.0.0 に更新後
git add manifest.json
git commit -m "Release version 1.0.0"
git push github master

# 正式版タグ
git tag v1.0.0
git push github v1.0.0
```

---

## 🔍 トラブルシューティング

### Q: Actionsが実行されない
**A**: タグの形式を確認
- ✅ 正しい: `v1.0.0`, `v1.0.0-beta.1`
- ❌ 間違い: `1.0.0`, `beta-1.0.0`

### Q: ビルドが失敗する
**A**: package.jsonとnode_modulesが正しくコミットされているか確認
```bash
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push github master
```

### Q: リリースにファイルが含まれない
**A**: ビルドが成功しているか確認
```bash
# ローカルでテスト
npm run build
ls main.js manifest.json styles.css
```

---

## ⚙️ カスタマイズ

### リリースノートを変更したい場合
`.github/workflows/release.yml` の `body:` セクションを編集：

```yaml
body: |
  ## 🚀 カスタムリリースノート
  
  お好きな内容をここに記載
```

### プレリリース/正式版を自動判定
```yaml
# release.yml に条件追加
prerelease: ${{ contains(github.ref, 'beta') || contains(github.ref, 'alpha') }}
```

---

## 📈 メリット

### 手動リリースと比較
| 項目 | 手動 | GitHub Actions |
|------|------|---------------|
| 所要時間 | 5-10分 | 10秒（タグプッシュのみ） |
| ミスの可能性 | あり | なし |
| ファイル忘れ | 可能性あり | 自動チェック |
| ビルド忘れ | 可能性あり | 自動ビルド |
| 再現性 | 人による | 完全に一貫 |

---

## 🎯 今すぐテスト実行

以下のコマンドをコピペして実行すれば、**1分後に自動リリースが作成されます**：

```powershell
# PowerShellで実行
cd D:\Project\2510_obsidianGit\obsidian-multi-git-plugin
git tag v1.0.0-beta.2 -m "Test GitHub Actions auto-release"
git push github v1.0.0-beta.2

# ブラウザでActionsタブを開いて確認
Start-Process "https://github.com/officefutaro/obsidian-multi-git-plugin/actions"
```

実行後：
1. Actionsタブで黄色い●が表示（実行中）
2. 1-2分で緑の✅に変化（成功）
3. Releasesページに新リリース出現
4. BRATで即座にインストール可能！

---

## 🔒 セキュリティ

- `GITHUB_TOKEN`は自動的に提供（設定不要）
- 権限は最小限（リリース作成とアセットアップロードのみ）
- プライベートリポジトリでも動作

---

## 📚 関連ドキュメント

- [BRAT実施手順書](./BRAT実施手順書.md)
- [GitHub-Release作成手順](./GitHub-Release作成手順.md)
- [公開トライ方法検討](./公開トライ方法検討.md)

---

**これで完全自動化の設定は完了です！タグをプッシュするだけでBRAT対応リリースが作成されます。**