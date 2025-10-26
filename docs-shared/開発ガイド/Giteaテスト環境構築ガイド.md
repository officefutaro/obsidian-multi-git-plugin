# 🏠 Giteaテスト環境でのプラグイン公開ガイド

## 🎯 Giteaを使用するメリット

### ✅ GitHubとの違い
- **セルフホスト可能**: 独自サーバーで完全制御
- **プライベート環境**: 内部テスト用に最適
- **軽量**: リソース使用量が少ない
- **Git互換**: 同じワークフローが利用可能

### 🔧 テスト用途
- **プラグイン動作確認**: GitHubに公開前のテスト
- **CI/CDパイプライン**: 自動ビルド・テストの確認
- **チーム内共有**: 内部レビュー用
- **プライベートリポジトリ**: 非公開開発

## 🚀 Giteaセットアップ

### 方法1: Dockerを使用したローカル環境

#### Step 1: Giteaサーバー起動
```bash
# Docker Compose設定ファイル作成
cat > docker-compose.yml << 'EOF'
version: "3"

networks:
  gitea:
    external: false

services:
  server:
    image: gitea/gitea:1.21
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__database__DB_TYPE=postgres
      - GITEA__database__HOST=db:5432
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=gitea
    restart: always
    networks:
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "222:22"
    depends_on:
      - db

  db:
    image: postgres:14
    restart: always
    environment:
      - POSTGRES_USER=gitea
      - POSTGRES_PASSWORD=gitea
      - POSTGRES_DB=gitea
    networks:
      - gitea
    volumes:
      - ./postgres:/var/lib/postgresql/data
EOF

# Gitea起動
docker-compose up -d
```

#### Step 2: 初期設定
```bash
# ブラウザでアクセス
# http://localhost:3000

# 初期設定:
# - データベース: PostgreSQL (設定済み)
# - 管理者アカウント作成
# - リポジトリルートパス: /data/git/repositories
```

### 方法2: 既存Giteaサーバーを使用

#### 接続設定確認
```bash
# Giteaサーバーの確認
curl -I http://your-gitea-server.com

# SSH接続確認
ssh -T git@your-gitea-server.com
```

## 📦 プラグインリポジトリのセットアップ

### Step 1: Giteaでリポジトリ作成

1. **Giteaにログイン**
2. **新規リポジトリ作成**:
   - リポジトリ名: `obsidian-multi-git-plugin`
   - 説明: `Obsidian Multi Git Manager Plugin`
   - 可視性: Private (テスト用)

### Step 2: ローカルリポジトリの設定

```bash
# プラグインディレクトリに移動
cd D:\Project\2510_obsidianGit\obsidian-multi-git-plugin

# Giteaリモートを追加
git remote add gitea http://localhost:3000/[USERNAME]/obsidian-multi-git-plugin.git

# または既存のリモートを変更
git remote set-url origin http://localhost:3000/[USERNAME]/obsidian-multi-git-plugin.git

# プッシュ
git push -u gitea main
```

### Step 3: リリース用ファイル準備

```bash
# 必要なファイルが存在することを確認
ls -la
# main.js
# manifest.json
# styles.css
# README.md
# LICENSE

# バージョンタグ作成
git tag v1.0.0
git push gitea v1.0.0
```

## 🔄 Gitea Actions (CI/CD) 設定

### Step 1: ワークフロー設定ファイル作成

```bash
# .gitea/workflows ディレクトリ作成
mkdir -p .gitea/workflows
```

### Step 2: リリース自動化ワークフロー

```yaml
# .gitea/workflows/release.yml
name: Release Obsidian Plugin

on:
  push:
    tags:
      - "*"

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18.x"

      - name: Install dependencies
        run: npm install

      - name: Build plugin
        run: npm run build

      - name: Create release
        uses: actions/create-release@v1
        id: create_release
        with:
          tag_name: ${{ github.ref_name }}
          release_name: Release ${{ github.ref_name }}
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITEA_TOKEN }}

      - name: Upload main.js
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./main.js
          asset_name: main.js
          asset_content_type: text/javascript
        env:
          GITHUB_TOKEN: ${{ secrets.GITEA_TOKEN }}

      - name: Upload manifest.json
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./manifest.json
          asset_name: manifest.json
          asset_content_type: application/json
        env:
          GITHUB_TOKEN: ${{ secrets.GITEA_TOKEN }}

      - name: Upload styles.css
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./styles.css
          asset_name: styles.css
          asset_content_type: text/css
        env:
          GITHUB_TOKEN: ${{ secrets.GITEA_TOKEN }}
```

### Step 3: テスト用ワークフロー

```yaml
# .gitea/workflows/test.yml
name: Test Plugin

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18.x"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build plugin
        run: npm run build

      - name: Verify files
        run: |
          test -f main.js || exit 1
          test -f manifest.json || exit 1
          test -f styles.css || exit 1
          echo "✅ All required files present"
```

