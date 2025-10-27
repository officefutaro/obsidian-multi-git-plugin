# Gitea経由でのプラグイン管理ガイド

**更新日**: 2025年10月26日  
**対象**: ローカルGitea環境でのObsidianプラグイン配布

---

## 📋 概要

BRATはGitHub専用のため、ローカルGiteaでは使用できません。代わりに以下の方法でプラグイン管理を実現できます。

## 🚀 方法1: 自動更新スクリプト

### インストール
```powershell
# 初回インストール
irm "http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/obsidian-multi-git-plugin/install.ps1" | iex
```

### 自動更新設定
```powershell
# 自動更新スクリプトを実行
.\auto-update-local.ps1

# 全Vaultを自動更新
.\auto-update-local.ps1 -AllVaults

# タスクスケジューラ登録（毎日自動更新）
.\auto-update-local.ps1 -AllVaults
```

## 🔗 方法2: シンボリックリンク

### Windows
```powershell
# 管理者権限で実行
New-Item -ItemType SymbolicLink `
  -Path "$env:APPDATA\obsidian\plugins\obsidian-multi-git" `
  -Target "D:\Project\2510_obsidianGit\obsidian-multi-git-plugin"
```

### macOS/Linux
```bash
ln -s ~/Projects/obsidian-multi-git-plugin \
  ~/.config/obsidian/plugins/obsidian-multi-git
```

**メリット**:
- リアルタイム更新
- 開発時に最適
- Git pullするだけで更新

## 📦 方法3: Gitea APIを使った疑似BRAT

### カスタム更新チェッカー作成
```javascript
// update-checker.js
async function checkForUpdates() {
    const giteaUrl = 'http://192.168.68.72:3000';
    const repo = 'futaro/obsidian-multi-git-plugin';
    
    // 最新リリース確認
    const response = await fetch(`${giteaUrl}/api/v1/repos/${repo}/releases/latest`);
    const release = await response.json();
    
    // 現在のバージョンと比較
    const currentVersion = app.plugins.manifests['obsidian-multi-git'].version;
    if (release.tag_name !== `v${currentVersion}`) {
        // 更新処理
        await downloadAndInstall(release);
    }
}
```

## 🔄 方法4: Git Hookによる自動デプロイ

### post-receiveフック設定（Giteaサーバー側）
```bash
#!/bin/bash
# Gitea: /data/git/repositories/futaro/obsidian-multi-git-plugin.git/hooks/post-receive

# プラグインファイルを配布ディレクトリにコピー
cp main.js manifest.json styles.css /var/www/plugins/obsidian-multi-git/

# 更新通知送信（オプション）
curl -X POST http://localhost:3001/plugin-updated
```

## 📊 比較表

| 方法 | 自動更新 | リアルタイム | 設定難易度 | 推奨用途 |
|------|---------|-------------|-----------|----------|
| **自動更新スクリプト** | ✅ | ❌ | 簡単 | 一般利用 |
| **シンボリックリンク** | ✅ | ✅ | 中 | 開発環境 |
| **カスタム更新チェッカー** | ✅ | ❌ | 難 | 大規模配布 |
| **Git Hook** | ✅ | ✅ | 難 | CI/CD統合 |

## 🎯 推奨構成

### 開発環境
```
シンボリックリンク + Git操作
→ コード変更が即座に反映
```

### テスト環境
```
自動更新スクリプト + タスクスケジューラ
→ 定期的に最新版を取得
```

### 本番環境
```
Gitea API + カスタム更新チェッカー
→ バージョン管理と安定性確保
```

## ⚠️ 注意事項

1. **セキュリティ**: HTTPSを使用していない場合、ネットワーク内のみで使用
2. **バージョン管理**: manifest.jsonのversion更新を忘れない
3. **依存関係**: main.jsが単一ファイルにバンドルされていることを確認
4. **キャッシュ**: Obsidianの再起動が必要な場合あり

## 🚀 将来的な改善案

1. **Gitea Plugin Manager**: BRAT相当の機能を持つプラグイン開発
2. **WebDAV統合**: ファイル同期プロトコルの活用
3. **RSS/Webhook**: 更新通知システムの構築
4. **Docker化**: コンテナによる配布簡素化

---

**結論**: ローカルGiteaでもBRAT相当の便利さを実現可能。用途に応じて最適な方法を選択してください。