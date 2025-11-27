# 📚 Multi Git Manager - ユーザーガイド

## 🌟 概要

Multi Git Managerは、Obsidian内で複数のGitリポジトリを効率的に管理するためのプラグインです。複雑なプロジェクト構成や複数のノート管理を一元化できます。

## 🎯 主要機能

### 🔍 自動リポジトリ検出
- **Vault本体**: Obsidian Vault自体がGitリポジトリの場合
- **親ディレクトリ**: Vault外のプロジェクトルート
- **サブフォルダ**: Vault内の個別プロジェクト

### 📊 リアルタイム監視
- **ステータスバー表示**: 変更ファイル数の常時監視
- **30秒間隔更新**: 自動的な状態同期
- **視覚的インジケータ**: 変更の有無を即座に把握

### 🎛️ 統合管理界面
- **Git Manager View**: 全リポジトリの統一管理画面
- **一括操作**: 複数リポジトリの同時操作
- **選択的実行**: 必要なリポジトリのみを対象

## 🖥️ ユーザーインターフェース

### 1. ステータスバー
```
[Git: 5 changes]  <-- ここに表示
```
- **表示内容**: 全リポジトリの変更ファイル総数
- **クリック**: Git Manager Viewを開く
- **更新頻度**: 30秒間隔

### 2. リボンアイコン
```
🌳 Git Manager  <-- 左サイドバーのアイコン
```
- **機能**: Git Manager Viewの開閉
- **表示**: 常時利用可能
- **ツールチップ**: "Multi Git Manager"

### 3. コマンドパレット
`Ctrl/Cmd + P` で利用可能なコマンド:

| コマンド | 機能 | ショートカット |
|----------|------|----------------|
| **Open Git Manager** | メイン管理画面を開く | - |
| **Show Git Status** | 詳細ステータス表示 | - |
| **Git Commit** | 一括コミット画面 | - |
| **Git Push** | プッシュ実行画面 | - |
| **Git Pull** | プル実行画面 | - |

## 📋 詳細機能説明

### Git Manager View

#### 📊 リポジトリ概要
```
┌─────────────────────────────────────┐
│ 🔄 Git Repository Manager          │
├─────────────────────────────────────┤
│ 📁 MyVault (3 changes)             │
│   • Modified: 2 files              │
│   • Untracked: 1 file              │
│   • Branch: main ↑1 ↓0             │
├─────────────────────────────────────┤
│ 📁 ParentProject (1 change)        │
│   • Modified: 1 file               │
│   • Branch: develop ↑0 ↓2          │
└─────────────────────────────────────┘
```

#### 🎮 コントロールボタン
- **🔄 Refresh**: 手動での状態更新
- **📝 Commit All**: 全リポジトリ一括コミット
- **⬆️ Push All**: 全リポジトリプッシュ
- **⬇️ Pull All**: 全リポジトリプル

### Git Status Modal

#### 📄 詳細表示画面
```
┌─────────────────────────────────────┐
│ Git Status - All Repositories      │
├─────────────────────────────────────┤
│ 📂 MyVault                         │
│   Branch: main                     │
│   ↑1 ↓0                           │
│                                    │
│   Modified (2):                    │
│     M notes/daily/2023-10-24.md   │
│     M templates/meeting.md         │
│                                    │
│   Untracked (1):                   │
│     ? assets/image.png             │
├─────────────────────────────────────┤
│ 📂 ParentProject (Parent)          │
│   Branch: develop                  │
│   ↑0 ↓2                           │
│                                    │
│   Modified (1):                    │
│     M README.md                    │
└─────────────────────────────────────┘
```

### Git Commit Modal

#### ✏️ コミット作成画面
```
┌─────────────────────────────────────┐
│ Git Commit                          │
├─────────────────────────────────────┤
│ Select Repositories:                │
│   ☑️ MyVault - 3 changes           │
│   ☑️ ParentProject - 1 change      │
│   ☐ EmptyRepo - 0 changes          │
├─────────────────────────────────────┤
│ Commit Message:                     │
│ ┌─────────────────────────────────┐ │
│ │ Update daily notes and fix bugs │ │
│ │                                 │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│           [Commit] [Cancel]         │
└─────────────────────────────────────┘
```

### Git Push/Pull Modal

#### 🔄 同期操作画面
```
┌─────────────────────────────────────┐
│ Git Push                            │
├─────────────────────────────────────┤
│ Select Repositories:                │
│   ☑️ MyVault                       │
│   ☑️ ParentProject (Parent)        │
│   ☐ LocalOnlyRepo                  │
├─────────────────────────────────────┤
│             [Push] [Cancel]         │
└─────────────────────────────────────┘
```

## 🔧 高度な使用方法

### 💼 ワークフロー例

#### 1. 論文執筆プロジェクト
```
📁 ResearchProject/
├── 🔄 obsidian-vault/ (メモ・アイデア)
├── 🔄 latex-manuscript/ (論文原稿)
├── 🔄 data-analysis/ (分析コード)
└── 🔄 bibliography/ (参考文献)
```

**運用フロー**:
1. **日々の作業**: 各リポジトリで個別作業
2. **区切りでコミット**: Multi Git Managerで一括コミット
3. **チーム共有**: 選択的プッシュで部分共有

#### 2. ブログ記事管理
```
📁 BlogVault/
├── 🔄 drafts/ (下書きリポジトリ)
├── 🔄 published/ (公開記事)
├── 🔄 assets/ (画像・リソース)
└── 🔄 tools/ (自動化スクリプト)
```