## 🧪 テスト手順

### Step 1: プラグインのビルドテスト

```bash
# 自動ビルドの確認
git add .gitea/
git commit -m "Add Gitea Actions workflow"
git push gitea main

# タグ作成でリリースをトリガー
git tag v1.0.1
git push gitea v1.0.1
```

### Step 2: リリースファイルの確認

1. **Giteaのリポジトリページを開く**
2. **Releases** タブを確認
3. **アップロードされたファイル** を確認:
   - main.js
   - manifest.json
   - styles.css

### Step 3: 手動インストールテスト

```bash
# リリースファイルをダウンロード
curl -L http://localhost:3000/[USERNAME]/obsidian-multi-git-plugin/releases/download/v1.0.1/main.js -o main.js
curl -L http://localhost:3000/[USERNAME]/obsidian-multi-git-plugin/releases/download/v1.0.1/manifest.json -o manifest.json
curl -L http://localhost:3000/[USERNAME]/obsidian-multi-git-plugin/releases/download/v1.0.1/styles.css -o styles.css

# Obsidianプラグインフォルダにコピー
mkdir -p "[VAULT]/.obsidian/plugins/multi-git-manager-test"
cp main.js manifest.json styles.css "[VAULT]/.obsidian/plugins/multi-git-manager-test/"
```

## 🔧 Giteaアクセストークン設定

### Step 1: アクセストークン作成

1. **Gitea設定** → **アプリケーション** → **アクセストークン**
2. **新しいトークン作成**:
   - 名前: `obsidian-plugin-ci`
   - 権限: `repo`, `write:packages`

### Step 2: GitHub Actions Secrets設定

1. **リポジトリ設定** → **Actions** → **Secrets**
2. **新しいSecret追加**:
   - Name: `GITEA_TOKEN`
   - Value: [生成したアクセストークン]

## 📊 Giteaでのプロジェクト管理

### Issues管理

```markdown
# バグ報告テンプレート
**環境**:
- OS: 
- Obsidianバージョン: 
- プラグインバージョン: 

**問題の詳細**:
[詳細な説明]

**再現手順**:
1. 
2. 
3. 

**期待される動作**:
[説明]

**実際の動作**:
[説明]
```

### Pull Request テンプレート

```markdown
# 変更内容

## 変更の種類
- [ ] バグ修正
- [ ] 新機能
- [ ] 破壊的変更
- [ ] ドキュメント更新

## 詳細
[変更の詳細説明]

## テスト
- [ ] 既存テストが通過
- [ ] 新しいテストを追加
- [ ] 手動テストを実施

## チェックリスト
- [ ] コードレビュー完了
- [ ] ドキュメント更新
- [ ] CHANGELOG.md 更新
```

## 🌐 外部からの利用設定

### BRATプラグイン対応

```json
// manifest.json に追加
{
  "fundingUrl": "http://your-gitea-server.com/[USERNAME]/obsidian-multi-git-plugin",
  "isDesktopOnly": true
}
```

### カスタムリリースURL

```javascript
// BRAT設定用URL
http://your-gitea-server.com/[USERNAME]/obsidian-multi-git-plugin
```

## 🔒 セキュリティ考慮事項

### プライベート環境でのテスト

```bash
# ファイアウォール設定 (必要に応じて)
sudo ufw allow 3000/tcp  # Gitea Web UI
sudo ufw allow 222/tcp   # Gitea SSH

# HTTPS設定 (本番環境)
# Let's Encrypt + Nginx リバースプロキシ推奨
```

### バックアップ設定

```bash
# Giteaデータのバックアップ
docker exec gitea gitea dump -c /data/gitea/conf/app.ini

# 定期バックアップスクリプト
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec gitea gitea dump -c /data/gitea/conf/app.ini -f /data/backup_${DATE}.zip
```

## 📈 GitHubとの違い・移行

### 移行時の考慮点

| 項目 | GitHub | Gitea |
|------|--------|-------|
| **Actions** | GitHub Actions | Gitea Actions (限定的) |
| **API** | REST/GraphQL | REST API |
| **Webhooks** | 豊富 | 基本的なもの |
| **Packages** | GitHub Packages | Gitea Packages |

### GitHub移行時

```bash
# Giteaで動作確認後、GitHubに移行
git remote add github https://github.com/[USERNAME]/obsidian-multi-git-plugin.git
git push github main
git push github --tags
```

---

## 🎯 まとめ

**Giteaでのテストメリット**:
- ✅ **プライベート環境**: 安全なテスト環境
- ✅ **完全制御**: 自分のサーバーで管理
- ✅ **GitHub互換**: 同じワークフローが使用可能
- ✅ **軽量**: リソース消費が少ない

**次のステップ**:
1. Giteaでの動作確認完了
2. チーム内レビュー
3. GitHubへの移行・公開

**🚀 Giteaを使用してObsidianプラグインの安全なテスト環境を構築しましょう！**