**運用フロー**:
1. **下書き作成**: drafts/で記事執筆
2. **レビュー**: チーム確認用にコミット
3. **公開準備**: published/に移動・整理
4. **一括デプロイ**: 全リポジトリ同期

#### 3. 学習ノート管理
```
📁 StudyVault/
├── 🔄 computer-science/ (CS関連)
├── 🔄 mathematics/ (数学)
├── 🔄 projects/ (実習プロジェクト)
└── 🔄 resources/ (共有リソース)
```

### 🎨 カスタマイズ設定

#### CSS スタイリング
```css
/* styles.css をカスタマイズ */
.git-manager-view {
    font-family: 'JetBrains Mono', monospace;
}

.git-file-modified {
    color: #ff9500;
}

.git-file-added {
    color: #00ff00;
}

.git-file-deleted {
    color: #ff4757;
}
```

#### 自動更新間隔の調整
```typescript
// main.ts の該当部分
this.registerInterval(
    window.setInterval(() => this.updateStatusBar(), 10000) // 10秒に変更
);
```

## 🔍 トラブルシューティング

### よくある問題と解決法

#### 1. 🚫 リポジトリが検出されない

**症状**: Git Manager Viewにリポジトリが表示されない

**原因と解決法**:
```bash
# 原因1: Gitリポジトリとして初期化されていない
cd "[対象フォルダ]"
git init

# 原因2: .gitフォルダが隠しファイルになっている
ls -la  # .git フォルダの確認

# 原因3: 権限問題
chmod -R 755 .git
```

#### 2. ⚠️ Gitコマンドが失敗する

**症状**: "git command not found" エラー

**解決法**:
```bash
# Windows
where git
# パスが表示されない場合、Git for Windowsを再インストール

# macOS  
brew install git
# または Xcode Command Line Tools をインストール

# Linux
sudo apt install git  # Ubuntu/Debian
sudo yum install git   # CentOS/RHEL
```

#### 3. 🔄 ステータスが更新されない

**症状**: ファイルを変更してもステータスバーが更新されない

**解決法**:
1. **手動更新**: Git Manager Viewの🔄ボタンをクリック
2. **プラグイン再起動**: 設定でプラグインをオフ→オンにする
3. **Obsidian再起動**: 完全な再起動を実行

#### 4. 🚨 パフォーマンス問題

**症状**: Obsidianが重くなる

**原因**: 大量のファイルがあるリポジトリ

**解決法**:
```bash
# .gitignore で除外すべきファイル
echo "node_modules/" >> .gitignore
echo ".obsidian/workspace" >> .gitignore
echo "*.tmp" >> .gitignore
```

### 🛠️ デバッグ方法

#### 1. 開発者ツールでの確認
```javascript
// Ctrl+Shift+I でコンソールを開く
// プラグインのログを確認
console.log("Multi Git Manager"); // 検索用
```

#### 2. 詳細ログの有効化
```javascript
// Obsidian設定 → 詳細 → 開発者モード をオン
// より詳細なエラーログが表示される
```

#### 3. ファイル権限の確認
```bash
# プラグインファイルの権限確認
ls -la .obsidian/plugins/multi-git-manager/
# main.js, manifest.json が読み取り可能であることを確認
```

## 📈 パフォーマンス最適化

### ⚡ 高速化のコツ

#### 1. 不要なファイルの除外
```gitignore
# .gitignore の推奨設定
.obsidian/workspace
.obsidian/cache
*.tmp
*.log
node_modules/
.DS_Store
Thumbs.db
```

#### 2. 大きなリポジトリの分割
```
❌ 避けるべき構成:
📁 HugeVault/ (10,000+ files)

✅ 推奨構成:
📁 MainVault/ (日常メモ)
📁 ArchiveVault/ (過去資料)
📁 ProjectVault/ (プロジェクト)
```

#### 3. 更新頻度の調整
- **ヘビーユーザー**: 10秒間隔
- **通常ユーザー**: 30秒間隔 (デフォルト)
- **ライトユーザー**: 60秒間隔

## 🔐 セキュリティ考慮事項

### 🛡️ 安全な運用

#### 1. 機密情報の管理
```gitignore
# 機密ファイルの除外
*.key
*.pem
.env
secrets/
private/
```

#### 2. リモートリポジトリの設定
```bash
# HTTPS接続の推奨
git remote set-url origin https://github.com/username/repo.git

# SSH接続の場合、キーの適切な管理
ssh-keygen -t ed25519 -C "your.email@example.com"
```

#### 3. 履歴の管理
```bash
# 機密情報が含まれたコミットの削除
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch secrets/password.txt' \
--prune-empty --tag-name-filter cat -- --all
```

## 🚀 アップデート・拡張

### 📦 定期アップデート
```bash
# プラグインの更新確認
cd obsidian-multi-git-plugin
git pull origin main
npm run build

# Obsidianプラグインフォルダにコピー
cp main.js ~/.obsidian/plugins/multi-git-manager/
```

### 🔧 カスタム拡張
```typescript
// 独自機能の追加例
class CustomGitExtension {
    async autoCommit() {
        // 自動コミット機能
    }
    
    async syncWithCloud() {
        // クラウド同期機能
    }
}
```

---

## 📞 サポート・コミュニティ

### 🤝 ヘルプが必要な時
- **GitHub Issues**: バグ報告・機能要望
- **Discussions**: 使い方相談・アイデア共有
- **Wiki**: 詳細ドキュメント・FAQ

### 🎯 貢献方法
- **バグ報告**: 詳細な再現手順を含める
- **機能要望**: 具体的な使用場面を説明
- **コード貢献**: Pull Requestを送信

---

**🎉 Multi Git Managerで効率的なGitワークフローを実現しましょう！**